"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Heart, MapPin, PackageCheck, UserRound } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";
import { getProfile } from "@/lib/authApi";
import { getProductFrontImage } from "@/lib/productMedia";
import { getSafeImageUrl } from "@/lib/localAssets";
import { formatPrice } from "@/lib/utils";
import type { Address, Order, Product, User } from "@/lib/types";

type ProfileState = {
  user: User;
  orders: Order[];
  addresses: Address[];
};

function AccountContent() {
  const { user, logout } = useAuth();
  const { products, wishlist } = useStore();
  const [profile, setProfile] = useState<ProfileState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        const response = await getProfile();
        if (!active) {
          return;
        }

        setProfile({
          user: response.user,
          orders: response.orders,
          addresses: response.addresses,
        });
      } catch {
        if (active) {
          setProfile(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      active = false;
    };
  }, []);

  const orders = profile?.orders ?? [];
  const addresses = profile?.addresses ?? [];
  const wishlistProducts = useMemo(() => {
    const liveProducts = products.filter((product) => wishlist.includes(product._id));

    if (liveProducts.length > 0) {
      return liveProducts;
    }

    return (profile?.user.wishlist ?? []).filter(
      (item): item is Product => typeof item === "object" && item !== null && "_id" in item,
    );
  }, [products, profile, wishlist]);

  return (
    <div className="container-page py-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-dark">
            Account
          </p>
          <h1 className="mt-2 font-display text-5xl font-semibold text-ink md:text-6xl">
            Hi, {user?.name}
          </h1>
          <p className="mt-2 text-sm text-brand-muted">
            Manage your profile, saved addresses, wishlist, and order history.
          </p>
        </div>
        <div className="flex gap-3">
          {user?.role === "admin" && (
            <Button href="/admin" variant="outline">
              Open admin
            </Button>
          )}
          <Button variant="outline" onClick={() => void logout()}>
            Sign out
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-[8px] border border-brand-border bg-white p-6 text-sm text-brand-muted">
          Loading your profile...
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-8">
            <section id="wishlist" className="scroll-mt-28 rounded-[8px] border border-brand-border bg-white p-5">
              <div className="mb-5 flex items-center gap-2">
                <UserRound size={20} className="text-gold-dark" />
                <h2 className="font-display text-3xl font-semibold text-ink">Profile</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-[120px_1fr] md:items-center">
                <div className="grid h-24 w-24 place-items-center rounded-full bg-ink text-2xl font-semibold text-white">
                  {(profile?.user.name || profile?.user.email || "VA")
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div className="grid gap-2 text-sm text-brand-muted">
                  <p className="font-semibold text-ink">{profile?.user.email}</p>
                  <p>Role: {profile?.user.role || "user"}</p>
                  <p>Google ID: {profile?.user.googleId || "Linked account"}</p>
                  {profile?.user.phone && <p>Phone: {profile.user.phone}</p>}
                </div>
              </div>
            </section>

            <section className="rounded-[8px] border border-brand-border bg-white p-5">
              <div className="mb-5 flex items-center gap-2">
                <PackageCheck size={20} className="text-gold-dark" />
                <h2 className="font-display text-3xl font-semibold text-ink">My orders</h2>
              </div>
              <div className="grid gap-4">
                {orders.length === 0 ? (
                  <p className="rounded-[8px] bg-beige-soft p-5 text-sm text-brand-muted">
                    No orders yet.
                  </p>
                ) : (
                  orders.map((order) => (
                    <div key={order._id} className="rounded-[8px] border border-brand-border p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-ink">{order.orderId}</h3>
                          <p className="text-sm text-brand-muted">
                            {new Date(order.createdAt || order.date).toLocaleString("en-IN")}
                          </p>
                        </div>
                        <Badge tone="default">
                          {order.deliveryStatus}
                        </Badge>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2 text-xs">
                        <Badge
                          tone="default"
                        >
                          Payment {order.paymentStatus}
                        </Badge>
                        <Badge tone="light">{order.paymentMethod}</Badge>
                      </div>
                      {(order.razorpayPaymentId || order.razorpayOrderId) && (
                        <div className="mt-3 grid gap-1 rounded-[8px] bg-beige-soft p-3 text-xs text-brand-muted">
                          {order.razorpayOrderId && <span>Razorpay order: {order.razorpayOrderId}</span>}
                          {order.razorpayPaymentId && <span>Payment ID: {order.razorpayPaymentId}</span>}
                        </div>
                      )}
                      <div className="mt-4 grid gap-3 text-sm text-brand-muted">
                        {order.products.map((product) => (
                          <div
                            key={`${order._id}-${product.productId}`}
                            className="grid grid-cols-[56px_1fr_auto] items-center gap-3 rounded-[8px] bg-beige-soft p-2"
                          >
                            <div className="relative aspect-[3/4] overflow-hidden rounded-[8px] bg-white">
                              <Image
                                src={getSafeImageUrl(
                                  typeof product.image === "string" ? product.image : product.image?.url,
                                )}
                                alt={product.title}
                                fill
                                sizes="56px"
                                className="object-cover"
                              />
                            </div>
                            <span>
                              <span className="block font-semibold text-ink">{product.title}</span>
                              <span className="mt-1 block text-xs">
                                Qty {product.quantity} / {product.size || "Free Size"} / {product.color || "As shown"}
                              </span>
                            </span>
                            <span className="font-semibold text-ink">
                              {formatPrice(product.price * product.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 rounded-[8px] border border-brand-border p-3 text-sm text-brand-muted">
                        <p className="font-semibold text-ink">Delivery to {order.shippingAddress.fullName}</p>
                        <p className="mt-1">
                          {order.shippingAddress.address}
                          {order.shippingAddress.landmark ? `, ${order.shippingAddress.landmark}` : ""},{" "}
                          {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                        </p>
                      </div>
                      <div className="mt-4 flex justify-between border-t border-brand-border pt-3 font-semibold">
                        <span>Total</span>
                        <span>{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          <div className="grid gap-8">
            <section className="rounded-[8px] border border-brand-border bg-beige-soft p-5">
              <div className="mb-5 flex items-center gap-2">
                <MapPin size={20} className="text-gold-dark" />
                <h2 className="font-display text-3xl font-semibold text-ink">Saved addresses</h2>
              </div>
              <div className="grid gap-4">
                {addresses.length === 0 ? (
                  <p className="rounded-[8px] bg-white p-5 text-sm text-brand-muted">
                    No saved addresses yet.
                  </p>
                ) : (
                  addresses.map((address, index) => (
                    <div
                      key={`${address.label || address.fullName}-${index}`}
                      className="rounded-[8px] bg-white p-4 text-sm text-brand-muted"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-ink">{address.label || `Address ${index + 1}`}</p>
                        {address.isDefault && <Badge tone="default">Default</Badge>}
                      </div>
                      <p className="mt-2">{address.fullName}</p>
                      <p>{address.address}</p>
                      <p>
                        {address.city}, {address.state} - {address.pincode}
                      </p>
                      <p>{address.phone}</p>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="rounded-[8px] border border-brand-border bg-white p-5">
              <div className="mb-5 flex items-center gap-2">
                <Heart size={20} className="text-gold-dark" />
                <h2 className="font-display text-3xl font-semibold text-ink">Wishlist</h2>
              </div>
              <div className="grid gap-4">
                {wishlistProducts.length === 0 ? (
                  <p className="rounded-[8px] bg-beige-soft p-5 text-sm text-brand-muted">
                    No saved sarees yet.
                  </p>
                ) : (
                  wishlistProducts.map((product) => (
                    <Link
                      key={product._id}
                      href={`/collection/${product.slug || product._id}`}
                      className="grid grid-cols-[72px_1fr] gap-3 rounded-[8px] border border-brand-border p-3 transition hover:border-gold"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden rounded-[8px] bg-beige-soft">
                        <Image
                          src={getProductFrontImage(product)?.url || "/assets/wedding saree.png"}
                          alt={product.title}
                          fill
                          sizes="72px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-ink">{product.title}</h3>
                        <p className="mt-1 text-sm text-brand-muted">
                          {formatPrice(product.discountPrice)}
                        </p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AccountPage() {
  return (
    <ProtectedRoute nextPath="/account">
      <AccountContent />
    </ProtectedRoute>
  );
}
