"use client";

import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { FilterSidebar, type Filters } from "./FilterSidebar";
import { ProductGrid } from "./ProductGrid";
import { SortDropdown, type SortValue } from "./SortDropdown";

const defaultFilters: Filters = {
  category: "All",
  fabric: "All",
  color: "All",
  occasion: "All",
  price: 12000,
  isNew: false,
  isBestSeller: false,
};

export function ShopClient() {
  const { products } = useStore();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [sort, setSort] = useState<SortValue>("latest");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const category = searchParams.get("category") || "All";
    const searchValue = searchParams.get("search") || "";

    queueMicrotask(() => {
      setFilters((current) => {
        if (current.category === category) {
          return current;
        }

        return { ...current, category };
      });

      setSearch(searchValue);
    });
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(search.toLowerCase()) ||
        (product.fabric || "").toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase());

      return (
        matchesSearch &&
        (filters.category === "All" || product.category === filters.category) &&
        (filters.fabric === "All" || product.fabric === filters.fabric) &&
        (filters.color === "All" || product.color === filters.color) &&
        (filters.occasion === "All" ||
          product.occasion === filters.occasion) &&
        product.discountPrice <= filters.price &&
        (!filters.isNew || product.isNew) &&
        (!filters.isBestSeller || product.isBestSeller)
      );
    });

    return [...filtered].sort((a, b) => {
      if (sort === "low") return a.discountPrice - b.discountPrice;
      if (sort === "high") return b.discountPrice - a.discountPrice;
      if (sort === "popular") return Number(b.reviews) - Number(a.reviews);
      return Number(b.isNew) - Number(a.isNew);
    });
  }, [filters, products, search, sort]);

  return (
    <div className="bg-[var(--color-ivory)] pt-24">
      <div className="border-b border-[rgba(122,0,16,0.1)] bg-[linear-gradient(135deg,#fffaf3_0%,#f5ede3_100%)]">
        <div className="container-page py-14">
          <p className="font-accent text-sm font-semibold uppercase tracking-[0.34em] text-[var(--color-maroon)]">
            Luxury Indian fashion edits
          </p>
          <div className="mt-3 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-display text-4xl font-semibold leading-tight text-[var(--color-brown)] sm:text-5xl md:text-7xl">
                Collections
              </h1>
              <p className="mt-4 max-w-2xl leading-7 text-[var(--color-brand-muted)]">
                Browse wedding sarees, silk classics, party edits and breathable cottons with filters designed for occasion styling.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
              <label className="flex h-12 items-center gap-2 rounded-full border border-brand-border bg-white/80 px-4 text-sm shadow-sm">
                <Search size={16} className="text-brand-muted" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search fabric, saree, category"
                  className="w-full min-w-0 bg-transparent outline-none sm:w-72"
                />
              </label>
              <SortDropdown value={sort} onChange={setSort} />
            </div>
          </div>
        </div>
      </div>

      <div className="container-page py-10">
      <div className="grid gap-8 lg:grid-cols-[292px_1fr]">
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          clearFilters={() => setFilters(defaultFilters)}
        />
        <div>
          <div className="mb-5 flex items-center justify-between border-b border-[rgba(122,0,16,0.1)] pb-4 text-sm text-brand-muted">
            <span>{filteredProducts.length} products</span>
            <span>New drops every week</span>
          </div>
          <ProductGrid products={filteredProducts} />
        </div>
      </div>
      </div>
    </div>
  );
}
