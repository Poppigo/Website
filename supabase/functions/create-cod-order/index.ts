import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

/** Normalise an Indian mobile number to E.164 (+91XXXXXXXXXX). */
function normalizePhone(raw: string): string {
  if (!raw) return raw;
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 11 && digits.startsWith("0")) return `+91${digits.slice(1)}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  return `+${digits}`;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      items,
      customerName,
      customerEmail,
      shippingAddress,
      mobileNo,
      userId,
      couponCode,
    } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("No items provided");
    }
    if (!customerName) throw new Error("Name is required");
    if (!customerEmail) throw new Error("Email is required");

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // ── Rate limiting ─────────────────────────────────────────────
    // Max 3 COD orders per email per 24 hours
    const RATE_LIMIT = 3;
    const WINDOW_HOURS = 24;
    const windowStart = new Date(Date.now() - WINDOW_HOURS * 60 * 60 * 1000).toISOString();

    const { count: recentCount } = await supabaseAdmin
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("customer_email", customerEmail.toLowerCase().trim())
      .eq("payment_method", "cod")
      .gte("created_at", windowStart);

    if ((recentCount ?? 0) >= RATE_LIMIT) {
      return new Response(
        JSON.stringify({
          error: `Too many COD orders. Maximum ${RATE_LIMIT} COD orders allowed per ${WINDOW_HOURS} hours. Please try again later or choose online payment.`,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 429 }
      );
    }
    // ─────────────────────────────────────────────────────────────

    // SERVER-SIDE price recalculation
    const productIds = items.map((i: any) => i.product_id).filter(Boolean);
    const { data: products, error: productsError } = await supabaseAdmin
      .from("products")
      .select("id, price, name, stock")
      .in("id", productIds);

    if (productsError || !products) {
      throw new Error("Failed to verify product prices");
    }

    const productMap = new Map(products.map((p: any) => [p.id, p]));
    let serverTotal = 0;

    for (const item of items) {
      const product = productMap.get(item.product_id);
      if (!product) throw new Error(`Product not found: ${item.product_id}`);
      if (product.stock !== null && product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }
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

    const COD_FEE = 50;
    const finalAmount = serverTotal - discount + COD_FEE;
    const orderNumber = `COD-${Date.now().toString(36).toUpperCase().slice(-8)}`;

    // Create order with payment_method = 'cod'
    const { error: orderError } = await supabaseAdmin.from("orders").insert({
      order_number: orderNumber,
      customer_name: customerName,
      customer_email: customerEmail,
      amount: finalAmount,
      status: "Processing",
      payment_method: "cod",
      items,
      shipping_address: shippingAddress || {},
      mobile_no: mobileNo ? normalizePhone(mobileNo) : null,
      user_id: userId || null,
    });

    if (orderError) {
      console.error("COD order insert error:", orderError);
      throw new Error("Failed to create order");
    }

    // Update product stock
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

    // Increment coupon used_count
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

    // NOTE: For COD, we do NOT update customer total_orders/total_spent here.
    // That happens when admin marks the order as "Delivered".

    return new Response(
      JSON.stringify({ success: true, order_number: orderNumber }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("COD order error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
