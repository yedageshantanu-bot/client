"use client";

import {
  Calendar,
  Download,
  Mail,
  MapPin,
  Phone,
  Search,
  ShoppingBag,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useStore } from "@/context/StoreContext";
import { cn, formatPrice, getInitials } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import type { Customer, Order } from "@/lib/types";

type Tier = "all" | "vip" | "regular" | "new";

export function AdminCustomers() {
  const { customers, orders } = useStore();
  const [search, setSearch] = useState("");
  const [tier, setTier] = useState<Tier>("all");
  const [viewing, setViewing] = useState<Customer | null>(null);

  const tierMeta = (spending: number) => {
    if (spending >= 20000) return { label: "VIP", tone: "default" as const };
    if (spending >= 5000) return { label: "Regular", tone: "default" as const };
    return { label: "New", tone: "light" as const };
  };

  const enriched = useMemo(() => {
    return customers.map((customer) => {
      const customerOrders = orders.filter(
        (order) => order.userEmail === customer.email,
      );
      const lastOrder = customerOrders[0];
      const cities = Array.from(
        new Set(
          customerOrders.map((order) => order.shippingAddress.city).filter(Boolean),
        ),
      );
      const tierInfo = tierMeta(customer.totalSpending);
      return { ...customer, customerOrders, lastOrder, cities, tierInfo };
    });
  }, [customers, orders]);

  const filtered = useMemo(() => {
    return enriched.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.email.toLowerCase().includes(search.toLowerCase()) ||
        customer.phone.includes(search);
      let matchesTier = true;
      if (tier === "vip") matchesTier = customer.totalSpending >= 20000;
      else if (tier === "regular")
        matchesTier =
          customer.totalSpending >= 5000 && customer.totalSpending < 20000;
      else if (tier === "new")
        matchesTier = customer.totalSpending < 5000;
      return matchesSearch && matchesTier;
    });
  }, [enriched, search, tier]);

  const totals = useMemo(() => {
    const totalSpending = enriched.reduce(
      (sum, customer) => sum + customer.totalSpending,
      0,
    );
    const avgLtv = enriched.length
      ? Math.round(totalSpending / enriched.length)
      : 0;
    return {
      totalSpending,
      avgLtv,
      vip: enriched.filter((c) => c.totalSpending >= 20000).length,
      withPhone: enriched.filter((c) => c.phone).length,
    };
  }, [enriched]);

  const exportCsv = () => {
    const rows = [
      ["Name", "Email", "Phone", "Orders", "Total spending", "Tier", "Last order"],
      ...filtered.map((c) => [
        c.name,
        c.email,
        c.phone,
        String(c.totalOrders),
        String(c.totalSpending),
        c.tierInfo.label,
        c.lastOrder ? new Date(c.lastOrder.date).toISOString() : "",
      ]),
    ];
    const csv = rows
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `vastraaura-customers-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#64748b]">
            Customer relationship
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-[#0f172a] sm:text-4xl">
            Customers
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748b]">
            See every customer, their email, phone, lifetime value, purchase
            history, and the cities they ship to.
          </p>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          className="inline-flex items-center gap-2 rounded-full border border-[#e2e8f0] bg-white px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-[#0f172a] hover:border-[#0f172a]"
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* KPIs */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi
          label="Total customers"
          value={String(enriched.length)}
          icon={UsersRound}
          hint="Across all sources"
          tone="maroon"
        />
        <Kpi
          label="Avg. lifetime value"
          value={formatPrice(totals.avgLtv)}
          icon={TrendingUp}
          hint="Per customer"
          tone="gold"
        />
        <Kpi
          label="VIP customers"
          value={String(totals.vip)}
          icon={ShoppingBag}
          hint="Spent ₹20,000+"
          tone="maroon"
        />
        <Kpi
          label="With phone"
          value={String(totals.withPhone)}
          icon={Phone}
          hint="Checkout capture"
          tone="gold"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[#e2e8f0]/60 bg-white p-4 shadow-sm lg:flex-row lg:items-center">
        <label className="flex h-11 flex-1 items-center gap-2 rounded-xl border border-[#e2e8f0] bg-[#f8fafc]/30 px-3 text-sm focus-within:border-[#0f172a]">
          <Search size={16} className="text-[#64748b]" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, email, or phone…"
            className="h-full w-full bg-transparent outline-none"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: "all", label: "All", tone: "all" },
              { id: "vip", label: "VIP", tone: "amber" },
              { id: "regular", label: "Regular", tone: "emerald" },
              { id: "new", label: "New", tone: "blue" },
            ] as const
          ).map((option) => {
            const styleMap: Record<string, string> = {
              all: "bg-[#0f172a] text-white shadow-md shadow-[#0f172a]/20",
              amber: "bg-amber-50 text-amber-900 ring-1 ring-amber-200",
              emerald: "bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200",
              blue: "bg-blue-50 text-blue-900 ring-1 ring-blue-200",
            };
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setTier(option.id)}
                className={cn(
                  "h-11 rounded-xl px-4 text-[10px] font-bold uppercase tracking-widest transition duration-300",
                  tier === option.id
                    ? styleMap[option.tone]
                    : "border border-[#e2e8f0] bg-white text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a]",
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Customer grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#e2e8f0] bg-white py-16 text-center">
          <UsersRound className="mx-auto mb-3 text-[#64748b]" size={28} />
          <p className="font-display text-xl font-semibold text-[#0f172a]">
            No customers found
          </p>
          <p className="mt-1 text-sm text-[#64748b]">
            Try a different search or tier filter.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((customer) => (
            <button
              type="button"
              key={customer._id}
              onClick={() => setViewing(customer)}
              className="group flex flex-col items-start gap-3 rounded-2xl border border-[#e2e8f0]/60 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex w-full items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#0f172a] text-sm font-bold text-white">
                  {getInitials(customer.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate text-sm font-bold text-[#0f172a]"
                    style={{ wordBreak: "break-word" }}
                  >
                    {customer.name}
                  </p>
                  <p
                    className="truncate text-[11px] text-[#64748b]"
                    style={{ wordBreak: "break-word" }}
                  >
                    {customer.email}
                  </p>
                </div>
                <Badge tone={customer.tierInfo.tone} className="text-[9px]">
                  {customer.tierInfo.label}
                </Badge>
              </div>

              <div className="grid w-full grid-cols-2 gap-2">
                <div className="rounded-lg border border-[#e2e8f0]/50 bg-[#f8fafc]/30 px-3 py-2">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#64748b]">
                    Orders
                  </p>
                  <p className="text-sm font-bold text-[#0f172a]">
                    {customer.totalOrders}
                  </p>
                </div>
                <div className="rounded-lg border border-[#e2e8f0]/50 bg-[#f8fafc]/30 px-3 py-2">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#64748b]">
                    Lifetime value
                  </p>
                  <p className="text-sm font-bold text-[#0f172a]">
                    {formatPrice(customer.totalSpending)}
                  </p>
                </div>
              </div>

              <div className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#64748b]">
                {customer.phone && (
                  <span className="inline-flex items-center gap-1">
                    <Phone size={11} /> {customer.phone}
                  </span>
                )}
                {customer.cities[0] && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={11} /> {customer.cities[0]}
                    {customer.cities.length > 1
                      ? ` +${customer.cities.length - 1}`
                      : ""}
                  </span>
                )}
                {customer.lastOrder && (
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={11} /> Last seen{" "}
                    {new Date(customer.lastOrder.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Customer detail drawer */}
      {viewing && (
        <CustomerDetail
          customer={viewing}
          orders={orders.filter(
            (order) => order.userEmail === viewing.email,
          )}
          onClose={() => setViewing(null)}
        />
      )}
    </div>
  );
}

function CustomerDetail({
  customer,
  orders,
  onClose,
}: {
  customer: Customer;
  orders: Order[];
  onClose: () => void;
}) {
  const cities = Array.from(
    new Set(orders.map((o) => o.shippingAddress.city).filter(Boolean)),
  );

  return (
    <Modal
      open={!!customer}
      onClose={onClose}
      title={`${customer.name}`}
      className="max-w-3xl"
    >
      <div className="space-y-5 py-2">
        <div className="flex flex-col gap-4 rounded-2xl border border-[#e2e8f0]/60 bg-gradient-to-br from-beige-soft/40 to-white p-5 sm:flex-row sm:items-center">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#0f172a] text-xl font-bold text-white">
            {getInitials(customer.name)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-2xl font-bold text-[#0f172a]">
              {customer.name}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#64748b]">
              <span className="inline-flex items-center gap-1">
                <Mail size={11} /> {customer.email}
              </span>
              {customer.phone && (
                <span className="inline-flex items-center gap-1">
                  <Phone size={11} /> {customer.phone}
                </span>
              )}
              {cities[0] && (
                <span className="inline-flex items-center gap-1">
                  <MapPin size={11} /> {cities.join(", ")}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748b]">
              Lifetime value
            </p>
            <p className="font-display text-xl font-bold text-[#0f172a]">
              {formatPrice(customer.totalSpending)}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748b]">
              {customer.totalOrders} orders
            </p>
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748b]">
            Order history
          </h3>
          {orders.length === 0 ? (
            <p className="rounded-xl border border-dashed border-[#e2e8f0] py-6 text-center text-sm text-[#64748b]">
              This customer has not placed an order yet.
            </p>
          ) : (
            <ul className="space-y-2">
              {orders.map((order) => (
                <li
                  key={order._id}
                  className="flex flex-col gap-2 rounded-xl border border-[#e2e8f0]/50 bg-white p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#0f172a]">{order.orderId}</p>
                    <p className="text-[11px] text-[#64748b]">
                      {new Date(order.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      · {order.products.length} item
                      {order.products.length === 1 ? "" : "s"} ·{" "}
                      {order.shippingAddress.city}
                    </p>
                    <p className="mt-1 line-clamp-1 text-[11px] text-[#64748b]">
                      {order.products
                        .map((item) => `${item.title} ×${item.quantity}`)
                        .join(" · ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      tone="default"
                      className="text-[9px]"
                    >
                      {order.deliveryStatus}
                    </Badge>
                    <p className="mt-1 text-sm font-bold text-[#0f172a]">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Modal>
  );
}

function Kpi({
  label,
  value,
  icon: Icon,
  hint,
  tone,
}: {
  label: string;
  value: string;
  icon: typeof UsersRound;
  hint: string;
  tone: "maroon" | "gold";
}) {
  const toneMap = {
    maroon: "border-[#0f172a]/20 bg-[#0f172a]/5 text-[#0f172a]",
    gold: "border-[#e2e8f0] bg-[#f8fafc] text-[#64748b]",
  } as const;
  return (
    <div className="rounded-2xl border border-[#e2e8f0]/60 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span
          className={`grid h-10 w-10 place-items-center rounded-xl border ${toneMap[tone]}`}
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





