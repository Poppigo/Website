import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

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
    const { items, customerName, customerEmail, shippingAddress, userId, amount: passedAmount } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("No items provided");
    }
    if (!customerName) throw new Error("Name is required");
    if (!customerEmail) throw new Error("Email is required");

    // SERVER-SIDE price verification: recalculate total from DB prices
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

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
      if (!product) {
        throw new Error(`Product not found: ${item.name || item.product_id}`);
      }
      if (product.stock !== null && product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }
      serverTotal += product.price * item.quantity;
    }

    // Use server-calculated total, ignore client-passed amount
    const amountInPaise = Math.round(serverTotal * 100);

    const keyId = Deno.env.get("RAZORPAY_KEY_ID") || "";
    const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET") || "";

    // Create Razorpay order
    const rpResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa(`${keyId}:${keySecret}`),
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
        notes: {
          customer_name: customerName,
          customer_email: customerEmail,
        },
      }),
    });

    const rpOrder = await rpResponse.json();

    if (rpOrder.error) {
      throw new Error(rpOrder.error.description || "Failed to create Razorpay order");
    }

    return new Response(
      JSON.stringify({
        order_id: rpOrder.id,
        amount: rpOrder.amount,
        currency: rpOrder.currency,
        key_id: keyId,
        server_total: serverTotal,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Create Razorpay order error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
