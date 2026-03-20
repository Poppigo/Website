import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import availSizes from "@/assets/Avail_in_3_sizes-removebg-preview-1.png";
import heroProduct from "@/assets/hero-product.jpeg";
import productPack from "@/assets/product-pack.png";

const cards = [
  {
    title: "Available in 3 Sizes",
    subtitle: "S-M, L-XL, 2XL-3XL",
    image: availSizes,
  },
  {
    title: "5x Slimmer 10x Comfort",
    subtitle: "Ultra-thin design. Maximum protection without bulk",
    image: heroProduct,
    featured: true,
  },
  {
    title: "Buy More.\nBleed Less Money",
    subtitle: "Bundle deals inside\nSave more with 2 and 3-pack combos",
    image: productPack,
  },
];

const LaunchSale = () => {
  const navigate = useNavigate();

  const handleShopClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate("/shop");
  };

  return (
    <section id="shop-the-stash" className="bg-[#fafff0] py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-accent font-semibold text-4xl tracking-widest" style={{ color: "#4241ff" }}>
            Shop the Stash
          </span>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mt-3">
            Period care built for your life.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              <div
                onClick={handleShopClick}
                className={`group relative block rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-lime/10 hover:-translate-y-1.5 ${
                  card.featured ? "bg-[#fff4ee] border border-[#d8e8b2] shadow-md" : "bg-[#fff4ee] border border-border shadow-sm"
                }`}
              >
                <div className="relative p-7 md:p-9 flex flex-col h-[370px] sm:h-[420px] md:h-[470px]">
                  <div className="relative mb-4">
                    <div>
                      <h3 className="font-body text-2xl md:text-3xl font-bold text-foreground leading-tight whitespace-pre-line">
                        {card.title}
                      </h3>
                      {card.subtitle && (
                        <p className="text-lg md:text-xl mt-1 font-body text-foreground/50 whitespace-pre-line">
                          {card.subtitle}
                        </p>
                      )}
                    </div>
                    <span className="absolute top-0 -right-6 w-10 h-10 rounded-full border-2 border-foreground/10 flex items-center justify-center group-hover:bg-lime group-hover:border-lime transition-all">
                      <ArrowUpRight className="w-5 h-5 text-foreground" />
                    </span>
                  </div>

                  {/* Image */}
                  {card.title.startsWith("Buy More.") ? (
                    <div className="absolute bottom-0 -left-[10%] w-[110%] h-[90%] pointer-events-none">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-contain object-bottom-left drop-shadow-lg"
                      />
                    </div>
                  ) : card.title.startsWith("5x Slimmer") ? (
                    <div className="flex-1 flex items-end justify-center mt-auto">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="max-h-56 md:max-h-64 w-auto object-contain scale-110 transition-transform duration-300 drop-shadow-lg"
                      />
                    </div>
                  ) : (
                    <div className="flex-1 flex items-end justify-center mt-auto">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="max-h-72 md:max-h-80 w-auto object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LaunchSale;
