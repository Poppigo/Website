import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Called when admin marks a COD order as Delivered.
// Updates customer total_orders and total_spent.
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId } = await req.json();
    if (!orderId) throw new Error("Order ID is required");

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Verify the caller is an admin
    const authHeader = req.headers.get("authorization");
    if (!authHeader) throw new Error("Unauthorized");

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) throw new Error("Unauthorized");

    const { data: adminCheck } = await supabaseAdmin
      .from("admin_emails")
      .select("id")
      .eq("email", user.email)
      .maybeSingle();

    if (!adminCheck) throw new Error("Unauthorized - not an admin");

    // Get the order
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) throw new Error("Order not found");
    if (order.payment_method !== "cod") throw new Error("Not a COD order");

    // Upsert customer metrics
    const { data: existingCustomer } = await supabaseAdmin
      .from("customers")
      .select("*")
      .eq("email", order.customer_email)
      .maybeSingle();

    if (existingCustomer) {
      await supabaseAdmin
        .from("customers")
        .update({
          total_orders: (existingCustomer.total_orders || 0) + 1,
          total_spent: (Number(existingCustomer.total_spent) || 0) + Number(order.amount),
          name: order.customer_name,
          user_id: order.user_id || existingCustomer.user_id,
          mobile_no: order.mobile_no || existingCustomer.mobile_no,
        })
        .eq("id", existingCustomer.id);
    } else {
      await supabaseAdmin.from("customers").insert({
        name: order.customer_name,
        email: order.customer_email,
        total_orders: 1,
        total_spent: Number(order.amount),
        user_id: order.user_id || null,
        mobile_no: order.mobile_no || null,
      });
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Complete COD order error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
