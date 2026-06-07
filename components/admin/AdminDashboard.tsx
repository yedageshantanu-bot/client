"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  CircleDollarSign,
  Eye,
  PackageCheck,
  Percent,
  ShoppingBag,
  Sparkles,
  Star,
  Tag,
  TrendingUp,
  Truck,
  UsersRound,
  Video,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useStore } from "@/context/StoreContext";
import { mockAdminStats } from "@/lib/mockData";
import { brandName } from "@/lib/brand";
import { formatPrice, getInitials } from "@/lib/utils";
import { getProductFrontImage, getProductThumbnail } from "@/lib/productMedia";
import { Badge } from "@/components/ui/Badge";

const chartColors = [
  "#0f172a", // slate-900
  "#6366f1", // indigo-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#ec4899", // pink-500
  "#06b6d4", // cyan-500
  "#8b5cf6", // violet-500
  "#f43f5e", // rose-500
];

export function AdminDashboard() {
  const { orders, products, customers, coupons, reviews } = useStore();

  const todayKey = new Date().toDateString();
  const paidOrders = orders.filter((order) => order.paymentStatus === "Paid");
  const pendingOrders = orders.filter(
    (order) => order.deliveryStatus === "Pending",
  );
  const todaysOrders = orders.filter(
    (order) => new Date(order.date).toDateString() === todayKey,
  );
  const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0);
  const avgOrderValue = paidOrders.length
    ? Math.round(totalRevenue / paidOrders.length)
    : 0;
  const lowStock = products.filter((product) => Number(product.stock) <= 5);

  // Saree-specific: group revenue by fabric and category
  const revenueByCategory = useMemo(() => {
    const map = new Map<string, number>();
    paidOrders.forEach((order) => {
      order.products.forEach((item) => {
        const product = products.find((p) => p._id === item.productId);
        const key = product?.category || "Other";
        map.set(key, (map.get(key) || 0) + item.price * item.quantity);
      });
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [paidOrders, products]);

  const fabricBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((product) => {
      const key = product.fabric || "Other";
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [products]);

  const bestSellers = useMemo(
    () =>
      [...products]
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 5),
    [products],
  );

  const topCustomers = useMemo(
    () => [...customers].sort((a, b) => b.totalSpending - a.totalSpending).slice(0, 5),
    [customers],
  );

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort(
          (a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime(),
        )
        .slice(0, 5),
    [orders],
  );

  const recentReviews = useMemo(() => reviews.slice(0, 4), [reviews]);

  const stats = [
    {
      label: "Total revenue",
      value: formatPrice(totalRevenue || mockAdminStats.totalRevenue),
      hint: `${paidOrders.length} paid orders`,
      icon: CircleDollarSign,
      tone: "maroon" as const,
    },
    {
      label: "Orders today",
      value: String(todaysOrders.length || mockAdminStats.todayOrders),
      hint: `${orders.length} all-time`,
      icon: ShoppingBag,
      tone: "gold" as const,
    },
    {
      label: "Pending delivery",
      value: String(pendingOrders.length),
      hint: "To be packed & shipped",
      icon: Truck,
      tone: "amber" as const,
    },
    {
      label: "Delivered",
      value: String(
        orders.filter((order) => order.deliveryStatus === "Delivered").length,
      ),
      hint: "Completed orders",
      icon: PackageCheck,
      tone: "green" as const,
    },
    {
      label: "Avg. order value",
      value: formatPrice(avgOrderValue || 4290),
      hint: "Per paid order",
      icon: TrendingUp,
      tone: "maroon" as const,
    },
    {
      label: "Catalog SKUs",
      value: String(products.length),
      hint: `${lowStock.length} need restock`,
      icon: Boxes,
      tone: "gold" as const,
    },
    {
      label: "Customers",
      value: String(customers.length || mockAdminStats.totalCustomers),
      hint: "Across all channels",
      icon: UsersRound,
      tone: "maroon" as const,
    },
    {
      label: "Active coupons",
      value: String(coupons.filter((coupon) => coupon.isActive).length),
      hint: `${coupons.length} total codes`,
      icon: Tag,
      tone: "gold" as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero greeting — clean white enterprise SaaS */}
      <section className="relative overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm sm:p-8">
        <div className="relative grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#e2e8f0] bg-[#f8fafc] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748b]">
              <Sparkles size={12} /> Good day, Admin
            </p>
            <h1 className="mt-4 text-[clamp(1.6rem,3vw,2.2rem)] font-bold leading-[1.1] tracking-tight text-[#0f172a]">
              Your saree store, at a glance
            </h1>
            <p className="mt-3 max-w-2xl text-[13px] leading-6 text-[#475569] sm:text-[14px]">
              Live revenue, dispatch queue, fabric-level mix, and customer
              delight — everything you need to run {brandName} from a single
              console.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href="/admin/products"
                className="inline-flex items-center gap-2 rounded-xl bg-[#0f172a] px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-white transition duration-300 hover:bg-[#1e293b]"
              >
                <Boxes size={13} /> Manage catalog
              </Link>
              <Link
                href="/admin/orders"
                className="inline-flex items-center gap-2 rounded-xl border border-[#e2e8f0] bg-white px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-[#0f172a] transition duration-300 hover:bg-[#f8fafc]"
              >
                <Truck size={13} /> Process {pendingOrders.length} pending orders
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <HeroMetric
              label="Revenue MTD"
              value={<span className="font-sans tabular-nums price">{formatPrice(totalRevenue)}</span>}
              hint="+18% vs last month"
            />
            <HeroMetric
              label="Conversion"
              value="3.4%"
              hint="Add-to-cart ratio"
            />
            <HeroMetric
              label="Repeat buyers"
              value={`${customers.filter((c) => c.totalOrders > 1).length}`}
              hint="Of all customers"
            />
            <HeroMetric
              label="Avg. rating"
              value={
                products.length
                  ? (
                      products.reduce(
                        (sum, product) => sum + (product.rating || 0),
                        0,
                      ) / products.length
                    ).toFixed(1) + " ★"
                  : "—"
              }
              hint={`${reviews.length} reviews`}
            />
          </div>
        </div>
      </section>

      {/* KPI grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-2xl border border-[#e2e8f0]/60 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span
                className={[
                  "grid h-11 w-11 place-items-center rounded-xl border",
                  stat.tone === "maroon"
                    ? "border-[#0f172a]/20 bg-[#0f172a]/5 text-[#0f172a]"
                    : stat.tone === "green"
                    ? "border-[#0f172a]/15 bg-[#f1f5f9] text-[#0f172a]"
                    : stat.tone === "amber"
                    ? "border-[#0f172a]/15 bg-[#f8fafc] text-[#0f172a]"
                    : "border-[#0f172a]/15 bg-white text-[#0f172a]",
                ].join(" ")}
              >
                <stat.icon size={18} />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#64748b]">
                {stat.hint}
              </span>
            </div>
            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#64748b]">
              {stat.label}
            </p>
            <p className="mt-1 font-sans text-2xl font-bold tabular-nums tracking-tight text-[#0f172a]">
              {stat.value}
            </p>
          </article>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-[#e2e8f0]/60 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748b]">
                Sales performance
              </p>
              <h2 className="font-display text-2xl font-semibold text-[#0f172a]">
                Revenue &amp; orders — last 6 months
              </h2>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest font-sans">
              <span className="flex items-center gap-1.5 text-[#64748b]">
                <span className="h-2 w-2 rounded-full bg-[#0f172a]" /> Revenue
              </span>
              <span className="flex items-center gap-1.5 text-[#6366f1]">
                <span className="h-2 w-2 rounded-full bg-[#6366f1]" /> Orders
              </span>
            </div>
          </div>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockAdminStats.monthlyRevenue}>
                <defs>
                  <linearGradient id="revInk" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="ordIndigo" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  fontSize={11}
                />
                <YAxis
                  yAxisId="left"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  width={70}
                  fontSize={11}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  width={40}
                  fontSize={11}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e9dccb",
                    fontSize: 12,
                  }}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0f172a"
                  strokeWidth={2.5}
                  fill="url(#revInk)"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fill="url(#ordIndigo)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e2e8f0]/60 bg-white p-5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748b]">
            Category mix
          </p>
          <h2 className="font-display text-2xl font-semibold text-[#0f172a]">
            Revenue by saree category
          </h2>
          {revenueByCategory.length > 0 ? (
            <>
              <div className="mt-4 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={revenueByCategory}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {revenueByCategory.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={chartColors[index % chartColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatPrice(value)}
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid #e9dccb",
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="mt-3 space-y-1.5">
                {revenueByCategory.map((entry, index) => (
                  <li
                    key={entry.name}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="flex items-center gap-2 font-semibold text-[#0f172a]">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            chartColors[index % chartColors.length],
                        }}
                      />
                      {entry.name}
                    </span>
                    <span className="font-bold text-[#0f172a]">
                      {formatPrice(entry.value)}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="mt-6 grid place-items-center rounded-xl border border-dashed border-[#e2e8f0] py-10 text-center text-sm text-[#64748b]">
              No paid orders yet. Once orders come in, you'll see category-wise
              revenue split here.
            </div>
          )}
        </div>
      </div>

      {/* Fulfillment pipeline + fabric mix */}
      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-[#e2e8f0]/60 bg-white p-5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748b]">
            Fulfillment pipeline
          </p>
          <h2 className="font-display text-2xl font-semibold text-[#0f172a]">
            Orders by status
          </h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { status: "Pending", count: orders.filter((o) => o.deliveryStatus === "Pending").length },
                  { status: "Packed", count: orders.filter((o) => o.deliveryStatus === "Packed").length },
                  { status: "Shipped", count: orders.filter((o) => o.deliveryStatus === "Shipped").length },
                  { status: "Delivered", count: orders.filter((o) => o.deliveryStatus === "Delivered").length },
                  { status: "Cancelled", count: orders.filter((o) => o.deliveryStatus === "Cancelled").length },
                ]}
              >
                <CartesianGrid stroke="#e9dccb" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="status" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={11} width={32} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e9dccb",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {["Pending", "Packed", "Shipped", "Delivered", "Cancelled"].map(
                    (status, index) => (
                      <Cell
                        key={status}
                        fill={chartColors[index % chartColors.length]}
                      />
                    ),
                  )}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e2e8f0]/60 bg-white p-5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748b]">
            Catalog DNA
          </p>
          <h2 className="font-display text-2xl font-semibold text-[#0f172a]">
            Products by fabric
          </h2>
          <div className="mt-4 space-y-3">
            {fabricBreakdown.map((entry, index) => {
              const total = fabricBreakdown.reduce(
                (sum, item) => sum + item.value,
                0,
              );
              const percent = total
                ? Math.round((entry.value / total) * 100)
                : 0;
              return (
                <div key={entry.name}>
                  <div className="mb-1 flex items-center justify-between text-xs font-semibold text-[#0f172a]">
                    <span>{entry.name}</span>
                    <span className="text-[#64748b]">
                      {entry.value} SKUs · {percent}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#f8fafc]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${percent}%`,
                        backgroundColor:
                          chartColors[index % chartColors.length],
                      }}
                    />
                  </div>
                </div>
              );
            })}
            {fabricBreakdown.length === 0 && (
              <p className="rounded-xl border border-dashed border-[#e2e8f0] py-8 text-center text-sm text-[#64748b]">
                Add your first saree to see fabric-level distribution.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Best sellers + recent orders */}
      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-[#e2e8f0]/60 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748b]">
                Bestsellers
              </p>
              <h2 className="font-display text-2xl font-semibold text-[#0f172a]">
                Top-rated sarees
              </h2>
            </div>
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#64748b] hover:text-[#0f172a]"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {bestSellers.map((product, index) => {
              const image = getProductThumbnail(product) ?? getProductFrontImage(product);
              return (
                <li
                  key={product._id}
                  className="flex items-center gap-3 rounded-xl border border-[#e2e8f0]/40 bg-[#f8fafc]/30 p-3"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-[#f1f5f9] text-[11px] font-bold text-[#0f172a]">
                    {index + 1}
                  </span>
                  <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-lg border border-[#e2e8f0] bg-white">
                    {image ? (
                      <Image
                        src={image.url}
                        alt={product.title}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#0f172a]">
                      {product.title}
                    </p>
                    <p className="text-[10px] uppercase tracking-widest text-[#64748b]">
                      {product.fabric} · {product.occasion}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="flex items-center justify-end gap-1 text-xs font-bold text-[#0f172a]">
                      <Star size={11} className="fill-gold text-[#64748b]" />
                      {(product.rating || 0).toFixed(1)}
                    </p>
                    <p className="text-[10px] text-[#64748b]">
                      {formatPrice(product.discountPrice)}
                    </p>
                  </div>
                </li>
              );
            })}
            {bestSellers.length === 0 && (
              <li className="rounded-xl border border-dashed border-[#e2e8f0] py-8 text-center text-sm text-[#64748b]">
                No products yet.
              </li>
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-[#e2e8f0]/60 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748b]">
                Latest activity
              </p>
              <h2 className="font-display text-2xl font-semibold text-[#0f172a]">
                Recent orders
              </h2>
            </div>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#64748b] hover:text-[#0f172a]"
            >
              All orders <ArrowRight size={12} />
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {recentOrders.map((order) => (
              <li
                key={order._id}
                className="rounded-xl border border-[#e2e8f0]/40 bg-[#f8fafc]/20 p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#0f172a]">
                      {order.orderId} · {order.customer}
                    </p>
                    <p className="text-[10px] uppercase tracking-widest text-[#64748b]">
                      {new Date(order.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      · {order.products.length} item
                      {order.products.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <span
                    className={[
                      "rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest",
                      order.deliveryStatus === "Delivered"
                        ? "bg-[#0f172a] text-white"
                        : order.deliveryStatus === "Cancelled"
                        ? "bg-[#f1f5f9] text-[#64748b]"
                        : "bg-[#f8fafc] text-[#64748b]",
                    ].join(" ")}
                  >
                    {order.deliveryStatus}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-[#64748b]">
                  <span className="truncate">{order.userEmail || "—"}</span>
                  <span className="font-bold text-[#0f172a]">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </li>
            ))}
            {recentOrders.length === 0 && (
              <li className="rounded-xl border border-dashed border-[#e2e8f0] py-8 text-center text-sm text-[#64748b]">
                No orders yet.
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Low stock + customers + reviews */}
      <div className="grid gap-5 xl:grid-cols-3">
        <div className="rounded-2xl border border-[#e2e8f0]/60 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748b]">
                Needs attention
              </p>
              <h2 className="font-display text-xl font-semibold text-[#0f172a]">
                Low stock alerts
              </h2>
            </div>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#0f172a]/10 text-[#0f172a]">
              <AlertTriangle size={14} />
            </span>
          </div>
          <ul className="mt-3 space-y-2.5">
            {lowStock.slice(0, 5).map((product) => (
              <li
                key={product._id}
                className="flex items-center justify-between gap-3 rounded-lg border border-[#e2e8f0]/50 bg-[#f8fafc]/40 p-2.5"
              >
                <p
                  className="truncate text-sm font-semibold text-[#0f172a]"
                  style={{ wordBreak: "break-word" }}
                >
                  {product.title}
                </p>
                <Badge tone="default" className="text-[9px]">
                  {product.stock} left
                </Badge>
              </li>
            ))}
            {lowStock.length === 0 && (
              <li className="rounded-xl border border-dashed border-[#e2e8f0] py-6 text-center text-sm text-[#64748b]">
                All products are well stocked. ✨
              </li>
            )}
          </ul>
          <Link
            href="/admin/products"
            className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#0f172a] hover:text-[#64748b]"
          >
            Restock products <ArrowRight size={12} />
          </Link>
        </div>

        <div className="rounded-2xl border border-[#e2e8f0]/60 bg-white p-5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748b]">
            Customer delight
          </p>
          <h2 className="font-display text-xl font-semibold text-[#0f172a]">
            Top customers
          </h2>
          <ul className="mt-3 space-y-2.5">
            {topCustomers.map((customer) => (
              <li
                key={customer._id}
                className="flex items-center gap-3 rounded-lg border border-[#e2e8f0]/40 p-2.5"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#f1f5f9] text-xs font-bold text-[#0f172a]">
                  {getInitials(customer.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#0f172a]">
                    {customer.name}
                  </p>
                  <p className="truncate text-[10px] text-[#64748b]">
                    {customer.email}
                  </p>
                </div>
                <span className="text-xs font-bold text-[#0f172a]">
                  {formatPrice(customer.totalSpending)}
                </span>
              </li>
            ))}
            {topCustomers.length === 0 && (
              <li className="rounded-xl border border-dashed border-[#e2e8f0] py-6 text-center text-sm text-[#64748b]">
                Customers will appear after their first order.
              </li>
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-[#e2e8f0]/60 bg-white p-5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748b]">
            Customer voice
          </p>
          <h2 className="font-display text-xl font-semibold text-[#0f172a]">
            Latest reviews
          </h2>
          <ul className="mt-3 space-y-3">
            {recentReviews.map((review) => {
              const product = products.find((p) => p._id === review.productId);
              return (
                <li
                  key={review._id}
                  className="rounded-lg border border-[#e2e8f0]/40 p-2.5"
                >
                  <div className="flex items-center justify-between text-[10px] text-[#64748b]">
                    <span className="font-semibold text-[#0f172a]">
                      {product?.title?.slice(0, 28) || "Saree"}
                    </span>
                    <span className="flex items-center gap-0.5 text-[#64748b]">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} size={10} className="fill-gold text-[#64748b]" />
                      ))}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-[#64748b]">
                    “{review.comment}”
                  </p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[#64748b]">
                    — {review.name}
                  </p>
                </li>
              );
            })}
            {recentReviews.length === 0 && (
              <li className="rounded-xl border border-dashed border-[#e2e8f0] py-6 text-center text-sm text-[#64748b]">
                No reviews collected yet.
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Coupon strip */}
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-[#e2e8f0]/60 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748b]">
                Active promotions
              </p>
              <h2 className="font-display text-xl font-semibold text-[#0f172a]">
                Coupon performance
              </h2>
            </div>
            <Percent size={18} className="text-[#64748b]" />
          </div>
          <ul className="mt-3 space-y-2.5">
            {coupons
              .filter((coupon) => coupon.isActive)
              .slice(0, 4)
              .map((coupon) => {
                const usedPercent = coupon.maxUses
                  ? Math.min(100, Math.round((coupon.usedCount / coupon.maxUses) * 100))
                  : 0;
                return (
                  <li
                    key={coupon._id}
                    className="rounded-xl border border-[#e2e8f0]/40 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-base font-bold tabular-nums text-[#0f172a]">
                        {coupon.code}
                      </span>
                      <span className="text-xs font-bold text-[#0f172a]">
                        {coupon.type === "percentage"
                          ? `${coupon.discount}% OFF`
                          : `${formatPrice(coupon.discount)} OFF`}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#f8fafc]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#0f172a] to-[#0f172a]"
                        style={{ width: `${usedPercent}%` }}
                      />
                    </div>
                    <p className="mt-1 text-[10px] uppercase tracking-widest text-[#64748b]">
                      {coupon.usedCount} used
                      {coupon.maxUses ? ` / ${coupon.maxUses}` : ""} · Min order {formatPrice(coupon.minimumOrder)}
                    </p>
                  </li>
                );
              })}
            {coupons.filter((coupon) => coupon.isActive).length === 0 && (
              <li className="rounded-xl border border-dashed border-[#e2e8f0] py-6 text-center text-sm text-[#64748b]">
                No active coupons. Create one to lift conversion.
              </li>
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-[#e2e8f0]/60 bg-white p-5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748b]">
            Quick actions
          </p>
          <h2 className="font-display text-xl font-semibold text-[#0f172a]">
            Jump back in
          </h2>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            <Link
              href="/admin/products"
              className="flex items-center gap-3 rounded-xl border border-[#e2e8f0]/50 bg-[#f8fafc]/40 p-3 text-sm font-semibold text-[#0f172a] hover:border-[#0f172a]"
            >
              <Boxes size={16} className="text-[#64748b]" /> Add new product
            </Link>
            <Link
              href="/admin/coupons"
              className="flex items-center gap-3 rounded-xl border border-[#e2e8f0]/50 bg-[#f8fafc]/40 p-3 text-sm font-semibold text-[#0f172a] hover:border-[#0f172a]"
            >
              <Tag size={16} className="text-[#64748b]" /> Create coupon
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center gap-3 rounded-xl border border-[#e2e8f0]/50 bg-[#f8fafc]/40 p-3 text-sm font-semibold text-[#0f172a] hover:border-[#0f172a]"
            >
              <Truck size={16} className="text-[#64748b]" /> Update delivery status
            </Link>
            <Link
              href="/admin/cms"
              className="flex items-center gap-3 rounded-xl border border-[#e2e8f0]/50 bg-[#f8fafc]/40 p-3 text-sm font-semibold text-[#0f172a] hover:border-[#0f172a]"
            >
              <Eye size={16} className="text-[#64748b]" /> Edit homepage content
            </Link>
          </div>
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#e2e8f0]/50 bg-gradient-to-br from-beige-soft/40 to-white p-4">
            <Video size={16} className="text-[#0f172a]" />
            <p className="text-xs text-[#64748b]">
              Tip: products with a video demo convert 2.4× better. Add a 6–10s
              clip to your top sellers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroMetric({
  label,
  value,
  hint,
}: {
  label: string;
  value: React.ReactNode;
  hint: string;
}) {
  return (
    <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 transition duration-300 hover:border-[#0f172a] hover:shadow-md">
      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#64748b]">
        {label}
      </p>
      <p className="mt-1.5 truncate text-xl font-bold tracking-tight text-[#0f172a] sm:text-2xl">
        {value}
      </p>
      <p className="mt-0.5 truncate text-[10px] text-[#64748b]">{hint}</p>
    </div>
  );
}




