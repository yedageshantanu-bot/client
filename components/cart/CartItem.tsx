"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem as CartItemType } from "@/lib/types";
import { getSafeImageUrl } from "@/lib/localAssets";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

export function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="grid grid-cols-[82px_1fr] gap-3 rounded-[8px] border border-brand-border bg-white p-3 sm:grid-cols-[120px_1fr_auto] sm:gap-4">
      <Link
        href={`/product/${item._id}`}
        className="relative aspect-[3/4] overflow-hidden rounded-[8px] bg-beige-soft"
      >
        <Image
          src={getSafeImageUrl(item.image)}
          alt={item.title}
          fill
          sizes="120px"
          className="object-cover"
        />
      </Link>
      <div>
        <Link
          href={`/product/${item._id}`}
          className="block break-words font-semibold leading-6 text-ink hover:text-gold-dark"
        >
          {item.title}
        </Link>
        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="font-semibold text-ink">
            {formatPrice(item.discountPrice)}
          </span>
          <span className="text-sm text-brand-muted line-through">
            {formatPrice(item.price)}
          </span>
        </div>
        <div className="mt-4 flex w-fit items-center rounded-full border border-brand-border">
          <button
            className="grid h-9 w-9 place-items-center text-ink"
            onClick={() => updateQuantity(item._id, item.quantity - 1)}
            aria-label="Decrease quantity"
          >
            <Minus size={15} />
          </button>
          <span className="grid h-9 w-10 place-items-center text-sm font-semibold">
            {item.quantity}
          </span>
          <button
            className="grid h-9 w-9 place-items-center text-ink"
            onClick={() => updateQuantity(item._id, item.quantity + 1)}
            aria-label="Increase quantity"
          >
            <Plus size={15} />
          </button>
        </div>
      </div>
      <div className="col-span-2 flex items-center justify-between sm:col-span-1 sm:block sm:text-right">
        <p className="font-semibold text-ink">
          {formatPrice(item.discountPrice * item.quantity)}
        </p>
        <button
          className="mt-0 inline-flex items-center gap-2 text-sm text-brand-muted transition hover:text-red-700 sm:mt-8"
          onClick={() => removeItem(item._id)}
        >
          <Trash2 size={15} />
          Remove
        </button>
      </div>
    </div>
  );
}
