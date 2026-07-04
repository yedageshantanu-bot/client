"use client";

import {
  Calendar,
  Copy,
  Edit3,
  PauseCircle,
  Percent,
  PlayCircle,
  Plus,
  ShoppingCart,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useStore } from "@/context/StoreContext";
import type { Coupon } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn, formatPrice } from "@/lib/utils";
import { ActionDropdown } from "@/components/ui/ActionDropdown";

type CouponFormState = Omit<Coupon, "_id" | "usedCount" | "usedBy">;

const blankCoupon: CouponFormState = {
  code: "",
  type: "percentage",
  discount: 10,
  maxDiscount: null,
  maxUses: 50,
  expiryDate: "2027-12-31",
  isActive: true,
  minimumOrder: 1000,
  applicableProducts: [],
  oneUsePerUser: true,
};

type Tab = "all" | "active" | "paused" | "expired";

// Unified active state styles - solid dark navy/black with white text
const couponTabStyles: Record<Tab, { active: string; count: string }> = {
  all: {
    active: "bg-[#0f172a] text-white shadow-md shadow-[#0f172a]/20",
    count: "bg-white/20 text-white",
  },
  active: {
    active: "bg-[#0f172a] text-white shadow-md shadow-[#0f172a]/20",
    count: "bg-white/20 text-white",
  },
  paused: {
    active: "bg-[#0f172a] text-white shadow-md shadow-[#0f172a]/20",
    count: "bg-white/20 text-white",
  },
  expired: {
    active: "bg-[#0f172a] text-white shadow-md shadow-[#0f172a]/20",
    count: "bg-white/20 text-white",
  },
};

const isExpired = (date?: string | null) =>
  !!date && new Date(date).getTime() < Date.now();

