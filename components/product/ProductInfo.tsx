"use client";

import Image from "next/image";
import {
  Heart,
  MessageSquareText,
  ShoppingBag,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import type { Product, ProductVariant } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getAverageRating, getReviewCount } from "@/lib/productMedia";
import { ProductAccordions } from "./ProductAccordions";

export function ProductInfo({
  product,
  baseProduct,
  selectedVariant,
  onVariantChange,
}: {
  product: Product;
  baseProduct?: Product;
  selectedVariant?: ProductVariant | null;
  onVariantChange?: (variant: ProductVariant) => void;
}) {
  const router = useRouter();
  const { addProduct } = useCart();
  const { wishlist, toggleWishlist } = useStore();
  const { requireLogin } = useAuth();
  const sourceProduct = baseProduct || product;
  const variants = sourceProduct.variants || [];
  const saved = wishlist.includes(sourceProduct._id);

  const buyNow = () => {
    addProduct(product);
    router.push("/checkout");
  };

  return (
    <div className="lg:sticky lg:top-24">
      <div className="flex flex-wrap gap-2">
        {product.featured && <Badge>Featured</Badge>}
        {product.isBestSeller && <Badge>Best seller</Badge>}
        {product.isNew && <Badge tone="green">New arrival</Badge>}
        <Badge tone={product.stock > 0 ? "muted" : "red"}>
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </Badge>
      </div>

      <h1 className="mt-5 font-display text-5xl font-semibold leading-tight text-ink md:text-6xl">
        {product.title}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-semibold text-ink">
            {formatPrice(product.discountPrice)}
          </span>
          <span className="text-brand-muted line-through">
            {formatPrice(product.price)}
          </span>
          <span className="text-sm font-semibold text-gold-dark">
            {product.discount}% off
          </span>
        </div>
        <a
          href="#reviews"
          className="flex items-center gap-1 text-sm text-brand-muted transition hover:text-ink"
        >
          <Star size={16} fill="#C4A55A" className="text-gold" />
          {getAverageRating(product)} / {getReviewCount(product)} reviews
        </a>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-[8px] border border-brand-border p-4">
          <dt className="text-brand-muted">Material</dt>
          <dd className="mt-1 font-semibold text-ink">{product.fabric}</dd>
        </div>
        <div className="rounded-[8px] border border-brand-border p-4">
          <dt className="text-brand-muted">Occasion</dt>
          <dd className="mt-1 font-semibold text-ink">{product.occasion}</dd>
        </div>
        <div className="rounded-[8px] border border-brand-border p-4">
          <dt className="text-brand-muted">Color</dt>
          <dd className="mt-1 font-semibold text-ink">{product.color}</dd>
        </div>
        <div className="rounded-[8px] border border-brand-border p-4">
          <dt className="text-brand-muted">Category</dt>
          <dd className="mt-1 font-semibold text-ink">{product.category}</dd>
        </div>
      </dl>

      {variants.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-muted">
              Colour
            </p>
            <span className="text-sm font-semibold text-ink">
              {selectedVariant?.colorName || variants[0]?.colorName}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-3">
            {variants.map((variant) => {
              const active = String(selectedVariant?._id || selectedVariant?.sku) === String(variant._id || variant.sku);
              const preview = variant.frontImage?.url || variant.galleryImages?.[0]?.url || "";

              return (
                <button
                  key={String(variant._id || variant.sku || variant.colorName)}
                  type="button"
                  onClick={() => onVariantChange?.(variant)}
                  className={`group relative h-16 w-16 overflow-hidden rounded-[8px] border bg-beige-soft transition duration-300 hover:-translate-y-0.5 ${
                    active ? "border-ink shadow-[0_0_0_3px_rgba(196,165,90,0.25)]" : "border-brand-border hover:border-gold"
                  }`}
                  aria-label={`Select ${variant.colorName}`}
                  title={variant.colorName}
                >
                  {preview ? (
                    <Image
                      src={preview}
                      alt={variant.colorName}
                      fill
                      sizes="64px"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <span
                      className="block h-full w-full"
                      style={{ backgroundColor: variant.colorCode || "#C4A55A" }}
                    />
                  )}
                  <span
                    className="absolute bottom-1 right-1 h-4 w-4 rounded-full border border-white shadow"
                    style={{ backgroundColor: variant.colorCode || "#C4A55A" }}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {product.sizes?.length ? (
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-muted">
            Sizes
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <span
                key={size}
                className="min-w-11 rounded-[8px] border border-brand-border px-4 py-2 text-center text-sm font-semibold text-ink"
              >
                {size}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-7 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <Button onClick={() => addProduct(product)} disabled={product.stock < 1}>
          <ShoppingBag size={18} />
          Add to Cart
        </Button>
        <Button
          variant="secondary"
          onClick={buyNow}
          disabled={product.stock < 1}
        >
          Buy Now
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label="Wishlist"
          onClick={() => toggleWishlist(sourceProduct._id, () => requireLogin("/account"))}
        >
          <Heart size={18} fill={saved ? "currentColor" : "none"} />
        </Button>
      </div>

      <a
        href="#write-review"
        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-gold-dark transition hover:text-ink"
      >
        <MessageSquareText size={16} />
        Rate and comment on this product
      </a>

      <ProductAccordions product={product} />
    </div>
  );
}
