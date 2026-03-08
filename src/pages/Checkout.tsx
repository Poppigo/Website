import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, ChevronRight, Lock, Tag, X, Banknote, CreditCard } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Chandigarh", "Puducherry",
];

interface CheckoutForm {
  firstName: string;
  lastName: string;
  country: string;
  streetAddress: string;
  city: string;
  state: string;
  postcode: string;
  phone: string;
  email: string;
}

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; type: string; value: number } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online");
  const [form, setForm] = useState<CheckoutForm>({
    firstName: "",
    lastName: "",
    country: "India",
    streetAddress: "",
    city: "",
    state: "",
    postcode: "",
    phone: "",
    email: user?.email || "",
  });

  const discount = appliedCoupon
    ? appliedCoupon.type === "percentage"
      ? Math.round(totalPrice * appliedCoupon.value / 100)
      : Math.min(appliedCoupon.value, totalPrice)
    : 0;
  const finalTotal = totalPrice - discount;

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  // Fetch user profile data
  useEffect(() => {
    if (user?.email) {
      setForm((prev) => ({ ...prev, email: user.email || prev.email }));
    }
  }, [user]);

  // Auto-fill city/state from pincode
  useEffect(() => {
    const fetchPincode = async () => {
      if (form.postcode.length === 6) {
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${form.postcode}`);
          const data = await res.json();
          if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
            const po = data[0].PostOffice[0];
            setForm((prev) => ({
              ...prev,
              city: po.District || prev.city,
              state: po.State || prev.state,
            }));
          }
        } catch {
          // ignore pincode lookup errors
        }
      }
    };
    fetchPincode();
  }, [form.postcode]);

  const updateField = (field: keyof CheckoutForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!form.firstName.trim()) { toast.error("First name is required"); return false; }
    if (!form.lastName.trim()) { toast.error("Last name is required"); return false; }
    if (!form.streetAddress.trim()) { toast.error("Street address is required"); return false; }
    if (!form.city.trim()) { toast.error("City is required"); return false; }
    if (!form.state.trim()) { toast.error("State is required"); return false; }
    if (!form.postcode.trim()) { toast.error("Postcode is required"); return false; }
    if (!form.phone.trim() || form.phone.trim().length < 10) { toast.error("Valid phone number is required"); return false; }
    if (!form.email.trim()) { toast.error("Email is required"); return false; }
    return true;
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", couponCode.toUpperCase().trim())
        .eq("is_active", true)
        .single();

      if (error || !data) { toast.error("Invalid coupon code"); setCouponLoading(false); return; }

      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        toast.error("This coupon has expired"); setCouponLoading(false); return;
      }
      if (data.max_uses && data.used_count >= data.max_uses) {
        toast.error("This coupon has reached its usage limit"); setCouponLoading(false); return;
      }
      if (totalPrice < (data.min_order_amount || 0)) {
        toast.error(`Minimum order amount is ₹${data.min_order_amount}`); setCouponLoading(false); return;
      }

      setAppliedCoupon({ code: data.code, type: data.type, value: Number(data.value) });
      toast.success(`Coupon ${data.code} applied!`);
    } catch {
      toast.error("Failed to apply coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    if (items.length === 0) { toast.error("Cart is empty"); return; }

    setProcessing(true);
    try {
      const cartItems = items.map((item) => ({
        product_id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        size: item.size || null,
      }));

      if (paymentMethod === "cod") {
        // COD flow - create order directly without payment
        const { data: codData, error: codError } = await supabase.functions.invoke(
          "create-cod-order",
          {
            body: {
              items: cartItems,
              customerName: `${form.firstName} ${form.lastName}`,
              customerEmail: form.email,
              shippingAddress: {
                street: form.streetAddress,
                city: form.city,
                state: form.state,
                postcode: form.postcode,
                country: form.country,
              },
              mobileNo: form.phone,
              userId: user?.id || null,
              couponCode: appliedCoupon?.code || null,
            },
          }
        );

        if (codError) throw new Error(codError.message);
        if (codData?.error) {
          // Rate-limit hit — surface a friendlier message and nudge towards online payment
          if (
            codData.error.toLowerCase().includes("too many") ||
            codData.error.toLowerCase().includes("maximum") ||
            codData.error.toLowerCase().includes("rate")
          ) {
            toast.error(
              "You've reached the daily limit for Cash on Delivery orders. Please switch to online payment to complete your purchase, or try again tomorrow.",
              { duration: 6000 }
            );
            setPaymentMethod("online");
            setProcessing(false);
            return;
          }
          throw new Error(codData.error);
        }

        clearCart();
        // Fire-and-forget WhatsApp order confirmation + schedule follow-ups
        if (form.phone && codData.order_id) {
          supabase.functions.invoke("whatsapp-notify", {
            body: {
              type: "order_confirmation",
              orderId: codData.order_id,
              orderNumber: codData.order_number,
              customerName: `${form.firstName} ${form.lastName}`,
              customerPhone: form.phone,
            },
          }).catch((err: any) => console.warn("WhatsApp notify failed:", err.message));
        }
        navigate(`/order-success?order_number=${codData.order_number}`);
      } else {
        // Online payment flow via Razorpay
        const { data: orderData, error: orderError } = await supabase.functions.invoke(
          "create-razorpay-order",
          {
            body: {
              items: cartItems,
              customerName: `${form.firstName} ${form.lastName}`,
              customerEmail: form.email,
              shippingAddress: {
                street: form.streetAddress,
                city: form.city,
                state: form.state,
                postcode: form.postcode,
                country: form.country,
              },
              mobileNo: form.phone,
              userId: user?.id || null,
              couponCode: appliedCoupon?.code || null,
            },
          }
        );

        if (orderError) throw new Error(orderError.message);
        if (orderData?.error) throw new Error(orderData.error);

        const options = {
          key: orderData.key_id,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "PoppiGo",
          description: "Order Payment",
          order_id: orderData.order_id,
          prefill: {
            name: `${form.firstName} ${form.lastName}`,
            email: form.email,
            contact: form.phone,
          },
          theme: { color: "#1a1a2e" },
          handler: async (response: any) => {
            try {
              const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
                "verify-razorpay-payment",
                {
                  body: {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    couponCode: appliedCoupon?.code || null,
                  },
                }
              );

              if (verifyError) throw new Error(verifyError.message);
              if (verifyData?.error) throw new Error(verifyData.error);

              clearCart();
              // Fire-and-forget WhatsApp order confirmation + schedule follow-ups
              if (form.phone && verifyData.order_id) {
                supabase.functions.invoke("whatsapp-notify", {
                  body: {
                    type: "order_confirmation",
                    orderId: verifyData.order_id,
                    orderNumber: verifyData.order_number,
                    customerName: `${form.firstName} ${form.lastName}`,
                    customerPhone: form.phone,
                  },
                }).catch((err: any) => console.warn("WhatsApp notify failed:", err.message));
              }
              navigate(`/order-success?order_number=${verifyData.order_number}`);
            } catch (err: any) {
              console.error("Payment verification error:", err);
              toast.error("Payment verification failed. Contact support.");
            }
          },
          modal: {
            ondismiss: () => {
              setProcessing(false);
              toast.error("Payment cancelled");
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", (response: any) => {
          setProcessing(false);
          toast.error(response.error.description || "Payment failed");
        });
        rzp.open();
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      toast.error(err.message || "Something went wrong");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-peach flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-peach">
        <Navbar />
        <div className="pt-24 pb-20 flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
          <h1 className="font-display text-3xl font-bold text-foreground mb-3">No items to checkout</h1>
          <Link to="/shop" className="bg-secondary text-secondary-foreground px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity">
            Shop Now
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-peach">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/cart" className="hover:text-foreground transition-colors">Cart</Link>
            <ChevronRight size={14} />
            <span className="text-foreground font-medium">Checkout</span>
          </nav>

          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-10">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Billing Form */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl border border-border p-6 md:p-8"
              >
                <h2 className="font-display text-xl font-bold text-foreground mb-6">Billing Details</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" value={form.firstName} onChange={(e) => updateField("firstName", e.target.value)} placeholder="First name" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" value={form.lastName} onChange={(e) => updateField("lastName", e.target.value)} placeholder="Last name" />
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor="country">Country / Region *</Label>
                  <Input id="country" value={form.country} onChange={(e) => updateField("country", e.target.value)} placeholder="India" />
                </div>

                <div className="mt-4">
                  <Label htmlFor="streetAddress">Street Address *</Label>
                  <Input id="streetAddress" value={form.streetAddress} onChange={(e) => updateField("streetAddress", e.target.value)} placeholder="House number and street name" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <div>
                    <Label htmlFor="postcode">Postcode / ZIP *</Label>
                    <Input id="postcode" value={form.postcode} onChange={(e) => updateField("postcode", e.target.value)} placeholder="110001" maxLength={6} />
                  </div>
                  <div>
                    <Label htmlFor="city">Town / City *</Label>
                    <Input id="city" value={form.city} onChange={(e) => updateField("city", e.target.value)} placeholder="City" />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <select
                      id="state"
                      value={form.state}
                      onChange={(e) => updateField("state", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Select State</option>
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input id="phone" type="tel" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+91 9876543210" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" value={form.email} readOnly className="bg-muted cursor-not-allowed" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-2xl border border-border p-6 md:p-8 sticky top-24"
              >
                <h2 className="font-display text-xl font-bold text-foreground mb-6">Your Order</h2>

                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={`${item.id}__${item.size || ""}`} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-12 h-12 bg-accent rounded-lg overflow-hidden shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">{item.name}</p>
                          {item.size && <p className="text-xs text-muted-foreground">Size: {item.size}</p>}
                          <p className="text-muted-foreground">× {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-foreground ml-2">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Coupon Code */}
                <div className="border-t border-border pt-4">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Tag size={14} className="text-green-600" />
                        <span className="text-sm font-semibold text-green-700">{appliedCoupon.code}</span>
                        <span className="text-xs text-green-600">
                          ({appliedCoupon.type === "percentage" ? `${appliedCoupon.value}% off` : `₹${appliedCoupon.value} off`})
                        </span>
                      </div>
                      <button onClick={removeCoupon} className="p-1 hover:bg-green-100 rounded"><X size={14} className="text-green-600" /></button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="Coupon code" className="font-mono text-sm" />
                      <Button variant="outline" size="sm" onClick={handleApplyCoupon} disabled={couponLoading || !couponCode.trim()} className="shrink-0">
                        {couponLoading ? <Loader2 size={14} className="animate-spin" /> : "Apply"}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Payment Method Selector */}
                <div className="border-t border-border pt-4">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Payment Method</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("online")}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        paymentMethod === "online"
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border text-muted-foreground hover:border-muted-foreground/40"
                      }`}
                    >
                      <CreditCard size={18} />
                      <span>Pay Online</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("cod")}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        paymentMethod === "cod"
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border text-muted-foreground hover:border-muted-foreground/40"
                      }`}
                    >
                      <Banknote size={18} />
                      <span>Cash on Delivery</span>
                    </button>
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium text-foreground">₹{totalPrice.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Discount</span>
                      <span className="font-medium text-green-600">−₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-border pt-3 mt-3">
                    <span className="text-foreground">Total</span>
                    <span className="text-coral">₹{finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={processing}
                  className="w-full mt-6 bg-coral text-card px-6 py-4 rounded-full font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {processing ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {paymentMethod === "cod" ? <Banknote size={18} /> : <Lock size={18} />}
                      {paymentMethod === "cod" ? "Place COD Order" : "Place Order"}
                    </>
                  )}
                </button>

                <p className="text-xs text-muted-foreground text-center mt-3">
                  {paymentMethod === "cod"
                    ? "Pay cash when your order is delivered."
                    : "Secured by Razorpay. Your payment information is encrypted."}
                </p>

                <p className="text-xs text-muted-foreground text-center mt-2">
                  By placing your order, you agree to our{" "}
                  <Link to="/returns" className="underline hover:text-foreground transition-colors">
                    Returns &amp; Refund Policy
                  </Link>
                  . As a hygiene product, we do not accept returns. For quality concerns, contact us within 7 days of delivery.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
