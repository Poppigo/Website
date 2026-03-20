import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const DELAY_MS = 100;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { subject, body, previewText } = await req.json();

    if (!subject?.trim()) throw new Error("Subject is required");
    if (!body?.trim()) throw new Error("Body is required");

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY secret is not configured");

    const FROM_EMAIL =
      Deno.env.get("RESEND_FROM_EMAIL") ?? "PoppiGo <hello@poppigo.com>";

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch all marketing opted-in customers with valid emails
    const { data: customers, error } = await supabaseAdmin
      .from("customers")
      .select("name, email")
      .eq("marketing_opt_in", true)
      .not("email", "is", null);

    if (error) throw new Error("Failed to fetch customers: " + error.message);

    if (!customers || customers.length === 0) {
      return new Response(
        JSON.stringify({ message: "No opted-in customers found", sent: 0, failed: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let sent = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const customer of customers) {
      if (!customer.email) continue;

      const name = customer.name || "there";
      const personalizedSubject = subject.replace(/\{name\}/gi, name);
      const personalizedBody = body.replace(/\{name\}/gi, name);

      // Auto-wrap plain text in a styled HTML shell; pass HTML as-is
      const isHtml = /<[a-z][\s\S]*>/i.test(personalizedBody);
      const safeText = personalizedBody
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      const htmlBody = isHtml
        ? personalizedBody
        : `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  ${previewText ? `<meta name="description" content="${previewText.replace(/"/g, "&quot;")}" />` : ""}
</head>
<body style="margin:0;padding:0;background:#fff4ee;font-family:sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;margin-top:24px;margin-bottom:24px;">
    <div style="background:#1b2a54;padding:24px 32px;">
      <h1 style="margin:0;color:#ccff3c;font-size:22px;letter-spacing:-0.5px;">PoppiGo</h1>
    </div>
    <div style="padding:32px;color:#1b2a54;font-size:15px;line-height:1.7;white-space:pre-wrap;">${safeText}</div>
    <div style="padding:16px 32px;border-top:1px solid #f3f4f6;text-align:center;">
      <p style="color:#9ca3af;font-size:12px;margin:0;">
        You're receiving this because you opted in to PoppiGo marketing emails.
        &nbsp;|&nbsp;
        <a href="https://poppigo.com" style="color:#9ca3af;">poppigo.com</a>
      </p>
    </div>
  </div>
</body>
</html>`;

      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: FROM_EMAIL,
            to: [customer.email],
            subject: personalizedSubject,
            html: htmlBody,
          }),
        });

        if (!res.ok) {
          const errText = await res.text();
          errors.push(`${customer.email}: ${errText}`);
          failed++;
        } else {
          sent++;
        }
      } catch (e: any) {
        errors.push(`${customer.email}: ${e.message}`);
        failed++;
      }

      // Small delay to stay within Resend rate limits
      await sleep(DELAY_MS);
    }

    const message =
      failed === 0
        ? `Email sent to ${sent} customer${sent !== 1 ? "s" : ""} successfully!`
        : `Sent to ${sent}, failed for ${failed}`;

    return new Response(
      JSON.stringify({ message, sent, failed, errors: errors.slice(0, 10) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
