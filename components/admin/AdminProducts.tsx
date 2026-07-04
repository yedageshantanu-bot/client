"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Boxes,
  Edit3,
  EyeOff,
  Eye,
  Filter,
  Image as ImageIcon,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Video,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import type { Product } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProductForm } from "./ProductForm";
import { ActionDropdown } from "@/components/ui/ActionDropdown";
import {
  getProductFrontImage,
  getProductImages,
  getProductThumbnail,
  getProductVideos,
} from "@/lib/productMedia";

const CATEGORY_OPTIONS = [
  "All",
  "Wedding Sarees",
  "Silk Sarees",
  "Party Wear",
  "Cotton Sarees",
  "Daily Wear",
];

const FABRIC_OPTIONS = [
  "All",
  "Pure Silk",
  "Georgette",
  "Cotton",
  "Chiffon",
  "Linen",
  "Net",
  "Tussar Silk",
  "Organza",
];

const STOCK_FILTERS: Array<{ label: string; match: (stock: number) => boolean }> = [
  { label: "All stock", match: () => true },
  { label: "In stock", match: (stock) => stock > 5 },
  { label: "Low stock", match: (stock) => stock > 0 && stock <= 5 },
  { label: "Out of stock", match: (stock) => stock <= 0 },
];

type SortKey = "newest" | "priceHigh" | "priceLow" | "stock" | "rating";

