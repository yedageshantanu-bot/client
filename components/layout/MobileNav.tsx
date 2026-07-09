"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, ShoppingBag, Store, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import { cn } from "@/lib/utils";

const baseItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/collection", label: "Shop", icon: Store },
  { href: "/cart", label: "Cart", icon: ShoppingBag },
  { href: "/account", label: "Saved", icon: Heart },
  { href: "/account", label: "Account", icon: UserRound },
];

export function MobileNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { wishlist } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-border bg-white/95 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-5">
        {baseItems.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const count =
            item.href === "/cart"
              ? mounted ? itemCount : 0
              : item.href === "/account"
                ? mounted ? wishlist.length : 0
                : 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-[8px] py-2 text-[10px] font-medium text-brand-muted",
                active && "bg-beige-soft text-ink",
              )}
            >
              <span className="relative">
                <Icon size={19} />
                {count > 0 && (
                  <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-ink px-1 text-[9px] text-white">
                    {count}
                  </span>
                )}
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
