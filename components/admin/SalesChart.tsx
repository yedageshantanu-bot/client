"use client";

import dynamic from "next/dynamic";

const SalesChartInner = dynamic(
  () => import("./SalesChartInner").then((mod) => mod.SalesChartInner),
  {
    ssr: false,
    loading: () => (
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="h-[396px] rounded-[8px] border border-[#e2e8f0] bg-white" />
        <div className="h-[396px] rounded-[8px] border border-[#e2e8f0] bg-white" />
      </div>
    ),
  },
);

export function SalesChart() {
  return <SalesChartInner />;
}




