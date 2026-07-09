"use client";

import { SlidersHorizontal } from "lucide-react";

export type SortValue = "latest" | "low" | "high" | "popular";

export function SortDropdown({
  value,
  onChange,
}: {
  value: SortValue;
  onChange: (value: SortValue) => void;
}) {
  return (
    <label className="flex h-11 items-center gap-2 rounded-full border border-brand-border bg-white px-4 text-sm text-ink">
      <SlidersHorizontal size={16} />
      <select
        className="bg-transparent text-sm outline-none"
        value={value}
        onChange={(event) => onChange(event.target.value as SortValue)}
      >
        <option value="latest">Latest</option>
        <option value="low">Price Low to High</option>
        <option value="high">Price High to Low</option>
        <option value="popular">Popularity</option>
      </select>
    </label>
  );
}
