import { motion } from "framer-motion";
import { Shield, Droplets, Wind, Sparkles, Clock, Heart, Check } from "lucide-react";
import { Link } from "react-router-dom";
import techDetail from "@/assets/tech-detail.png";
import productPack from "@/assets/product-pack-1.png";

const features = [
  "5x Slimmer Core with 10x Comfort",
  "Japanese Gel Engineered for Blood Absorption",
  "No Bulges, No Leaks – 360° Protection",
  "2.5x Stretch Flex and Fit Band",
  "12 Hour Active Use, Zero Bulk",
  "Rash-free Skin Loving Care",
  "Individual Wrapper for Easy Disposal",
];

const Features = () => {
  return (
    <section id="features" className="bg-background py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-coral font-display font-semibold text-sm uppercase tracking-widest">
            What's Poppin
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-3">
            Why we are built different
          </h2>
          <p className="text-muted-foreground text-lg mt-4 max-w-2xl mx-auto">
            We provide Modern Period Care
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
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
                  <span className="mt-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </span>
                  {feature}
                </motion.li>
              ))}
            </ul>

            <Link
              to="/shop"
              className="mt-10 inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-display font-semibold hover:scale-105 transition-transform"
            >
              Grab Yours
            </Link>
          </motion.div>

          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <img
              src={productPack}
              alt="PoppiGo Ultra-Slim product packaging"
              className="w-full max-w-md mx-auto rounded-3xl shadow-xl"
            />
            <img
              src={techDetail}
              alt="Japanese gel absorption technology layers"
              className="absolute -bottom-6 -left-6 w-40 h-40 rounded-2xl shadow-lg border-4 border-background object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Features;
