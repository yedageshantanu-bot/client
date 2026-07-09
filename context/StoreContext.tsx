"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";
import {
  mockCoupons,
  mockCustomers,
  mockOrders,
  mockProducts,
  mockReviews,
} from "@/lib/mockData";
import {
  createProduct as apiCreateProduct,
  deleteProduct as apiDeleteProduct,
  loadProducts as apiLoadProducts,
  updateProduct as apiUpdateProduct,
} from "@/lib/productApi";
import {
  createCoupon as apiCreateCoupon,
  deleteCoupon as apiDeleteCoupon,
  loadCoupons as apiLoadCoupons,
  updateCoupon as apiUpdateCoupon,
} from "@/lib/couponApi";
import {
  getAllOrders as apiGetAllOrders,
  getUsers as apiGetUsers,
  toggleWishlist as apiToggleWishlist,
  getProfile as apiGetProfile,
  updateOrderDeliveryStatus as apiUpdateOrderDeliveryStatus,
} from "@/lib/authApi";
import { getReviewCount, normalizeProduct } from "@/lib/productMedia";
import { isStrictAdmin } from "@/lib/authRules";
import { useAuth } from "@/context/AuthContext";
import type {
  Address,
  CartItem,
  Coupon,
  Customer,
  Order,
  Product,
  Review,
  User,
} from "@/lib/types";

type StoreContextValue = {
  products: Product[];
  coupons: Coupon[];
  orders: Order[];
  customers: Customer[];
  reviews: Review[];
  wishlist: string[];
  addProduct: (product: Partial<Product>) => Promise<Product>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  addCoupon: (coupon: Omit<Coupon, "_id" | "usedCount" | "usedBy">) => Promise<Coupon>;
  updateCoupon: (id: string, coupon: Partial<Coupon>) => Promise<Coupon>;
  deleteCoupon: (id: string) => Promise<void>;
  toggleCoupon: (id: string) => Promise<void>;
  updateOrderStatus: (id: string, status: Order["deliveryStatus"]) => void;
  placeOrder: (payload: {
    user: User;
    items: CartItem[];
    address: Address;
    subtotal: number;
    couponCode?: string;
    couponDiscount: number;
    total: number;
    paymentMethod: Order["paymentMethod"];
  }) => Promise<Order>;
  toggleWishlist: (productId: string, requireLogin?: () => void) => void;
  addReview: (review: Omit<Review, "_id" | "date">) => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);
const DATA_VERSION = "pastels-and-couple-gifts-2026-07-05-v1";
const wishlistStorageKey = (user?: Pick<User, "_id" | "email"> | null) =>
  `vastraaura_wishlist:${user?._id || user?.email || "guest"}`;

const readLocal = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") {
    return fallback;
  }

  if (window.localStorage.getItem("vastraaura_data_version") !== DATA_VERSION) {
    return fallback;
  }

  const saved = window.localStorage.getItem(key);
  return saved ? (JSON.parse(saved) as T) : fallback;
};

const writeLocal = <T,>(key: string, value: T) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