export function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [fabric, setFabric] = useState("All");
  const [stockFilter, setStockFilter] = useState(0);
  const [sort, setSort] = useState<SortKey>("newest");

  useEffect(() => {
    if (showForm || editing) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [showForm, editing]);

  const openNewProductForm = () => {
    setEditing(null);
    setShowForm(true);
  };

  const saveProduct = async (payload: Parameters<typeof addProduct>[0]) => {
    setBusyId("saving");
    try {
      if (editing) {
        await updateProduct(editing._id, payload);
        setEditing(null);
      } else {
        await addProduct(payload);
        setShowForm(false);
      }
    } finally {
      setBusyId(null);
    }
  };

  const toggleFeatured = async (product: Product) => {
    setBusyId(product._id);
    try {
      await updateProduct(product._id, { featured: !product.featured });
    } finally {
      setBusyId(null);
    }
  };

  const toggleActive = async (product: Product) => {
    setBusyId(product._id);
    try {
      await updateProduct(product._id, { isActive: !product.isActive });
    } finally {
      setBusyId(null);
    }
  };

  const quickAdjustStock = async (product: Product, delta: number) => {
    const next = Math.max(0, Number(product.stock) + delta);
    setBusyId(product._id);
    try {
      await updateProduct(product._id, { stock: next });
    } finally {
      setBusyId(null);
    }
  };

  const stats = useMemo(() => {
    const totalStock = products.reduce(
      (sum, product) => sum + Number(product.stock || 0),
      0,
    );
    const outOfStock = products.filter((product) => Number(product.stock) <= 0);
    const lowStock = products.filter(
      (product) => Number(product.stock) > 0 && Number(product.stock) <= 5,
    );
    const withVideo = products.filter(
      (product) => getProductVideos(product).length > 0,
    );
    return {
      totalStock,
      outOfStock: outOfStock.length,
      lowStock: lowStock.length,
      withVideo: withVideo.length,
    };
  }, [products]);

  const filtered = useMemo(() => {
    const list = products.filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory = category === "All" || product.category === category;
      const matchesFabric = fabric === "All" || product.fabric === fabric;
      const matchesStock =
        STOCK_FILTERS[stockFilter]?.match(Number(product.stock)) ?? true;
      return matchesSearch && matchesCategory && matchesFabric && matchesStock;
    });

    const sorted = [...list];
    switch (sort) {
      case "priceHigh":
        sorted.sort((a, b) => b.discountPrice - a.discountPrice);
        break;
      case "priceLow":
        sorted.sort((a, b) => a.discountPrice - b.discountPrice);
        break;
      case "stock":
        sorted.sort((a, b) => Number(a.stock) - Number(b.stock));
        break;
      case "rating":
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        // "newest" → keep insertion order (newest at top per StoreContext)
        break;
    }
    return sorted;
  }, [category, fabric, products, search, sort, stockFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#64748b]">
            Catalog &amp; inventory
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-[#0f172a] sm:text-4xl">
            Products
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748b]">
            Add new sarees with photos, demo videos, sizes, fabric, occasion,
            and per-color stock. Keep inventory healthy from one place.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            href="/admin/coupons"
            className="text-[10px] font-bold uppercase tracking-widest"
          >
            <Boxes size={14} /> Bulk import
          </Button>
          <Button
            onClick={openNewProductForm}
            className="text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-[#0a0a0a]/15"
          >
            <Plus size={14} /> Add product
          </Button>
        </div>
      </div>

      {/* Form */}
      {(showForm || editing) && (
        <ProductForm
          product={editing}
          onCancel={() => {
            setEditing(null);
            setShowForm(false);
          }}
          onSubmit={saveProduct}
        />
      )}

      {/* Quick stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatPill
          label="Total SKUs"
          value={String(products.length)}
          hint="Across all categories"
          icon={Boxes}
          tone="maroon"
        />
        <StatPill
          label="In stock"
          value={String(products.length - stats.outOfStock - stats.lowStock)}
          hint="Healthy inventory"
          icon={Sparkles}
          tone="green"
        />
        <StatPill
          label="Low stock"
          value={String(stats.lowStock)}
          hint="≤ 5 units — restock soon"
          icon={AlertTriangle}
          tone="amber"
        />
        <StatPill
          label="With video"
          value={`${stats.withVideo}/${products.length}`}
          hint="Boost conversion 2.4×"
          icon={Video}
          tone="gold"
        />
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-[#e2e8f0]/60 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="flex h-11 flex-1 items-center gap-2 rounded-xl border border-[#e2e8f0] bg-[#f8fafc]/30 px-3 text-sm focus-within:border-[#0f172a]">
            <Search size={16} className="text-[#64748b]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by product title…"
              className="h-full w-full bg-transparent outline-none"
            />
          </label>

          <div className="flex flex-wrap items-center gap-2">
            <span className="hidden items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#64748b] md:inline-flex">
              <Filter size={12} /> Filters
            </span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-11 rounded-xl border border-[#e2e8f0] bg-[#f8fafc]/30 px-3 text-xs font-bold uppercase tracking-widest outline-none focus:border-[#0f172a]"
            >
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <select
              value={fabric}
              onChange={(event) => setFabric(event.target.value)}
              className="h-11 rounded-xl border border-[#e2e8f0] bg-[#f8fafc]/30 px-3 text-xs font-bold uppercase tracking-widest outline-none focus:border-[#0f172a]"
            >
              {FABRIC_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <select
              value={stockFilter}
              onChange={(event) => setStockFilter(Number(event.target.value))}
              className="h-11 rounded-xl border border-[#e2e8f0] bg-[#f8fafc]/30 px-3 text-xs font-bold uppercase tracking-widest outline-none focus:border-[#0f172a]"
            >
              {STOCK_FILTERS.map((option, index) => (
                <option key={option.label} value={index}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              className="h-11 rounded-xl border border-[#e2e8f0] bg-[#f8fafc]/30 px-3 text-xs font-bold uppercase tracking-widest outline-none focus:border-[#0f172a]"
            >
              <option value="newest">Newest first</option>
              <option value="priceHigh">Price: high → low</option>
              <option value="priceLow">Price: low → high</option>
              <option value="stock">Lowest stock</option>
              <option value="rating">Top rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#e2e8f0] bg-white py-16 text-center">
          <Boxes className="mx-auto mb-3 text-[#64748b]" size={28} />
          <p className="font-display text-xl font-semibold text-[#0f172a]">
            No products match your filters
          </p>
          <p className="mt-1 text-sm text-[#64748b]">
            Try clearing the search or adding a new product.
          </p>
          <Button onClick={openNewProductForm} className="mt-4">
            <Plus size={14} /> Add product
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product) => {
            const image =
              getProductThumbnail(product) ?? getProductFrontImage(product);
            const galleryCount = getProductImages(product).length;
            const videoCount = getProductVideos(product).length;
            const stock = Number(product.stock) || 0;
            const isOut = stock <= 0;
            const isLow = !isOut && stock <= 5;

            return (
              <article
                key={product._id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[#e2e8f0]/60 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#f8fafc]">
                  {image ? (
                    <Image
                      src={image.url}
                      alt={product.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 320px"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-[#64748b]">
                      <ImageIcon size={28} />
                    </div>
                  )}

                  <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                    <span className="rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[var(--color-maroon)] backdrop-blur">
                      {product.category}
                    </span>
                    {product.featured && (
                      <span className="rounded-full bg-[var(--color-maroon)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white backdrop-blur">
                        Featured
                      </span>
                    )}
                    {product.isActive === false && (
                      <span className="rounded-full bg-neutral-500 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white backdrop-blur">
                        Hidden
                      </span>
                    )}
                  </div>

                  <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
                    {videoCount > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#0f172a]/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white backdrop-blur">
                        <Video size={10} /> {videoCount}
                      </span>
                    )}
                    {galleryCount > 1 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#0f172a] backdrop-blur">
                        <ImageIcon size={10} /> {galleryCount}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3
                        className="line-clamp-2 text-sm font-bold text-[#0f172a]"
                        style={{ wordBreak: "break-word" }}
                      >
                        {product.title}
                      </h3>
                      <p className="mt-1 text-[10px] uppercase tracking-widest text-[#64748b]">
                        {product.fabric} · {product.occasion}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#0f172a]">
                        {formatPrice(product.discountPrice)}
                      </p>
                      <p className="text-[10px] text-[#64748b] line-through">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div
                      className={cn(
                        "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest",
                        isOut
                          ? "bg-[#0f172a] text-white"
                          : isLow
                          ? "bg-[#1e293b] text-white"
                          : "bg-[#f1f5f9] text-[#0f172a]",
                      )}
                    >
                      {isOut
                        ? "Out of stock"
                        : isLow
                        ? `Low · ${stock} left`
                        : `Stock · ${stock}`}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => void quickAdjustStock(product, -1)}
                        disabled={busyId === product._id || stock <= 0}
                        className="grid h-7 w-7 place-items-center rounded-full border border-[#e2e8f0] bg-white text-[#0f172a] hover:border-[#0f172a] disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Decrease stock by 1"
                      >
                        −
                      </button>
                      <button
                        type="button"
                        onClick={() => void quickAdjustStock(product, 1)}
                        disabled={busyId === product._id}
                        className="grid h-7 w-7 place-items-center rounded-full border border-[#e2e8f0] bg-white text-[#0f172a] hover:border-[#0f172a] disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Increase stock by 1"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-[#e2e8f0]/40 pt-3 text-[10px]">
                    <span className="text-[#64748b]">
                      ⭐ {(product.rating || 0).toFixed(1)} ({typeof product.reviews === "number" ? product.reviews : Array.isArray(product.reviews) ? product.reviews.length : 0})
                    </span>
                    <div className="flex flex-wrap items-center gap-1">
                      {product.featured && (
                        <Badge tone="gold" className="text-[8px]">
                          Featured
                        </Badge>
                      )}
                      <Badge
                        tone={product.isActive === false ? "red" : "green"}
                        className="text-[8px]"
                      >
                        {product.isActive === false ? "Hidden" : "Live"}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-[10px] font-bold uppercase tracking-widest"
                      onClick={() => setEditing(product)}
                    >
                      <Edit3 size={12} /> Edit
                    </Button>
                    <ActionDropdown
                      items={[
                        {
                          label: product.featured
                            ? "Remove from featured"
                            : "Mark as featured",
                          icon: Sparkles,
                          onClick: () => void toggleFeatured(product),
                          variant: "gold",
                        },
                        {
                          label: product.isActive === false
                            ? "Make public"
                            : "Hide product",
                          icon:
                            product.isActive === false ? Eye : EyeOff,
                          onClick: () => void toggleActive(product),
                        },
                        {
                          label: "Delete product",
                          icon: Trash2,
                          onClick: () => void deleteProduct(product._id),
                        },
                      ]}
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatPill({
  label,
  value,
  hint,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  icon: typeof Boxes;
  tone: "maroon" | "green" | "amber" | "gold";
}) {
  const toneClasses: Record<typeof tone, string> = {
    maroon: "border-[#0f172a]/20 bg-[#0f172a]/5 text-[#0f172a]",
    green: "border-[#0f172a]/15 bg-[#f1f5f9] text-[#0f172a]",
    amber: "border-[#0f172a]/15 bg-[#f8fafc] text-[#0f172a]",
    gold: "border-[#0f172a]/15 bg-white text-[#0f172a]",
  };

  return (
    <div className="rounded-2xl border border-[#e2e8f0]/60 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "grid h-10 w-10 place-items-center rounded-xl border",
            toneClasses[tone],
          )}
        >
          <Icon size={16} />
        </span>
        <span className="text-[9px] font-bold uppercase tracking-widest text-[#64748b]">
          {hint}
        </span>
      </div>
      <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#64748b]">
        {label}
      </p>
      <p className="mt-1 font-display text-2xl font-bold text-[#0f172a]">{value}</p>
    </div>
  );
}





