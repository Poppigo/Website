import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import blogImage from "@/assets/blogimage.png";

type Post = {
  slug: string;
  title: string;
  date: string;
  image?: string;
  content: React.ReactNode;
};

const posts: Post[] = [
  {
    slug: "poppigo-indias-first-ultraslim-disposable-period-panty",
    title: "Poppigo Disposable Period Panty will change how you think about period care.",
    date: "December 11, 2025",
    content: (
      <div className="font-body text-foreground/80 text-lg leading-relaxed flex flex-col gap-5">
        <p>
          I've spent the last 18 months talking to hundreds of Gen Z menstruators, and the message
          was clear: <em>'We're tired of products that don't keep up with our lives.'</em>
        </p>
        <p>
          So we built something different. Something that doesn't ask you to slow down, hide,
          or compromise.
        </p>
        <p>
          PoppiGo launched India's first Ultraslim Disposable Period Panty, and honestly?
          I'm nervous. Not because I doubt the product — I know it works. I'm nervous because
          we're challenging an industry that's been comfortable with 'good enough' for decades.
        </p>
        <p className="text-foreground">But comfortable never changed anything.</p>
        <p>Stay tuned. The period care revolution is about to get real.</p>
      </div>
    ),
  },
  {
    slug: "why-gen-z-is-ditching-pads-and-embracing-disposable-period-panties",
    title: "Why Gen Z Is Ditching Pads and Embracing Disposable Period Panties",
    date: "October 7, 2025",
    image: blogImage,
    content: (
      <div className="font-body text-foreground/80 text-lg leading-relaxed flex flex-col gap-5">
        <p>
          If you still believe pads are the undisputed MVP of period products, it may be time to
          change your mind. Today, a newcomer is quickly becoming the star of the show, particularly
          among Gen Z: disposable period underwear. In this week's feature, we're looking at why
          this new alternative is stealing hearts (and wardrobes), highlighting its hassle-free charm
          and the innovative ultra-slim design tricks such as Poppigo that are making period
          protection lighter, easier, and unmistakeably trendy.
        </p>
        <p>
          Let's start by revisiting traditional pads. They've been around forever, but ask anyone
          with firsthand experience and you'll hear a mixed bag: pads can be bulky and uncomfortable,
          and there's that nagging feeling of "something's stuck" all day long. They wander around
          awkwardly, with shifting adhesive that loses its grip at the worst moments. Sometimes,
          they cause irritation or chafing. And besides, discarding them is dirty and a little
          uncomfortable — no one likes messing around with that subtle disposal system. And for
          the environment? Most pads still come up short on being green-friendly.
        </p>
        <p>
          Now compare all this to disposable period panties. For Gen Zers, who live life at warp
          speed, these panties tick so many boxes. Not just do they slide on like your normal undies,
          but they have internal protection built into them that is designed to catch leaks
          unobtrusively — no additional layers, no adhesive tape, no annoying crinkles. The
          protection simply melts into the background, silently getting on with it. It's your
          period nicely taken care of with zero drama.
        </p>
        <p>
          What particularly impresses this generation is the comfort and assurance of these panties.
          Yes, they are disposable — but in the best sense of the word. Newer styles tend to employ
          light, biodegradable materials that allow for good airflow and feel clean. When it's time
          to be done, you simply discard them. No scrubbing, no spills, no check-ins. Just simple
          protection that's designed for a quick-paced life, whether you're toggling between video
          chats, weekend walks, or spontaneous nights out.
        </p>
        <p>
          And the surprise: these are not grandma's period panties. Companies like Poppigo, with
          their Ultraslim collection, have streamlined the profile to be remarkably thin — so thin
          that they slide underneath anything from tight-fitting jeans to soft loungewear without a
          trace of bulk. It's a discreet but clever game-changer for anyone concerned about showing
          panty lines or discomfort. Slimmer definitely feels better.
        </p>
        <p>
          The why of Gen Z's transition is both functional and psychological. They prefer something
          that does as many things as they do — light, trustworthy, and minimal maintenance. And the
          traditional pad routine comes with the hassle of constant checking and post-period laundry
          tasks that are a real bummer. By going disposable with period panties, periods are less of
          a "thing" and more just a quiet aspect of the day, dealt with without fanfare or
          distraction.
        </p>
        <p>
          If you haven't yet tried disposable period panties, and the "pads or bust" attitude seems
          a little behind the times, give it a go with this easy-to-use alternative. It's a simple,
          low-maintenance way to keep things going without missing a beat — and if that ultra-thin
          design is your style, you're ahead of the game.
        </p>
        <p className="text-foreground/80">
          So here's to the sunglasses, the late-night playlists, and the low-key coverage that
          simply does the trick. Disposable period panties are gently ushering in a new period of
          thinking about period care — smart, simple, and utterly refreshing.
        </p>
      </div>
    ),
  },
];

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f7fbed] via-[#fafff0] to-[#f0ffd6]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="font-body text-foreground/60 text-xl">Post not found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7fbed] via-[#fafff0] to-[#f0ffd6]">
      <Navbar />

      <article className="max-w-3xl mx-auto px-6 pt-32 pb-20 md:pt-40">
        {/* Back link */}
        <button
          onClick={() => navigate("/blog")}
          className="inline-flex items-center gap-2 text-foreground/50 hover:text-foreground font-body font-medium mb-10 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </button>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Meta */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-foreground/30 text-sm">·</span>
            <span className="inline-flex items-center gap-1.5 text-foreground/40 font-body text-sm">
              <Calendar className="w-3.5 h-3.5" />
              {post.date}
            </span>
            <span className="text-foreground/30 text-sm">· By Poppigo_admin</span>
          </div>

          {/* Title */}
          <h1 className="font-body text-3xl md:text-5xl font-bold text-foreground leading-tight mb-8">
            {post.title}
          </h1>

          {/* Hero image */}
          {post.image && (
            <div className="rounded-[2rem] overflow-hidden mb-10 shadow-lg">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          )}

          {/* Content */}
          {post.content}
        </motion.div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost;
