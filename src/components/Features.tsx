import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import whyBuild1 from "@/assets/Why-we-build-1.jpg";
import whyBuild2 from "@/assets/Why-we-build-2.jpg";
import productImg from "@/assets/product-img-180702025-1.png";

const features = [
  "5x Slimmer Core with 10x Comfort",
  "Japanese Gel Engineered for Blood Absorption",
  "No Bulges, No Leaks – 360° Protection",
  "2.5x Stretch Flex and Fit Band",
  "Up to 12 Hour Protection, Zero Bulk",
  "Rash-free Skin Loving Care",
  "Individual Wrapper for Easy Disposal",
];

const Features = () => {
  const navigate = useNavigate();

  const handleShopClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate("/shop");
  };

  return (
    <section id="features" className="bg-background py-14 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-10 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-coral font-display font-semibold text-sm uppercase tracking-widest">
            What's Poppin
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-3">
            Why we are built different
          </h2>
          <p className="text-muted-foreground text-lg mt-4 max-w-2xl mx-auto">
            We provide Modern Period Care
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Feature list */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <ul className="space-y-5">
              {features.map((feature, i) => (
                <motion.li
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex items-start gap-4 text-foreground text-lg"
                >
                  <motion.span
                    className="mt-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 400, damping: 15, delay: i * 0.08 }}
                  >
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </motion.span>
                  {feature}
                </motion.li>
              ))}
            </ul>

            <button
              onClick={handleShopClick}
              className="mt-10 inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-display font-semibold hover:scale-105 transition-transform"
            >
              Grab Yours
            </button>
          </motion.div>

          {/* Images - editorial layout: tall left, two stacked right */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex gap-3 md:gap-4 justify-center"
          >
            {/* Left: tall full-height image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex-shrink-0"
            >
              <img
                src={whyBuild1}
                alt="Why we're built different"
                className="w-[120px] sm:w-[160px] md:w-[200px] h-full max-h-[420px] rounded-2xl shadow-lg object-cover"
                style={{ minHeight: "260px" }}
              />
            </motion.div>

            {/* Right: two images stacked */}
            <div className="flex flex-col gap-3 md:gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.35 }}
              >
                <img
                  src={whyBuild2}
                  alt="Why we're built different"
                  className="w-[120px] sm:w-[160px] md:w-[200px] rounded-2xl shadow-lg object-cover aspect-[4/3]"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <img
                  src={productImg}
                  alt="PoppiGo product"
                  className="w-[120px] sm:w-[160px] md:w-[200px] rounded-2xl shadow-xl object-cover aspect-[4/3]"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Features;
