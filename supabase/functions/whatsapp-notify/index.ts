import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const DELAY_MS = 300;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ── Phone normalisation ───────────────────────────────────────────────────────

function normalizePhone(raw: string): string {
  if (!raw) return raw;
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 11 && digits.startsWith("0")) return `+91${digits.slice(1)}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  if (raw.startsWith("+")) return raw;
  return `+${digits}`;
}

// ── Core sendWhatsApp helper ──────────────────────────────────────────────────

async function sendWhatsApp(
  accountSid: string,
  authToken: string,
  fromNumber: string,
  phone: string,
  message: string
): Promise<void> {
  const normalizedPhone = normalizePhone(phone);
  const from = fromNumber.startsWith("whatsapp:") ? fromNumber : `whatsapp:${fromNumber}`;
  const to = `whatsapp:${normalizedPhone}`;

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const params = new URLSearchParams({ From: from, To: to, Body: message });

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(`${accountSid}:${authToken}`),
    },
    body: params.toString(),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Twilio WhatsApp send failed [${res.status}]: ${errBody}`);
  }
}

// ── Follow-up message templates ───────────────────────────────────────────────

function buildFollowupMessages(customerName: string, orderNumber: string) {
  return [
    {
      days: 7,
      message: `Hi ${customerName}! 👋 We hope you're loving your Poppigo order #${orderNumber}! We'd really appreciate a quick review — it only takes a minute. 🌟 Visit poppigo.com to share your thoughts. Thank you!`,
    },
    {
      days: 15,
      message: `Hi ${customerName}! 😊 It's been 2 weeks since your Poppigo order #${orderNumber}. How are you enjoying your products? We'd love to hear your feedback. Drop a review at poppigo.com!`,
    },
    {
      days: 30,
      message: `Hi ${customerName}! 🎉 It's been a month since order #${orderNumber}. We hope you're loving your Poppigo products! It might be time to restock — check out our latest collection at poppigo.com. Use code LOYAL10 for 10% off!`,
    },
  ];
}

// ── Handlers ──────────────────────────────────────────────────────────────────

/**
 * Send order confirmation WhatsApp and schedule follow-up reminders.
 */
async function handleOrderConfirmation(
  supabase: any,
  creds: { accountSid: string; authToken: string; fromNumber: string } | null,
  payload: { orderId: string; orderNumber: string; customerName: string; customerPhone: string },
  dryRun: boolean
) {
  const { orderId, orderNumber, customerName, customerPhone } = payload;

  if (!customerPhone) {
    return json({ error: "No phone number provided for this order" }, 400);
  }

  const confirmationMsg = `Hi ${customerName}! ✅ Your Poppigo order #${orderNumber} has been received successfully. We'll notify you when it's dispatched. Thank you for shopping with us! 🛍️`;

  if (!dryRun && creds) {
    await sendWhatsApp(creds.accountSid, creds.authToken, creds.fromNumber, customerPhone, confirmationMsg);
  } else {
    console.log(`[DRY RUN] Order confirmation to ${customerPhone}: ${confirmationMsg}`);
  }

  // Schedule follow-up reminders
  const now = new Date();
  const followupsToInsert = buildFollowupMessages(customerName, orderNumber).map(({ days, message }) => {
    const scheduled = new Date(now);
    scheduled.setDate(scheduled.getDate() + days);
    return {
      order_id: orderId,
      order_number: orderNumber,
      customer_name: customerName,
      customer_phone: customerPhone,
      message,
      scheduled_at: scheduled.toISOString(),
      sent: false,
    };
  });

  const { error: insertError } = await supabase.from("followups").insert(followupsToInsert);
  if (insertError) {
    console.error("Failed to insert followups:", insertError.message);
  }

  return json({ success: true, message: "Order confirmation sent", dry_run: dryRun });
}

/**
 * Send dispatch or delivered status notification.
 */
async function handleStatusNotification(
  supabase: any,
  creds: { accountSid: string; authToken: string; fromNumber: string } | null,
  payload: { orderId: string; orderNumber: string; customerName: string; customerPhone: string; status: "dispatched" | "delivered" },
  dryRun: boolean
) {
  const { orderNumber, customerName, customerPhone, status } = payload;

  if (!customerPhone) {
    return json({ error: "No phone number provided for this order" }, 400);
  }

  const messages: Record<string, string> = {
    dispatched: `Hi ${customerName}! 🚚 Your Poppigo order #${orderNumber} has been dispatched and is on the way! You should receive it in 2-5 business days. Track your order at poppigo.com.`,
    delivered: `Hi ${customerName}! 📦 Your Poppigo order #${orderNumber} has been delivered! We hope you love it. Don't forget to leave a review at poppigo.com. Happy shopping! 🛍️`,
  };

  const message = messages[status];
  if (!message) return json({ error: "Unknown status" }, 400);

  if (!dryRun && creds) {
    await sendWhatsApp(creds.accountSid, creds.authToken, creds.fromNumber, customerPhone, message);
  } else {
    console.log(`[DRY RUN] Status notification (${status}) to ${customerPhone}: ${message}`);
  }

  return json({ success: true, message: `Status notification (${status}) sent`, dry_run: dryRun });
}

