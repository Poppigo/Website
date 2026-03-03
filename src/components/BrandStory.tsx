import { motion } from "framer-motion";
import founderVideo from "@/assets/founder_video.mp4";

const BrandStory = () => {
  return (
    <section id="story" className="bg-peach py-14 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-8 md:mb-12">
          <span className="text-coral font-display font-semibold text-sm uppercase tracking-widest">
            Tea On Us
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-3">
            Why We Built<br />What We Built
          </h2>
        </div>

        <div className="flex flex-col-reverse md:flex-row gap-8 md:gap-12 items-start">
          {/* Portrait image — 3:4 ratio, fixed width column */}
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
              <div className="absolute -bottom-3 -right-3 bg-primary text-primary-foreground px-5 py-2.5 rounded-2xl font-display font-bold text-base shadow-lg">
                Est. 2024
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
            <div className="space-y-4 text-foreground/80 text-base leading-relaxed">
              <p>
                Life's literally a nonstop scroll and you're the main character—killing it at spin
                class, dominating the padel court, vibing at a concert, or jumping on a last-minute
                flight. You're chasing goals, making moves and saying "yes" to whatever epic thing
                comes your way.
              </p>
              <p>
                But real talk: periods, sweat, and hygiene hassles? Total vibe killers. Leaks,
                sketchy bathrooms, and feeling gross—it's the stuff that can throw you off your game.
              </p>
              <p>
                Our founder,{" "}
                <strong className="text-foreground">Nilima Jhunjhunwala</strong>, gets it. Like,
                really gets it because she's been there.
              </p>
              <p>
                And by there, we mean 12,000 feet above sea level, in rugged Ladakh, running a
                marathon (yes queen!), surrounded by crazy-beautiful mountains. Dreamy, right? Except
                instead of crushing the miles she was stressing about leaks and awkward pad changes
                in the middle of nowhere. Cold, annoyed, and completely over it, she thought:{" "}
                <em>"Why is something so natural so hard to manage?"</em>
              </p>
              <p>
                In that flash of clarity, the idea for PoppiGo was born. Our team's do list is
                simple: to develop next level hygiene essentials for all you never-say-never girlies.
                With PoppiGo's game changing stash, you're gonna feel squeaky clean and 100%
                confident no matter where the day (or night) takes you. Toss them into your bag and
                trust them to show up when it counts—unlike your ex. Zero drama, just the backup you
                need to stay unstoppable.
              </p>
              <p>
                At PoppiGo, we're here to hype you up, you'll never have to say "no" to the next big
                plan or let FOMO sneak up on you. Because life's messy. But you? You got this.
              </p>
              <div className="pt-4 border-t border-foreground/10">
                <p className="text-foreground font-medium italic">
                  Built from my story, but made for all of us.
                </p>
                <p className="text-coral font-display font-bold text-xl mt-1">
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
