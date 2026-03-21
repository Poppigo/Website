import { motion } from "framer-motion";
import { ArrowUpRight, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import blogImage from "@/assets/blogimage.png";

const posts = [
  {
    slug: "poppigo-indias-first-ultraslim-disposable-period-panty",
    title: "Poppigo Disposable Period Panty will change how you think about period care.",
    date: "December 11, 2025",
    image: null,
    excerpt:
      "I've spent the last 18 months talking to hundreds of Gen Z menstruators, and the message was clear: 'We're tired of products that don't keep up with our lives.' So we built something different. Something that doesn't ask you to slow down, hide, or compromise.",
  },
  {
    slug: "why-gen-z-is-ditching-pads-and-embracing-disposable-period-panties",
    title: "Why Gen Z Is Ditching Pads and Embracing Disposable Period Panties",
    date: "October 7, 2025",
    image: blogImage,
    excerpt:
      "If you still believe pads are the undisputed MVP of period products, it may be time to change your mind. Today, a newcomer is quickly becoming the star of the show, particularly among Gen Z: disposable period underwear. In this week's feature, we're looking at why this new alternative is stealing hearts (and wardrobes).",
  },
];

const Blog = () => {
  const navigate = useNavigate();

  const handleReadMore = (slug: string) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(`/blog/${slug}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7fbed] via-[#fafff0] to-[#f0ffd6]">
      <Navbar />

      {/* Blog Posts Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col gap-8">
            {posts.map((post, i) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group bg-gradient-to-br from-white via-[#fafff0] to-[#f0ffd6] rounded-[2rem] border border-border/30 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                {/* Post image */}
                {post.image && (
                  <div className="w-full h-52 md:h-64 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-8 md:p-10 flex flex-col gap-4">
                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-3 text-sm font-body">
                    <span className="text-foreground/30">·</span>
                    <span className="inline-flex items-center gap-1.5 text-foreground/40">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.date}
                    </span>
                    <span className="text-foreground/30">·</span>
                    <span className="text-foreground/40">By Poppigo_admin</span>
                  </div>

                  {/* Title */}
                  <h2 className="font-body text-2xl md:text-3xl font-bold text-foreground leading-snug group-hover:text-[#4241ff] transition-colors">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="font-body text-foreground/60 text-base md:text-lg leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* CTA */}
                  <div className="mt-2">
                    <button
                      onClick={() => handleReadMore(post.slug)}
                      className="inline-flex items-center gap-2 bg-lime text-foreground font-body font-semibold px-6 py-3 rounded-full hover:shadow-md hover:shadow-lime/30 transition-all group/btn"
                    >
                      Read More
                      <span className="w-6 h-6 bg-foreground text-white rounded-full inline-flex items-center justify-center group-hover/btn:scale-110 transition-transform">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
