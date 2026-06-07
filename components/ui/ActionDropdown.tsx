"use client";

import { MoreVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type ActionItem = {
  label: string;
  icon: any;
  onClick: () => void;
  variant?: "default" | "danger" | "gold";
};

export function ActionDropdown({ items }: { items: ActionItem[] }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-border bg-white text-ink transition hover:bg-beige-soft"
        aria-label="Actions"
      >
        <MoreVertical size={18} />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-xl border border-brand-border bg-white p-1.5 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => {
                  item.onClick();
                  setOpen(false);
                }}
                title={item.label}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition",
                  item.variant === "gold"
                    ? "text-[#71717a] hover:bg-[#f4f4f5]"
                    : "text-[#0a0a0a] hover:bg-[#f4f4f5]"
                )}
              >
                <Icon size={18} className="shrink-0" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
