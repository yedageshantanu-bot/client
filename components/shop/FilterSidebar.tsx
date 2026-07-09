"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export type Filters = {
  category: string;
  fabric: string;
  color: string;
  occasion: string;
  price: number;
  isNew: boolean;
  isBestSeller: boolean;
};

const groups = {
  category: [
    "All",
    "Cute Plushies",
    "Fine Jewelry",
    "Romantic Combos",
    "Matching Pieces",
    "Sweet Surprises",
  ],
  fabric: [
    "All",
    "Soft Plush",
    "Sterling Silver",
    "Rose Gold Plated",
    "Premium Cotton",
    "Preserved Roses",
    "Organic Wax",
    "Stainless Steel",
  ],
  color: [
    "All",
    "Soft Pink",
    "Soft Blue",
    "Red",
    "Rose Gold",
    "Silver",
    "White",
    "Lavender",
    "Cream",
  ],
  occasion: [
    "All",
    "Anniversary",
    "Birthday",
    "Just Because",
    "Valentine's Day",
    "Dating Anniversary",
    "Long Distance",
  ],
};

function SelectFilter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-muted">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-[8px] border border-brand-border bg-white px-3 text-sm text-ink outline-none focus:border-gold"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function FilterSidebar({
  filters,
  setFilters,
  clearFilters,
  className,
}: {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  clearFilters: () => void;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "rounded-[8px] border border-brand-border bg-[rgba(255,250,243,0.82)] p-5 shadow-[0_1rem_2.8rem_rgba(59,42,40,0.06)] lg:sticky lg:top-28 lg:self-start",
        className,
      )}
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="font-display text-3xl font-semibold text-ink">
          Filters
        </h2>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X size={15} />
          Clear
        </Button>
      </div>

      <div className="grid gap-5">
        <SelectFilter
          label="Category"
          value={filters.category}
          options={groups.category}
          onChange={(category) => setFilters({ ...filters, category })}
        />
        <SelectFilter
          label="Material"
          value={filters.fabric}
          options={groups.fabric}
          onChange={(fabric) => setFilters({ ...filters, fabric })}
        />
        <SelectFilter
          label="Color"
          value={filters.color}
          options={groups.color}
          onChange={(color) => setFilters({ ...filters, color })}
        />
        <SelectFilter
          label="Occasion"
          value={filters.occasion}
          options={groups.occasion}
          onChange={(occasion) => setFilters({ ...filters, occasion })}
        />

        <label className="grid gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-muted">
            Price up to ₹{filters.price.toLocaleString("en-IN")}
          </span>
          <input
            type="range"
            min="100"
            max="10000"
            step="100"
            value={filters.price}
            onChange={(event) =>
              setFilters({ ...filters, price: Number(event.target.value) })
            }
            className="accent-gold"
          />
        </label>

        <label className="flex items-center justify-between gap-3 rounded-[8px] border border-brand-border bg-white/80 px-3 py-3 text-sm text-ink">
          New Arrival
          <input
            type="checkbox"
            checked={filters.isNew}
            onChange={(event) =>
              setFilters({ ...filters, isNew: event.target.checked })
            }
            className="h-4 w-4 accent-gold"
          />
        </label>
        <label className="flex items-center justify-between gap-3 rounded-[8px] border border-brand-border bg-white/80 px-3 py-3 text-sm text-ink">
          Best Seller
          <input
            type="checkbox"
            checked={filters.isBestSeller}
            onChange={(event) =>
              setFilters({ ...filters, isBestSeller: event.target.checked })
            }
            className="h-4 w-4 accent-gold"
          />
        </label>
      </div>
    </aside>
  );
}
