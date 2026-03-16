import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface FeaturedProduct {
  id: string;
  name: string;
  pieces: string;
  price: number;
  original_price: number;
  image_url: string;
  link: string;
  coupon_code: string;
  sort_order: number;
}

const Products = () => {
  const [products, setProducts] = useState<FeaturedProduct[]>([]);

  useEffect(() => {
    supabase
      .from("homepage_featured")
      .select("id, name, pieces, price, original_price, image_url, link, coupon_code, sort_order")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data) setProducts(data as FeaturedProduct[]);
      });
  }, []);

  return (
    <section id="products" className="bg-peach py-14 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10 md:mb-14">
          <span className="text-coral font-display font-semibold text-sm uppercase tracking-widest">
            Your Faves, Our Hits
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-3">
            Consider these the main characters
          </h2>
          <p className="text-muted-foreground text-lg mt-3">
            Available in three sizes
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product, i) => {
            const discount = product.original_price > product.price
              ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
              : 0;
            return (
            <motion.a
              key={product.id}
              href={product.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group bg-card rounded-3xl overflow-hidden border border-border hover:shadow-xl hover:shadow-secondary/10 transition-all duration-300 block"
            >
              <div className="relative bg-accent p-5 flex items-center justify-center aspect-[4/3] overflow-hidden">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-1/2 h-auto object-contain group-hover:scale-105 transition-transform duration-500"
                />
                {discount > 0 && (
                  <div className="absolute top-4 left-4 bg-coral text-card px-3 py-1 rounded-full text-xs font-bold">
                    -{discount}%
                  </div>
                )}
                {product.coupon_code && (
                  <div className="absolute bottom-3 left-3 right-3 bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-xl text-[11px] font-bold text-center tracking-wide">
                    USE CODE: {product.coupon_code}
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-display font-bold text-foreground text-lg mb-1">
                  {product.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {product.pieces}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-2xl text-coral">
                      ₹{Number(product.price).toLocaleString()}
                    </span>
                    <span className="text-muted-foreground line-through text-sm">
                      ₹{Number(product.original_price).toLocaleString()}
                    </span>
                  </div>
                  <span className="bg-secondary text-secondary-foreground px-5 py-2.5 rounded-full text-sm font-semibold group-hover:opacity-90 transition-opacity">
                    Buy Now
                  </span>
                </div>
              </div>
            </motion.a>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/shop"
            className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-display font-semibold hover:scale-105 transition-transform"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Products;
