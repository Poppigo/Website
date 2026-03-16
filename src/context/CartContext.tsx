import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
  id: number | string;
  name: string;
  price: number;
  image: string;
  size?: string;
  quantity: number;
}

const CART_STORAGE_KEY = "poppigo_cart";

// Unique key for cart deduplication: same product + same size = same line item
const cartKey = (id: number | string, size?: string) => `${id}__${size || ""}`;

const loadCart = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveCart = (items: CartItem[]) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // storage full or unavailable
  }
};

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (id: number | string, size?: string) => void;
  updateQuantity: (id: number | string, quantity: number, size?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  // Persist to localStorage on every change
  useEffect(() => {
    saveCart(items);
  }, [items]);

  const addToCart = (item: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => cartKey(i.id, i.size) === cartKey(item.id, item.size));
      if (existing) {
        return prev.map((i) =>
          cartKey(i.id, i.size) === cartKey(item.id, item.size)
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const removeFromCart = (id: number | string, size?: string) => {
    setItems((prev) => prev.filter((i) => cartKey(i.id, i.size) !== cartKey(id, size)));
  };

  const updateQuantity = (id: number | string, quantity: number, size?: string) => {
    if (quantity < 1) {
      removeFromCart(id, size);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (cartKey(i.id, i.size) === cartKey(id, size) ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
