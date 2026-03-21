import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, ChevronRight, ChevronDown, Check } from "lucide-react";
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

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="py-4 cursor-pointer" onClick={() => setOpen(!open)}>
      <div className="flex items-center justify-between gap-4">
        <span className="font-body font-semibold text-base md:text-lg" style={{ color: '#1b2a54' }}>{question}</span>
        <ChevronDown
          size={18}
          className="shrink-0 transition-transform duration-200"
          style={{ color: '#FF6B35', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </div>
      {open && (
        <p className="font-body mt-2 text-base leading-relaxed" style={{ color: '#4b5563' }}>{answer}</p>
      )}
    </div>
  );
};

// Fallback images mapped by product name keywords
const sizeWaist: Record<string, string> = {
  "S-M": '25\u2033 \u2013 35\u2033',
  "L-XL": '35\u2033 \u2013 45\u2033',
  "2XL-3XL": '45\u2033 \u2013 55\u2033',
};

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
  gallery_images: string[] | null;
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
  const [activeImageIndex, setActiveImageIndex] = useState(0);
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
      setActiveImageIndex(0);
      setLoading(false);
    };
    fetchProduct();
  }, [id, navigate]);

  // Auto-scroll through gallery images every 10 seconds
  useEffect(() => {
    if (!product) return;
    const totalImages = 1 + (product.gallery_images?.length || 0);
    if (totalImages <= 1) return;
    const timer = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % totalImages);
    }, 10000);
    return () => clearInterval(timer);
  }, [product]);

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
    navigate("/checkout");
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-[#f7fbed]">
        <Navbar />
        <div className="pt-24 pb-20 flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  const image = getProductImage(product, selectedSize);
  const allImages = [image, ...(product.gallery_images || [])];
  const sizes = product.sizes || [];

  return (
    <div className="min-h-screen bg-[#f7fbed] pb-24">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-base text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/shop" className="hover:text-foreground transition-colors">Shop</Link>
            <ChevronRight size={14} />
            <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image with thumbnail strip and hover zoom */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col-reverse lg:flex-row gap-3">
                {/* Thumbnail strip — bottom on mobile, left on desktop */}
                {allImages.length > 1 && (
                  <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-hidden lg:overflow-y-auto pb-1 lg:pb-0" style={{ maxHeight: '460px' }}>
                    {allImages.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`flex-shrink-0 w-16 h-16 rounded-xl border-2 overflow-hidden cursor-pointer transition-all ${
                          activeImageIndex === idx
                            ? "border-[#ccff3c] ring-1 ring-[#ccff3c]"
                            : "border-gray-200 hover:border-[#1b2a54]/50"
                        }`}
                      >
                        <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
                {/* Main image viewer */}
                <div
                  ref={imgContainerRef}
                  className="relative flex-1 bg-card rounded-3xl border border-border overflow-hidden aspect-square cursor-crosshair"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  onMouseMove={handleMouseMove}
                >
                  <img
                    src={allImages[activeImageIndex] ?? image}
                    alt={product.name}
                    className="w-full h-full object-contain p-8 transition-transform duration-100 ease-out will-change-transform"
                    style={isHovering ? {
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      transform: "scale(2.2)",
                    } : { transform: "scale(1)" }}
                  />
                  {!isHovering && (
                    <div className="absolute bottom-4 right-4 bg-black/20 text-white text-sm px-3 py-1.5 rounded-full backdrop-blur-sm font-medium">
                      Hover to zoom
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col"
            >
              <h1 className="font-body text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
                {product.name}
              </h1>

              <p className="font-body text-muted-foreground mb-6 text-base">
                {product.description || "PoppiGo – India's 1st Ultra-Slim Disposable Period Panty | Rashfree, No-Leak | Japanese Gel Absorption for longer hours | Accurate Fit | Active Day & Night Use"}
              </p>

              {/* Size Selection */}
              {sizes.length > 0 && (
                <div className="mb-6">
                  {/* Size Images Preview */}
                  {product.size_images && Object.keys(product.size_images).length > 0 && (
                    <div className="mb-4">
                      <div className="flex gap-2 flex-wrap">
                        {sizes.map((size) => {
                          const sizeImage = product.size_images?.[size];
                          if (!sizeImage) return null;
                          return (
                            <div
                              key={`preview-${size}`}
                              className={`relative w-24 h-28 rounded-xl border-2 overflow-hidden cursor-pointer transition-all flex items-center justify-center ${
                                selectedSize === size
                                  ? "border-[#1b2a54] ring-2 ring-[#ccff3c]"
                                  : "border-gray-200 hover:border-[#1b2a54]/50"
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
                              <div className="relative z-10 font-body font-bold text-sm text-center leading-tight">
                                {size}
                                {sizeWaist[size] && (
                                  <div className="font-bold text-xs mt-0.5 text-foreground/80">{sizeWaist[size]}</div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <p className="font-body font-bold mb-3 text-base" style={{ color: '#1b2a54' }}>
                    Select Your Size: <span style={{ color: '#FF6B35' }}>{selectedSize}</span>
                    {selectedSize && sizeWaist[selectedSize] && (
                      <span className="ml-2 font-bold text-sm text-foreground/70">Waist: {sizeWaist[selectedSize]}</span>
                    )}
                  </p>
                </div>
              )}

              {/* Pack Preview */}
              {product.enable_packs && product.pack_links && Object.keys(product.pack_links).length > 0 && (
                <div className="mb-6">
                  <p className="font-body font-bold mb-3 text-base" style={{ color: '#1b2a54' }}>Choose Pack Size:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {Object.entries(product.pack_links).map(([packName, link]) => {
                      if (!link) return null;
                      const getDiscountInfo = (pack: string) => {
                        if (pack === "Pack of 2") return { discount: "10%" };
                        if (pack === "Pack of 3") return { discount: "15%" };
                        if (pack === "Pack of 4") return { discount: "20%" };
                        return null;
                      };
                      const discountInfo = getDiscountInfo(packName);

                      return (
                        <button
                          key={packName}
                          onClick={() => window.location.href = link}
                          className="flex flex-col items-center justify-center gap-1.5 px-2 py-4 rounded-2xl font-bold transition-all duration-200 hover:scale-[1.03] hover:shadow-lg border-2 h-[80px]"
                          style={{ backgroundColor: '#f5f7ff', borderColor: '#1b2a54', color: '#1b2a54' }}
                        >
                          <span className="text-base font-body text-center leading-tight">{packName}</span>
                          {discountInfo ? (
                            <span className="text-sm px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: '#fff3ee', color: '#FF6B35', border: '1px solid #FF6B35' }}>
                              Save {discountInfo.discount}
                            </span>
                          ) : (
                            <span className="text-sm opacity-0 px-2 py-0.5">-</span>
                          )}
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
                    <span className="font-body text-lg text-muted-foreground line-through">
                      ₹{Number(product.original_price).toFixed(2)}
                    </span>
                  )}
                  <span className="font-body text-3xl font-bold" style={{ color: '#FF6B35' }}>
                    ₹{Number(product.price).toFixed(2)}
                  </span>
                  {product.original_price && product.original_price > product.price && (
                    <span className="font-body px-3 py-1 rounded-full text-base font-bold" style={{ backgroundColor: '#fff3ee', color: '#FF6B35', border: '1px solid #FF6B35' }}>
                      -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-body text-base font-medium text-foreground">Quantity:</span>
                  <div className="flex items-center border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-body px-4 py-2 text-foreground font-semibold min-w-[3rem] text-center">
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
                <p className="text-coral text-base font-semibold mb-4">
                  Only {product.stock} left in stock!
                </p>
              )}
              {product.stock === 0 && (
                <p className="text-destructive text-base font-bold mb-4">Out of stock</p>
              )}

              {/* Product Headline + Proof Points */}
              <div className="rounded-2xl border border-border bg-card p-5 mb-2">
                <p className="font-body font-bold text-base mb-0.5" style={{ color: '#1b2a54' }}>Japanese Gel Tech. Made for blood. Nothing else.</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">Ultra-slim disposable period panty designed for a drier, lighter, no-stress experience.</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { emoji: "💧", label: "Stay Dry Feel" },
                    { emoji: "🩸", label: "Made for Period Flow" },
                    { emoji: "✨", label: "Ultra-Slim Fit" },
                    { emoji: "🌿", label: "Rash-Free Comfort" },
                  ].map(({ emoji, label }) => (
                    <div key={label} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl" style={{ backgroundColor: '#f7fbed' }}>
                      <span className="text-xl leading-none">{emoji}</span>
                      <span className="font-body text-sm font-semibold text-foreground">{label}</span>
                    </div>
                  ))}
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
            <h2 className="font-display text-4xl md:text-5xl font-bold text-center mb-8" style={{ color: '#4241ff' }}>
              PoppiGo vs Others
            </h2>
            <div className="rounded-3xl overflow-hidden border border-border">
              {/* Header */}
              <div className="grid grid-cols-3 text-center">
                <div className="bg-muted p-4 font-body font-bold text-base uppercase tracking-wide" style={{ color: '#1b2a54' }}>Feature</div>
                <div className="p-4 font-body font-bold text-base uppercase tracking-wide" style={{ backgroundColor: '#ccff3c', color: '#1b2a54' }}>PoppiGo ✦</div>
                <div className="bg-muted p-4 font-body font-bold text-base uppercase tracking-wide" style={{ color: '#1b2a54' }}>Others</div>
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
                <div key={i} className={`grid grid-cols-3 text-center text-base ${i % 2 === 0 ? "bg-card" : "bg-background"}`}>
                  <div className="p-4 font-body font-semibold text-foreground border-r border-border">{feature}</div>
                  <div className="p-4 font-body text-primary-foreground bg-primary/10 border-r border-border flex items-center justify-center gap-1.5 font-medium text-foreground">
                    <Check size={14} className="text-primary shrink-0" />{poppi}
                  </div>
                  <div className="p-4 font-body text-muted-foreground">{other}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* FAQ Section */}
          <div className="mt-12 mb-2">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-1" style={{ color: '#4241ff' }}>FAQs</h2>
            <p className="text-2xl md:text-3xl mb-5 font-accent" style={{ color: '#4241ff' }}>Everything you need to know before you switch</p>
            <div className="divide-y" style={{ borderColor: '#e5e7eb' }}>
              {[
                {
                  q: "How many hours of protection do PoppiGo panties provide?",
                  a: "Designed for long-lasting protection through your day or night, depending on your flow.",
                },
                {
                  q: "What makes PoppiGo different from other period panties?",
                  a: "PoppiGo is powered by Japanese Gel Tech, a premium absorbent core made specifically for period flow. It helps lock fluid quickly for a drier, lighter feel.",
                },
                {
                  q: "Is PoppiGo a pad or a panty?",
                  a: "PoppiGo is a disposable period panty. You wear it just like regular underwear with built-in protection. No pads, no layering, no adjustments.",
                },
                {
                  q: "Will it leak?",
                  a: "PoppiGo is designed for secure, all-around protection with a snug fit and high-absorbency core. For best results, choose the right size and change based on your flow.",
                },
                {
                  q: "How do I choose the right size?",
                  a: "Pick your size based on your hip measurement for the best fit. A snug fit ensures better comfort and protection.",
                },
                {
                  q: "Where all can I use PoppiGo?",
                  a: "PoppiGo is made for real life. Use it for work, travel, workouts, long days, nights, or whenever you want stress-free protection.",
                },
                {
                  q: "Can I use them with tampons or other menstrual products?",
                  a: "Yes. You can wear PoppiGo as backup protection with tampons, cups, or pads.",
                },
                {
                  q: "Are PoppiGo panties reusable?",
                  a: "No — they are single-use for hygiene and convenience. Just wear, remove, and dispose.",
                },
              ].map(({ q, a }, i) => (
                <FAQItem key={i} question={q} answer={a} />
              ))}
            </div>
          </div>

          {/* Influencer Videos Section */}
          <div className="mt-12 mb-2 rounded-3xl p-6 md:p-8" style={{ backgroundColor: '#ccff3c', border: '2px solid #b8f000' }}>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-2" style={{ color: '#4241ff' }}>Real girls. Real periods. Real switch.</h2>
            <p className="text-2xl md:text-3xl mb-6 font-accent" style={{ color: '#4241ff' }}>See what real women are saying about PoppiGo.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { src: "/Aanya - influencer.mp4", name: "Aanya" },
                { src: "/Komal Thakur - Influencer.mp4", name: "Komal Thakur" },
                { src: "/Prerna Makharia - influencer.mp4", name: "Prerna Makharia" },
              ].map(({ src, name }) => (
                <div key={name} className="rounded-2xl overflow-hidden shadow-md" style={{ border: '1.5px solid #bbf7d0', backgroundColor: '#ffffff' }}>
                  <video
                    src={src}
                    controls
                    playsInline
                    autoPlay
                    muted
                    preload="metadata"
                    className="w-full h-96 object-cover bg-black"
                  />
                </div>
              ))}
            </div>
          </div>

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
            className="font-body w-full sm:w-80 flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-bold border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
            style={{ borderColor: '#ccff3c', color: '#1b2a54', backgroundColor: '#f4ffe6' }}
          >
            <ShoppingBag size={18} />
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            disabled={product.stock === 0}
            className="font-body w-full sm:w-80 flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
            style={{ backgroundColor: '#ccff3c', color: '#1b2a54' }}
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
