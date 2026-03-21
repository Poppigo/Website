import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Grid3X3, List, ChevronDown, ChevronUp, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";
import shopProduct1 from "@/assets/shop-product-1.png";
import shopProduct2 from "@/assets/shop-product-2.jpg";
import shopProduct3 from "@/assets/shop-product-3.png";
import productSM from "@/assets/product-sm.png";

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
  image_url: string | null;
  category: string | null;
  sizes: string[] | null;
  size_images: Record<string, string> | null;
  stock: number | null;
  enable_packs: boolean | null;
  pack_links: Record<string, string> | null;
}

// Size filter options are derived dynamically from products

const Shop = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("default");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [priceFilter, setPriceFilter] = useState<[number, number]>([0, 0]);
  const [discountOpen, setDiscountOpen] = useState(true);
  const [minDiscount, setMinDiscount] = useState<number | null>(null);
  const [ratings, setRatings] = useState<Record<string, { avg: number; count: number }>>({});
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: true });

      if (data) {
        setProducts(data as Product[]);
        const qtyMap: Record<string, number> = {};
        data.forEach((p: any) => { qtyMap[p.id] = 1; });
        setQuantities(qtyMap);
        const prices = data.map((p: any) => p.price);
        const min = Math.floor(Math.min(...prices));
        const max = Math.ceil(Math.max(...prices));
        setPriceRange([min, max]);
        setPriceFilter([min, max]);
      }
      if (error) console.error("Error fetching products:", error);
      setLoading(false);
    };
    const fetchRatings = async () => {
      const { data } = await supabase.from("reviews").select("product_id, rating");
      if (data) {
        const map: Record<string, { sum: number; count: number }> = {};
        (data as any[]).forEach((r) => {
          if (!map[r.product_id]) map[r.product_id] = { sum: 0, count: 0 };
          map[r.product_id].sum += r.rating;
          map[r.product_id].count += 1;
        });
        const result: Record<string, { avg: number; count: number }> = {};
        for (const [pid, v] of Object.entries(map)) {
          result[pid] = { avg: v.sum / v.count, count: v.count };
        }
        setRatings(result);
      }
    };
    fetchProducts();
    fetchRatings();
  }, []);

  const updateQty = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta),
    }));
  };

  // Derive unique sizes from products
  const allSizes = Array.from(
    new Set(products.flatMap((p) => p.sizes ?? []))
  ).sort();

  const getDiscount = (p: Product) =>
    p.original_price && p.original_price > p.price
      ? Math.round(((p.original_price - p.price) / p.original_price) * 100)
      : 0;

  const discountBuckets = [10, 20, 30, 50] as const;

  const filteredProducts = products.filter((p) => {
    if (selectedSize && !p.sizes?.includes(selectedSize)) return false;
    if (p.price < priceFilter[0] || p.price > priceFilter[1]) return false;
    if (minDiscount !== null && getDiscount(p) < minDiscount) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "latest") return new Date(b.id).getTime() - new Date(a.id).getTime();
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#f7fbed] overflow-x-hidden">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Shop Header */}
          <div className="text-center mb-12">
            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mt-2">
              Shop the Stash
            </h1>
            <p className="text-foreground/60 text-2xl md:text-3xl font-body max-w-4xl mx-auto mt-3 leading-relaxed md:whitespace-nowrap">
              Period care built for your life. Find your perfect fit.
            </p>
          </div>

          <div className="flex flex-col gap-10">
            {/* Products Grid */}
            <div className="w-full">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-8">
                <p className="text-foreground/50 text-base">
                  {loading ? "Loading..." : `Showing ${filteredProducts.length} of ${products.length} results`}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setLayout("grid")}
                      className={`p-1.5 rounded ${layout === "grid" ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      <Grid3X3 size={18} />
                    </button>
                    <button
                      onClick={() => setLayout("list")}
                      className={`p-1.5 rounded ${layout === "list" ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      <List size={18} />
                    </button>
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground font-medium max-w-[170px] sm:max-w-none"
                  >
                    <option value="default">Default sorting</option>
                    <option value="latest">Sort by latest</option>
                    <option value="price-low">Sort by price: low to high</option>
                    <option value="price-high">Sort by price: high to low</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center min-h-[300px]">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div
                  className={
                    layout === "grid"
                      ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
                      : "flex flex-col gap-6"
                  }
                >
                  {sortedProducts.map((product, i) => {
                    const image = getProductImage(product);
                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.08 }}
                        className={`group bg-white rounded-2xl overflow-hidden border border-foreground/10 hover:shadow-lg hover:shadow-lime/10 transition-all duration-300 ${
                          layout === "list" ? "flex flex-row" : ""
                        }`}
                      >
                        <Link
                          to={`/product/${product.id}`}
                          className={`relative bg-[#fafff0] flex items-center justify-center overflow-hidden ${
                            layout === "list" ? "w-48 shrink-0" : "aspect-square"
                          }`}
                        >
                          <img
                            src={image}
                            alt={product.name}
                            className="w-3/4 h-auto object-contain group-hover:scale-105 transition-transform duration-500"
                          />
                          {product.original_price && product.original_price > product.price && (
                            <div className="absolute top-3 left-3 bg-lime text-foreground px-2.5 py-1 rounded-full text-sm font-bold">
                              Save {Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                            </div>
                          )}
                        </Link>
                        <div className="p-3 sm:p-5 flex flex-col justify-between flex-1">
                          <div>
                            <Link to={`/product/${product.id}`}>
                              <h3 className="font-body font-bold text-foreground text-sm sm:text-lg leading-snug mb-1 sm:mb-2 line-clamp-2 hover:text-[#4241ff] transition-colors">
                                {product.name}
                              </h3>
                            </Link>
                            <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                              <span className="font-body font-bold text-base sm:text-xl text-foreground">
                                ₹{Number(product.price).toFixed(2)}
                              </span>
                              {product.original_price && product.original_price > product.price && (
                                <span className="text-base text-muted-foreground line-through">
                                  ₹{Number(product.original_price).toFixed(2)}
                                </span>
                              )}
                            </div>
                            {ratings[product.id] && (
                              <div className="flex items-center gap-1.5 mb-2">
                                <div className="flex gap-0.5">
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                      key={s}
                                      size={12}
                                      className={s <= Math.round(ratings[product.id].avg) ? "fill-amber-400 text-amber-400" : "text-border"}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-muted-foreground">({ratings[product.id].count})</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 border border-border rounded-lg overflow-hidden">
                              <button
                                onClick={() => updateQty(product.id, -1)}
                                className="px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-muted-foreground hover:text-foreground text-sm sm:text-base"
                              >
                                −
                              </button>
                              <span className="px-1.5 sm:px-3 py-1 sm:py-1.5 text-sm sm:text-base font-medium text-foreground min-w-[1.5rem] sm:min-w-[2rem] text-center">
                                {quantities[product.id] || 1}
                              </span>
                              <button
                                onClick={() => updateQty(product.id, 1)}
                                className="px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-muted-foreground hover:text-foreground text-sm sm:text-base"
                              >
                                +
                              </button>
                            </div>
                              <button
                              onClick={() => {
                                if (product.sizes && product.sizes.length > 1) {
                                  navigate(`/product/${product.id}`);
                                  return;
                                }
                                addToCart(
                                  { id: product.id as any, name: product.name, price: product.price, image, size: product.sizes?.[0] || undefined },
                                  quantities[product.id] || 1
                                );
                                toast.success(`${product.name} added to cart!`);
                              }}
                              className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-lime text-foreground flex items-center justify-center hover:shadow-md hover:shadow-lime/30 transition-all"
                            >
                              <ShoppingCart size={18} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Shop;
