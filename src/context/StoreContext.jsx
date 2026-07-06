import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const StoreContext = createContext(null);

const CART_KEY = "alaira.cart.v1";
const WISH_KEY = "alaira.wishlist.v1";
const NOTE_KEY = "alaira.note.v1";

const readLS = (k, fallback) => {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
};

export const StoreProvider = ({ children }) => {
  const [cart, setCart] = useState(() => readLS(CART_KEY, []));
  const [wishlist, setWishlist] = useState(() => readLS(WISH_KEY, []));
  const [note, setNote] = useState(() => readLS(NOTE_KEY, ""));

  useEffect(() => { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem(WISH_KEY, JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem(NOTE_KEY, JSON.stringify(note)); }, [note]);

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
      }
      return [...prev, {
        id: product.id, name: product.name, price: product.price, image: product.image, qty,
      }];
    });
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) return removeFromCart(id);
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, qty } : i));
  };
  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id));
  const clearCart = () => setCart([]);

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) return prev.filter((i) => i.id !== product.id);
      return [...prev, {
        id: product.id, name: product.name, price: product.price, image: product.image,
      }];
    });
  };
  const isWished = (id) => wishlist.some((i) => i.id === id);

  const totals = useMemo(() => {
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const shipping = subtotal === 0 ? 0 : subtotal >= 2500 ? 0 : 99;
    const total = subtotal + shipping;
    const itemCount = cart.reduce((s, i) => s + i.qty, 0);
    return { subtotal, shipping, total, itemCount };
  }, [cart]);

  const value = {
    cart, wishlist, note, setNote,
    addToCart, updateQty, removeFromCart, clearCart,
    toggleWishlist, isWished, totals,
  };
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
};
