import { Instagram, Twitter, Facebook, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="font-display text-2xl font-bold text-primary mb-4">
              PoppiGo
            </h3>
            <p className="text-secondary-foreground/60 text-sm leading-relaxed">
              India's Slimmest Disposable Period Panty. Modern hygiene essentials for women who never say no.
            </p>
            <div className="flex gap-4 mt-6">
              {[Instagram, Twitter, Facebook, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-secondary-foreground/90">
              Shop
            </h4>
            <ul className="space-y-2.5 text-sm text-secondary-foreground/60">
              <li><a href="#" className="hover:text-primary transition-colors">All Products</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Size Guide</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Bundles</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4 text-secondary-foreground/90">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm text-secondary-foreground/60">
              <li><a href="#" className="hover:text-primary transition-colors">Our Story</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4 text-secondary-foreground/90">
              Support
            </h4>
            <ul className="space-y-2.5 text-sm text-secondary-foreground/60">
              <li><a href="#" className="hover:text-primary transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-secondary-foreground/40">
          <p>© 2025 PoppiGo. All rights reserved.</p>
          <p>
            Available on{" "}
            <span className="text-primary font-semibold">Amazon</span>,{" "}
            <span className="text-primary font-semibold">Blinkit</span> &{" "}
            <span className="text-primary font-semibold">Flipkart</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
