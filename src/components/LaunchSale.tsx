import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import productPack from "@/assets/product-pack.png";
import heroProduct from "@/assets/hero-product.png";
import productPack1 from "@/assets/product-pack-1.png";

const cards = [
  {
    title: "Available in 3\nSizes – S to 3XL",
    image: productPack,
  },
  {
    title: "5x Slimmer,\n10x Comfort",
    image: heroProduct,
    featured: true,
  },
  {
    title: "Fast Absorbing\nJapanese-Tech",
    image: productPack1,
  },
];

const LaunchSale = () => {
  return (
    <section className="bg-lime py-16 md:py-24 relative overflow-hidden">
      {/* Heading */}
      <div className="max-w-6xl mx-auto px-6 text-center mb-12">
        <p className="font-display text-navy text-lg md:text-xl mb-2 italic line-through decoration-navy/60">
          Shop the stash
        </p>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-navy leading-tight">
          Launch Sale – Blink & You'll Miss It
        </h2>
      </div>

      {/* Cards */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <Link
                to="/shop"
                className={`group relative block bg-primary rounded-3xl overflow-hidden ${
                  card.featured ? "md:row-span-1" : ""
                }`}
              >
                {/* Decorative blobs */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-navy" />
                  <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-navy" />
                  <div className="absolute bottom-1/4 right-1/4 w-24 h-24 rounded-full bg-navy" />
                </div>

                {/* Content */}
                <div className="relative p-6 flex flex-col h-full min-h-[380px]">
                  {/* Top: Title + Arrow */}
                  <div className="flex items-start justify-between mb-auto">
                    <h3 className="font-display text-xl md:text-2xl font-bold text-lime whitespace-pre-line leading-tight">
                      {card.title}
                    </h3>
                    <span className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-card/40 flex items-center justify-center group-hover:bg-card/20 transition-colors">
                      <ArrowUpRight className="w-5 h-5 text-card" />
                    </span>
                  </div>

                  {/* Bottom: Product image */}
                  <div className="mt-6 flex justify-center">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="max-h-48 md:max-h-56 object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LaunchSale;
