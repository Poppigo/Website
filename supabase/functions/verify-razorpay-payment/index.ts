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
      items,
      customerName,
      customerEmail,
      shippingAddress,
      mobileNo,
      userId,
      couponCode,
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new Error("Missing payment verification parameters");
    }

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

    // Use service role to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // SERVER-SIDE price recalculation - never trust client amount
    const productIds = items.map((i: any) => i.product_id).filter(Boolean);
    const { data: products, error: productsError } = await supabaseAdmin
      .from("products")
      .select("id, price")
      .in("id", productIds);

    if (productsError || !products) {
      throw new Error("Failed to verify product prices");
    }

    const productMap = new Map(products.map((p: any) => [p.id, p]));
    let serverTotal = 0;
    for (const item of items) {
      const product = productMap.get(item.product_id);
      if (!product) throw new Error(`Product not found: ${item.product_id}`);
      serverTotal += product.price * item.quantity;
    }

    // Apply coupon discount server-side
    let discount = 0;
    if (couponCode) {
      const { data: coupon } = await supabaseAdmin
        .from("coupons")
        .select("*")
        .eq("code", couponCode)
        .eq("is_active", true)
        .single();

      if (coupon) {
        if (coupon.type === "percentage") {
          discount = Math.round(serverTotal * Number(coupon.value) / 100);
        } else {
          discount = Math.min(Number(coupon.value), serverTotal);
        }
      }
    }

    const finalAmount = serverTotal - discount;

    const orderNumber = `ORD-${razorpay_payment_id.slice(-8).toUpperCase()}`;

    // Check idempotency
    const { data: existingOrder } = await supabaseAdmin
      .from("orders")
      .select("id, order_number")
      .eq("order_number", orderNumber)
      .maybeSingle();

    if (existingOrder) {
      return new Response(
        JSON.stringify({ success: true, order_number: existingOrder.order_number, already_processed: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // 1. Create order with server-verified amount
    const { error: orderError } = await supabaseAdmin.from("orders").insert({
      order_number: orderNumber,
      customer_name: customerName,
      customer_email: customerEmail,
      amount: finalAmount,
      status: "Processing",
      items,
      shipping_address: shippingAddress || {},
      mobile_no: mobileNo || null,
      user_id: userId || null,
    });
    if (orderError) {
      console.error("Order insert error:", orderError);
      throw new Error("Failed to create order");
    }

    // 2. Update product stock
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

    // 3. Upsert customer
    const { data: existingCustomer } = await supabaseAdmin
      .from("customers")
      .select("*")
      .eq("email", customerEmail)
      .maybeSingle();

    if (existingCustomer) {
      await supabaseAdmin
        .from("customers")
        .update({
          total_orders: (existingCustomer.total_orders || 0) + 1,
          total_spent: (Number(existingCustomer.total_spent) || 0) + finalAmount,
          name: customerName,
          user_id: userId || existingCustomer.user_id,
          mobile_no: mobileNo || existingCustomer.mobile_no,
        })
        .eq("id", existingCustomer.id);
    } else {
      await supabaseAdmin.from("customers").insert({
        name: customerName,
        email: customerEmail,
        total_orders: 1,
        total_spent: finalAmount,
        user_id: userId || null,
        mobile_no: mobileNo || null,
      });
    }

    // 4. Increment coupon used_count
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
  } catch (error) {
    console.error("Verify payment error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
