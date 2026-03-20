import { motion } from "framer-motion";

const reels = [
  "https://www.instagram.com/reel/DVxb991jODw/",
  "https://www.instagram.com/reel/DVP8zNuDH1s/",
  "https://www.instagram.com/reel/DVm4pxxjI7m/",
  "https://www.instagram.com/reel/DUzym8wjH_K/",
  "https://www.instagram.com/reel/DO-_jafEnDO/",
  "https://www.instagram.com/reel/DLZ7VHoJ0JZ/",
  "https://www.instagram.com/reel/DRuEAc3D4uC/",
  "https://www.instagram.com/reel/DP8LwsCCT4m/",
  "https://www.instagram.com/reel/DUGHtf7jAdc/",
];

const pickRandomReels = (items: string[], count: number) => {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled.slice(0, count);
};

const featuredReels = pickRandomReels(reels, 4).map((url, index) => ({
  id: `${index}-${url.split("/").filter(Boolean).pop()}`,
  url,
  embedUrl: `${url}embed`,
}));

const SocialProof = () => {
  return (
    <section className="bg-[#fafff0] py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mt-3">
            What Our Fam Says
          </h2>
          <p className="text-foreground/60 text-2xl md:text-3xl mt-3 font-body">
            Real posts from real women living <span className="font-bold text-foreground">#NoPause</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10">
          {featuredReels.map((reel, i) => (
            <motion.div
              key={reel.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-white rounded-[2rem] border border-border p-5 md:p-6 hover:shadow-xl hover:shadow-lime/10 transition-all duration-300"
            >
              <div className="overflow-hidden rounded-[1.5rem] border border-border bg-[#fafaf7]">
                <div className="relative w-full pt-[118%] md:pt-[116%]">
                  <iframe
                    src={reel.embedUrl}
                    title={`Instagram Reel ${i + 1}`}
                    className="absolute inset-0 w-full h-full"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-2xl text-foreground/60 font-body">
            Want to be featured?{" "}
            <a
              href="https://www.instagram.com/letspoppigo"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:underline"
              style={{ color: "#4241ff" }}
            >
              Tag us @letspoppigo
            </a>
            {" "}and use <span className="font-bold text-foreground">#NoPause</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialProof;
