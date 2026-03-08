import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function verifySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const data = encoder.encode(`${orderId}|${paymentId}`);
  const sig = await crypto.subtle.sign("HMAC", key, data);
  const hexSig = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hexSig === signature;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      couponCode,
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new Error("Missing payment verification parameters");
    }

    // ── 1. Verify Razorpay signature ─────────────────────────────
    const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET") || "";
    const isValid = await verifySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      keySecret
    );

    if (!isValid) {
      throw new Error("Payment verification failed - invalid signature");
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // ── 2. Look up the Pending order created at checkout ─────────
    // order_number was set to ORD-{razorpay_order_id suffix} in create-razorpay-order
    const orderNumber = `ORD-${razorpay_order_id.slice(-8).toUpperCase()}`;

    const { data: pendingOrder, error: lookupError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("order_number", orderNumber)
      .maybeSingle();

    if (lookupError) throw new Error("Failed to look up order");

    // ── 3. Idempotency: already processed ────────────────────────
    if (pendingOrder && pendingOrder.status === "Processing") {
      return new Response(
        JSON.stringify({ success: true, order_number: pendingOrder.order_number, already_processed: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    if (!pendingOrder || pendingOrder.status !== "Pending") {
      // Fallback should never happen in normal flow
      throw new Error("Pending order not found or already in an unexpected state");
    }

    // ── 4. Update order status → Processing ──────────────────────
    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({ status: "Processing" })
      .eq("order_number", orderNumber);

    if (updateError) throw new Error("Failed to confirm order");

    // ── 5. Update product stock ────────────────────────────────
    const items = Array.isArray(pendingOrder.items) ? pendingOrder.items : [];
    for (const item of items) {
      if (item.product_id) {
        const { data: product } = await supabaseAdmin
          .from("products")
          .select("stock")
          .eq("id", item.product_id)
          .single();

        if (product) {
          const newStock = Math.max(0, (product.stock || 0) - item.quantity);
          await supabaseAdmin
            .from("products")
            .update({ stock: newStock })
            .eq("id", item.product_id);
        }
      }
    }

    // ── 6. Upsert customer metrics ────────────────────────────────
    const { data: existingCustomer } = await supabaseAdmin
      .from("customers")
      .select("*")
      .eq("email", pendingOrder.customer_email)
      .maybeSingle();

    const finalAmount = Number(pendingOrder.amount);

    if (existingCustomer) {
      await supabaseAdmin
        .from("customers")
        .update({
          total_orders: (existingCustomer.total_orders || 0) + 1,
          total_spent: (Number(existingCustomer.total_spent) || 0) + finalAmount,
          name: pendingOrder.customer_name,
          user_id: pendingOrder.user_id || existingCustomer.user_id,
          mobile_no: pendingOrder.mobile_no || existingCustomer.mobile_no,
        })
        .eq("id", existingCustomer.id);
    } else {
      await supabaseAdmin.from("customers").insert({
        name: pendingOrder.customer_name,
        email: pendingOrder.customer_email,
        total_orders: 1,
        total_spent: finalAmount,
        user_id: pendingOrder.user_id || null,
        mobile_no: pendingOrder.mobile_no || null,
      });
    }

    // ── 7. Increment coupon used_count ────────────────────────────
    if (couponCode) {
      const { data: coupon } = await supabaseAdmin
        .from("coupons")
        .select("id, used_count")
        .eq("code", couponCode)
        .single();
      if (coupon) {
        await supabaseAdmin
          .from("coupons")
          .update({ used_count: (coupon.used_count || 0) + 1 })
          .eq("id", coupon.id);
      }
    }

    return new Response(
      JSON.stringify({ success: true, order_number: orderNumber }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error: any) {
    console.error("Verify payment error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
