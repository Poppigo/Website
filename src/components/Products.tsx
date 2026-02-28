import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import productSM from "@/assets/product-sm.png";
import productLXL from "@/assets/product-lxl.jpg";
import productPack from "@/assets/product-pack-1.png";

const products = [
  {
    name: "Ultra-Slim Disposable Period Panty (S-M)",
    pieces: "6 PCs",
    price: "₹339",
    originalPrice: "₹399",
    discount: "-15%",
    image: productSM,
    link: "https://www.amazon.in/dp/B0FHWT4FJS?th=1&psc=1",
  },
  {
    name: "Ultra-Slim Period Panty (L-XL)",
    pieces: "6 PCs",
    price: "₹339",
    originalPrice: "₹459",
    discount: "-26%",
    image: productLXL,
    link: "https://www.amazon.in/dp/B0FJ1VKSM6?th=1&psc=1",
  },
  {
    name: "Ultra-Slim Period Panty (2XL-3XL)",
    pieces: "6 PCs",
    price: "₹399",
    originalPrice: "₹469",
    discount: "-25%",
    image: productPack,
    link: "https://www.amazon.in/dp/B0FJ1YZQQ2?th=1&psc=1",
  },
];

const Products = () => {
  return (
    <section id="products" className="bg-peach py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, i) => (
            <motion.a
              key={product.name}
              href={product.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group bg-card rounded-3xl overflow-hidden border border-border hover:shadow-xl hover:shadow-secondary/10 transition-all duration-300 block"
            >
              <div className="relative bg-accent p-8 flex items-center justify-center aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-3/4 h-auto object-contain group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-coral text-card px-3 py-1 rounded-full text-xs font-bold">
                  {product.discount}
                </div>
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
                      {product.price}
                    </span>
                    <span className="text-muted-foreground line-through text-sm">
                      {product.originalPrice}
                    </span>
                  </div>
                  <span className="bg-secondary text-secondary-foreground px-5 py-2.5 rounded-full text-sm font-semibold group-hover:opacity-90 transition-opacity">
                    Buy Now
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
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
