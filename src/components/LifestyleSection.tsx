import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import pgActive3 from "@/assets/Copy of PG Active 3.png";
import pgoingPlaces from "@/assets/Copy of PGo-ing places.jpg";
import pgActive2 from "@/assets/Copy of PG Active 2.jpg";
import pgoingPlaces2 from "@/assets/Copy of PGo-ing Places 2.jpg";

const lifestyleImages = [
  { src: pgActive3,     label: "Gym" },
  { src: pgoingPlaces,  label: "Travel" },
  { src: pgActive2,     label: "Work" },
  { src: pgoingPlaces2, label: "Everyday Life" },
];

const LifestyleSection = () => {
  const navigate = useNavigate();
  const goToShop = () => { window.scrollTo({ top: 0, behavior: "smooth" }); navigate("/shop"); };
  return (
    <section className="bg-[#f7fbed] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-foreground">
            Built For Your <span style={{ color: "#FF6B35" }}>Hustle</span>
          </h2>
          <p className="text-foreground/60 text-2xl md:text-3xl mt-4 max-w-4xl mx-auto font-body leading-relaxed">
            <span className="block">Periods shouldn't slow you down.</span>
            <span className="block md:whitespace-nowrap">PoppiGo is designed to move with you — wherever you want to go.</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-[88rem] mx-auto">
          {lifestyleImages.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl md:rounded-3xl cursor-pointer"
              onClick={goToShop}
            >
              <div className="aspect-[4/5] md:aspect-[11/13] overflow-hidden">
                <img
                  src={item.src}
                  alt={item.label}
                  className="w-full h-full object-cover scale-[1.14] transition-transform duration-700 group-hover:scale-[1.28]"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-white font-body font-bold text-xl md:text-2xl">
                  {item.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="flex justify-center mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex flex-wrap justify-center items-center gap-3 text-foreground/40 font-accent font-medium text-2xl md:text-3xl">
            <span>Gym</span>
            <span className="w-1.5 h-1.5 rounded-full bg-lime" />
            <span>Travel</span>
            <span className="w-1.5 h-1.5 rounded-full bg-lime" />
            <span>Work</span>
            <span className="w-1.5 h-1.5 rounded-full bg-lime" />
            <span>Everyday Life</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LifestyleSection;
