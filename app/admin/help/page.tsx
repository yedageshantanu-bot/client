"use client";

import {
  BookOpen,
  ChevronRight,
  Keyboard,
  LifeBuoy,
  MessageCircle,
  Search,
  Sparkles,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  {
    title: "Getting started",
    description: "Set up your store, add products, and take your first order",
    icon: Sparkles,
    color: "bg-indigo-50 text-indigo-700",
  },
  {
    title: "Manage products",
    description: "Catalog, variants, media, and inventory best practices",
    icon: BookOpen,
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "Orders & fulfillment",
    description: "Packing slips, shipping labels, returns and refunds",
    icon: BookOpen,
    color: "bg-amber-50 text-amber-700",
  },
  {
    title: "Marketing & coupons",
    description: "Run campaigns, send emails, drive repeat purchases",
    icon: BookOpen,
    color: "bg-rose-50 text-rose-700",
  },
  {
    title: "Reports & analytics",
    description: "Understand revenue, customers, and product performance",
    icon: BookOpen,
    color: "bg-blue-50 text-blue-700",
  },
  {
    title: "Integrations & API",
    description: "Connect shipping carriers, webhooks, and custom apps",
    icon: BookOpen,
    color: "bg-cyan-50 text-cyan-700",
  },
];

const shortcuts = [
  { keys: ["⌘", "K"], label: "Open command palette" },
  { keys: ["G", "D"], label: "Go to dashboard" },
  { keys: ["G", "O"], label: "Go to orders" },
  { keys: ["G", "P"], label: "Go to products" },
  { keys: ["?"], label: "Show keyboard shortcuts" },
  { keys: ["N"], label: "New order (in orders view)" },
];

const team = [
  { name: "Shantanu Yedage", role: "Owner", status: "online" },
  { name: "Support bot", role: "Always here", status: "online" },
];

export default function HelpPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748b]">
          Resources & support
        </p>
        <h1 className="mt-1.5 text-[clamp(1.6rem,3vw,2.2rem)] font-bold leading-[1.1] tracking-tight text-[#0f172a]">
          Help & docs
        </h1>
        <p className="mt-2 max-w-2xl text-[13px] leading-6 text-[#475569] sm:text-[14px]">
          Guides, tutorials, and the fastest way to reach our team.
        </p>
      </div>

      {/* Search */}
      <div className="premium-card p-4">
        <label className="flex h-12 items-center gap-3 rounded-xl border border-[#e2e8f0] bg-white px-4 transition focus-within:border-[#0f172a] focus-within:ring-4 focus-within:ring-[#0f172a]/10">
          <Search size={16} className="text-[#64748b]" />
          <input
            placeholder="Search guides, shortcuts, and FAQs…"
            className="h-full w-full bg-transparent text-[14px] text-[#0f172a] outline-none placeholder:text-[#a1a1aa]"
          />
          <span className="inline-flex items-center gap-0.5 rounded-md border border-[#e2e8f0] bg-[#fafafa] px-1.5 py-0.5 text-[10px] font-mono font-semibold text-[#64748b]">
            ⌘ K
          </span>
        </label>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Guides grid */}
        <div className="space-y-3">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#64748b]">
            Browse by topic
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.title}
                  type="button"
                  className="group premium-card flex items-start gap-3 p-4 text-left transition duration-300 hover:border-[#0f172a] hover:shadow-md"
                >
                  <span
                    className={cn(
                      "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
                      cat.color,
                    )}
                  >
                    <Icon size={16} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-[13px] font-semibold text-[#0f172a]">
                        {cat.title}
                      </span>
                      <ChevronRight
                        size={14}
                        className="text-[#a1a1aa] transition group-hover:translate-x-0.5 group-hover:text-[#0f172a]"
                      />
                    </span>
                    <span className="mt-1 block text-[12px] leading-snug text-[#64748b]">
                      {cat.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right column: shortcuts + contact */}
        <div className="space-y-4">
          <div className="premium-card p-4">
            <div className="mb-3 flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#f1f5f9] text-[#0f172a]">
                <Keyboard size={14} />
              </span>
              <h2 className="text-[13px] font-bold text-[#0f172a]">
                Keyboard shortcuts
              </h2>
            </div>
            <div className="space-y-2">
              {shortcuts.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center justify-between gap-3 rounded-lg border border-[#e2e8f0] bg-white px-3 py-2"
                >
                  <span className="text-[12px] text-[#0f172a]">{s.label}</span>
                  <span className="flex items-center gap-1">
                    {s.keys.map((k, i) => (
                      <span
                        key={i}
                        className="rounded-md border border-[#e2e8f0] bg-[#fafafa] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#0f172a]"
                      >
                        {k}
                      </span>
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="premium-card p-4">
            <div className="mb-3 flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#f1f5f9] text-[#0f172a]">
                <LifeBuoy size={14} />
              </span>
              <h2 className="text-[13px] font-bold text-[#0f172a]">
                Contact support
              </h2>
            </div>
            <div className="space-y-2">
              <a
                href="mailto:support@vastraaura.in"
                className="flex items-center gap-3 rounded-lg border border-[#e2e8f0] bg-white p-3 transition hover:border-[#0f172a]"
              >
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#f1f5f9] text-[#0f172a]">
                  <MessageCircle size={14} />
                </span>
                <span>
                  <span className="block text-[12px] font-semibold text-[#0f172a]">
                    Email support
                  </span>
                  <span className="block text-[10px] text-[#64748b]">
                    support@vastraaura.in
                  </span>
                </span>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg border border-[#e2e8f0] bg-white p-3 transition hover:border-[#0f172a]"
              >
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#f1f5f9] text-[#0f172a]">
                  <Video size={14} />
                </span>
                <span>
                  <span className="block text-[12px] font-semibold text-[#0f172a]">
                    Book a 1:1 demo
                  </span>
                  <span className="block text-[10px] text-[#64748b]">
                    Walkthrough with our team
                  </span>
                </span>
              </a>
            </div>
          </div>

          <div className="premium-card p-4">
            <h2 className="mb-3 text-[13px] font-bold text-[#0f172a]">
              Team online
            </h2>
            <div className="space-y-2">
              {team.map((member) => (
                <div
                  key={member.name}
                  className="flex items-center gap-3 rounded-lg border border-[#e2e8f0] bg-white p-3"
                >
                  <span className="relative">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-[#0f172a] text-[10px] font-bold text-white">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                    <span
                      className={cn(
                        "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white",
                        member.status === "online"
                          ? "bg-emerald-500"
                          : "bg-[#a1a1aa]",
                      )}
                    />
                  </span>
                  <span>
                    <span className="block text-[12px] font-semibold text-[#0f172a]">
                      {member.name}
                    </span>
                    <span className="block text-[10px] text-[#64748b]">
                      {member.role}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
