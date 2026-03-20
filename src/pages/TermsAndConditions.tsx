import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-10">
    <h2 className="font-body font-bold text-xl text-foreground mb-3">{title}</h2>
    <div className="text-muted-foreground text-base leading-relaxed space-y-3">{children}</div>
  </div>
);

const TermsAndConditions = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-peach">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-base text-muted-foreground mb-2">Last updated: March 2026</p>
          <h1 className="font-body text-4xl md:text-5xl font-bold text-foreground mb-4">
            Terms &amp; Conditions
          </h1>
          <p className="text-muted-foreground text-base mb-10 leading-relaxed">
            Please read these Terms &amp; Conditions carefully before using{" "}
            <strong>poppigo.co</strong> or placing an order. By accessing our website or purchasing
            our products, you agree to be bound by these terms.
          </p>

          <Section title="1. About Us">
            <p>
              PoppiGo is a brand owned and operated by{" "}
              <strong>Carenil Essentials Private Limited</strong>, registered in India.
            </p>
            <p>
              Registered Address: 45, Maker Chambers-III, 223 Nariman Point, Mumbai – 400021
            </p>
            <p>
              For any queries, write to us at{" "}
              <a href="mailto:hello@poppigo.co" className="text-[#4241ff] hover:underline">
                hello@poppigo.co
              </a>{" "}
              or call{" "}
              <a href="tel:+919004491875" className="text-[#4241ff] hover:underline">
                +91 9004491875
              </a>
              .
            </p>
          </Section>

          <Section title="2. Products">
            <p>
              PoppiGo offers India's Slimmest Disposable Period Underwear. All products are personal
              hygiene items intended for single use.
            </p>
            <p>
              Product images are for illustrative purposes only. Actual product appearance may vary
              slightly due to photography lighting and screen display settings.
            </p>
            <p>
              We reserve the right to modify, discontinue, or limit the availability of any product
              at any time without prior notice.
            </p>
          </Section>

          <Section title="3. Pricing & Payments">
            <p>
              All prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes unless
              stated otherwise.
            </p>
            <p>
              We accept payments via credit/debit cards, UPI, net banking, and Cash on Delivery (COD)
              where available. Payments are processed securely through Razorpay.
            </p>
            <p>
              We reserve the right to change pricing at any time. Prices at the time your order is
              confirmed will apply to your purchase.
            </p>
          </Section>

          <Section title="4. Orders & Cancellations">
            <p>
              Once an order is placed and confirmed, it enters processing immediately. Cancellations
              may not always be possible. If you need to cancel, contact us as soon as possible at{" "}
              <a href="mailto:hello@poppigo.co" className="text-[#4241ff] hover:underline">
                hello@poppigo.co
              </a>
              .
            </p>
            <p>
              We reserve the right to cancel any order due to stock unavailability, pricing errors,
              or fraud suspicion. You will be notified and a full refund will be issued if payment was
              collected.
            </p>
          </Section>

          <Section title="5. Shipping">
            <p>
              We ship across India. Delivery timelines are typically{" "}
              <strong>2–5 working days</strong> depending on your pin code.
            </p>
            <p>
              For full details, refer to our{" "}
              <Link to="/shipping" className="text-[#4241ff] hover:underline">
                Shipping Policy
              </Link>
              .
            </p>
          </Section>

          <Section title="6. Returns, Exchanges & Refunds">
            <p>
              As PoppiGo is a hygiene product, we are <strong>unable to accept returns or offer
              exchanges</strong>.
            </p>
            <p>
              However, if there is a concern about product quality, please email us at{" "}
              <a href="mailto:hello@poppigo.co" className="text-[#4241ff] hover:underline">
                hello@poppigo.co
              </a>{" "}
              within <strong>7 days of delivery</strong>. In confirmed cases of genuine quality
              issues, a replacement will be issued as a goodwill gesture.
            </p>
            <p>
              For full details, refer to our{" "}
              <Link to="/returns" className="text-[#4241ff] hover:underline">
                Returns Policy
              </Link>
              .
            </p>
          </Section>

          <Section title="7. User Accounts">
            <p>
              You may create an account on our website to track orders and manage your profile.
              Account registration is done via email/password or Google sign-in, powered by Supabase.
            </p>
            <p>
              You are responsible for maintaining the confidentiality of your login credentials and
              for all activities that occur under your account.
            </p>
            <p>
              We reserve the right to suspend or terminate accounts that violate these terms or
              engage in fraudulent activity.
            </p>
          </Section>

          <Section title="8. Intellectual Property">
            <p>
              All content on this website — including text, images, logos, and branding — is the
              property of Carenil Essentials Private Limited and is protected under applicable
              intellectual property laws.
            </p>
            <p>
              You may not reproduce, distribute, or use any content from this website without prior
              written permission.
            </p>
          </Section>

          <Section title="9. Limitation of Liability">
            <p>
              PoppiGo shall not be liable for any indirect, incidental, or consequential damages
              arising from the use of our products or website beyond the amount paid for the
              order in question.
            </p>
            <p>
              We make no warranties, express or implied, regarding fitness for a particular purpose
              beyond what is described in our product listings.
            </p>
          </Section>

          <Section title="10. Governing Law">
            <p>
              These terms are governed by and construed in accordance with the laws of India.
              Any disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai,
              Maharashtra.
            </p>
          </Section>

          <Section title="11. Changes to These Terms">
            <p>
              We may update these Terms &amp; Conditions at any time. Changes will be posted on this
              page with an updated date. Continued use of the website after changes constitutes
              acceptance of the revised terms.
            </p>
          </Section>

          <div className="mt-12 pt-8 border-t border-border text-base text-muted-foreground">
            <p>
              Questions? Email us at{" "}
              <a href="mailto:hello@poppigo.co" className="text-[#4241ff] hover:underline">
                hello@poppigo.co
              </a>{" "}
              or call{" "}
              <a href="tel:+919004491875" className="text-[#4241ff] hover:underline">
                +91 9004491875
              </a>
              .
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