const normalizeOrder = (order: Order): Order => ({
  ...order,
  customer:
    order.customer ||
    order.shippingAddress?.fullName ||
    (order as Order & { customerInfo?: { name?: string } }).customerInfo?.name ||
    "Customer",
  phone:
    order.phone ||
    order.shippingAddress?.phone ||
    (order as Order & { customerInfo?: { phone?: string } }).customerInfo?.phone ||
    "",
  userEmail:
    order.userEmail ||
    (order as Order & { customerInfo?: { email?: string } }).customerInfo?.email ||
    "",
  date: order.date || order.createdAt || new Date().toISOString(),
});

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { user, status } = useAuth();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [localHydrated, setLocalHydrated] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setProducts(readLocal("vastraaura_products", mockProducts));
      setCoupons(readLocal("vastraaura_coupons", mockCoupons));
      setOrders(readLocal("vastraaura_orders", mockOrders));
      setCustomers(readLocal("vastraaura_customers", mockCustomers));
      setReviews(readLocal("vastraaura_reviews", mockReviews));
      setLocalHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!localHydrated) {
      return;
    }

    queueMicrotask(() => {
      setWishlist(readLocal(wishlistStorageKey(user), []));
    });
  }, [localHydrated, user]);

  useEffect(() => {
    let active = true;

    const hydrateProducts = async () => {
      try {
        const remoteProducts = await apiLoadProducts();

        if (!active) {
          return;
        }

        if (remoteProducts.length > 0) {
          setProducts(remoteProducts.map((product) => normalizeProduct(product)));
          return;
        }

        setProducts(mockProducts.map((product) => normalizeProduct(product)));
      } catch {
        if (active) {
          setProducts(mockProducts.map((product) => normalizeProduct(product)));
        }
      }
    };

    hydrateProducts();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const hydrateCoupons = async () => {
      try {
        const remoteCoupons = await apiLoadCoupons();
        if (active) {
          setCoupons(remoteCoupons);
        }
      } catch {
        if (active) {
          setCoupons(mockCoupons);
        }
      }
    };

    hydrateCoupons();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const syncAuthData = async () => {
      if (status !== "authenticated" || !user) {
        return;
      }

      try {
        const profile = await apiGetProfile();
        if (!active) {
          return;
        }

        const wishlistIds = Array.isArray(profile.user.wishlist)
          ? profile.user.wishlist
              .map((item: unknown) => {
                if (!item) {
                  return null;
                }

                if (typeof item === "string") {
                  return item;
                }

                if (typeof item === "object" && "_id" in item) {
                  return String((item as { _id?: string })._id || "");
                }

                return null;
              })
              .filter(Boolean)
          : [];

        // Guest wishlist items merging on authentication
        const guestWishlistKey = "vastraaura_wishlist:guest";
        const guestWishlist = readLocal<string[]>(guestWishlistKey, []);
        let finalWishlist = [...wishlistIds];

        if (guestWishlist.length > 0) {
          const newItems = guestWishlist.filter((id) => !wishlistIds.includes(id));
          if (newItems.length > 0) {
            finalWishlist = [...wishlistIds, ...newItems];
            for (const productId of newItems) {
              try {
                await apiToggleWishlist(productId);
              } catch (e) {
                console.error("Failed to sync guest wishlist item to database:", productId, e);
              }
            }
          }
          if (typeof window !== "undefined") {
            window.localStorage.removeItem(guestWishlistKey);
          }
        }

        setWishlist(finalWishlist as string[]);

        if (isStrictAdmin(user)) {
          const [orderResponse, userResponse] = await Promise.all([
            apiGetAllOrders(),
            apiGetUsers(),
          ]);
          if (active) {
            const adminOrders = orderResponse.orders.map(normalizeOrder);
            setOrders(adminOrders);
            setCustomers(
              userResponse.users.map((customer) => {
                const customerOrders = adminOrders.filter(
                  (order) => order.userEmail === customer.email,
                );

                return {
                  _id: customer._id || customer.email,
                  name: customer.name,
                  email: customer.email,
                  phone: customer.phone || "",
                  totalOrders: customerOrders.length,
                  totalSpending: customerOrders.reduce((sum, order) => sum + order.total, 0),
                  lastOrder: customerOrders[0]?.date || customer.createdAt || "",
                };
              }),
            );
          }
        } else {
          setOrders(profile.orders.map(normalizeOrder));
        }
      } catch {
        if (active) {
          setWishlist([]);
        }
      }
    };

    void syncAuthData();

    return () => {
      active = false;
    };
  }, [status, user]);

  useEffect(() => {
    if (!localHydrated) {
      return;
    }

    window.localStorage.setItem("vastraaura_data_version", DATA_VERSION);
    writeLocal("vastraaura_products", products);
    writeLocal("vastraaura_coupons", coupons);
    writeLocal("vastraaura_orders", orders);
    writeLocal("vastraaura_customers", customers);
    writeLocal("vastraaura_reviews", reviews);
    writeLocal(wishlistStorageKey(user), wishlist);
  }, [coupons, customers, localHydrated, orders, products, reviews, user, wishlist]);

  const addProduct = useCallback(async (product: Partial<Product>) => {
    const created = normalizeProduct(await apiCreateProduct(product));
    setProducts((items) => [created, ...items]);
    toast.success("Product created");
    return created;
  }, []);

  const updateProduct = useCallback(async (id: string, product: Partial<Product>) => {
    const updated = normalizeProduct(await apiUpdateProduct(id, product));
    setProducts((items) =>
      items.map((item) => (item._id === id ? updated : item)),
    );
    toast.success("Product updated");
    return updated;
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      await apiDeleteProduct(id);
      setProducts((items) => items.filter((item) => item._id !== id));
      toast.success("Product deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete product");
      throw error;
    }
  }, []);

  const addCoupon = useCallback(
    async (coupon: Omit<Coupon, "_id" | "usedCount" | "usedBy">) => {
      try {
        const created = await apiCreateCoupon({
          ...coupon,
          code: coupon.code.toUpperCase(),
        });
        setCoupons((items) => [created, ...items.filter((item) => item._id !== created._id)]);
        toast.success("Coupon created");
        return created;
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to create coupon");
        throw error;
      }
    },
    [],
  );

  const updateCoupon = useCallback(async (id: string, coupon: Partial<Coupon>) => {
    try {
      const updated = await apiUpdateCoupon(id, {
        ...coupon,
        code: coupon.code ? coupon.code.toUpperCase() : undefined,
      });
      setCoupons((items) => items.map((item) => (item._id === id ? updated : item)));
      toast.success("Coupon updated");
      return updated;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update coupon");
      throw error;
    }
  }, []);

  const deleteCoupon = useCallback(async (id: string) => {
    try {
      await apiDeleteCoupon(id);
      setCoupons((items) => items.filter((item) => item._id !== id));
      toast.success("Coupon deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete coupon");
      throw error;
    }
  }, []);

  const toggleCoupon = useCallback(
    async (id: string) => {
      const coupon = coupons.find((item) => item._id === id);
      if (!coupon) {
        return;
      }

      try {
        const updated = await apiUpdateCoupon(id, { isActive: !coupon.isActive });
        setCoupons((items) => items.map((item) => (item._id === id ? updated : item)));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to update coupon");
        throw error;
      }
    },
    [coupons],
  );

  const updateOrderStatus = useCallback(
    (id: string, status: Order["deliveryStatus"]) => {
      setOrders((items) =>
        items.map((item) =>
          item._id === id ? { ...item, deliveryStatus: status } : item,
        ),
      );
      void apiUpdateOrderDeliveryStatus(id, status).catch(() => {
        toast.error("Could not sync delivery status");
      });
      toast.success("Delivery status updated");
    },
    [],
  );

  const placeOrder = useCallback(
    (_payload: {
      user: User;
      items: CartItem[];
      address: Address;
      subtotal: number;
      couponCode?: string;
      couponDiscount: number;
      total: number;
      paymentMethod: Order["paymentMethod"];
    }) => {
      void _payload;
      throw new Error("Orders can only be created after successful Razorpay verification.");
    },
    [],
  );

  const toggleWishlist = useCallback(
    (productId: string, requireLogin?: () => void) => {
      if (!user && requireLogin) {
        requireLogin();
        return;
      }

      setWishlist((items) => {
        const nextWishlist = items.includes(productId)
          ? items.filter((item) => item !== productId)
          : [...items, productId];

        if (status === "authenticated") {
          void apiToggleWishlist(productId)
            .then((response) => {
              const syncedWishlist = Array.isArray(response.user.wishlist)
                ? response.user.wishlist
                    .map((item: unknown) => {
                      if (typeof item === "string") {
                        return item;
                      }

                      if (item && typeof item === "object" && "_id" in item) {
                        return String((item as { _id?: string })._id || "");
                      }

                      return null;
                    })
                    .filter(Boolean)
                : null;

              if (syncedWishlist) {
                setWishlist(syncedWishlist as string[]);
              }
            })
            .catch(() => {
              // Keep the optimistic local save silent if the network/backend is slow.
            });
        }

        return nextWishlist;
      });
    },
    [status, user],
  );

  const addReview = useCallback((review: Omit<Review, "_id" | "date">) => {
    const nextReview: Review = {
      ...review,
      _id: `r${Date.now()}`,
      date: new Date().toISOString(),
    };

    setReviews((items) => [nextReview, ...items]);
    setProducts((items) =>
      items.map((product) => {
        if (product._id !== review.productId) {
          return product;
        }

          const currentRating = product.rating ?? product.ratings?.average ?? 0;
          const currentCount = getReviewCount(product);
          const totalRating = currentRating * currentCount + review.rating;
          const nextCount = currentCount + 1;

        return {
          ...product,
          rating: Number((totalRating / nextCount).toFixed(1)),
          reviews: nextCount,
        };
      }),
    );
    toast.success("Review added");
  }, []);

  const value = useMemo(
    () => ({
      products,
      coupons,
      orders,
      customers,
      reviews,
      wishlist,
      addProduct,
      updateProduct,
      deleteProduct,
      addCoupon,
      updateCoupon,
      deleteCoupon,
      toggleCoupon,
      updateOrderStatus,
      placeOrder,
      toggleWishlist,
      addReview,
    }),
    [
      addReview,
      addCoupon,
      addProduct,
      coupons,
      customers,
      deleteCoupon,
      deleteProduct,
      orders,
      placeOrder,
      products,
      reviews,
      toggleCoupon,
      toggleWishlist,
      updateCoupon,
      updateOrderStatus,
      updateProduct,
      wishlist,
    ],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export const useStore = () => {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error("useStore must be used inside StoreProvider");
  }

  return context;
};
