"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useStore } from "@/context/StoreContext";
import { mockAdminStats } from "@/lib/mockData";

const colors = ["#C4A55A", "#1A1A1A", "#E8D4A0", "#C0392B"];

export function SalesChartInner() {
  const { orders } = useStore();
  const statusData = [
    "Delivered",
    "Shipped",
    "Packed",
    "Pending",
    "Cancelled",
  ].map((status) => ({
    status,
    count: orders.filter((order) => order.deliveryStatus === status).length,
  }));

  return (
    <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
      <div className="min-w-0 rounded-[8px] border border-[#e2e8f0] bg-white p-4 shadow-[0_1rem_3rem_rgba(26,26,26,0.05)] sm:p-5">
        <h2 className="font-display text-2xl font-semibold text-[#0f172a] sm:text-3xl">
          Monthly sales
        </h2>
        <div className="mt-4 h-80 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockAdminStats.monthlyRevenue}>
              <defs>
                <linearGradient id="goldRevenue" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#C4A55A" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#C4A55A" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#E8E0D0" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} />
              <YAxis tickLine={false} axisLine={false} tickMargin={10} width={72} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#C4A55A"
                fill="url(#goldRevenue)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="min-w-0 rounded-[8px] border border-[#e2e8f0] bg-white p-4 shadow-[0_1rem_3rem_rgba(26,26,26,0.05)] sm:p-5">
        <h2 className="font-display text-2xl font-semibold text-[#0f172a] sm:text-3xl">
          Order status
        </h2>
        <div className="mt-4 h-80 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData}>
              <CartesianGrid stroke="#E8E0D0" vertical={false} />
              <XAxis dataKey="status" tickLine={false} axisLine={false} tickMargin={10} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} tickMargin={10} width={36} />
              <Tooltip />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {statusData.map((entry, index) => (
                  <Cell key={entry.status} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}




