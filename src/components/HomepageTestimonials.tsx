import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Testimonial {
  id: string;
  name: string;
  size: string;
  rating: number;
  comment: string;
  sort_order: number;
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5 mb-3">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={14}
        className={s <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20"}
      />
    ))}
  </div>
);

const HomepageTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    supabase
      .from("homepage_testimonials")
      .select("id, name, size, rating, comment, sort_order")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data) setTestimonials(data as Testimonial[]);
      });
  }, []);

  return (
    <section id="testimonials" className="bg-background py-14 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10 md:mb-14">
          <span className="text-coral font-display font-semibold text-sm uppercase tracking-widest">
            Tea on Us
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-3">
            Real girls, real results
          </h2>
          <p className="text-muted-foreground text-lg mt-3">
            No filters. Just honest reviews.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-card border border-border rounded-2xl p-6 flex flex-col"
            >
              <StarRating rating={review.rating} />
              <p className="text-foreground/80 text-base leading-relaxed flex-1">
                "{review.comment}"
              </p>
              <div className="mt-5 flex items-center justify-between">
                <span className="font-display font-bold text-foreground">{review.name}</span>
                <span className="text-xs text-muted-foreground bg-accent px-3 py-1 rounded-full">
                  Size {review.size}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomepageTestimonials;
