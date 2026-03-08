import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

// Public opt-out endpoint — no auth required.
// GET /functions/v1/opt-out?email=<encoded_email>            → unsubscribe
// GET /functions/v1/opt-out?email=<encoded_email>&resub=1    → resubscribe

serve(async (req) => {
  const url = new URL(req.url);
  const rawEmail = url.searchParams.get("email");
  const resub = url.searchParams.get("resub") === "1";

  if (!rawEmail) {
    return html(400, "Invalid Link", "This unsubscribe link is invalid — no email address was found.");
  }

  const email = decodeURIComponent(rawEmail).toLowerCase().trim();

  if (!email.includes("@")) {
    return html(400, "Invalid Link", "This unsubscribe link contains an invalid email address.");
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const { error } = await supabase
    .from("customers")
    .update({ marketing_opt_in: resub })
    .eq("email", email);

  if (error) {
    console.error("opt-out DB error:", error);
    return html(500, "Something Went Wrong", "We couldn't process your request. Please try again later.");
  }

  if (resub) {
    return html(
      200,
      "You're Back! 🎉",
      "You've successfully resubscribed to PoppiGo marketing messages. We're happy to have you back!"
    );
  }

  return html(
    200,
    "Unsubscribed ✓",
    "You've been removed from our marketing list. You won't receive any more promotional messages from PoppiGo.",
    `<p style="margin-top:24px;font-size:14px;color:#aaa">
      Changed your mind?
      <a href="?email=${encodeURIComponent(email)}&resub=1" style="color:#e05a5a;text-decoration:underline">
        Resubscribe
      </a>
    </p>`
  );
});

// ── HTML response helper ──────────────────────────────────────────────────────

function html(status: number, title: string, message: string, extra = "") {
  const body = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title} — PoppiGo</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{
      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
      background:#fff5f0;
      min-height:100vh;
      display:flex;
      align-items:center;
      justify-content:center;
      padding:24px;
    }
    .card{
      background:#fff;
      border-radius:20px;
      padding:48px 40px;
      max-width:440px;
      width:100%;
      text-align:center;
      box-shadow:0 4px 32px rgba(0,0,0,0.08);
    }
    .logo{font-size:48px;margin-bottom:20px}
    h1{color:#e05a5a;font-size:22px;font-weight:700;margin-bottom:12px}
    p{color:#555;line-height:1.65;font-size:15px}
    .home{
      display:inline-block;
      margin-top:28px;
      padding:10px 24px;
      background:#e05a5a;
      color:#fff;
      border-radius:999px;
      text-decoration:none;
      font-size:14px;
      font-weight:600;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">🌸</div>
    <h1>${title}</h1>
    <p>${message}</p>
    ${extra}
    <a href="https://poppigo.com" class="home">Back to PoppiGo</a>
  </div>
</body>
</html>`;

  return new Response(body, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
