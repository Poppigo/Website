import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Package, Truck, ArrowRight, ShoppingBag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get("order_number");

  return (
    <div className="min-h-screen bg-peach">
      <Navbar />
      <div className="pt-24 pb-20 flex items-center justify-center min-h-[80vh] px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-md w-full"
        >
          {/* Main card */}
          <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-lg">
            {/* Top accent strip */}
            <div className="h-2 w-full bg-gradient-to-r from-coral via-primary to-coral" />

            <div className="px-8 pt-8 pb-6 text-center">
              {/* Animated checkmark */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 14 }}
                className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center mx-auto mb-5"
              >
                <Check size={36} strokeWidth={3} className="text-emerald-500" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.4 }}
              >
                <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                  Order Confirmed! 🎉
                </h1>
                <p className="text-muted-foreground text-base leading-relaxed">
                  Thank you for shopping with PoppiGo! Your order is confirmed and being packed with care.
                </p>
              </motion.div>
            </div>

            {/* Order number pill */}
            {orderNumber && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="mx-8 mb-6"
              >
                <div className="bg-muted rounded-2xl px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center">
                      <Package size={14} className="text-muted-foreground" />
                    </div>
                    <span className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Order Number</span>
                  </div>
                  <span className="font-display font-bold text-foreground text-base">#{orderNumber}</span>
                </div>
              </motion.div>
            )}

            {/* Steps */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mx-8 mb-8"
            >
              <div className="flex items-center gap-0">
                {/* Step 1 */}
                <div className="flex flex-col items-center flex-1">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center mb-1.5">
                    <Check size={16} className="text-emerald-600" strokeWidth={3} />
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-600 text-center">Confirmed</span>
                </div>
                <div className="h-px flex-1 bg-border mb-4" />
                {/* Step 2 */}
                <div className="flex flex-col items-center flex-1">
                  <div className="w-9 h-9 rounded-full bg-coral/15 flex items-center justify-center mb-1.5">
                    <Package size={16} className="text-coral" />
                  </div>
                  <span className="text-[10px] font-semibold text-coral text-center">Packing</span>
                </div>
                <div className="h-px flex-1 bg-border mb-4" />
                {/* Step 3 */}
                <div className="flex flex-col items-center flex-1">
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center mb-1.5">
                    <Truck size={16} className="text-muted-foreground" />
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground text-center">Shipped</span>
                </div>
              </div>
            </motion.div>

            {/* Delivery note */}
            <div className="mx-8 mb-7 bg-primary/5 border border-primary/10 rounded-2xl px-4 py-3 flex items-start gap-3">
              <Truck size={16} className="text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                Estimated delivery in <strong className="text-foreground">2–5 working days</strong>. Track your order from My Orders.
              </p>
            </div>

            {/* Actions */}
            <div className="px-8 pb-8 flex flex-col gap-3">
              <Link
                to="/my-orders"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-display font-semibold hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#ccff00', color: '#1b2a54' }}
              >
                <Package size={16} />
                Track My Order
              </Link>
              <Link
                to="/shop"
                className="w-full inline-flex items-center justify-center gap-2 border border-border text-muted-foreground px-6 py-3.5 rounded-full font-display font-semibold hover:text-foreground hover:border-foreground transition-colors"
              >
                <ShoppingBag size={16} />
                Continue Shopping
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Bottom note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center text-sm text-muted-foreground mt-5"
          >
            Questions? Email us at{" "}
            <a href="mailto:hello@poppigo.co" className="text-coral hover:underline">
              hello@poppigo.co
            </a>
          </motion.p>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderSuccess;
