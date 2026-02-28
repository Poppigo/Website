import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get("order_number");

  return (
    <div className="min-h-screen bg-peach">
      <Navbar />
      <div className="pt-24 pb-20 flex items-center justify-center min-h-[70vh] px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-card rounded-3xl border border-border p-8 md:p-12 max-w-lg w-full text-center"
        >
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-3">
            Order Confirmed!
          </h1>
          {orderNumber && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <Package size={18} className="text-muted-foreground" />
              <span className="text-muted-foreground font-medium">
                Order #{orderNumber}
              </span>
            </div>
          )}
          <p className="text-muted-foreground mb-8">
            Thank you for your purchase! Your order is being processed and you'll receive updates on the My Orders page.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/my-orders"
              className="inline-flex items-center justify-center gap-2 border-2 border-secondary text-secondary px-6 py-3 rounded-full font-semibold hover:bg-secondary hover:text-secondary-foreground transition-all"
            >
              View My Orders
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              Continue Shopping <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderSuccess;
