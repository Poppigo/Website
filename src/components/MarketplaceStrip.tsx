import { motion } from "framer-motion";

const marketplaces = [
  { name: "Zepto",     logo: "https://www.google.com/s2/favicons?domain=zeptonow.com&sz=128" },
  { name: "Amazon",    logo: "https://www.google.com/s2/favicons?domain=amazon.in&sz=128" },
  { name: "Blinkit",   logo: "https://www.google.com/s2/favicons?domain=blinkit.com&sz=128" },
  { name: "Instamart", logo: "https://www.google.com/s2/favicons?domain=swiggy.com&sz=128" },
  { name: "Tata 1mg",  logo: "https://www.google.com/s2/favicons?domain=1mg.com&sz=128" },
  { name: "Meesho",    logo: "https://www.google.com/s2/favicons?domain=meesho.com&sz=128" },
  { name: "Jiomart",   logo: "https://www.google.com/s2/favicons?domain=jiomart.com&sz=128" },
];

const LogoRow = () => (
  <div className="flex gap-6 shrink-0">
    {marketplaces.map((mp) => (
      <div
        key={mp.name}
        className="h-16 min-w-[170px] rounded-2xl bg-[#0f1a35] border border-white/10 flex items-center gap-3 shadow-md shrink-0 select-none px-3"
      >
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-sm">
          <img src={mp.logo} alt={mp.name} className="w-full h-full object-contain" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-body font-bold text-base text-white">{mp.name}</span>
        </div>
      </div>
    ))}
  </div>
);

const MarketplaceStrip = () => {
  return (
    <section className="py-12 md:py-16" style={{ backgroundColor: '#0f1a35' }}>
      <motion.div
        className="text-center mb-10 px-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="font-body text-3xl md:text-4xl font-bold" style={{ color: '#ccff3c' }}>
          PoppiGo — available wherever you shop
        </div>
        <p className="text-2xl md:text-3xl mt-2 font-body" style={{ color: '#ccff3c', opacity: 0.75 }}>
          Shop PoppiGo on your favorite apps.
        </p>
      </motion.div>

      <div className="relative overflow-hidden">
        <div className="absolute left-0 inset-y-0 w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #0f1a35, transparent)' }} />
        <div className="absolute right-0 inset-y-0 w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #0f1a35, transparent)' }} />

        <div className="scrolling-marquee-slow flex gap-6 w-max py-2">
          <LogoRow /><LogoRow /><LogoRow /><LogoRow />
        </div>
      </div>
    </section>
  );
};

export default MarketplaceStrip;
