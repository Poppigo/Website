import { Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/poppigo-logo-cropped.svg";

const Footer = () => {
  return (
    <footer id="footer" className="bg-secondary text-secondary-foreground">
      {/* Bottom footer */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <img src={logo} alt="PoppiGo" className="h-10 w-auto mb-3 brightness-0 invert" />
            <p className="text-secondary-foreground/60 text-sm leading-relaxed">
              India's Slimmest Disposable Period Underwear. Modern hygiene essentials for women who
              never say no.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-secondary-foreground/90">
              Got Qs? Slide into our inbox
            </h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/60">
              <li>
                <a
                  href="mailto:hello@poppigo.co"
                  className="hover:text-primary transition-colors"
                >
                  hello@poppigo.co
                </a>
              </li>
              <li>
                <a href="tel:+919004491875" className="hover:text-primary transition-colors">
                  +91 9004491875
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-secondary-foreground/90">
              Policies
            </h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/60">
              <li>
                <Link to="/shipping" className="hover:text-primary transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-primary transition-colors">
                  Returns &amp; Refunds
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-secondary-foreground/90">
              Catch us online
            </h4>
            <ul className="space-y-3 text-sm text-secondary-foreground/60">
              <li>
                <a
                  href="https://www.instagram.com/letspoppigo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <Instagram size={16} />
                  letspoppigo
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/nilima-krishna-jhunjhunwala-8151256/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <Linkedin size={16} />
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/10 mt-10 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-secondary-foreground/40">
          <p>© 2026 PoppiGo. All rights reserved.</p>
          <p className="text-right leading-relaxed">
            Marketed and Distributed by{" "}
            <span className="text-secondary-foreground/60">Carenil Essentials Private Limited</span>
            <br />
            45, Maker Chambers-III, 223 Nariman Point, Mumbai – 400021
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
