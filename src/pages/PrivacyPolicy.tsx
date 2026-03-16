import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-10">
    <h2 className="font-display font-bold text-xl text-foreground mb-3">{title}</h2>
    <div className="text-muted-foreground text-sm leading-relaxed space-y-3">{children}</div>
  </div>
);

const PrivacyPolicy = () => {
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
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-sm mb-10 leading-relaxed">
            At <strong>PoppiGo</strong> (Carenil Essentials Private Limited), your privacy matters
            to us. This policy explains what information we collect and how we use it when you
            visit{" "}
            <a href="https://www.poppigo.co" className="text-[#4241ff] hover:underline">
              www.poppigo.co
            </a>
            .
          </p>

          <Section title="Information We Collect">
            <p>When you interact with PoppiGo, we may collect:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Account details:</strong> Name, email address, and encrypted password (or
                name/email if you sign in via Google).
              </li>
              <li>
                <strong>Order details:</strong> Shipping address, phone number, and purchase
                information.
              </li>
              <li>
                <strong>Payment details:</strong> Payments are processed securely via Razorpay. We
                do not store card information.
              </li>
              <li>
                <strong>Usage data:</strong> Basic website analytics such as browser type, IP
                address, and pages visited.
              </li>
              <li>
                <strong>Communication:</strong> Messages or emails you send us.
              </li>
            </ul>
          </Section>

          <Section title="How We Use Your Data">
            <p>We use your information to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Process and deliver your orders</li>
              <li>Manage your account securely</li>
              <li>Respond to customer support requests</li>
              <li>Improve our website and products</li>
              <li>Send updates or offers if you opt in</li>
            </ul>
          </Section>

          <Section title="Data Security">
            <p>
              Our website uses <strong>Supabase</strong> for secure data storage and
              authentication. Passwords are encrypted, and login sessions are managed using secure
              tokens. We also use HTTPS encryption to protect your information.
            </p>
          </Section>

          <Section title="Sharing of Data">
            <p>We do not sell your data. We only share necessary information with:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>For payment processing</li>
              <li>To support backend infrastructure</li>
              <li>Delivery partners for shipping orders</li>
              <li>Legal authorities when required by law</li>
            </ul>
          </Section>

          <Section title="Your Rights">
            <p>You may request to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Access your data</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account</li>
              <li>Opt out of marketing emails</li>
            </ul>
            <p>
              Email us at{" "}
              <a href="mailto:hello@poppigo.co" className="text-[#4241ff] hover:underline">
                hello@poppigo.co
              </a>{" "}
              to make any request.
            </p>
          </Section>

          <Section title="Updates">
            <p>
              We may update this policy occasionally. Any changes will be posted on this page.
            </p>
          </Section>

          <div className="mt-12 pt-8 border-t border-border text-sm text-muted-foreground space-y-1">
            <h2 className="font-display font-bold text-xl text-foreground mb-3">Contact Us</h2>
            <p>PoppiGo – Carenil Essentials Private Limited</p>
            <p>45, Maker Chambers III, Nariman Point, Mumbai – 400021</p>
            <p>
              Email:{" "}
              <a href="mailto:hello@poppigo.co" className="text-[#4241ff] hover:underline">
                hello@poppigo.co
              </a>
            </p>
            <p>
              Phone:{" "}
              <a href="tel:+919004491875" className="text-[#4241ff] hover:underline">
                +91 90044 91875
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
