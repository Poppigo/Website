import { useEffect } from "react";
import { ShieldCheck, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ReturnsPolicy = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-peach">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-sm text-muted-foreground mb-2">Last updated: March 2026</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Returns &amp; Exchanges
          </h1>
          <p className="text-muted-foreground text-sm mb-12 leading-relaxed">
            We keep it honest, simple, and human.
          </p>

          {/* Key policy banner */}
          <div className="flex items-start gap-4 bg-card border border-border rounded-2xl p-5 mb-10">
            <div className="w-10 h-10 rounded-full bg-coral/10 flex-shrink-0 flex items-center justify-center mt-0.5">
              <ShieldCheck size={20} className="text-coral" />
            </div>
            <div>
              <h2 className="font-display font-bold text-foreground text-base mb-1">
                The Honest Truth About Returns
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Since Poppigo is a hygiene product, we can't accept returns once delivered — just
                like you wouldn't want to receive something that's been used or returned by someone
                else. We know you get it!
              </p>
            </div>
          </div>

          {/* Quality concern section */}
          <div className="flex items-start gap-4 bg-card border border-border rounded-2xl p-5 mb-12">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex-shrink-0 flex items-center justify-center mt-0.5">
              <AlertCircle size={20} className="text-amber-500" />
            </div>
            <div>
              <h2 className="font-display font-bold text-foreground text-base mb-1">
                Wrong Size? No Problem!
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We offer size exchanges if the pack is <strong>unopened and unused</strong>. Just
                email us at{" "}
                <a href="mailto:ecomm@poppigo.co" className="text-[#4241ff] hover:underline">
                  ecomm@poppigo.co
                </a>{" "}
                within <strong>7 days of delivery</strong>, and we'll sort it out — reverse pickup
                is on us.
              </p>
            </div>
          </div>

          <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
            <div>
              <h2 className="font-display font-bold text-xl text-foreground mb-3">
                Not Happy? Talk to Us.
              </h2>
              <p>
                Seriously. If something's not right — quality issue, delivery problem, or you're
                just not satisfied — email us at{" "}
                <a href="mailto:ecomm@poppigo.co" className="text-[#4241ff] hover:underline">
                  ecomm@poppigo.co
                </a>. We'll listen, and as a goodwill gesture, we'll work with you to make it
                right. Your trust matters more to us than sticking to rigid policies.
              </p>
            </div>

            <div>
              <h2 className="font-display font-bold text-xl text-foreground mb-3">
                Damaged Product?
              </h2>
              <p>
                Contact us within <strong>48 hours</strong> with photos. We'll replace it or
                refund you immediately. Simple.
              </p>
            </div>

            <div>
              <h2 className="font-display font-bold text-xl text-foreground mb-3">
                Questions?
              </h2>
              <p>
                Email us at{" "}
                <a href="mailto:ecomm@poppigo.co" className="text-[#4241ff] hover:underline">
                  ecomm@poppigo.co
                </a>. We're real people who genuinely care. Promise.
              </p>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ReturnsPolicy;
