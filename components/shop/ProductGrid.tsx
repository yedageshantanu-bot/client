import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="rounded-[8px] border border-brand-border bg-beige-soft p-8 text-center">
        <p className="font-display text-3xl font-semibold text-ink">
          No products found
        </p>
        <p className="mt-2 text-sm text-brand-muted">
          Try changing filters or clearing the search.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 items-stretch gap-x-3 gap-y-8 sm:gap-x-4 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
