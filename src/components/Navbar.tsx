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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="PoppiGo" className="h-8 md:h-10 w-auto" />
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) =>
            link.href ? (
              <button
                key={link.label}
                onClick={handleShopClick}
                className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                {link.label}
              </button>
            ) : (
              <button
                key={link.label}
                onClick={() => handleSectionClick(link.section!)}
                className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors"
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
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                title="My Orders"
              >
                <Package size={20} />
              </Link>
              <button
                onClick={() => signOut()}
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                title="Sign out"
              >
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              title="Sign in"
            >
              <User size={20} />
            </Link>
          )}

          <Link to="/cart" className="relative text-primary-foreground/80 hover:text-primary-foreground transition-colors">
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          <button
            onClick={handleShopClick}
            className="hidden sm:inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-2.5 rounded-full text-sm font-normal hover:opacity-90 transition-opacity"
          >
            Shop Now
            <span className="w-5 h-5 bg-white text-secondary rounded-full inline-flex items-center justify-center">
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </button>
          <button
            className="lg:hidden text-primary-foreground"
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
            className="lg:hidden overflow-hidden bg-primary border-t border-primary-foreground/10"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) =>
                link.href ? (
                  <button
                    key={link.label}
                    onClick={handleShopClick}
                    className="text-primary-foreground font-medium text-lg text-left"
                  >
                    {link.label}
                  </button>
                ) : (
                  <button
                    key={link.label}
                    onClick={() => handleSectionClick(link.section!)}
                    className="text-primary-foreground font-medium text-lg text-left"
                  >
                    {link.label}
                  </button>
                )
              )}
              {user ? (
                <>
                  <Link
                    to="/my-orders"
                    className="text-primary-foreground font-medium text-lg"
                    onClick={() => setMobileOpen(false)}
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => { signOut(); setMobileOpen(false); }}
                    className="text-primary-foreground font-medium text-lg text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="text-primary-foreground font-medium text-lg"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign In
                </Link>
              )}
              <button
                onClick={handleShopClick}
                className="mt-2 inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-5 py-3 rounded-full text-sm font-normal"
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