/**
 * Process all pending follow-ups where scheduled_at <= now().
 */
async function handleRunFollowups(
  supabase: any,
  creds: { accountSid: string; authToken: string; fromNumber: string } | null,
  dryRun: boolean
) {
  const { data: pendingFollowups, error } = await supabase
    .from("followups")
    .select("*")
    .lte("scheduled_at", new Date().toISOString())
    .eq("sent", false);

  if (error) throw new Error(`Failed to fetch followups: ${error.message}`);
  if (!pendingFollowups || pendingFollowups.length === 0) {
    return json({ success: true, message: "No pending follow-ups", sent: 0, failed: 0 });
  }

  let sent = 0;
  let failed = 0;

  for (const followup of pendingFollowups) {
    try {
      if (!dryRun && creds) {
        await sendWhatsApp(
          creds.accountSid,
          creds.authToken,
          creds.fromNumber,
          followup.customer_phone,
          followup.message
        );
        await sleep(DELAY_MS);
      } else {
        console.log(`[DRY RUN] Follow-up to ${followup.customer_phone}: ${followup.message.slice(0, 60)}…`);
      }

      await supabase
        .from("followups")
        .update({ sent: true, sent_at: new Date().toISOString(), error_message: null })
        .eq("id", followup.id);
      sent++;
    } catch (err: any) {
      console.error(`Follow-up failed for ${followup.customer_phone}:`, err.message);
      await supabase
        .from("followups")
        .update({ error_message: err.message })
        .eq("id", followup.id);
      failed++;
    }
  }

  return json({
    success: true,
    message: `Follow-ups processed. ${sent} sent, ${failed} failed.`,
    sent,
    failed,
    dry_run: dryRun,
  });
}

/**
 * Send a broadcast WhatsApp message to all customers with whatsapp_opt_in = true.
 */
async function handleBroadcast(
  supabase: any,
  creds: { accountSid: string; authToken: string; fromNumber: string } | null,
  payload: { message: string },
  dryRun: boolean
) {
  const { message } = payload;
  if (!message?.trim()) return json({ error: "Message body is required" }, 400);

  const { data: customers, error } = await supabase
    .from("customers")
    .select("name, mobile_no, whatsapp_opt_in")
    .eq("whatsapp_opt_in", true)
    .not("mobile_no", "is", null);

  if (error) throw new Error(`Failed to fetch customers: ${error.message}`);
  if (!customers || customers.length === 0) {
    return json({ success: true, message: "No opted-in customers found", sent: 0, failed: 0 });
  }

  let sent = 0;
  let failed = 0;

  for (const customer of customers) {
    if (!customer.mobile_no) { failed++; continue; }

    // Personalise message by replacing {name} placeholder
    const personalised = message.replace(/\{name\}/gi, customer.name || "there");

    try {
      if (!dryRun && creds) {
        await sendWhatsApp(
          creds.accountSid,
          creds.authToken,
          creds.fromNumber,
          customer.mobile_no,
          personalised
        );
        await sleep(DELAY_MS);
      } else {
        console.log(`[DRY RUN] Broadcast to ${customer.mobile_no}: ${personalised.slice(0, 60)}…`);
      }
      sent++;
    } catch (err: any) {
      console.error(`Broadcast failed for ${customer.mobile_no}:`, err.message);
      failed++;
    }
  }

  return json({
    success: true,
    message: `Broadcast complete. ${sent} sent, ${failed} failed.`,
    sent,
    failed,
    dry_run: dryRun,
  });
}

// ── Utility ───────────────────────────────────────────────────────────────────

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status,
  });
}

// ── Entry point ───────────────────────────────────────────────────────────────

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID") ?? "";
    const authToken = Deno.env.get("TWILIO_AUTH_TOKEN") ?? "";
    const fromNumber = Deno.env.get("TWILIO_WHATSAPP_NUMBER") ?? "";

    const dryRun = !accountSid || !authToken || !fromNumber;
    if (dryRun) {
      console.warn(
        "Twilio credentials not configured — running in dry-run mode. " +
        "Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER."
      );
    }

    const creds = dryRun ? null : { accountSid, authToken, fromNumber };
    const body = await req.json();
    const { type } = body;

    if (type === "order_confirmation") {
      return await handleOrderConfirmation(supabaseAdmin, creds, body, dryRun);
    }

    if (type === "dispatched" || type === "delivered") {
      return await handleStatusNotification(supabaseAdmin, creds, { ...body, status: type }, dryRun);
    }

    if (type === "run_followups") {
      return await handleRunFollowups(supabaseAdmin, creds, dryRun);
    }

    if (type === "broadcast") {
      return await handleBroadcast(supabaseAdmin, creds, body, dryRun);
    }

    return json({ error: "Unknown type. Expected: order_confirmation | dispatched | delivered | run_followups | broadcast" }, 400);
  } catch (err: any) {
    console.error("whatsapp-notify error:", err);
    return json({ error: err.message }, 500);
  }
});
