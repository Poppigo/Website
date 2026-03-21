import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, User, LogOut, Package, ArrowUpRight } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import logo from "@/assets/poppigo-logo-cropped.svg";

const navLinks = [
  { label: "Shop The Stash", href: "/shop", section: null },
  { label: "What's Poppin'", href: null, section: "features" },
  { label: "Tea On Us", href: null, section: "story" },
  { label: "Facts Only", href: null, section: "faq" },
  { label: "Hit Us Up", href: null, section: "footer" },
  { label: "Blog", href: "/blog", section: null },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSectionClick = (sectionId: string) => {
    setMobileOpen(false);
    if (location.pathname === "/") {
      scrollToSection(sectionId);
    } else {
      navigate("/");
      setTimeout(() => scrollToSection(sectionId), 300);
    }
  };

  const handleShopClick = () => {
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate("/shop");
  };

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(href);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-foreground/5" style={{ backgroundColor: "#fafff0" }}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" onClick={scrollToTop} className="flex items-center">
          <img src={logo} alt="PoppiGo" className="h-10 md:h-14 w-auto" />
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) =>
            link.href ? (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href!)}
                className="text-base font-body font-medium transition-colors"
                style={{ color: "#1b2a54" }}
              >
                {link.label}
              </button>
            ) : (
              <button
                key={link.label}
                onClick={() => handleSectionClick(link.section!)}
                className="text-base font-body font-medium transition-colors"
                style={{ color: "#1b2a54" }}
              >
                {link.label}
              </button>
            )
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/my-orders"
                onClick={scrollToTop}
                className="text-foreground/60 hover:text-foreground transition-colors"
                title="My Orders"
              >
                <Package size={26} />
              </Link>
              <button
                onClick={() => signOut()}
                className="text-foreground/60 hover:text-foreground transition-colors"
                title="Sign out"
              >
                <LogOut size={26} />
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              onClick={scrollToTop}
              className="text-foreground/60 hover:text-foreground transition-colors"
              title="Sign in"
            >
              <User size={26} />
            </Link>
          )}

          <Link to="/cart" onClick={scrollToTop} className="relative text-foreground/60 hover:text-foreground transition-colors">
            <ShoppingBag size={26} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-lime text-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          <button
            onClick={handleShopClick}
            className="hidden sm:inline-flex items-center gap-2 bg-lime text-foreground px-7 py-3 rounded-full text-base font-medium hover:shadow-md hover:shadow-lime/30 transition-all"
          >
            Shop Now
            <span className="w-6 h-6 bg-foreground text-white rounded-full inline-flex items-center justify-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </button>
          <button
            className="lg:hidden text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden border-t border-foreground/5"
            style={{ backgroundColor: "#fafff0" }}
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) =>
                link.href ? (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link.href!)}
                    className="font-body font-medium text-lg text-left"
                    style={{ color: "#1b2a54" }}
                  >
                    {link.label}
                  </button>
                ) : (
                  <button
                    key={link.label}
                    onClick={() => handleSectionClick(link.section!)}
                    className="font-body font-medium text-lg text-left"
                    style={{ color: "#1b2a54" }}
                  >
                    {link.label}
                  </button>
                )
              )}
              {user ? (
                <>
                  <Link
                    to="/my-orders"
                    className="text-foreground font-medium text-lg"
                    onClick={() => { scrollToTop(); setMobileOpen(false); }}
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => { signOut(); setMobileOpen(false); }}
                    className="text-foreground font-medium text-lg text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="text-foreground font-medium text-lg"
                  onClick={() => { scrollToTop(); setMobileOpen(false); }}
                >
                  Sign In
                </Link>
              )}
              <button
                onClick={handleShopClick}
                className="mt-2 inline-flex items-center justify-center gap-2 bg-lime text-foreground px-5 py-3 rounded-full text-base font-semibold"
              >
                Shop Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
