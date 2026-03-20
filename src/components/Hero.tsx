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
    <section className="relative bg-gradient-to-br from-[#fff4ee] via-[#fafff0] to-[#f0ffd6] overflow-hidden pt-24 md:pt-28 pb-12 md:pb-0 min-h-[90vh] flex items-center">
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
              className="font-accent text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold leading-[0.95] tracking-tight text-foreground"
            >
              Stay Dry.
              <br />
              <span style={{ color: "#FF6B35" }}>Stay Active.</span>
              <br />
              Stay You.
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-2xl md:text-3xl text-foreground/60 mt-6 max-w-lg leading-relaxed font-body"
            >
              Designed for women who move, hustle, work out, travel, and live life without pause.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col items-start gap-4 mt-8"
            >
              <button
                onClick={handleShopClick}
                className="inline-flex items-center gap-2 bg-lime text-foreground px-8 py-4 rounded-full text-lg font-body font-semibold hover:shadow-lg hover:shadow-lime/30 transition-all duration-300 hover:scale-105"
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

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="hidden sm:flex flex-nowrap items-center gap-3 mt-10"
            >
              {[
                { icon: "⭐", label: "4.8 Rating" },
                { icon: "📅", label: "Trusted by thousands" },
                { icon: "📦", label: "10,000+ pieces sold" },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 bg-[#fff4ee]/70 backdrop-blur-sm border border-foreground/8 rounded-full px-3 py-1.5">
                  <span className="text-sm leading-none">{icon}</span>
                  <span className="text-sm font-semibold text-foreground/70 whitespace-nowrap">{label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Product hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="relative flex justify-center items-center"
          >
            <div className="relative rounded-[2rem] w-full max-w-xl md:max-w-[42rem]">
              <img
                src={heroProduct}
                alt="PoppiGo 3-Pack Product"
                className="w-[110%] md:w-[115%] mx-auto block h-auto object-contain drop-shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
