import { motion } from "framer-motion";
import sizeGuide from "@/assets/Section-6-1.jpeg";

const ChooseYourFit = () => {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-display font-semibold text-sm uppercase tracking-widest" style={{ color: "#4241ff" }}>
              Every Body Inclusive
            </span>
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mt-3 leading-tight">
              Choose Your Fit
            </h2>
            <p className="text-foreground/60 text-lg mt-5 font-body leading-relaxed max-w-lg">
              Periods don't come in one size — neither should period care.
            </p>
            <p className="text-foreground/60 text-base mt-4 font-body leading-relaxed max-w-lg">
              PoppiGo is every-body inclusive, designed to fit comfortably across different shapes and sizes so you can stay active, confident, and leak-free.
            </p>

            <div className="mt-8 space-y-4">
              {[
                { size: "S-M", waist: '25″ – 35″' },
                { size: "L-XL", waist: '35″ – 45″' },
                { size: "2XL-3XL", waist: '45″ – 55″' },
              ].map((item) => (
                <div
                  key={item.size}
                  className="flex items-center gap-4 border-l-4 border-[#6f9f2d] pl-4 py-1"
                >
                  <span className="text-[#3b5f0d] font-display font-bold text-sm md:text-base">
                    {item.size}
                  </span>
                  <span className="text-[#4f6d1f] font-body text-sm md:text-base">
                    Waist: {item.waist}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Size Guide Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <img
              src={sizeGuide}
              alt="PoppiGo Size Guide"
              className="w-full max-w-lg rounded-3xl shadow-xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ChooseYourFit;
