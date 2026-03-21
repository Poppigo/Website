import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroProduct from "@/assets/hero_img.jpg";

const Hero = () => {
  const navigate = useNavigate();

  const handleShopClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate("/shop");
  };

  return (
    <section className="relative bg-gradient-to-br from-[#f7fbed] via-[#fafff0] to-[#f0ffd6] overflow-hidden pt-24 md:pt-28 pb-12 md:pb-0 min-h-[90vh] flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left: Copy + CTA */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col items-start"
          >
            {/* Bundle Discounts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="hidden"
            >
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-body text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold leading-[0.95] tracking-tight text-foreground"
            >
              Stay Dry.
              <br />
              <span style={{ color: "#FF6B35" }}>Stay Active.</span>
              <br />
              Stay You.
            </motion.h1>

            {/* Mobile-only hero image (above description on mobile) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
              className="md:hidden w-full flex justify-center items-center mt-4 mb-6 cursor-pointer"
              onClick={handleShopClick}
            >
              <img
                src={heroProduct}
                alt="PoppiGo 3-Pack Product"
                className="w-full h-auto object-contain drop-shadow-2xl"
              />
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-0 md:mt-6 max-w-lg w-full"
            >
              {/* India's First tagline */}
              <p className="font-body font-bold text-xl md:text-2xl text-foreground leading-snug mb-4">
                India's First Ultra-slim Disposable Period Panty
              </p>

              {/* Feature pills */}
              <div className="hidden sm:flex flex-wrap gap-2 mb-5">
                {[
                  { icon: "🔬", label: "Japanese Gel Tech" },
                  { icon: "🛡️", label: "Leakproof" },
                  { icon: "🌿", label: "Rashfree" },
                ].map(({ icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 bg-white/80 border border-foreground/10 rounded-full px-4 py-1.5 text-base font-body font-semibold text-foreground/80"
                  >
                    <span>{icon}</span>{label}
                  </span>
                ))}
              </div>

              <p className="text-xl md:text-2xl text-foreground/60 leading-relaxed font-body">
                Designed for women who move, hustle, work out, travel, and live life without pause.
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col items-stretch sm:items-start gap-4 mt-8"
            >
              <button
                onClick={handleShopClick}
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-lime text-foreground px-8 py-4 rounded-full text-lg font-body font-semibold hover:shadow-lg hover:shadow-lime/30 transition-all duration-300 hover:scale-105"
              >
                Shop Now
                <ArrowRight className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 text-lg">
                <span className="text-2xl">🎉</span>
                <span className="font-semibold text-foreground text-lg">10% off on 2 Packs</span>
                <span className="text-foreground/30 text-lg">·</span>
                <span className="text-2xl">🎉</span>
                <span className="font-semibold text-foreground text-lg">15% off on 3 Packs</span>
              </div>
            </motion.div>

            {/* Trust Indicators — removed from here, moved below grid */}
          </motion.div>

          {/* Right: Product hero image (desktop only) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="relative hidden md:flex justify-center items-center md:-mt-6"
          >
            <div className="relative rounded-[2rem] w-full max-w-xl md:max-w-[42rem] cursor-pointer" onClick={handleShopClick}>
              <img
                src={heroProduct}
                alt="PoppiGo 3-Pack Product"
                className="w-[110%] md:w-[115%] mx-auto block h-auto object-contain drop-shadow-2xl"
              />
            </div>
          </motion.div>
        </div>

        {/* Trust Indicators — full-width centered below the two columns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="grid grid-cols-3 gap-3 sm:gap-5 mt-8 md:mt-10 max-w-3xl mx-auto w-full"
        >
          {[
            { icon: "⭐", stat: "4.8", label: "Rating" },
            { icon: "📅", stat: "Thousands", label: "Trust Us" },
            { icon: "📦", stat: "10000+", label: "Pieces Sold" },
          ].map(({ icon, stat, label }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center gap-0.5 bg-white/80 backdrop-blur-sm border border-foreground/8 rounded-2xl px-5 sm:px-6 py-2 sm:py-3 shadow-sm"
            >
              <span className="text-2xl sm:text-3xl leading-none">{icon}</span>
              <span className="font-body font-extrabold text-xl sm:text-2xl md:text-3xl text-foreground leading-tight text-center mt-1">{stat}</span>
              <span className="font-body text-sm sm:text-base font-semibold text-foreground/60 text-center leading-tight">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
