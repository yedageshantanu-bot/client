"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/Button";
import { ProductGrid } from "@/components/shop/ProductGrid";

export function TrendingProducts() {
  const { products } = useStore();
  const [mounted, setMounted] = useState(false);
  const trending = products
    .filter((product) => product.isBestSeller || product.isNew)
    .slice(0, 8);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  return (
    <section className="section bg-beige-soft">
      <div className="container-page">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-dark">
              Trending Products
            </p>
            <h2 className="mt-2 font-display text-5xl font-semibold text-ink">
              Loved this week
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-brand-muted">
              Premium product cards with hover lift, discount badges, wishlist
              affordances, and quick add interactions.
            </p>
          </div>
          <Button href="/shop" variant="outline">
            Shop all
            <ArrowRight size={16} />
          </Button>
        </div>
        {mounted ? (
          <ProductGrid products={trending} />
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[3/4] rounded-[8px] bg-white" />
                <div className="mt-4 h-4 w-3/4 rounded-full bg-white" />
                <div className="mt-3 h-4 w-1/2 rounded-full bg-white" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
