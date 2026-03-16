const items = [
  ["Japanese Gel Technology"],
  ["Fastest Absorption"],
  ["FDA Approved", "Trustworthy"],
  ["India's", "Slimmest", "Core"],
  ["Leakproof", "Protection"],
  ["Rash Free", "Comfort"],
];

const MarqueeBanner = () => {
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <section className="bg-foreground py-6 md:py-8 overflow-hidden">
      <div className="scrolling-marquee flex items-stretch gap-6 whitespace-nowrap">
        {repeated.map((item, i) => (
          <span key={i} className="flex items-center gap-6">
            <span className="min-w-[190px] md:min-w-[220px] h-[110px] md:h-[128px] px-5 md:px-6 rounded-[1.75rem] bg-white/8 border border-white/10 flex flex-col justify-center whitespace-normal">
              {item.map((line) => (
                <span key={line} className="text-white font-display font-bold text-lg md:text-2xl lg:text-[1.8rem] uppercase tracking-wide leading-[1.05]">
                  {line}
                </span>
              ))}
            </span>
            <span className="text-lime text-2xl md:text-3xl">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
};

export default MarqueeBanner;
