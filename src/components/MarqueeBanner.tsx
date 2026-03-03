const items = [
  "India's Slimmest Core",
  "Japanese tech engineered for Blood",
  "No Bulges, No Leaks",
  "Designed for Active Lifestyles",
];

const MarqueeBanner = () => {
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <section className="bg-secondary py-4 overflow-hidden">
      <div className="scrolling-marquee flex items-center gap-8 whitespace-nowrap">
        {repeated.map((item, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="text-secondary-foreground font-display font-semibold text-sm md:text-base">
              {item}
            </span>
            <span className="text-primary text-xl">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
};

export default MarqueeBanner;
