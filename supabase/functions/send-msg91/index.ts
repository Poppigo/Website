import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MSG91_BASE = "https://control.msg91.com/api/v5";

// Rate limiting: wait between API calls to avoid MSG91 throttling
const DELAY_BETWEEN_MESSAGES_MS = 200; // 5 messages/sec max
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const authKey = Deno.env.get("MSG91_AUTH_KEY");
    const dryRun = !authKey;

    if (dryRun) {
      console.warn("MSG91_AUTH_KEY not configured — running in dry-run mode (no messages will be sent).");
    }

    const { type, campaign_id } = await req.json();

    if (type === "campaign" && campaign_id) {
      return await handleCampaign(supabaseAdmin, authKey, campaign_id, dryRun);
    }

    if (type === "process_follow_ups") {
      return await handleFollowUps(supabaseAdmin, authKey, dryRun);
    }

    throw new Error("Invalid request type");
  } catch (error) {
    console.error("MSG91 error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

// Fetch all rows from a table, paginating past the 1000-row limit
async function fetchAllRows(supabase: any, table: string, query: any) {
  const PAGE_SIZE = 1000;
  let allRows: any[] = [];
  let offset = 0;
  while (true) {
    const { data, error } = await query.range(offset, offset + PAGE_SIZE - 1);
    if (error) throw new Error(`Failed to fetch ${table}: ${error.message}`);
    if (!data || data.length === 0) break;
    allRows = allRows.concat(data);
    if (data.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }
  return allRows;
}

async function handleCampaign(supabase: any, authKey: string | undefined, campaignId: string, dryRun: boolean) {
  const { data: campaign, error: campError } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", campaignId)
    .single();

  if (campError || !campaign) throw new Error("Campaign not found");
  if (campaign.status !== "draft") throw new Error("Campaign has already been sent");

  await supabase.from("campaigns").update({ status: "sending" }).eq("id", campaignId);

  // Build customer query with pagination to handle large lists
  let query = supabase.from("customers").select("name, email, mobile_no");
  if (campaign.audience === "with_orders") {
    query = query.gt("total_orders", 0);
  } else if (campaign.audience === "no_orders") {
    query = query.or("total_orders.is.null,total_orders.eq.0");
  }

  const customers = await fetchAllRows(supabase, "customers", query);

  let sentCount = 0;
  let failedCount = 0;

  // Process in batches with throttling
  for (const customer of customers) {
    try {
      const messageBody = replaceTemplateVars(campaign.message_body, {
        customer_name: customer.name,
      });

      if (!dryRun) {
        await sendMessage(authKey!, {
          channel: campaign.channel,
          to: campaign.channel === "email" ? customer.email : customer.mobile_no,
          name: customer.name,
          subject: campaign.message_subject,
          body: messageBody,
        });
        // Throttle to avoid MSG91 rate limits
        await sleep(DELAY_BETWEEN_MESSAGES_MS);
      } else {
        console.log(`[DRY RUN] Would send ${campaign.channel} to ${customer.email}`);
      }

      await supabase.from("campaign_logs").insert({
        campaign_id: campaignId,
        customer_email: customer.email,
        customer_name: customer.name,
        channel: campaign.channel,
        status: dryRun ? "dry_run" : "sent",
        sent_at: new Date().toISOString(),
      });

      sentCount++;
    } catch (err) {
      // On rate limit (429), wait and retry once
      if (err.message?.includes("429")) {
        console.warn(`Rate limited on ${customer.email}, waiting 2s and retrying...`);
        await sleep(2000);
        try {
          await sendMessage(authKey!, {
            channel: campaign.channel,
            to: campaign.channel === "email" ? customer.email : customer.mobile_no,
            name: customer.name,
            subject: campaign.message_subject,
            body: replaceTemplateVars(campaign.message_body, { customer_name: customer.name }),
          });
          await supabase.from("campaign_logs").insert({
            campaign_id: campaignId,
            customer_email: customer.email,
            customer_name: customer.name,
            channel: campaign.channel,
            status: "sent",
            sent_at: new Date().toISOString(),
          });
          sentCount++;
          continue;
        } catch (retryErr) {
          err = retryErr;
        }
      }

      await supabase.from("campaign_logs").insert({
        campaign_id: campaignId,
        customer_email: customer.email,
        customer_name: customer.name,
        channel: campaign.channel,
        status: "failed",
        error_message: err.message,
      });
      failedCount++;
    }
  }

  await supabase.from("campaigns").update({
    status: "sent",
    sent_count: sentCount,
    failed_count: failedCount,
    sent_at: new Date().toISOString(),
  }).eq("id", campaignId);

  return new Response(
    JSON.stringify({
      message: `Campaign ${dryRun ? "(dry run) " : ""}sent to ${sentCount} recipients. ${failedCount} failed.`,
      dry_run: dryRun,
      sent: sentCount,
      failed: failedCount,
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
  );
}

async function handleFollowUps(supabase: any, authKey: string | undefined, dryRun: boolean) {
  const { data: rules } = await supabase
    .from("follow_up_rules")
    .select("*")
    .eq("is_active", true);

  if (!rules || rules.length === 0) {
    return new Response(
      JSON.stringify({ message: "No active follow-up rules" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  }

  let totalSent = 0;
  let totalSkipped = 0;

  for (const rule of rules) {
    if (rule.trigger_type === "post_purchase") {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - rule.delay_days);
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      const ordersQuery = supabase
        .from("orders")
        .select("*")
        .eq("status", "Delivered")
        .gte("updated_at", startOfDay.toISOString())
        .lte("updated_at", endOfDay.toISOString());

      const orders = await fetchAllRows(supabase, "orders", ordersQuery);

      for (const order of orders) {
        // Check if already sent for this rule + customer
        const { data: existing } = await supabase
          .from("campaign_logs")
          .select("id")
          .eq("follow_up_rule_id", rule.id)
          .eq("customer_email", order.customer_email)
          .maybeSingle();

        if (existing) { totalSkipped++; continue; }

        // For review-request rules, skip if customer already reviewed all items
        if (rule.name.toLowerCase().includes("review")) {
          const orderItems = Array.isArray(order.items) ? order.items : [];
          const productIds = orderItems.map((i: any) => i.product_id || i.id).filter(Boolean);

          if (productIds.length > 0) {
            const { data: existingReviews } = await supabase
              .from("reviews")
              .select("product_id")
              .eq("order_id", order.id)
              .eq("user_id", order.user_id)
              .in("product_id", productIds);

            if (existingReviews && existingReviews.length >= productIds.length) {
              totalSkipped++;
              continue;
            }
          }
        }

        const items = Array.isArray(order.items) ? order.items : [];
        const productNames = items.map((i: any) => i.name).join(", ");

        try {
          const messageBody = replaceTemplateVars(rule.message_body, {
            customer_name: order.customer_name,
            order_number: order.order_number,
            product_names: productNames,
            order_date: new Date(order.created_at).toLocaleDateString("en-IN"),
          });

          if (!dryRun) {
            await sendMessage(authKey!, {
              channel: rule.channel,
              to: rule.channel === "email" ? order.customer_email : order.mobile_no,
              name: order.customer_name,
              subject: rule.message_subject,
              body: messageBody,
            });
            await sleep(DELAY_BETWEEN_MESSAGES_MS);
          } else {
            console.log(`[DRY RUN] Would send follow-up "${rule.name}" to ${order.customer_email}`);
          }

          await supabase.from("campaign_logs").insert({
            follow_up_rule_id: rule.id,
            customer_email: order.customer_email,
            customer_name: order.customer_name,
            channel: rule.channel,
            status: dryRun ? "dry_run" : "sent",
            sent_at: new Date().toISOString(),
          });
          totalSent++;
        } catch (err) {
          await supabase.from("campaign_logs").insert({
            follow_up_rule_id: rule.id,
            customer_email: order.customer_email,
            customer_name: order.customer_name,
            channel: rule.channel,
            status: "failed",
            error_message: err.message,
          });
        }
      }
    } else if (rule.trigger_type === "no_orders") {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - rule.delay_days);
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      const customersQuery = supabase
        .from("customers")
        .select("*")
        .or("total_orders.is.null,total_orders.eq.0")
        .gte("created_at", startOfDay.toISOString())
        .lte("created_at", endOfDay.toISOString());

      const customers = await fetchAllRows(supabase, "customers", customersQuery);

      for (const customer of customers) {
        const { data: existing } = await supabase
          .from("campaign_logs")
          .select("id")
          .eq("follow_up_rule_id", rule.id)
          .eq("customer_email", customer.email)
          .maybeSingle();

        if (existing) { totalSkipped++; continue; }

        try {
          const messageBody = replaceTemplateVars(rule.message_body, {
            customer_name: customer.name,
          });

          if (!dryRun) {
            await sendMessage(authKey!, {
              channel: rule.channel,
              to: rule.channel === "email" ? customer.email : customer.mobile_no,
              name: customer.name,
              subject: rule.message_subject,
              body: messageBody,
            });
            await sleep(DELAY_BETWEEN_MESSAGES_MS);
          } else {
            console.log(`[DRY RUN] Would send follow-up "${rule.name}" to ${customer.email}`);
          }

          await supabase.from("campaign_logs").insert({
            follow_up_rule_id: rule.id,
            customer_email: customer.email,
            customer_name: customer.name,
            channel: rule.channel,
            status: dryRun ? "dry_run" : "sent",
            sent_at: new Date().toISOString(),
          });
          totalSent++;
        } catch (err) {
          await supabase.from("campaign_logs").insert({
            follow_up_rule_id: rule.id,
            customer_email: customer.email,
            customer_name: customer.name,
            channel: rule.channel,
            status: "failed",
            error_message: err.message,
          });
        }
      }
    }
  }

  return new Response(
    JSON.stringify({
      message: `Follow-ups processed. ${totalSent} sent, ${totalSkipped} skipped (already sent or reviewed).`,
      dry_run: dryRun,
      sent: totalSent,
      skipped: totalSkipped,
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
  );
}

function replaceTemplateVars(template: string, vars: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value || "");
  }
  return result;
}

async function sendMessage(authKey: string, opts: {
  channel: string; to: string | null; name: string;
  subject: string | null; body: string;
}) {
  if (!opts.to) {
    throw new Error(`No ${opts.channel === "email" ? "email" : "phone number"} available`);
  }

  if (opts.channel === "email") {
    const res = await fetch(`${MSG91_BASE}/email/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json", authkey: authKey },
      body: JSON.stringify({
        to: [{ email: opts.to, name: opts.name }],
        from: { email: Deno.env.get("MSG91_SENDER_EMAIL") || "noreply@poppigo.com", name: "PoppiGo" },
        subject: opts.subject || "Message from PoppiGo",
        body: opts.body,
        content_type: "text/plain",
      }),
    });
    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Email send failed [${res.status}]: ${errBody}`);
    }
  } else if (opts.channel === "whatsapp") {
    const res = await fetch(`${MSG91_BASE}/whatsapp/whatsapp-outbound-message/bulk/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", authkey: authKey },
      body: JSON.stringify({
        integrated_number: Deno.env.get("MSG91_WHATSAPP_NUMBER") || "",
        content_type: "text",
        payload: {
          to: opts.to.replace(/[^0-9]/g, ""),
          type: "text",
          messaging_product: "whatsapp",
          text: { body: opts.body },
        },
      }),
    });
    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`WhatsApp send failed [${res.status}]: ${errBody}`);
    }
  } else if (opts.channel === "sms") {
    const res = await fetch(`${MSG91_BASE}/flow/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", authkey: authKey },
      body: JSON.stringify({
        flow_id: Deno.env.get("MSG91_SMS_FLOW_ID") || "",
        sender: Deno.env.get("MSG91_SENDER_ID") || "POPPGO",
        mobiles: opts.to.replace(/[^0-9]/g, ""),
        VAR1: opts.name,
        VAR2: opts.body,
      }),
    });
    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`SMS send failed [${res.status}]: ${errBody}`);
    }
  }
}
