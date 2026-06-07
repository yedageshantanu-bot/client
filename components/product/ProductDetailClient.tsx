"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/Button";
import { getDisplayProduct } from "@/lib/productMedia";
import { ImageGallery } from "./ImageGallery";
import { ProductInfo } from "./ProductInfo";
import { RelatedProducts } from "./RelatedProducts";
import { ReviewSection } from "./ReviewSection";

export function ProductDetailClient({
  productId,
  initialProduct,
}: {
  productId: string;
  initialProduct: Product | null;
}) {
  const { products } = useStore();
  const product =
    products.find((item) => item._id === productId || item.slug === productId) ??
    initialProduct;
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const selectedVariant = useMemo(() => {
    if (!product?.variants?.length) {
      return null;
    }

    return (
      product.variants.find((variant) => String(variant._id || variant.sku) === selectedVariantId) ||
      product.variants[0]
    );
  }, [product, selectedVariantId]);
  const displayProduct = product ? getDisplayProduct(product, selectedVariant) : null;

  if (!product) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-display text-5xl font-semibold text-ink">
          Saree not found
        </h1>
        <p className="mt-3 text-brand-muted">
          This product may have been removed from the collection.
        </p>
        <Button className="mt-6" href="/collection">
          Back to collection
        </Button>
      </div>
    );
  }

  const activeProduct = displayProduct ?? product;

  return (
    <div className="bg-[var(--color-ivory)] pt-24">
      <div className="container-page py-10">
        <div className="mb-6 text-sm text-brand-muted">
          <Link href="/" className="hover:text-ink">
            Home
          </Link>{" "}
          /{" "}
          <Link href="/collection" className="hover:text-ink">
            Collection
          </Link>{" "}
          / <span className="text-ink">{product.title}</span>
        </div>
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <ImageGallery product={activeProduct} />
          <ProductInfo
            product={activeProduct}
            baseProduct={product}
            selectedVariant={selectedVariant}
            onVariantChange={(variant) => setSelectedVariantId(String(variant._id || variant.sku || ""))}
          />
        </div>
      </div>

      <ReviewSection product={product} />
      <RelatedProducts product={product} />
    </div>
  );
}
