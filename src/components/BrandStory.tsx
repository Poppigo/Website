import { motion } from "framer-motion";
import founderVideo from "@/assets/founder_video.mp4";

const BrandStory = () => {
  return (
    <section id="story" className="bg-[#fafff0] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-10 md:mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-accent font-semibold text-4xl tracking-widest" style={{ color: "#4241ff" }}>
            Tea On Us
          </span>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mt-3">
            Why We Built<br />What We Built
          </h2>
        </motion.div>

        <div className="flex flex-col-reverse md:flex-row gap-8 md:gap-14 items-start max-w-6xl mx-auto">
          {/* Portrait video */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full md:w-[300px] lg:w-[340px] flex-shrink-0"
          >
            <div className="relative w-full">
              <div className="w-full overflow-hidden rounded-2xl shadow-lg">
                <video
                  src={founderVideo}
                  autoPlay
                  loop
                  muted
                  controls
                  playsInline
                  className="w-full h-auto block"
                />
              </div>
            </div>
          </motion.div>

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 min-w-0"
          >
            <div className="space-y-4 text-foreground/70 text-base leading-relaxed font-body">
              <p>
                Life's literally a nonstop scroll and you're the main character—killing it at spin
                class, dominating the padel court, vibing at a concert, or jumping on a last-minute
                flight. You're chasing goals, making moves, and saying "yes" to whatever epic thing
                comes your way.
              </p>
              <p>
                But real talk: periods, sweat, and hygiene hassles? Total vibe killers. Leaks,
                sketchy bathrooms, and feeling gross—it's the stuff that throws you off your game.
              </p>
              <p>
                Our founder,{" "}
                <strong className="text-foreground">Nilima</strong>, gets it. Like,
                really gets it—because she's been there.
              </p>
              <p>
                And by there, we mean 12,000 feet up in rugged Ladakh, running a marathon, surrounded by mountains.
              </p>
              <p>
                Except she was stressing about leaks and awkward pad changes in the middle of nowhere.
              </p>
              <p>
                That's when PoppiGo was born—to create next-level hygiene essentials for women who never stop moving.
              </p>
              <p>
                With PoppiGo's game-changing stash, you'll feel squeaky clean and confident wherever life takes you.
              </p>
              <div className="flex flex-col gap-1 text-foreground font-semibold text-lg mt-4">
                <span>No stress.</span>
                <span>No drama.</span>
                <span>No budget blowouts.</span>
              </div>
              <p className="mt-2">
                Because life's messy.<br />
                But you? <span className="text-foreground font-semibold">You got this.</span>
              </p>
              <div className="pt-6 border-t border-foreground/10">
                <p className="text-foreground font-medium italic">
                  Built from my story, but made for all of us.
                </p>
                <p className="font-body font-bold text-xl mt-2 text-foreground">
                  In cramps and confidence,<br />
                  <span className="text-2xl">Nilima</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
