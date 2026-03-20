import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package, ChevronRight, Loader2, Star } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ReviewForm from "@/components/ReviewForm";

const statusColor: Record<string, string> = {
  Delivered: "bg-green-100 text-green-700",
  Shipped: "bg-blue-100 text-blue-700",
  Processing: "bg-amber-100 text-amber-700",
  Cancelled: "bg-red-100 text-red-700",
};

const statusStep: Record<string, number> = {
  Processing: 1,
  Shipped: 2,
  Delivered: 3,
  Cancelled: -1,
};

interface Order {
  id: string;
  order_number: string;
  amount: number;
  status: string;
  items: any;
  created_at: string;
}

const MyOrders = () => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewedKeys, setReviewedKeys] = useState<Set<string>>(new Set());
  const [openReview, setOpenReview] = useState<string | null>(null);

  const fetchReviewed = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("reviews")
      .select("product_id, order_id, size")
      .eq("user_id", user.id);
    if (data) {
      setReviewedKeys(new Set((data as any[]).map((r) => `${r.product_id}__${r.order_id}__${r.size || ""}`)));
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .neq("status", "Pending")
        .order("created_at", { ascending: false });

      if (data) setOrders(data as Order[]);
      setLoading(false);
    };
    if (user) {
      fetchOrders();
      fetchReviewed();
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-peach flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen bg-peach">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-base text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-foreground font-medium">My Orders</span>
          </nav>

          <h1 className="font-body text-4xl md:text-5xl font-bold text-foreground mb-10">My Orders</h1>

          {loading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <Loader2 size={32} className="animate-spin text-muted-foreground" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <Package size={64} className="text-muted-foreground mx-auto mb-6" />
              <h2 className="font-body text-3xl font-bold mb-3" style={{ color: '#1b2a54' }}>No orders yet</h2>
              <p className="mb-6 text-lg" style={{ color: '#4241ff' }}>Your order history will appear here.</p>
              <Link to="/shop" className="px-10 py-4 rounded-full font-semibold text-lg hover:opacity-90 transition-opacity" style={{ backgroundColor: '#ccff00', color: '#1b2a54' }}>
                Shop Now
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, i) => {
                const step = statusStep[order.status] || 0;
                const orderItems = Array.isArray(order.items) ? order.items : [];
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-card rounded-2xl border border-border p-5 md:p-6"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <div>
                        <p className="font-body font-bold text-foreground">{order.order_number}</p>
                        <p className="text-base text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-body font-bold" style={{ color: '#FF6B35' }}>₹{Number(order.amount).toLocaleString()}</p>
                        <span className={`inline-block px-2.5 py-1 rounded-full text-sm font-semibold mt-1 ${statusColor[order.status] || "bg-muted text-muted-foreground"}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    {order.status !== "Cancelled" && (
                      <div className="flex items-center gap-1 mb-4">
                        {["Processing", "Shipped", "Delivered"].map((s, idx) => (
                          <div key={s} className="flex-1">
                            <div className={`h-1.5 rounded-full ${step > idx ? "bg-green-500" : step === idx + 1 ? "bg-amber-400" : "bg-border"}`} />
                            <p className={`text-[10px] mt-1 ${step >= idx + 1 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                              {s}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Items */}
                    {orderItems.length > 0 && (
                      <div className="border-t border-border pt-3 space-y-3">
                        {orderItems.map((item: any, idx: number) => {
                          const itemProductId = item.product_id || item.id;
                          const itemSize = item.size || "";
                          const reviewKey = `${itemProductId}__${order.id}__${itemSize}`;
                          const alreadyReviewed = reviewedKeys.has(reviewKey);
                          const isDelivered = order.status === "Delivered";
                          return (
                            <div key={idx}>
                              <div className="flex items-center justify-between text-base">
                                <span className="text-foreground">
                                  {item.name}{item.size ? ` (${item.size})` : ""} × {item.quantity}
                                </span>
                                <div className="flex items-center gap-3">
                                  <span className="text-muted-foreground">₹{(item.price * item.quantity).toFixed(2)}</span>
                                  {isDelivered && !alreadyReviewed && (
                                    <button
                                      onClick={() => setOpenReview(openReview === reviewKey ? null : reviewKey)}
                                      className="flex items-center gap-1 text-sm font-semibold hover:underline" style={{ color: '#FF6B35' }}
                                    >
                                      <Star size={12} /> Rate
                                    </button>
                                  )}
                                  {alreadyReviewed && (
                                    <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                                      <Star size={12} className="fill-green-600" /> Reviewed
                                    </span>
                                  )}
                                </div>
                              </div>
                              {openReview === reviewKey && isDelivered && !alreadyReviewed && user && (
                                <ReviewForm
                                  productId={itemProductId}
                                  productName={item.name}
                                  orderId={order.id}
                                  userId={user.id}
                                  customerName={user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User"}
                                  size={item.size || undefined}
                                  onSubmitted={() => {
                                    setOpenReview(null);
                                    fetchReviewed();
                                  }}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyOrders;
