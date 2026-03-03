import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, ChevronRight, Shield, Leaf, Users, Check } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";
import ReviewSection from "@/components/ReviewSection";
import shopProduct1 from "@/assets/shop-product-1.png";
import shopProduct2 from "@/assets/shop-product-2.jpg";
import shopProduct3 from "@/assets/shop-product-3.png";
import productSM from "@/assets/product-sm.png";

// Fallback images mapped by product name keywords
const fallbackImages: Record<string, string> = {
  "1 pack": shopProduct1,
  "pack of 2": shopProduct3,
  "pack of 3": productSM,
};

function getProductImage(product: any): string {
  if (product.image_url) return product.image_url;
  const name = product.name.toLowerCase();
  for (const [key, img] of Object.entries(fallbackImages)) {
    if (name.includes(key)) return img;
  }
  return shopProduct2;
}

interface Product {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  description: string | null;
  image_url: string | null;
  category: string | null;
  sizes: string[] | null;
  stock: number | null;
  is_active: boolean | null;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isHovering, setIsHovering] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imgContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = imgContainerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setZoomPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .eq("is_active", true)
        .single();

      if (error || !data) {
        toast.error("Product not found");
        navigate("/shop");
        return;
      }
      setProduct(data as Product);
      if (data.sizes && data.sizes.length > 0) {
        setSelectedSize(data.sizes[0]);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!product) return;
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    addToCart(
      {
        id: product.id as any,
        name: product.name,
        price: product.price,
        image: getProductImage(product),
        size: selectedSize || undefined,
      },
      quantity
    );
    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-peach">
        <Navbar />
        <div className="pt-24 pb-20 flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  const image = getProductImage(product);
  const sizes = product.sizes || [];

  return (
    <div className="min-h-screen bg-peach">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/shop" className="hover:text-foreground transition-colors">Shop</Link>
            <ChevronRight size={14} />
            <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image with hover zoom */}
            <motion.div
              ref={imgContainerRef}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative bg-card rounded-3xl border border-border overflow-hidden aspect-square cursor-crosshair"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={image}
                alt={product.name}
                className="w-full h-full object-contain p-8 transition-transform duration-100 ease-out will-change-transform"
                style={isHovering ? {
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transform: "scale(2.2)",
                } : { transform: "scale(1)" }}
              />
              {!isHovering && (
                <div className="absolute bottom-4 right-4 bg-black/20 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm font-medium">
                  Hover to zoom
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col"
            >
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
                {product.name}
              </h1>

              <p className="text-muted-foreground mb-6">
                {product.description || "PoppiGo – India's 1st Ultra-Slim Disposable Period Panty | Rashfree, No-Leak | Japanese Gel Absorption for longer hours | Accurate Fit | Active Day & Night Use"}
              </p>

              {/* Size Selection */}
              {sizes.length > 0 && (
                <div className="mb-6">
                  <p className="font-display font-bold text-foreground mb-3">
                    Select Your Size: <span className="text-coral">{selectedSize}</span>
                  </p>
                  <div className="flex gap-3">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-5 py-2.5 rounded-lg border-2 font-semibold text-sm transition-all ${
                          selectedSize === size
                            ? "border-secondary bg-secondary text-secondary-foreground"
                            : "border-border text-foreground hover:border-secondary"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                {product.original_price && product.original_price > product.price && (
                  <span className="text-lg text-muted-foreground line-through">
                    ₹{Number(product.original_price).toFixed(2)}
                  </span>
                )}
                <span className="font-display text-3xl font-bold text-coral">
                  ₹{Number(product.price).toFixed(2)}
                </span>
                {product.original_price && product.original_price > product.price && (
                  <span className="bg-coral/10 text-coral px-3 py-1 rounded-full text-sm font-bold">
                    -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                  </span>
                )}
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium text-foreground">Quantity:</span>
                <div className="flex items-center border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2 text-foreground font-semibold min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Stock */}
              {product.stock !== null && product.stock <= 10 && product.stock > 0 && (
                <p className="text-coral text-sm font-semibold mb-4">
                  Only {product.stock} left in stock!
                </p>
              )}
              {product.stock === 0 && (
                <p className="text-destructive text-sm font-bold mb-4">Out of stock</p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 flex items-center justify-center gap-2 border-2 border-secondary text-secondary px-6 py-3.5 rounded-full font-bold hover:bg-secondary hover:text-secondary-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag size={18} />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex-1 bg-coral text-card px-6 py-3.5 rounded-full font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center text-center p-4 bg-card rounded-2xl border border-border">
                  <Shield size={28} className="text-muted-foreground mb-2" />
                  <span className="text-xs font-semibold text-foreground">FDA Approved</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-card rounded-2xl border border-border">
                  <Leaf size={28} className="text-muted-foreground mb-2" />
                  <span className="text-xs font-semibold text-foreground">Rash Free</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-card rounded-2xl border border-border">
                  <Users size={28} className="text-muted-foreground mb-2" />
                  <span className="text-xs font-semibold text-foreground">10K+ Users</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-16"
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
              PoppiGo vs Others
            </h2>
            <div className="rounded-3xl overflow-hidden border border-border">
              {/* Header */}
              <div className="grid grid-cols-3 text-center">
                <div className="bg-muted p-4 font-display font-bold text-muted-foreground text-sm uppercase tracking-wide">Feature</div>
                <div className="bg-primary p-4 font-display font-bold text-primary-foreground text-sm uppercase tracking-wide">PoppiGo ✦</div>
                <div className="bg-muted p-4 font-display font-bold text-muted-foreground text-sm uppercase tracking-wide">Others</div>
              </div>
              {/* Rows */}
              {[
                ["Thickness", "Just 2mm slim", "Bulky & visible"],
                ["Protection", "Up to 12 hours", "4–6 hours max"],
                ["Core Tech", "Japanese Gel-Tech", "Basic cotton"],
                ["Use case", "Blood, sweat & pee", "Blood only"],
                ["Feel", "Like regular underwear", "Diaper-like"],
                ["Disposal", "Wear, toss & go!", "Needs washing"],
              ].map(([feature, poppi, other], i) => (
                <div key={i} className={`grid grid-cols-3 text-center text-sm ${i % 2 === 0 ? "bg-card" : "bg-background"}`}>
                  <div className="p-4 font-semibold text-foreground border-r border-border">{feature}</div>
                  <div className="p-4 text-primary-foreground bg-primary/10 border-r border-border flex items-center justify-center gap-1.5 font-medium text-foreground">
                    <Check size={14} className="text-primary shrink-0" />{poppi}
                  </div>
                  <div className="p-4 text-muted-foreground">{other}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Reviews Section */}
          <ReviewSection productId={product.id} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
