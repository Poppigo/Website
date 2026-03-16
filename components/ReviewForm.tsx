import { useState } from "react";
import { Star, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ReviewFormProps {
  productId: string;
  productName: string;
  orderId: string;
  userId: string;
  customerName: string;
  size?: string;
  onSubmitted: () => void;
}

const ReviewForm = ({ productId, productName, orderId, userId, customerName, size, onSubmitted }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      product_id: productId,
      user_id: userId,
      order_id: orderId,
      rating,
      comment: comment.trim() || null,
      customer_name: customerName,
      size: size || null,
    } as any);

    if (error) {
      if (error.code === "23505") {
        toast.error("You've already reviewed this item from this order");
      } else {
        toast.error("Failed to submit review");
        console.error(error);
      }
    } else {
      toast.success("Review submitted!");
      onSubmitted();
    }
    setSubmitting(false);
  };

  const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <div className="mt-3 bg-card rounded-2xl border border-border p-5 space-y-4">
      <div>
        <p className="font-display font-bold text-foreground text-sm mb-1">
          Rate "{productName}"{size ? ` (${size})` : ""}
        </p>
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onMouseEnter={() => setHoveredStar(s)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => setRating(s)}
                className="transition-transform hover:scale-125 p-0.5"
              >
                <Star
                  size={28}
                  className={
                    s <= (hoveredStar || rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/30"
                  }
                />
              </button>
            ))}
          </div>
          {(hoveredStar || rating) > 0 && (
            <span className="text-xs font-medium text-muted-foreground ml-1">
              {ratingLabels[hoveredStar || rating]}
            </span>
          )}
        </div>
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience with this product..."
        rows={3}
        className="w-full bg-accent/20 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 resize-none focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
      />
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Your review will be public</p>
        <button
          onClick={handleSubmit}
          disabled={submitting || rating === 0}
          className="flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Send size={14} />
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </div>
  );
};

export default ReviewForm;
