import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya S.",
    size: "S-M",
    rating: 5,
    comment:
      "Finally! No bulge under my leggings at the gym. I wore it through an entire spin class and not a single leak. Obsessed.",
  },
  {
    name: "Ananya R.",
    size: "L-XL",
    rating: 5,
    comment:
      "Wore it on a 6-hour flight and felt totally fresh. The fact that it's disposable makes travel SO much easier. Game changer!",
  },
  {
    name: "Kavya M.",
    size: "S-M",
    rating: 5,
    comment:
      "I was sceptical but it's genuinely slimmer than any pad I've worn. It stayed put during my morning run. 10/10 would recommend.",
  },
  {
    name: "Shruti T.",
    size: "2XL-3XL",
    rating: 5,
    comment:
      "Love the stretch band – it doesn't dig in at all. Comfortable for 12 hours straight. No rashes, no leaks. Zero drama.",
  },
  {
    name: "Meghna D.",
    size: "L-XL",
    rating: 5,
    comment:
      "The individual pouches are such a thoughtful touch. Discrete disposal is a big deal for me. These are now a permanent part of my stash.",
  },
  {
    name: "Ishita B.",
    size: "S-M",
    rating: 5,
    comment:
      "My horse riding session used to be such a nightmare during periods. Not anymore! PoppiGo stayed in place the entire time. Unreal.",
  },
];

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
