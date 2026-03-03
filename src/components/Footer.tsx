import { Instagram, Globe } from "lucide-react";
import logo from "@/assets/poppigo-logo-cropped.svg";

const Footer = () => {
  return (
    <footer id="footer" className="bg-secondary text-secondary-foreground">
      {/* Bottom footer */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
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
              <li className="pt-2">
                <a href="/#faq" className="hover:text-primary transition-colors underline underline-offset-2">
                  Returns Policy
                </a>
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
                  href="https://www.poppigo.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <Globe size={16} />
                  www.poppigo.co
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/10 mt-10 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-secondary-foreground/40">
          <p>© 2025 PoppiGo. All rights reserved.</p>
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
