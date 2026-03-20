import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: "5", suffix: "x", label: "Slimmer Core" },
  { value: "10", suffix: "x", label: "Comfort" },
  { value: "0", suffix: "", label: "Bulk" },
  { value: "0", suffix: "", label: "Leaks" },
];

const AnimatedNumber = ({ target, suffix, index }: { target: number; suffix: string; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView || target === 0) {
      if (target === 0) setCount(0);
      return;
    }
    let current = 0;
    const steps = 40;
    const duration = 1200;
    const increment = target / steps;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.12, type: "spring", bounce: 0.4 }}
      className="text-center"
    >
      <span className="font-display text-3xl md:text-5xl font-bold text-primary">
        {count}{suffix}
      </span>
      <p className="text-secondary-foreground/70 font-display text-sm md:text-base mt-1">
        {stats[index].label}
      </p>
    </motion.div>
  );
};

const Stats = () => {
  return (
    <section className="bg-secondary py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="grid grid-cols-4 gap-4 md:gap-8">
          {stats.map((stat, i) => (
            <AnimatedNumber
              key={stat.label}
              target={parseInt(stat.value)}
              suffix={stat.suffix}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
