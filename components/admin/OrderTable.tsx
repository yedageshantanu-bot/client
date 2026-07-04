"use client";

import {
  Calendar,
  CheckCircle2,
  CreditCard,
  Download,
  Eye,
  FileText,
  Filter,
  IndianRupee,
  Package,
  PackageCheck,
  Printer,
  Search,
  Tag,
  Truck,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useStore } from "@/context/StoreContext";
import type { Order } from "@/lib/types";
import { cn, formatPrice, getInitials } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { OrderInvoice } from "@/components/admin/OrderInvoice";
import { ActionDropdown } from "@/components/ui/ActionDropdown";

type Tab = "All" | Order["deliveryStatus"];

const tabs: Tab[] = [
  "All",
  "Pending",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

// Each tab gets a unified solid dark navy/black active style with a translucent badge
const tabStyles: Record<string, { active: string; count: string }> = {
  All: {
    active: "bg-[#0f172a] text-white shadow-md shadow-[#0f172a]/20",
    count: "bg-white/20 text-white",
  },
  Pending: {
    active: "bg-[#0f172a] text-white shadow-md shadow-[#0f172a]/20",
    count: "bg-white/20 text-white",
  },
  Packed: {
    active: "bg-[#0f172a] text-white shadow-md shadow-[#0f172a]/20",
    count: "bg-white/20 text-white",
  },
  Shipped: {
    active: "bg-[#0f172a] text-white shadow-md shadow-[#0f172a]/20",
    count: "bg-white/20 text-white",
  },
  Delivered: {
    active: "bg-[#0f172a] text-white shadow-md shadow-[#0f172a]/20",
    count: "bg-white/20 text-white",
  },
  Cancelled: {
    active: "bg-[#0f172a] text-white shadow-md shadow-[#0f172a]/20",
    count: "bg-white/20 text-white",
  },
  default: {
    active: "bg-[#0f172a] text-white shadow-md shadow-[#0f172a]/20",
    count: "bg-white/20 text-white",
  },
};

const paymentTone = (status: Order["paymentStatus"]) => {
  if (status === "Paid") return "green" as const;
  if (status === "Pending") return "gold" as const;
  if (status === "Refunded") return "muted" as const;
  return "red" as const;
};

const statusTone = (status: Order["deliveryStatus"]) => {
  switch (status) {
    case "Delivered":
      return "green" as const;
    case "Shipped":
      return "gold" as const;
    case "Packed":
      return "gold" as const;
    case "Pending":
      return "muted" as const;
    case "Cancelled":
      return "red" as const;
    default:
      return "muted" as const;
  }
};

export function OrderTable() {
  const { orders, updateOrderStatus } = useStore();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<Tab>("All");
  const [paymentFilter, setPaymentFilter] = useState<"All" | Order["paymentStatus"]>("All");
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<Order | null>(null);

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: orders.length };
    tabs.forEach((t) => {
      if (t === "All") return;
      map[t] = orders.filter((order) => order.deliveryStatus === t).length;
    });
    return map as Record<Tab, number>;
  }, [orders]);

  const filtered = useMemo(
    () =>
      orders.filter((order) => {
        const matchesSearch =
          order.orderId.toLowerCase().includes(search.toLowerCase()) ||
          order.customer.toLowerCase().includes(search.toLowerCase()) ||
          order.phone.includes(search) ||
          (order.userEmail || "")
            .toLowerCase()
            .includes(search.toLowerCase());
        const matchesTab = tab === "All" || order.deliveryStatus === tab;
        const matchesPayment =
          paymentFilter === "All" || order.paymentStatus === paymentFilter;
        return matchesSearch && matchesTab && matchesPayment;
      }),
    [orders, paymentFilter, search, tab],
  );

  // Totals for the header KPIs
  const revenue = useMemo(
    () =>
      orders
        .filter((order) => order.paymentStatus === "Paid")
        .reduce((sum, order) => sum + order.total, 0),
    [orders],
  );

  const handlePrint = (order: Order) => {
    setViewingInvoice(order);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const advanceStatus = (order: Order) => {
    const order1: Order["deliveryStatus"][] = ["Pending", "Packed", "Shipped", "Delivered"];
    const currentIndex = order1.indexOf(order.deliveryStatus);
    if (currentIndex === -1 || currentIndex === order1.length - 1) return;
    const nextStatus = order1[currentIndex + 1];
    updateOrderStatus(order._id, nextStatus);
  };

  return (
    <div className="no-print space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#64748b]">
            Order management
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-[#0f172a] sm:text-4xl">
            Orders &amp; deliveries
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748b]">
            View every order, update delivery status, print professional
            invoices, and follow up with customers — all from one queue.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-2xl border border-[#e2e8f0]/60 bg-white px-4 py-2.5 shadow-sm">
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#64748b]">
              Paid revenue
            </p>
            <p className="font-display text-lg font-bold text-[#0f172a]">
              {formatPrice(revenue)}
            </p>
          </div>
          <div className="rounded-2xl border border-[#e2e8f0]/60 bg-white px-4 py-2.5 shadow-sm">
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#64748b]">
              Orders
            </p>
            <p className="font-display text-lg font-bold text-[#0f172a]">
              {orders.length}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs — each tab has a distinct accent color */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#e2e8f0] bg-white p-2 shadow-sm">
        {tabs.map((t) => {
          const active = t === tab;
          // Per-tab distinct color treatment (subtle, premium)
          const tabColor = tabStyles[t] || tabStyles.default;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3.5 py-2 text-[11px] font-bold uppercase tracking-widest transition duration-300",
                active
                  ? tabColor.active
                  : "text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a]",
              )}
            >
              {t}
              <span
                className={cn(
                  "rounded-md px-1.5 text-[10px] font-black tabular-nums",
                  active ? tabColor.count : "bg-[#f1f5f9] text-[#64748b]",
                )}
              >
                {counts[t] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filters row */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="flex h-11 flex-1 items-center gap-2 rounded-xl border border-[#e2e8f0] bg-white px-3 text-sm focus-within:border-[#0f172a]">
          <Search size={16} className="text-[#64748b]" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by order ID, name, phone, or email…"
            className="h-full w-full bg-transparent outline-none"
          />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <span className="hidden items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#64748b] md:inline-flex">
            <Filter size={12} /> Payment
          </span>
          <select
            value={paymentFilter}
            onChange={(event) =>
              setPaymentFilter(event.target.value as typeof paymentFilter)
            }
            className="h-11 rounded-xl border border-[#e2e8f0] bg-white px-3 text-xs font-bold uppercase tracking-widest outline-none focus:border-[#0f172a]"
          >
            <option value="All">All payments</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Order list */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#e2e8f0] bg-white py-16 text-center">
          <Truck className="mx-auto mb-3 text-[#64748b]" size={28} />
          <p className="font-display text-xl font-semibold text-[#0f172a]">
            No orders match this filter
          </p>
          <p className="mt-1 text-sm text-[#64748b]">
            Try a different status or clear the search.
          </p>
        </div>
      ) : (
        <ul className="grid gap-3">
          {filtered.map((order) => (
            <li
              key={order._id}
              className="grid gap-3 rounded-2xl border border-[#e2e8f0]/60 bg-white p-4 shadow-sm transition hover:shadow-md md:grid-cols-[1fr_auto] md:items-center"
            >
              <div className="grid gap-3 sm:grid-cols-[auto_1fr_auto] sm:items-center">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-[#0f172a]/10 to-gold/10 text-sm font-bold text-[#0f172a]">
                  {getInitials(order.customer || "Customer")}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display text-base font-bold text-[#0f172a]">
                      {order.orderId}
                    </p>
                    <Badge
                      tone={statusTone(order.deliveryStatus)}
                      className="text-[9px] font-black uppercase"
                    >
                      {order.deliveryStatus}
                    </Badge>
                    <Badge
                      tone={paymentTone(order.paymentStatus)}
                      className="text-[9px] font-black uppercase"
                    >
                      {order.paymentStatus}
                    </Badge>
                  </div>
                  <p
                    className="mt-1 truncate text-sm font-semibold text-[#0f172a]"
                    style={{ wordBreak: "break-word" }}
                  >
                    {order.customer}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#64748b]">
                    {order.userEmail || "—"} · {order.phone} ·{" "}
                    {new Date(order.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <p className="mt-1 line-clamp-1 text-[11px] text-[#64748b]">
                    {order.products
                      .map((item) => `${item.title} ×${item.quantity}`)
                      .join(" · ")}
                  </p>
                </div>
                <div className="text-right sm:ml-4">
                  <p className="font-display text-lg font-bold text-[#0f172a]">
                    {formatPrice(order.total)}
                  </p>
                  {order.couponCode ? (
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#0f172a]">
                      {order.couponCode} · −{formatPrice(order.couponDiscount)}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2">
                <select
                  value={order.deliveryStatus}
                  onChange={(event) =>
                    updateOrderStatus(
                      order._id,
                      event.target.value as Order["deliveryStatus"],
                    )
                  }
                  className="h-9 rounded-full border border-[#e2e8f0] bg-white px-3 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#0f172a]"
                >
                  {(["Pending", "Packed", "Shipped", "Delivered", "Cancelled"] as const).map(
                    (status) => (
                      <option key={status} value={status}>
                        Mark {status}
                      </option>
                    ),
                  )}
                </select>
                {order.deliveryStatus !== "Delivered" &&
                  order.deliveryStatus !== "Cancelled" && (
                    <button
                      type="button"
                      onClick={() => advanceStatus(order)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#0f172a] px-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-[#5d0710]"
                    >
                      <CheckCircle2 size={12} /> Advance
                    </button>
                  )}
                <ActionDropdown
                  items={[
                    {
                      label: "View order",
                      icon: Eye,
                      onClick: () => setViewingOrder(order),
                    },
                    {
                      label: "View invoice",
                      icon: FileText,
                      onClick: () => setViewingInvoice(order),
                      variant: "gold",
                    },
                    {
                      label: "Print invoice",
                      icon: Printer,
                      onClick: () => handlePrint(order),
                    },
                    {
                      label: "Download PDF",
                      icon: Download,
                      onClick: () => handlePrint(order),
                    },
                    {
                      label:
                        order.deliveryStatus === "Cancelled"
                          ? "Restore order"
                          : "Cancel order",
                      icon: XCircle,
                      onClick: () => updateOrderStatus(order._id, "Cancelled"),
                    },
                  ]}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Order details modal */}
      {viewingOrder && (
        <Modal
          open={!!viewingOrder}
          onClose={() => setViewingOrder(null)}
          title={`Order ${viewingOrder.orderId}`}
          className="max-w-3xl"
        >
          <div className="space-y-5 py-1">
            <div className="grid gap-2.5 grid-cols-2 sm:grid-cols-4">
              <OrderStat
                label="Date"
                value={new Date(viewingOrder.date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
                icon={Calendar}
              />
              <OrderStat
                label="Payment"
                value={viewingOrder.paymentStatus}
                icon={CreditCard}
                accent={paymentTone(viewingOrder.paymentStatus)}
              />
              <OrderStat
                label="Delivery"
                value={viewingOrder.deliveryStatus}
                icon={PackageCheck}
                accent={statusTone(viewingOrder.deliveryStatus)}
              />
              <OrderStat
                label="Total"
                value={<span className="font-sans tabular-nums price">{formatPrice(viewingOrder.total)}</span>}
                icon={IndianRupee}
                accent="gold"
              />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-[#e2e8f0]/60 bg-[#f8fafc]/30 p-4">
                <h3 className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748b]">
                  Customer
                </h3>
                <p className="truncate text-sm font-semibold text-[#0f172a]">
                  {viewingOrder.customer}
                </p>
                <p
                  className="mt-1 truncate text-[11px] text-[#64748b]"
                  title={viewingOrder.userEmail || ""}
                >
                  {viewingOrder.userEmail || "—"}
                </p>
                <p className="mt-1 text-[11px] text-[#64748b]">
                  📞 {viewingOrder.phone}
                </p>
              </div>
              <div className="rounded-2xl border border-[#e2e8f0]/60 bg-[#f8fafc]/30 p-4">
                <h3 className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748b]">
                  Shipping address
                </h3>
                <p className="truncate text-sm font-semibold text-[#0f172a]">
                  {viewingOrder.shippingAddress.fullName}
                </p>
                <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-[#64748b]">
                  {viewingOrder.shippingAddress.address}
                  {viewingOrder.shippingAddress.landmark
                    ? `, ${viewingOrder.shippingAddress.landmark}`
                    : ""}
                  , {viewingOrder.shippingAddress.city},{" "}
                  {viewingOrder.shippingAddress.state} —{" "}
                  {viewingOrder.shippingAddress.pincode}
                </p>
                <p className="mt-1 text-[11px] text-[#64748b]">
                  📞 {viewingOrder.shippingAddress.phone || viewingOrder.phone}
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-[#e2e8f0]/60">
              <div className="flex items-center justify-between bg-[#f8fafc]/40 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748b]">
                <span>Order items ({viewingOrder.products.length})</span>
                <Tag size={12} />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[420px] text-left text-sm">
                  <thead className="bg-white text-[10px] font-bold uppercase tracking-widest text-[#64748b]">
                    <tr>
                      <th className="px-4 py-2">Product</th>
                      <th className="w-16 px-2 py-2 text-center">Qty</th>
                      <th className="w-28 px-4 py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border/40">
                    {viewingOrder.products.map((p, i) => (
                      <tr key={i}>
                        <td className="px-4 py-3">
                          <p className="truncate font-semibold text-[#0f172a]" title={p.title}>
                            {p.title}
                          </p>
                          {p.color || p.size ? (
                            <p className="mt-0.5 text-[10px] text-[#64748b]">
                              {p.color} {p.size ? `· ${p.size}` : ""}
                            </p>
                          ) : null}
                        </td>
                        <td className="px-2 py-3 text-center font-bold text-[#0f172a]">
                          {p.quantity}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-[#0f172a]">
                          {formatPrice(p.price * p.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-[#f8fafc]/20 text-sm">
                    <tr>
                      <td colSpan={2} className="px-4 py-2 text-right text-[#64748b]">
                        Subtotal
                      </td>
                      <td className="px-4 py-2 text-right font-bold text-[#0f172a]">
                        {formatPrice(viewingOrder.subtotal)}
                      </td>
                    </tr>
                    {viewingOrder.couponDiscount > 0 && (
                      <tr>
                        <td colSpan={2} className="px-4 py-2 text-right text-[#0f172a]">
                          Coupon ({viewingOrder.couponCode})
                        </td>
                        <td className="px-4 py-2 text-right font-bold text-[#0f172a]">
                          -{formatPrice(viewingOrder.couponDiscount)}
                        </td>
                      </tr>
                    )}
                    <tr className="border-t border-[#e2e8f0]/40">
                      <td colSpan={2} className="px-4 py-3 text-right font-display text-sm font-bold text-[#0f172a]">
                        Grand total
                      </td>
                      <td className="px-4 py-3 text-right font-display text-base font-bold text-[#0f172a]">
                        <span className="font-sans tabular-nums price">{formatPrice(viewingOrder.total)}</span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 border-t border-[#e2e8f0]/40 pt-4">
              <button
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#0f172a] px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-[#0a0a0a]/15 hover:bg-[#5d0710]"
                onClick={() => {
                  setViewingInvoice(viewingOrder);
                  setViewingOrder(null);
                }}
              >
                <FileText size={14} /> View invoice
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-full border border-[#e2e8f0] px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-[#0f172a] hover:bg-[#f8fafc]"
                onClick={() => handlePrint(viewingOrder)}
              >
                <Printer size={14} /> Print
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Invoice modal */}
      {viewingInvoice && (
        <Modal
          open={!!viewingInvoice}
          onClose={() => setViewingInvoice(null)}
          title="Invoice preview"
          className="max-w-[850px] p-0 overflow-hidden"
        >
          <div className="max-h-[80vh] overflow-y-auto bg-[#f8fafc]/10">
            <OrderInvoice order={viewingInvoice} />
          </div>
          <div className="flex items-center justify-between border-t border-[#e2e8f0] bg-white p-5 no-print">
            <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#64748b]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#0f172a]" />
              A4 print ready
            </span>
            <div className="flex gap-2">
              <button
                className="rounded-full border border-[#e2e8f0] px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#0f172a] hover:bg-[#f8fafc]"
                onClick={() => setViewingInvoice(null)}
              >
                Close
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-full bg-[#0f172a] px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg shadow-[#0a0a0a]/15 hover:bg-[#5d0710]"
                onClick={() => window.print()}
              >
                <Printer size={12} /> Print now
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function OrderStat({
  label,
  value,
  icon: Icon,
  accent = "muted",
}: {
  label: string;
  value: React.ReactNode;
  icon: typeof Package;
  accent?: "muted" | "gold" | "green" | "red";
}) {
  const accentMap = {
    muted: "border-[#e2e8f0] bg-white text-[#0f172a]",
    gold: "border-[#0f172a]/15 bg-[#f8fafc] text-[#0f172a]",
    green: "border-[#0f172a]/15 bg-[#f1f5f9] text-[#0f172a]",
    red: "border-[#0f172a]/15 bg-[#0f172a]/5 text-[#0f172a]",
  } as const;
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-xl border px-3 py-2.5 min-w-0",
        accentMap[accent],
      )}
    >
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/70">
        <Icon size={14} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[9px] font-bold uppercase tracking-widest opacity-70">
          {label}
        </p>
        <p className="truncate text-sm font-bold leading-tight">{value}</p>
      </div>
    </div>
  );
}





