import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import flower1 from "@/assets/F-1.png";
import flower2 from "@/assets/F-2.png";
import heroCardGolf from "@/assets/hero-card-golf.jpg";
import heroCardTravel from "@/assets/hero-card-travel.jpg";
import heroCardHorse from "@/assets/hero-card-horse.jpg";
import heroCardJoy from "@/assets/yoga-new.jpg";
import heroCardHike from "@/assets/hero-card-hike.jpg";

const lifestyleCards = [
  { img: heroCardGolf, rotation: -12, icon: "🎾" },
  { img: heroCardTravel, rotation: -5, icon: "✈️" },
  { img: heroCardHorse, rotation: 0, icon: "🎾" },
  { img: heroCardJoy, rotation: 5, icon: "🎾" },
  { img: heroCardHike, rotation: 12, icon: "🎒" },
];

const Hero = () => {
  const navigate = useNavigate();

  const handleShopClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate("/shop");
  };

  return (
    <section className="relative bg-primary overflow-hidden pt-20 pb-6 md:pb-0">
      {/* Top section with text */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8 md:pt-12 pb-8 flex flex-col items-center text-center">
        {/* Decorative flowers */}
        <motion.div
          className="absolute left-4 md:left-12 top-16 md:top-20 w-20 md:w-44 pointer-events-none select-none"
          animate={{ y: [0, -12, 0], rotate: [0, 4, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src={flower1} alt="" className="w-full h-full object-contain" />
        </motion.div>

        <motion.div
          className="absolute right-4 md:right-12 top-16 md:top-20 w-20 md:w-44 pointer-events-none select-none"
          animate={{ y: [0, -12, 0], rotate: [0, -4, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <img src={flower2} alt="" className="w-full h-full object-contain" />
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-bold leading-[0.95] tracking-tight mb-4 md:mb-6"
          style={{ color: "hsl(230, 70%, 35%)" }}
        >
          {/* Line 1 */}
          <span className="flex justify-center gap-[0.25em] flex-wrap">
            {["Meet", "your", "new"].map((word) => (
              <motion.span
                key={word}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
                }}
                className="inline-block"
              >
                {word}
              </motion.span>
            ))}
          </span>
          {/* Line 2 */}
          <span className="flex justify-center gap-[0.25em] flex-wrap mt-1">
            {["Period", "BFF"].map((word) => (
              <motion.span
                key={word}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
                }}
                className={`inline-block${word === "BFF" ? " text-coral" : ""}`}
              >
                {word}
              </motion.span>
            ))}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl font-body text-primary-foreground mb-8"
        >
          India's Slimmest{" "}
          <span className="underline decoration-[hsl(10,80%,60%)] decoration-[3px] underline-offset-4">
            Disposable Period Underwear
          </span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.button
            onClick={handleShopClick}
            className="inline-flex items-center gap-3 bg-secondary text-secondary-foreground px-8 py-4 rounded-full text-lg font-display font-semibold"
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.96 }}
            animate={{ boxShadow: ["0 0 0 0 rgba(0,0,0,0)", "0 0 0 10px rgba(203,213,225,0.25)", "0 0 0 0 rgba(0,0,0,0)"] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
          >
            Add to Cart
            <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </motion.button>
        </motion.div>
      </div>

      {/* Lifestyle cards row */}
      <div className="relative z-10 mt-4">
        <div className="flex justify-center items-end gap-1 md:gap-4 px-2 md:px-8">
          {lifestyleCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
              className="relative w-[18%] sm:w-[160px] md:w-[210px] lg:w-[260px] min-w-0"
              style={{
                transform: `rotate(${card.rotation}deg)`,
                marginBottom: Math.abs(card.rotation) > 8 ? "-20px" : "0px",
              }}
            >
              {/* Card with colored border */}
              <div
                className="rounded-2xl md:rounded-3xl overflow-hidden p-[3px] md:p-[4px]"
                style={{
                  background:
                    i % 2 === 0
                      ? "hsl(230, 70%, 45%)"
                      : "hsl(10, 80%, 60%)",
                }}
              >
                <div className="relative rounded-xl md:rounded-2xl overflow-hidden bg-muted">
                  <img
                    src={card.img}
                    alt=""
                    className="w-full aspect-[3/4] object-cover grayscale"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
