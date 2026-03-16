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

function getProductImage(product: any, selectedSize?: string): string {
  // If a size is selected and there's a size-specific image, use it
  if (selectedSize && product.size_images?.[selectedSize]) {
    return product.size_images[selectedSize];
  }
  // Otherwise use the main product image
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
  size_images: Record<string, string> | null;
  stock: number | null;
  is_active: boolean | null;
  enable_packs: boolean | null;
  pack_links: Record<string, string> | null;
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
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id]);

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
      <div className="min-h-screen bg-muted/30">
        <Navbar />
        <div className="pt-24 pb-20 flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  const image = getProductImage(product, selectedSize);
  const sizes = product.sizes || [];

  return (
    <div className="min-h-screen bg-muted/30 pb-24">
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
                  {/* Size Images Preview */}
                  {product.size_images && Object.keys(product.size_images).length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">Size previews:</p>
                      <div className="flex gap-2 flex-wrap">
                        {sizes.map((size) => {
                          const sizeImage = product.size_images?.[size];
                          if (!sizeImage) return null;
                          return (
                            <div
                              key={`preview-${size}`}
                              className={`relative w-16 h-16 rounded-lg border-2 overflow-hidden cursor-pointer transition-all flex items-center justify-center ${
                                selectedSize === size
                                  ? "border-secondary bg-secondary text-secondary-foreground ring-2 ring-secondary/20"
                                  : "border-border bg-card hover:border-secondary/50 text-foreground"
                              }`}
                              onClick={() => setSelectedSize(size)}
                            >
                              {/* Background image with opacity */}
                              <img
                                src={sizeImage}
                                alt={`${size} preview`}
                                className="absolute inset-0 w-full h-full object-cover opacity-20"
                              />
                              {/* Size text overlay */}
                              <div className="relative z-10 font-display font-bold text-sm text-center leading-tight">
                                {size}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <p className="font-display font-bold text-foreground mb-3">
                    Select Your Size: <span className="text-coral">{selectedSize}</span>
                  </p>
                </div>
              )}

              {/* Pack Preview */}
              {product.enable_packs && product.pack_links && Object.keys(product.pack_links).length > 0 && (
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-3 font-medium">Choose Pack Size:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {Object.entries(product.pack_links).map(([packName, link]) => {
                      if (!link) return null;
                      const getDiscountInfo = (pack: string) => {
                        if (pack === "Pack of 2") return { discount: "10%", color: "bg-lime-500" };
                        if (pack === "Pack of 3") return { discount: "15%", color: "bg-green-500" };
                        return null;
                      };
                      const discountInfo = getDiscountInfo(packName);

                      return (
                        <button
                          key={packName}
                          onClick={() => window.location.href = link}
                          className="group relative px-6 py-4 bg-gradient-to-r from-coral to-coral/90 hover:from-coral/90 hover:to-coral text-white border-0 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] hover:-translate-y-0.5 overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-lime-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative z-10 flex flex-col items-center gap-1">
                            <span>{packName}</span>
                            {discountInfo && (
                              <span className={`text-xs px-2 py-0.5 rounded-full ${discountInfo.color} text-white font-bold`}>
                                Save {discountInfo.discount}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Price and Quantity - responsive layout */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0 mb-6">
                <div className="flex items-center gap-4">
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

                <div className="flex items-center gap-3">
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
      
      {/* Fixed Bottom Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-2xl shadow-foreground/10 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row gap-3 items-center justify-center">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full sm:w-80 flex items-center justify-center gap-2 border-2 border-secondary text-secondary px-8 py-3.5 rounded-full font-bold hover:bg-secondary hover:text-secondary-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBag size={18} />
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            disabled={product.stock === 0}
            className="w-full sm:w-80 flex items-center justify-center gap-2 bg-coral text-card px-8 py-3.5 rounded-full font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Buy Now
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
