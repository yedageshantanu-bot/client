"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import toast from "react-hot-toast";
import type { AppliedCoupon, CartItem, Product } from "@/lib/types";
import { getProductFrontImage } from "@/lib/productMedia";
import { useAuth } from "@/context/AuthContext";

type CartState = {
  items: CartItem[];
  coupon: AppliedCoupon | null;
};

type CartAction =
  | { type: "HYDRATE"; payload: CartState }
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QTY"; payload: { id: string; qty: number } }
  | { type: "APPLY_COUPON"; payload: AppliedCoupon }
  | { type: "REMOVE_COUPON" }
  | { type: "CLEAR_CART" };

type CartContextValue = CartState & {
  addProduct: (product: Product) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;
  clearCart: () => void;
  subtotal: number;
  discount: number;
  total: number;
  itemCount: number;
};

const cartStorageKey = (user?: { _id?: string; email?: string } | null) =>
  `vastraaura_cart:${user?._id || user?.email || "guest"}`;

const initialState: CartState = {
  items: [],
  coupon: null,
};

const CartContext = createContext<CartContextValue | null>(null);

const getStoredCart = (storageKey: string) => {
  if (typeof window === "undefined") {
    return initialState;
  }

  const saved = window.localStorage.getItem(storageKey);
  return saved ? (JSON.parse(saved) as CartState) : initialState;
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return action.payload;
    case "ADD_ITEM": {
      const exists = state.items.find((item) => item._id === action.payload._id);

      if (exists) {
        return {
          ...state,
          items: state.items.map((item) =>
            item._id === action.payload._id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        };
      }

      return { ...state, items: [...state.items, action.payload] };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        coupon: null,
        items: state.items.filter((item) => item._id !== action.payload),
      };
    case "UPDATE_QTY":
      return {
        ...state,
        coupon: null,
        items: state.items.map((item) =>
          item._id === action.payload.id
            ? { ...item, quantity: Math.max(1, action.payload.qty) }
            : item,
        ),
      };
    case "APPLY_COUPON":
      return { ...state, coupon: action.payload };
    case "REMOVE_COUPON":
      return { ...state, coupon: null };
    case "CLEAR_CART":
      return initialState;
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, status } = useAuth();
  const storageKey = cartStorageKey(status === "authenticated" ? user : null);
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [hydratedKey, setHydratedKey] = useState<string | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      dispatch({ type: "HYDRATE", payload: getStoredCart(storageKey) });
      setHydratedKey(storageKey);
    });
  }, [storageKey]);

  useEffect(() => {
    if (hydratedKey !== storageKey) {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [hydratedKey, state, storageKey]);

  const addProduct = useCallback((product: Product) => {
    const frontImage = getProductFrontImage(product);
    const variant = product.selectedVariant;
    const lineId = variant ? `${product._id}:${variant.sku || variant.colorName}` : product._id;

    dispatch({
      type: "ADD_ITEM",
      payload: {
        _id: lineId,
        title: product.title,
        price: product.price,
        discountPrice: product.discountPrice || product.price,
        image: frontImage?.url || "",
        quantity: 1,
        color: variant?.colorName || product.color,
      },
    });
    toast.success("Added to cart");
  }, []);

  const removeItem = useCallback((id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  }, []);

  const updateQuantity = useCallback((id: string, qty: number) => {
    dispatch({ type: "UPDATE_QTY", payload: { id, qty } });
  }, []);

  const applyCoupon = useCallback((coupon: AppliedCoupon) => {
    dispatch({ type: "APPLY_COUPON", payload: coupon });
  }, []);

  const removeCoupon = useCallback(() => {
    dispatch({ type: "REMOVE_COUPON" });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const subtotal = useMemo(
    () =>
      state.items.reduce(
        (sum, item) => sum + item.discountPrice * item.quantity,
        0,
      ),
    [state.items],
  );
  const discount = state.coupon ? Math.min(state.coupon.amount, subtotal) : 0;
  const total = Math.max(subtotal - discount, 0);
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const value = useMemo(
    () => ({
      ...state,
      addProduct,
      removeItem,
      updateQuantity,
      applyCoupon,
      removeCoupon,
      clearCart,
      subtotal,
      discount,
      total,
      itemCount,
    }),
    [
      addProduct,
      clearCart,
      discount,
      itemCount,
      removeCoupon,
      removeItem,
      state,
      subtotal,
      total,
      updateQuantity,
      applyCoupon,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
};
