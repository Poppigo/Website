import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-peach">
        <Navbar />
        <div className="pt-24 pb-20 flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
          <ShoppingBag size={64} className="text-muted-foreground mb-6" />
          <h1 className="font-display text-3xl font-bold text-foreground mb-3">
            Your cart is empty
          </h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added anything yet.
          </p>
          <Link
            to="/shop"
            className="bg-secondary text-secondary-foreground px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            Shop Now
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-peach">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-10">
            Your Cart
          </h1>

          <div className="space-y-4 mb-10">
            {items.map((item, i) => (
              <motion.div
                key={`${item.id}__${item.size || ""}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 bg-card rounded-2xl border border-border p-4"
              >
                <div className="w-20 h-20 bg-accent rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-foreground text-sm leading-snug line-clamp-2">{item.name}</h3>
                  {item.size && <p className="text-xs text-muted-foreground mt-0.5">Size: {item.size}</p>}
                  <p className="text-coral font-bold mt-1">₹{item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-1 border border-border rounded-lg overflow-hidden shrink-0">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)} className="px-2 py-1.5 text-muted-foreground hover:text-foreground">
                    <Minus size={14} />
                  </button>
                  <span className="px-3 py-1.5 text-sm font-medium text-foreground min-w-[2rem] text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)} className="px-2 py-1.5 text-muted-foreground hover:text-foreground">
                    <Plus size={14} />
                  </button>
                </div>
                <p className="font-display font-bold text-foreground w-20 text-right shrink-0">₹{(item.price * item.quantity).toFixed(2)}</p>
                <button onClick={() => removeFromCart(item.id, item.size)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0">
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))}
          </div>

          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <span className="text-muted-foreground font-medium">Subtotal</span>
              <span className="font-display text-2xl font-bold text-foreground">₹{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/shop"
                className="flex-1 text-center border border-border text-foreground px-6 py-3 rounded-full font-semibold hover:bg-accent transition-colors"
              >
                Continue Shopping
              </Link>
              <Link
                to="/checkout"
                className="flex-1 bg-coral text-card px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity text-center"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
