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
        className={s <= rating ? "fill-orange-400 text-orange-400" : "text-foreground/10"}
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
    <section id="testimonials" className="bg-[#f7fbed] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-10 md:mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-accent font-semibold text-4xl tracking-widest" style={{ color: "#4241ff" }}>
            Reviews
          </span>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mt-3">
            See Why Women Are Switching
          </h2>
          <p className="text-foreground/50 text-2xl md:text-3xl mt-3 font-body">
            They tried it. Now they're obsessed.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-[#fafff0] border border-lime/15 rounded-2xl p-6 flex flex-col hover:shadow-md hover:shadow-lime/10 transition-all duration-300"
            >
              <StarRating rating={review.rating} />
              <p className="text-foreground/70 text-base leading-relaxed flex-1 font-body">
                "{review.comment}"
              </p>
              <div className="mt-5 flex items-center justify-between">
                <span className="font-body font-bold text-foreground">{review.name}</span>
                <span className="text-sm text-foreground/50 bg-lime/20 px-3 py-1 rounded-full font-medium">
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
