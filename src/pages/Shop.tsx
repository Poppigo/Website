import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Grid3X3, List, ChevronDown, ChevronUp, Star } from "lucide-react";
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
  stock: number | null;
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
    <div className="min-h-screen bg-peach">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-10">
            Shop
          </h1>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar Filters */}
            <aside className="lg:w-64 shrink-0">
              <div className="mb-8">
                <button
                  onClick={() => setCategoryOpen(!categoryOpen)}
                  className="flex items-center justify-between w-full font-display font-bold text-foreground text-lg mb-4"
                >
                  Filter By Size
                  {categoryOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {categoryOpen && (
                  <ul className="space-y-2">
                    <li
                      onClick={() => setSelectedSize(null)}
                      className={`flex items-center justify-between cursor-pointer transition-colors text-sm ${!selectedSize ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      <span>All Sizes</span>
                      <span className="text-muted-foreground/60">({products.length})</span>
                    </li>
                    {allSizes.map((size) => {
                      const count = products.filter((p) => p.sizes?.includes(size)).length;
                      return (
                        <li
                          key={size}
                          onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                          className={`flex items-center justify-between cursor-pointer transition-colors text-sm ${selectedSize === size ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}
                        >
                          <span>{size}</span>
                          <span className="text-muted-foreground/60">({count})</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div>
                <button
                  onClick={() => setPriceOpen(!priceOpen)}
                  className="flex items-center justify-between w-full font-display font-bold text-foreground text-lg mb-4"
                >
                  Filter By Price
                  {priceOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {priceOpen && (
                  <div className="space-y-3">
                    <input
                      type="range"
                      min={priceRange[0]}
                      max={priceRange[1]}
                      value={priceFilter[0]}
                      onChange={(e) => setPriceFilter([Number(e.target.value), priceFilter[1]])}
                      className="w-full accent-coral"
                    />
                    <input
                      type="range"
                      min={priceRange[0]}
                      max={priceRange[1]}
                      value={priceFilter[1]}
                      onChange={(e) => setPriceFilter([priceFilter[0], Number(e.target.value)])}
                      className="w-full accent-coral"
                    />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>₹{priceFilter[0]} – ₹{priceFilter[1]}</span>
                      <button
                        onClick={() => setPriceFilter(priceRange)}
                        className="text-secondary-foreground bg-secondary px-3 py-1 rounded text-xs font-semibold"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8">
                <button
                  onClick={() => setDiscountOpen(!discountOpen)}
                  className="flex items-center justify-between w-full font-display font-bold text-foreground text-lg mb-4"
                >
                  Filter By Discount
                  {discountOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {discountOpen && (
                  <ul className="space-y-2">
                    <li
                      onClick={() => setMinDiscount(null)}
                      className={`cursor-pointer transition-colors text-sm ${minDiscount === null ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      All
                    </li>
                    {discountBuckets.map((d) => {
                      const count = products.filter((p) => getDiscount(p) >= d).length;
                      return (
                        <li
                          key={d}
                          onClick={() => setMinDiscount(minDiscount === d ? null : d)}
                          className={`flex items-center justify-between cursor-pointer transition-colors text-sm ${minDiscount === d ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}
                        >
                          <span>{d}% & above</span>
                          <span className="text-muted-foreground/60">({count})</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-8">
                <p className="text-muted-foreground text-sm">
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
                    className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground font-medium"
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
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
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
                        className={`group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-shadow ${
                          layout === "list" ? "flex flex-row" : ""
                        }`}
                      >
                        <Link
                          to={`/product/${product.id}`}
                          className={`relative bg-accent flex items-center justify-center overflow-hidden ${
                            layout === "list" ? "w-48 shrink-0" : "aspect-square"
                          }`}
                        >
                          <img
                            src={image}
                            alt={product.name}
                            className="w-3/4 h-auto object-contain group-hover:scale-105 transition-transform duration-500"
                          />
                          {product.original_price && product.original_price > product.price && (
                            <div className="absolute top-3 left-3 bg-coral text-card px-2.5 py-1 rounded-full text-xs font-bold">
                              -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                            </div>
                          )}
                        </Link>
                        <div className="p-5 flex flex-col justify-between flex-1">
                          <div>
                            <Link to={`/product/${product.id}`}>
                              <h3 className="font-display font-bold text-foreground text-base leading-snug mb-2 line-clamp-2 hover:text-coral transition-colors">
                                {product.name}
                              </h3>
                            </Link>
                            <div className="flex items-center gap-2 mb-3">
                              <span className="font-display font-bold text-xl text-coral">
                                ₹{Number(product.price).toFixed(2)}
                              </span>
                              {product.original_price && product.original_price > product.price && (
                                <span className="text-sm text-muted-foreground line-through">
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
                                <span className="text-xs text-muted-foreground">({ratings[product.id].count})</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 border border-border rounded-lg overflow-hidden">
                              <button
                                onClick={() => updateQty(product.id, -1)}
                                className="px-2.5 py-1.5 text-muted-foreground hover:text-foreground text-sm"
                              >
                                −
                              </button>
                              <span className="px-3 py-1.5 text-sm font-medium text-foreground min-w-[2rem] text-center">
                                {quantities[product.id] || 1}
                              </span>
                              <button
                                onClick={() => updateQty(product.id, 1)}
                                className="px-2.5 py-1.5 text-muted-foreground hover:text-foreground text-sm"
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
                              className="w-9 h-9 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center hover:opacity-80 transition-opacity"
                            >
                              <Plus size={18} />
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
