import { Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/poppigo-logo-cropped.svg";

const Footer = () => {
  return (
    <footer id="footer" className="bg-foreground text-white">
      {/* Bottom footer */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="inline-flex items-center bg-white rounded-xl px-3 py-2 mb-3">
              <img src={logo} alt="PoppiGo" className="h-8 w-auto" />
            </div>
            <p className="text-white/50 text-sm leading-relaxed font-body">
              India's first hygiene brand for active lifestyles. Modern hygiene essentials for women who
              never say no.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-white/90">
              Got Qs? Slide into our inbox
            </h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li>
                <a
                  href="mailto:hello@poppigo.co"
                  className="hover:text-lime transition-colors"
                >
                  hello@poppigo.co
                </a>
              </li>
              <li>
                <a href="tel:+919004491875" className="hover:text-lime transition-colors">
                  +91 9004491875
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-white/90">
              Policies
            </h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li>
                <Link to="/shipping" className="hover:text-lime transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-lime transition-colors">
                  Returns &amp; Refunds
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-lime transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-lime transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-white/90">
              Catch us online
            </h4>
            <ul className="space-y-3 text-sm text-white/50">
              <li>
                <a
                  href="https://www.instagram.com/letspoppigo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-lime transition-colors"
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
                  className="inline-flex items-center gap-2 hover:text-lime transition-colors"
                >
                  <Linkedin size={16} />
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-white/30">
          <p>© 2026 PoppiGo. All rights reserved.</p>
          <p className="text-right leading-relaxed">
            Marketed and Distributed by{" "}
            <span className="text-white/50">Carenil Essentials Private Limited</span>
            <br />
            45, Maker Chambers-III, 223 Nariman Point, Mumbai – 400021
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
