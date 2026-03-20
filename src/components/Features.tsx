import { motion } from "framer-motion";
import { Check } from "lucide-react";
import layersImage from "@/assets/layers.png";

const features = [
  "Ultra Slim Design",
  "Japanese Gel for Faster Absorption",
  "Leakproof Protection",
  "Rash-Free Material",
  "Flexible Fit for Active Days",
];

const Features = () => {
  return (
    <section id="features" className="bg-[#fff4ee] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-accent font-semibold text-4xl tracking-widest" style={{ color: "#4241ff" }}>
            What's Poppin'
          </span>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mt-3">
            What Makes PoppiGo Different
          </h2>
          <p className="text-foreground/50 text-2xl md:text-3xl mt-3 font-body">
            Japanese Gel Tech + Instant Dryness &nbsp;·&nbsp; No Rashes &nbsp;·&nbsp; No Leaks
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
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
                  className="flex items-center gap-4 text-foreground text-2xl font-body"
                >
                  <motion.span
                    className="w-8 h-8 rounded-full bg-lime flex items-center justify-center flex-shrink-0"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 400, damping: 15, delay: i * 0.08 }}
                  >
                    <Check className="w-4 h-4 text-foreground" />
                  </motion.span>
                  {feature}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Layered feature image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="w-full max-w-md md:max-w-lg"
            >
              <img
                src={layersImage}
                alt="PoppiGo layered product illustration"
                className="w-full rounded-[2rem] object-contain shadow-2xl"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Features;
