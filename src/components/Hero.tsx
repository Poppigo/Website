import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import heroCardGolf from "@/assets/hero-card-golf.jpg";
import heroCardTravel from "@/assets/hero-card-travel.jpg";
import heroCardHorse from "@/assets/hero-card-horse.jpg";
import heroCardJoy from "@/assets/hero-card-joy.jpg";
import heroCardHike from "@/assets/hero-card-hike.jpg";

const lifestyleCards = [
  { img: heroCardGolf, caption: "No backups,\njust backswings", rotation: -12, icon: "🎾" },
  { img: heroCardTravel, caption: "Passport &\nperiod ready!", rotation: -5, icon: "✈️" },
  { img: heroCardHorse, caption: "Deep lunge,\nno bulge", rotation: 0, icon: "🎾" },
  { img: heroCardJoy, caption: "Leaks don't\nride along!", rotation: 5, icon: "🎾" },
  { img: heroCardHike, caption: "Conquer peaks &\nyour period!", rotation: 12, icon: "🎒" },
];

const Hero = () => {
  return (
    <section className="relative bg-primary overflow-hidden pt-20">
      {/* Top section with text */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-8 flex flex-col items-center text-center">
        {/* Decorative flowers */}
        <div className="absolute left-4 md:left-12 top-16 md:top-20 w-28 md:w-44 pointer-events-none select-none">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <g transform="translate(100,100)">
              {[0, 72, 144, 216, 288].map((angle, i) => (
                <ellipse
                  key={i}
                  cx="0"
                  cy="-40"
                  rx="35"
                  ry="50"
                  fill={i % 2 === 0 ? "hsl(10, 80%, 60%)" : "hsl(10, 80%, 65%)"}
                  transform={`rotate(${angle})`}
                />
              ))}
              <circle cx="0" cy="0" r="14" fill="hsl(230, 70%, 40%)" />
            </g>
          </svg>
        </div>
        <div className="absolute right-4 md:right-12 top-16 md:top-20 w-28 md:w-44 pointer-events-none select-none">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <g transform="translate(100,100)">
              {[0, 72, 144, 216, 288].map((angle, i) => (
                <ellipse
                  key={i}
                  cx="0"
                  cy="-40"
                  rx="35"
                  ry="50"
                  fill={i % 2 === 0 ? "hsl(230, 70%, 45%)" : "hsl(230, 70%, 50%)"}
                  transform={`rotate(${angle})`}
                />
              ))}
              <circle cx="0" cy="0" r="14" fill="hsl(10, 80%, 60%)" />
            </g>
          </svg>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-display text-5xl md:text-7xl lg:text-[5.5rem] font-bold leading-[0.95] tracking-tight mb-6"
          style={{ color: "hsl(230, 70%, 35%)" }}
        >
          Meet your new
          <br />
          Period BFF
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl font-body text-primary-foreground mb-8"
        >
          India's Slimmest{" "}
          <span className="underline decoration-[hsl(10,80%,60%)] decoration-[3px] underline-offset-4">
            Disposable Period Underwear
          </span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link
            to="/shop"
            className="inline-flex items-center gap-3 bg-secondary text-secondary-foreground px-8 py-4 rounded-full text-lg font-display font-semibold hover:scale-105 transition-transform"
          >
            Grab Yours
            <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </Link>
        </motion.div>
      </div>

      {/* Lifestyle cards row */}
      <div className="relative z-10 mt-4 pb-0 overflow-hidden">
        <div className="flex justify-center items-end gap-2 md:gap-4 px-2 md:px-8">
          {lifestyleCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
              className="relative flex-shrink-0 w-[140px] md:w-[220px] lg:w-[260px]"
              style={{
                transform: `rotate(${card.rotation}deg)`,
                marginBottom: Math.abs(card.rotation) > 8 ? "-20px" : "0px",
              }}
            >
              {/* Card with colored border */}
              <div
                className="rounded-2xl md:rounded-3xl overflow-hidden p-[3px] md:p-[4px]"
                style={{
                  background:
                    i % 2 === 0
                      ? "hsl(230, 70%, 45%)"
                      : "hsl(10, 80%, 60%)",
                }}
              >
                <div className="relative rounded-xl md:rounded-2xl overflow-hidden bg-muted">
                  <img
                    src={card.img}
                    alt={card.caption}
                    className="w-full aspect-[3/4] object-cover grayscale"
                  />
                  {/* Caption overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                    <p
                      className="font-display text-sm md:text-lg font-bold leading-tight whitespace-pre-line"
                      style={{ color: "hsl(72, 100%, 50%)" }}
                    >
                      {card.caption}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
