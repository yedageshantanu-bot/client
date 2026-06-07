"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { CartItem } from "@/components/cart/CartItem";
import { CouponInput } from "@/components/cart/CouponInput";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, subtotal, discount, total } = useCart();
  const { status, requireLogin } = useAuth();

  if (items.length === 0) {
    return (
      <div className="container-page py-28 text-center sm:py-32">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-beige-soft text-ink">
          <ShoppingBag size={26} />
        </div>
        <h1 className="mt-5 font-display text-4xl font-semibold text-ink sm:text-5xl">
          Your cart is empty
        </h1>
        <p className="mt-3 text-brand-muted">
          Explore the latest sarees and add your favorites.
        </p>
        <Button className="mt-7" href="/collection">
          Start shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="container-page py-24 sm:py-28">
      <div className="mb-8 flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-dark">
          Cart
        </p>
        <h1 className="font-display text-4xl font-semibold text-ink sm:text-5xl md:text-6xl">
          Shopping bag
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="grid gap-4">
          {items.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}
        </div>

        <aside className="h-fit rounded-[8px] border border-brand-border bg-beige-soft p-5 lg:sticky lg:top-24">
          <h2 className="font-display text-3xl font-semibold text-ink">
            Order summary
          </h2>
          <div className="mt-5">
            <CouponInput />
          </div>
          <div className="mt-6 grid gap-3 border-t border-brand-border pt-5 text-sm">
            <div className="flex justify-between">
              <span className="text-brand-muted">Subtotal</span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Coupon discount</span>
              <span className="font-semibold text-emerald-700">
                -{formatPrice(discount)}
              </span>
            </div>
            <div className="flex justify-between border-t border-brand-border pt-4 text-base">
              <span className="font-semibold text-ink">Total</span>
              <span className="font-semibold text-ink">{formatPrice(total)}</span>
            </div>
          </div>
          <Button
            className="mt-6 w-full"
            href={status === "authenticated" ? "/checkout" : undefined}
            onClick={status === "authenticated" ? undefined : () => requireLogin("/checkout")}
          >
            Checkout
            <ArrowRight size={17} />
          </Button>
          <Link
            href="/collection"
            className="mt-4 block text-center text-sm font-semibold text-brand-muted hover:text-ink"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
