import { useState, useEffect } from "react";
import { Star, MessageSquare, User } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

interface Review {
  id: string;
  product_id: string;
  rating: number;
  comment: string | null;
  customer_name: string;
  size: string | null;
  created_at: string;
}

interface ReviewSectionProps {
  productId: string;
}

const StarRating = ({ rating, size = 16 }: { rating: number; size?: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={size}
        className={s <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20"}
      />
    ))}
  </div>
);

const ReviewSection = ({ productId }: ReviewSectionProps) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });
      if (data) setReviews(data as Review[]);
      setLoading(false);
    };

    const checkPurchase = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("orders")
        .select("id, items")
        .eq("user_id", user.id)
        .eq("status", "Delivered");
      if (data) {
        const purchased = data.some((order: any) => {
          const items = Array.isArray(order.items) ? order.items : [];
          return items.some((item: any) => (item.product_id || item.id) === productId);
        });
        setHasPurchased(purchased);
      }
    };

    fetchReviews();
    checkPurchase();
  }, [productId, user]);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const ratingDist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mt-16"
    >
      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8">
        Ratings & Reviews
      </h2>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 mb-8 max-w-lg">
            <div className="flex flex-col sm:flex-row gap-8">
              <div className="text-center sm:text-left shrink-0">
                <p className="font-display text-5xl font-bold text-foreground">
                  {avgRating > 0 ? avgRating.toFixed(1) : "—"}
                </p>
                <StarRating rating={Math.round(avgRating)} size={20} />
                <p className="text-sm text-muted-foreground mt-1">
                  {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex-1 space-y-1.5">
                {ratingDist.map(({ star, count }) => (
                  <div key={star} className="flex items-center gap-2 text-sm">
                    <span className="w-3 text-muted-foreground font-medium">{star}</span>
                    <Star size={12} className="fill-amber-400 text-amber-400 shrink-0" />
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all"
                        style={{
                          width: reviews.length > 0 ? `${(count / reviews.length) * 100}%` : "0%",
                        }}
                      />
                    </div>
                    <span className="text-muted-foreground w-6 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          {!user ? (
            <div className="bg-card rounded-2xl border border-border p-6 text-center mb-8">
              <MessageSquare size={28} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground mb-3">Log in to leave a review</p>
              <Link
                to="/auth"
                className="inline-block bg-secondary text-secondary-foreground px-6 py-2.5 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Log In
              </Link>
            </div>
          ) : !hasPurchased ? (
            <div className="bg-card rounded-2xl border border-border p-6 text-center mb-8">
              <MessageSquare size={28} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground mb-3">Purchase this product to leave a review</p>
              <Link
                to="/shop"
                className="inline-block bg-coral text-card px-6 py-2.5 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Purchase to Review
              </Link>
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border p-6 text-center mb-8">
              <p className="text-muted-foreground">
                You can leave a review from your{" "}
                <Link to="/my-orders" className="text-coral font-semibold hover:underline">
                  My Orders
                </Link>{" "}
                page for delivered items.
              </p>
            </div>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review, i) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card rounded-2xl border border-border p-5 md:p-6"
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
                      <User size={18} className="text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-display font-bold text-foreground text-sm">
                            {review.customer_name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <StarRating rating={review.rating} size={14} />
                            {review.size && (
                              <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                Size: {review.size}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {new Date(review.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-foreground/80 mt-3 leading-relaxed">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export { StarRating };
export default ReviewSection;
