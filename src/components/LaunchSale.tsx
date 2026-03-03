import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import availSizes from "@/assets/Avail_in_3_sizes-removebg-preview-1.png";
import fastAbsorbing from "@/assets/Fast-Absorbing-Japanese-TechS-1.png";
import heroProduct from "@/assets/hero-product.png";

const AMAZON_SM = "https://www.amazon.in/dp/B0FHWT4FJS";
const AMAZON_LXL = "https://www.amazon.in/dp/B0FJ1VKSM6";
const AMAZON_STORE = "https://www.amazon.in/stores/page/5ABC0BF5-7088-4979-9DAD-F25E0CF7FD70";

const cards = [
  {
    title: "Available in 3\nSizes – S to 3XL",
    image: availSizes,
    link: AMAZON_STORE,
    coupon: null,
    imageAlign: "center" as const,
    imageSizeCls: "max-h-48 md:max-h-56 w-full",
  },
  {
    title: "5x Slimmer,\n10x Comfort",
    image: heroProduct,
    featured: true,
    link: AMAZON_SM,
    coupon: null,
    imageAlign: "center" as const,
    imageSizeCls: "max-h-48 md:max-h-56 w-full",
  },
  {
    title: "Grab Extra\n10% Off!",
    image: fastAbsorbing,
    link: AMAZON_LXL,
    coupon: null,
    imageAlign: "left" as const,
    imageSizeCls: "max-h-120 md:max-h-132 w-auto -ml-6",
  },
];

const LaunchSale = () => {
  const navigate = useNavigate();

  const handleShopClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate("/shop");
  };

  return (
    <section className="bg-lime py-12 md:py-20 relative overflow-hidden">
      {/* Heading */}
      <div className="max-w-6xl mx-auto px-6 text-center mb-12">
        <span className="text-navy/60 font-display font-semibold text-sm uppercase tracking-widest">
          Shop the Stash
        </span>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-navy leading-tight mt-3">
          Period care built for your life
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
            <motion.div
                onClick={handleShopClick}
                className={`group relative block bg-primary rounded-3xl overflow-hidden cursor-pointer ${
                  card.featured ? "md:row-span-1" : ""
                }`}
                whileHover={{ scale: 1.03, rotateX: 3, rotateY: -3 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{ transformPerspective: 800 }}
              >
                {/* Decorative blobs */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-navy" />
                  <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-navy" />
                  <div className="absolute bottom-1/4 right-1/4 w-24 h-24 rounded-full bg-navy" />
                </div>

                {/* Content */}
                <div className="relative p-5 md:p-6 flex flex-col h-[260px] sm:h-[320px] md:h-[380px]">
                  {/* Top: Title + Arrow */}
                  <div className="flex items-start justify-between mb-auto">
                    <h3 className="font-display text-xl md:text-2xl font-bold text-navy whitespace-pre-line leading-tight">
                      {card.title}
                    </h3>
                    <span className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-card/40 flex items-center justify-center group-hover:bg-card/20 transition-colors">
                      <ArrowUpRight className="w-5 h-5 text-card" />
                    </span>
                  </div>

                  {/* Coupon code badge */}
                  {card.coupon && (
                    <div className="mt-3">
                      <span className="inline-block bg-secondary text-secondary-foreground px-4 py-1.5 rounded-full text-sm font-bold tracking-wide">
                        {card.coupon}
                      </span>
                    </div>
                  )}

                  {/* Bottom: Product image */}
                  <div className={`flex ${card.imageAlign === "left" ? "justify-start -mx-2 -mt-14" : "justify-center mt-6"}`}>
                    <img
                      src={card.image}
                      alt={card.title}
                      className={`${card.imageSizeCls} object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-lg`}
                    />
                  </div>
                </div>
                </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LaunchSale;
