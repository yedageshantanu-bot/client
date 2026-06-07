"use client";

import {
  Boxes,
  IndianRupee,
  PackageCheck,
  ReceiptText,
  ShoppingBag,
  Tag,
  Truck,
  UsersRound,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/utils";

export function DashboardStats() {
  const { orders, products, customers, coupons } = useStore();
  const today = new Date().toDateString();
  const delivered = orders.filter(
    (order) => order.deliveryStatus === "Delivered",
  ).length;
  const pending = orders.filter(
    (order) => order.deliveryStatus === "Pending",
  ).length;
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  const stats = [
    { label: "Total Orders", value: orders.length, icon: ReceiptText },
    {
      label: "Today Orders",
      value: orders.filter(
        (order) => new Date(order.date).toDateString() === today,
      ).length,
      icon: ShoppingBag,
    },
    { label: "Pending Orders", value: pending, icon: Truck },
    { label: "Delivered Orders", value: delivered, icon: PackageCheck },
    { label: "Revenue", value: formatPrice(revenue), icon: IndianRupee },
    { label: "Total Products", value: products.length, icon: Boxes },
    { label: "Total Customers", value: customers.length, icon: UsersRound },
    {
      label: "Active Coupons",
      value: coupons.filter((coupon) => coupon.isActive).length,
      icon: Tag,
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <article
            key={stat.label}
            className="rounded-2xl border border-[#e2e8f0]/60 bg-white/70 p-6 shadow-lg shadow-[#0f172a]/5 transition-all duration-300 hover:shadow-xl hover:border-[#e2e8f0]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-beige-soft to-white text-[#64748b] border border-[#e2e8f0]/60 shadow-sm">
                <Icon size={24} strokeWidth={2.5} />
              </div>
              <div className="min-w-0 flex-1 text-right">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#64748b] mb-1">
                  {stat.label}
                </p>
                <h2 className="truncate font-display text-3xl font-bold text-[#0f172a] leading-none">
                  {stat.value}
                </h2>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}




