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
            At <strong>PoppiGo</strong> (operated by Carenil Essentials Private Limited), your
            privacy is important to us. This policy explains what data we collect, how we use it,
            and your rights.
          </p>

          <Section title="1. Who We Are">
            <p>
              <strong>Carenil Essentials Private Limited</strong> operates the PoppiGo website at{" "}
              <a href="https://www.poppigo.co" className="text-coral hover:underline">
                www.poppigo.co
              </a>
              .
            </p>
            <p>
              Registered Address: 45, Maker Chambers-III, 223 Nariman Point, Mumbai – 400021
            </p>
            <p>
              Data Controller Contact:{" "}
              <a href="mailto:hello@poppigo.co" className="text-coral hover:underline">
                hello@poppigo.co
              </a>
            </p>
          </Section>

          <Section title="2. Data We Collect">
            <p>We collect the following categories of personal data:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Account information:</strong> Email address, name, and password (hashed)
                when you register via email/password sign-up. If you sign in with Google, we receive
                your name and email from Google via OAuth — no password is stored.
              </li>
              <li>
                <strong>Order information:</strong> Shipping address, contact number, and order
                details when you place a purchase.
              </li>
              <li>
                <strong>Payment information:</strong> Payment transactions are processed by{" "}
                <strong>Razorpay</strong>. We do not store card numbers or sensitive payment data.
              </li>
              <li>
                <strong>Usage data:</strong> Browser type, IP address, pages visited, and
                time spent on pages, collected automatically via standard web server logs.
              </li>
              <li>
                <strong>Communications:</strong> Any messages you send us via email or support.
              </li>
            </ul>
          </Section>

          <Section title="3. How We Use Your Data">
            <ul className="list-disc pl-5 space-y-1.5">
              <li>To process and fulfill your orders, and send order confirmation notifications.</li>
              <li>To manage your account and authenticate you securely.</li>
              <li>To communicate with you about your orders, returns, or customer support queries.</li>
              <li>To improve our website and product offerings based on usage patterns.</li>
              <li>To comply with legal and regulatory obligations.</li>
              <li>
                To send you promotional communications, only if you have opted in. You can opt out
                at any time.
              </li>
            </ul>
          </Section>

          <Section title="4. Authentication & Supabase">
            <p>
              Our website uses <strong>Supabase</strong> as our backend and authentication
              provider. Supabase stores your account credentials securely. When you sign up with
              email/password, your password is hashed and never stored in plain text. When you use
              Google Sign-In, we utilise Google OAuth 2.0 and only receive your name and email from
              Google.
            </p>
            <p>
              Supabase is GDPR-compliant and your data is stored on secure cloud infrastructure.
              For more on Supabase's security practices, visit{" "}
              <a
                href="https://supabase.com/security"
                target="_blank"
                rel="noopener noreferrer"
                className="text-coral hover:underline"
              >
                supabase.com/security
              </a>
              .
            </p>
            <p>
              Session tokens (JWTs) are used to keep you logged in. These are stored in your
              browser's local storage and expire periodically for security.
            </p>
          </Section>

          <Section title="5. Cookies & Tracking">
            <p>
              We use essential cookies to keep you logged in and maintain your shopping cart. We do
              not use third-party advertising cookies.
            </p>
            <p>
              You can disable cookies in your browser settings; however, some features of the
              website (such as staying logged in) may not function correctly without them.
            </p>
          </Section>

          <Section title="6. Sharing of Data">
            <p>We do not sell your personal data. We share data only with:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Razorpay</strong> — to process payments securely.
              </li>
              <li>
                <strong>Supabase</strong> — to store account and order data.
              </li>
              <li>
                <strong>Logistics/courier partners</strong> — to deliver your orders (name, address,
                and phone number are shared with the delivery partner).
              </li>
              <li>
                <strong>Legal authorities</strong> — when required to comply with applicable laws.
              </li>
            </ul>
          </Section>

          <Section title="7. Data Retention">
            <p>
              We retain your account and order data for as long as your account is active or as
              required for business and legal purposes. If you request account deletion, we will
              delete your personal data within 30 days, except where retention is required by law.
            </p>
          </Section>

          <Section title="8. Your Rights">
            <p>You have the right to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your account and associated data.</li>
              <li>Withdraw consent for marketing communications at any time.</li>
            </ul>
            <p>
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:hello@poppigo.co" className="text-coral hover:underline">
                hello@poppigo.co
              </a>
              .
            </p>
          </Section>

          <Section title="9. Security">
            <p>
              We implement industry-standard security practices including HTTPS encryption,
              hashed passwords, JWT-based authentication, and database-level row security through
              Supabase's Row Level Security (RLS) policies.
            </p>
            <p>
              While we take every reasonable precaution, no method of data transmission over the
              internet is 100% secure. We encourage you to use a strong, unique password for your
              account.
            </p>
          </Section>

          <Section title="10. Children's Privacy">
            <p>
              Our products and website are not intended for children under the age of 13. We do not
              knowingly collect personal data from children.
            </p>
          </Section>

          <Section title="11. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. The revised version will be
              posted on this page with an updated date. We encourage you to review it periodically.
            </p>
          </Section>

          <div className="mt-12 pt-8 border-t border-border text-sm text-muted-foreground">
            <p>
              Questions about your privacy? Email us at{" "}
              <a href="mailto:hello@poppigo.co" className="text-coral hover:underline">
                hello@poppigo.co
              </a>{" "}
              or call{" "}
              <a href="tel:+919004491875" className="text-coral hover:underline">
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

export default PrivacyPolicy;
