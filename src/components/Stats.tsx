import { motion } from "framer-motion";
import lifestyleActive from "@/assets/lifestyle-active.png";

const activities = [
  "We've been there during that final deadlift rep, right when everything's burning—but you're not worried about leaks.",
  "We've gone match after match on the padel court—staying put, no matter how hard you move.",
  "We've been under basketball shorts, mid-jump shot, holding strong through the whole game.",
  "We've stepped into the boxing ring, right alongside the women who don't hold back.",
];

const stats = [
  { value: "5x", label: "Slimmer Core" },
  { value: "10x", label: "Comfort" },
  { value: "0", label: "Bulk" },
  { value: "0", label: "Leaks" },
];

const Stats = () => {
  return (
    <section className="bg-secondary py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-primary font-display font-semibold text-sm uppercase tracking-widest">
            Live Free
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-secondary-foreground mt-3">
            Where PoppiGo has Been
          </h2>
        </div>

        {/* Activities + Image */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-5"
          >
            {activities.map((text, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-secondary-foreground/70 text-lg leading-relaxed border-l-2 border-primary pl-5"
              >
                {text}
              </motion.p>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img
              src={lifestyleActive}
              alt="Active woman boxing - PoppiGo supports your lifestyle"
              className="rounded-3xl w-full h-auto shadow-xl"
            />
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <span className="font-display text-5xl md:text-7xl font-bold text-primary">
                {stat.value}
              </span>
              <p className="text-secondary-foreground/80 font-display text-lg mt-2">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
