import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FinalCTA = () => {
  const navigate = useNavigate();

  const handleShopClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate("/shop");
  };

  return (
    <section className="bg-[#f7fbed] py-20 md:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
            Ready To Go With<br />
            <span style={{ color: "#FF6B35" }}>PoppiGo?</span>
          </h2>
          
          <p className="text-4xl text-foreground/60 mt-6 max-w-2xl mx-auto font-accent leading-relaxed">
            Periods shouldn't hold you back.
          </p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onClick={handleShopClick}
            className="inline-flex items-center gap-2 bg-lime text-[#1b2a54] px-10 py-5 rounded-full text-lg font-body font-semibold hover:shadow-xl hover:shadow-lime/30 transition-all duration-300 hover:scale-110 mt-10"
          >
            Shop Now
            <ArrowRight className="w-6 h-6" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
