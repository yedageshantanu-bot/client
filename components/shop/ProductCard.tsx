"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, ShoppingBag, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import type { Product } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";
import { getProductFrontImage, getProductThumbnail } from "@/lib/productMedia";

export function ProductCard({ product }: { product: Product }) {
  const { addProduct } = useCart();
  const { wishlist, toggleWishlist } = useStore();
  const { requireLogin } = useAuth();
  const saved = wishlist.includes(product._id);
  const image = getProductFrontImage(product) || getProductThumbnail(product);
  const href = `/collection/${product.slug || product._id}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-64px" }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.45 }}
      className="group flex h-full flex-col"
    >
      <div className="relative overflow-hidden rounded-lg border border-[rgba(122,0,16,0.12)] bg-[var(--color-ivory-3)] shadow-[0_1.2rem_3rem_rgba(59,42,40,0.08)]">
        <Link href={href} className="block">
          <div className="relative aspect-[3/4] overflow-hidden bg-[var(--color-ivory-2)]">
            <Image
              src={image?.url || "/assets/wedding saree.png"}
              alt={image?.altText || product.title}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover object-center transition duration-700 group-hover:scale-[1.035]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
          </div>
        </Link>

        <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
          {(product.isBestSeller || product.featured) && (
            <span className="rounded-full bg-[#08142E] px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-white shadow-sm">
              Featured
            </span>
          )}
          {Boolean(product.discount) && (
            <span className="w-max rounded-full bg-[#08142E] px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-white shadow-sm">
              {product.discount}% Off
            </span>
          )}
        </div>

        <button
          onClick={() => {
            toggleWishlist(product._id, () => requireLogin("/account#wishlist"));
          }}
          className={cn(
            "absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-[rgba(255,250,243,0.92)] text-[var(--color-maroon)] shadow-sm transition hover:bg-[var(--color-gold)]",
            saved && "bg-[var(--color-gold)]",
          )}
          aria-label="Add to wishlist"
        >
          <Heart size={17} fill={saved ? "currentColor" : "none"} />
        </button>

        <div className="absolute inset-x-2 bottom-2 grid grid-cols-[1fr_auto] gap-2 opacity-100 transition duration-300 md:inset-x-3 md:bottom-3 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
          <button
            onClick={() => addProduct(product)}
            className="flex h-10 min-w-0 items-center justify-center gap-1 rounded-full bg-[var(--color-ivory)] px-2 text-[0.72rem] font-bold text-[var(--color-maroon)] shadow-lg transition hover:bg-[var(--color-gold)] hover:text-[var(--color-brown)] sm:h-11 sm:gap-2 sm:text-sm"
          >
            <ShoppingBag size={16} />
            <span className="truncate">Quick Add</span>
          </button>
          <Link href={href} className="grid h-10 w-10 place-items-center rounded-full bg-[var(--color-brown)] text-[var(--color-ivory)] shadow-lg transition hover:bg-[var(--color-maroon)] sm:h-11 sm:w-11" aria-label="Quick view">
            <Eye size={17} />
          </Link>
        </div>
      </div>

      <div className="mt-3 flex flex-1 flex-col sm:mt-4">
        <div className="flex items-start justify-between gap-3">
          <Link href={href} className="min-h-[3rem] flex-1 overflow-hidden font-display text-lg font-semibold leading-6 text-[var(--color-brown)] transition hover:text-[var(--color-maroon)] sm:text-xl">
            {product.title}
          </Link>
          <span className="flex shrink-0 items-center gap-1 text-xs text-[var(--color-brand-muted)]">
            <Star size={14} fill="#C9A84C" className="text-[var(--color-gold)]" />
            {product.rating ?? 4.8}
          </span>
        </div>
        <p className="mt-1 min-h-8 text-[0.66rem] uppercase tracking-[0.12em] text-[var(--color-brand-muted)] sm:text-xs sm:tracking-[0.14em]">
          {product.fabric || "Silk"} / {product.occasion || "Celebration"}
        </p>
        <div className="mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-1 pt-2">
          <span className="price font-bold text-[var(--color-maroon)]">{formatPrice(product.discountPrice || product.price)}</span>
          {product.discountPrice < product.price && (
            <span className="price text-sm text-[var(--color-brand-muted)] line-through">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