export function AdminCoupons() {
  const {
    coupons,
    products,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    toggleCoupon,
  } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState<CouponFormState>(blankCoupon);
  const [tab, setTab] = useState<Tab>("all");

  const counts = useMemo(() => {
    const active = coupons.filter((c) => c.isActive && !isExpired(c.expiryDate));
    const paused = coupons.filter((c) => !c.isActive);
    const expired = coupons.filter((c) => isExpired(c.expiryDate));
    return { all: coupons.length, active: active.length, paused: paused.length, expired: expired.length };
  }, [coupons]);

  const filtered = useMemo(() => {
    return coupons.filter((coupon) => {
      if (tab === "active") return coupon.isActive && !isExpired(coupon.expiryDate);
      if (tab === "paused") return !coupon.isActive;
      if (tab === "expired") return isExpired(coupon.expiryDate);
      return true;
    });
  }, [coupons, tab]);

  const startEdit = (coupon: Coupon) => {
    setEditing(coupon);
    setForm({
      code: coupon.code,
      type: coupon.type,
      discount: coupon.discount,
      maxDiscount: coupon.maxDiscount ?? null,
      maxUses: coupon.maxUses,
      expiryDate: coupon.expiryDate,
      isActive: coupon.isActive,
      minimumOrder: coupon.minimumOrder,
      applicableProducts: coupon.applicableProducts,
      oneUsePerUser: coupon.oneUsePerUser,
    });
    setShowForm(true);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      ...form,
      code: form.code.toUpperCase(),
      discount: Number(form.discount),
      maxDiscount:
        form.maxDiscount === null || form.maxDiscount === undefined
          ? null
          : Number(form.maxDiscount),
      maxUses: form.maxUses === null ? null : Number(form.maxUses),
      minimumOrder: Number(form.minimumOrder),
    };

    try {
      if (editing) {
        await updateCoupon(editing._id, payload);
        toast.success("Coupon updated");
      } else {
        await addCoupon(payload);
        toast.success("Coupon created");
      }
      setEditing(null);
      setShowForm(false);
      setForm(blankCoupon);
    } catch (error) {
      console.error("[Alaira coupons] save failed", error);
    }
  };

  const toggleProduct = (id: string) => {
    setForm((value) => ({
      ...value,
      applicableProducts: value.applicableProducts.includes(id)
        ? value.applicableProducts.filter((item) => item !== id)
        : [...value.applicableProducts, id],
    }));
  };

  const copyCode = (code: string) => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      toast.error("Clipboard not available");
      return;
    }
    navigator.clipboard
      .writeText(code)
      .then(() => toast.success(`${code} copied`))
      .catch(() => toast.error("Could not copy"));
  };

  const closeForm = () => {
    setEditing(null);
    setShowForm(false);
    setForm(blankCoupon);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#64748b]">
            Promotions
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-[#0f172a] sm:text-4xl">
            Coupons
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748b]">
            Create, edit, pause, and analyze discount codes. Track usage, set
            minimum order value, scope coupons to specific sarees, and share
            codes with one tap.
          </p>
        </div>
        <Button onClick={() => setShowForm((value) => !value)} className="text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-[#0a0a0a]/15">
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? "Close form" : "Create coupon"}
        </Button>
      </div>

      {/* Tabs — distinct color per status */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#e2e8f0] bg-white p-2 shadow-sm">
        {(
          [
            { id: "all", label: "All" },
            { id: "active", label: "Active" },
            { id: "paused", label: "Paused" },
            { id: "expired", label: "Expired" },
          ] as const
        ).map((option) => {
          const active = option.id === tab;
          const tabColor = couponTabStyles[option.id];
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setTab(option.id)}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3.5 py-2 text-[11px] font-bold uppercase tracking-widest transition duration-300",
                active
                  ? tabColor.active
                  : "text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a]",
              )}
            >
              {option.label}
              <span
                className={cn(
                  "rounded-md px-1.5 text-[10px] font-black tabular-nums",
                  active ? tabColor.count : "bg-[#f1f5f9] text-[#64748b]",
                )}
              >
                {counts[option.id]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={submit}
          className="rounded-2xl border border-[#e2e8f0]/60 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="mb-6 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#0f172a]/10 text-[#0f172a]">
              <Tag size={18} />
            </span>
            <div>
              <h2 className="font-display text-2xl font-bold text-[#0f172a]">
                {editing ? "Edit coupon" : "New coupon"}
              </h2>
              <p className="text-xs text-[#64748b]">
                Codes are auto-uppercased. Toggle product eligibility below to
                scope a coupon to specific sarees.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#64748b]">
                Coupon code
              </span>
              <input
                required
                value={form.code}
                onChange={(event) =>
                  setForm({ ...form, code: event.target.value.toUpperCase() })
                }
                placeholder="WELCOME10"
                className="mt-2 h-11 w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc]/30 px-3 text-sm font-bold uppercase outline-none focus:border-[#0f172a]"
              />
            </label>
            <label>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#64748b]">
                Discount type
              </span>
              <select
                value={form.type}
                onChange={(event) =>
                  setForm({ ...form, type: event.target.value as Coupon["type"] })
                }
                className="mt-2 h-11 w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc]/30 px-3 text-sm font-bold outline-none focus:border-[#0f172a]"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed amount (₹)</option>
              </select>
            </label>
            <label>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#64748b]">
                Discount value
              </span>
              <div className="relative">
                <input
                  required
                  type="number"
                  value={form.discount}
                  onChange={(event) =>
                    setForm({ ...form, discount: Number(event.target.value) })
                  }
                  className="mt-2 h-11 w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc]/30 px-3 pr-8 text-sm font-bold outline-none focus:border-[#0f172a]"
                />
                <span className="absolute right-3 top-1/2 mt-1 -translate-y-1/2 text-xs font-bold text-[#64748b]">
                  {form.type === "percentage" ? "%" : "₹"}
                </span>
              </div>
            </label>
            <label>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#64748b]">
                Max discount cap
              </span>
              <input
                type="number"
                value={form.maxDiscount ?? ""}
                onChange={(event) =>
                  setForm({
                    ...form,
                    maxDiscount: event.target.value
                      ? Number(event.target.value)
                      : null,
                  })
                }
                placeholder="No limit"
                className="mt-2 h-11 w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc]/30 px-3 text-sm font-bold outline-none focus:border-[#0f172a]"
              />
            </label>
            <label>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#64748b]">
                Usage limit
              </span>
              <input
                type="number"
                value={form.maxUses ?? ""}
                onChange={(event) =>
                  setForm({
                    ...form,
                    maxUses: event.target.value
                      ? Number(event.target.value)
                      : null,
                  })
                }
                placeholder="Unlimited"
                className="mt-2 h-11 w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc]/30 px-3 text-sm font-bold outline-none focus:border-[#0f172a]"
              />
            </label>
            <label>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#64748b]">
                Minimum order
              </span>
              <input
                required
                type="number"
                value={form.minimumOrder}
                onChange={(event) =>
                  setForm({ ...form, minimumOrder: Number(event.target.value) })
                }
                className="mt-2 h-11 w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc]/30 px-3 text-sm font-bold outline-none focus:border-[#0f172a]"
              />
            </label>
            <label>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#64748b]">
                Expiry date
              </span>
              <input
                type="date"
                value={form.expiryDate || ""}
                onChange={(event) =>
                  setForm({ ...form, expiryDate: event.target.value || null })
                }
                className="mt-2 h-11 w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc]/30 px-3 text-sm font-bold outline-none focus:border-[#0f172a]"
              />
            </label>
            <label className="flex items-center justify-between rounded-xl border border-[#e2e8f0] bg-[#f8fafc]/30 px-3 py-2.5 text-xs font-bold">
              Active
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) =>
                  setForm({ ...form, isActive: event.target.checked })
                }
                className="h-4 w-4 accent-[#0a0a0a]"
              />
            </label>
            <label className="flex items-center justify-between rounded-xl border border-[#e2e8f0] bg-[#f8fafc]/30 px-3 py-2.5 text-xs font-bold">
              Limit 1 per user
              <input
                type="checkbox"
                checked={form.oneUsePerUser}
                onChange={(event) =>
                  setForm({ ...form, oneUsePerUser: event.target.checked })
                }
                className="h-4 w-4 accent-[#0a0a0a]"
              />
            </label>
          </div>

          <div className="mt-6 rounded-2xl border border-[#e2e8f0]/50 bg-[#f8fafc]/30 p-4">
            <p className="mb-3 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748b]">
              <ShoppingCart size={12} /> Product-specific eligibility
            </p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <label
                  key={product._id}
                  className="flex items-center gap-3 rounded-lg border border-[#e2e8f0]/40 bg-white px-3 py-2 text-xs font-semibold text-[#0f172a] hover:border-[#0f172a]"
                >
                  <input
                    type="checkbox"
                    checked={form.applicableProducts.includes(product._id)}
                    onChange={() => toggleProduct(product._id)}
                    className="h-4 w-4 accent-[#0a0a0a]"
                  />
                  <span className="truncate">{product.title}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 border-t border-[#e2e8f0]/40 pt-4">
            <Button type="submit">
              {editing ? "Save changes" : "Deploy coupon"}
            </Button>
            <Button type="button" variant="outline" onClick={closeForm}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#e2e8f0] bg-white py-16 text-center">
          <Percent className="mx-auto mb-3 text-[#64748b]" size={28} />
          <p className="font-display text-xl font-semibold text-[#0f172a]">
            No coupons in this tab
          </p>
          <p className="mt-1 text-sm text-[#64748b]">
            {tab === "expired"
              ? "No expired coupons — your customers are happy!"
              : "Create your first coupon to lift conversion."}
          </p>
        </div>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {filtered.map((coupon) => {
            const expired = isExpired(coupon.expiryDate);
            const usedPercent = coupon.maxUses
              ? Math.min(100, Math.round((coupon.usedCount / coupon.maxUses) * 100))
              : 0;
            const status = expired
              ? { label: "Expired", tone: "default" as const }
              : coupon.isActive
              ? { label: "Active", tone: "default" as const }
              : { label: "Paused", tone: "default" as const };

            return (
              <article
                key={coupon._id}
                className="relative overflow-hidden rounded-2xl border border-[#e2e8f0]/60 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-[#08142E] px-3 py-1.5 font-display text-base font-bold tracking-[0.18em] text-white">
                        {coupon.code}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyCode(coupon.code)}
                        className="grid h-7 w-7 place-items-center rounded-full border border-[#e2e8f0] bg-white text-[#64748b] hover:border-[#0f172a] hover:text-[#64748b]"
                        aria-label="Copy code"
                      >
                        <Copy size={12} />
                      </button>
                    </div>
                    <p className="mt-2 text-base font-bold text-[#0f172a]">
                      {coupon.type === "percentage"
                        ? `${coupon.discount}% OFF`
                        : `${formatPrice(coupon.discount)} OFF`}
                      {coupon.maxDiscount ? (
                        <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-[#64748b]">
                          cap {formatPrice(coupon.maxDiscount)}
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-1 text-[11px] text-[#64748b]">
                      Min order {formatPrice(coupon.minimumOrder)} ·{" "}
                      {coupon.oneUsePerUser ? "Single use per user" : "Multi-use"}
                    </p>
                  </div>
                  <Badge tone={status.tone} className="text-[9px] font-black uppercase">
                    {status.label}
                  </Badge>
                </div>

                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-[#64748b]">
                    <span>Usage</span>
                    <span>
                      {coupon.usedCount}
                      {coupon.maxUses ? ` / ${coupon.maxUses}` : ""}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#f8fafc]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#0f172a] to-[#1e293b]"
                      style={{ width: `${usedPercent}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#64748b]">
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={11} />{" "}
                    {coupon.expiryDate
                      ? new Date(coupon.expiryDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "No expiry"}
                  </span>
                  <span>
                    {coupon.applicableProducts.length === 0
                      ? "All products"
                      : `${coupon.applicableProducts.length} product${
                          coupon.applicableProducts.length === 1 ? "" : "s"
                        }`}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-1.5 border-t border-[#e2e8f0]/40 pt-3">
                  <button
                    type="button"
                    onClick={() => void toggleCoupon(coupon._id)}
                    className={[
                      "inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[9px] font-black uppercase tracking-widest",
                      coupon.isActive
                        ? "border border-[#e2e8f0] bg-white text-[#0f172a] hover:border-[#0f172a] hover:text-[#64748b]"
                        : "border border-[#e2e8f0] bg-white text-[#64748b] hover:border-[#0f172a]",
                    ].join(" ")}
                  >
                    {coupon.isActive ? (
                      <>
                        <PauseCircle size={11} /> Pause
                      </>
                    ) : (
                      <>
                        <PlayCircle size={11} /> Activate
                      </>
                    )}
                  </button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 px-3 text-[9px] font-black uppercase tracking-widest"
                    onClick={() => startEdit(coupon)}
                  >
                    <Edit3 size={11} /> Edit
                  </Button>
                  <ActionDropdown
                    items={[
                      {
                        label: "Copy code",
                        icon: Copy,
                        onClick: () => copyCode(coupon.code),
                      },
                      {
                        label: "Edit parameters",
                        icon: Edit3,
                        onClick: () => startEdit(coupon),
                      },
                      {
                        label: "Delete coupon",
                        icon: Trash2,
                        onClick: () => void deleteCoupon(coupon._id),
                      },
                    ]}
                  />
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}




