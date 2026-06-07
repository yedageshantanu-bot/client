"use client";

import { useStore } from "@/context/StoreContext";
import type { Product } from "@/lib/types";
import { ProductGrid } from "@/components/shop/ProductGrid";

export function RelatedProducts({ product }: { product: Product }) {
  const { products } = useStore();
  const related = products
    .filter(
      (item) => item.category === product.category && item._id !== product._id,
    )
    .slice(0, 4);

  if (related.length === 0) {
    return null;
  }

  return (
    <section className="container-page py-16">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-dark">
          Related Products
        </p>
        <h2 className="mt-2 font-display text-5xl font-semibold text-ink">
          More in {product.category}
        </h2>
      </div>
      <ProductGrid products={related} />
    </section>
  );
}
