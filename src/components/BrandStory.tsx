import { motion } from "framer-motion";
import brandStory from "@/assets/brand-story.png";

const BrandStory = () => {
  return (
    <section id="story" className="bg-peach py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-coral font-display font-semibold text-sm uppercase tracking-widest">
            Tea On Us
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-3">
            Why We Built<br />What We Built
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-5 text-foreground/80 text-lg leading-relaxed">
              <p>
                Life's a nonstop scroll and you're the main character – killing it at spin, 
                smashing the padel court, vibing at concerts, or hopping on last-minute flights.
              </p>
              <p>
                But real talk: periods and hygiene hassles? Total vibe killers. Leaks, sketchy 
                bathrooms, and feeling off your game shouldn't hold you back.
              </p>
              <p>
                Our founder <strong className="text-foreground">Nilima Jhunjhunwala</strong> gets it. 
                12,000 feet up in Ladakh, mid-marathon, surrounded by stunning peaks – she 
                thought: <em>"Why is something so natural so hard to manage?"</em>
              </p>
              <p className="text-foreground font-semibold">
                That moment sparked PoppiGo. Modern hygiene essentials for all you 
                never-say-never girlies.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <img
              src={brandStory}
              alt="Ladakh mountains - where PoppiGo was inspired"
              className="rounded-3xl w-full h-auto shadow-xl"
            />
            <div className="absolute -bottom-4 -left-4 bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-display font-bold text-lg shadow-lg">
              Est. 2024
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
