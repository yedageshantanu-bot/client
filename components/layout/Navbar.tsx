"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Home, LayoutDashboard, Menu, PackageCheck, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { navLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { isStrictAdmin } from "@/lib/authRules";

export function Navbar() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { user, requireLogin } = useAuth();
  const isAdmin = isStrictAdmin(user);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  useEffect(() => {
    queueMicrotask(() => setOpen(false));
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
    <div className="fixed right-4 top-5 z-[60] grid w-9 md:hidden" suppressHydrationWarning>
      <button className="grid h-9 w-9 place-items-center rounded-full border border-[rgba(212,163,115,0.28)] bg-[rgba(255,250,243,0.9)] text-[var(--color-maroon)] shadow-sm backdrop-blur-md transition duration-500" onClick={() => setOpen((value) => !value)} aria-label={open ? "Close menu" : "Open menu"}>
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>
    </div>
    <motion.header
      initial={mounted ? { y: -16, opacity: 0 } : false}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55 }}
      suppressHydrationWarning
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-500 ease-out",
        "border-[rgba(212,163,115,0.28)] bg-[rgba(255,250,243,0.94)] text-[var(--color-brown)] shadow-[0_1rem_3rem_rgba(59,42,40,0.1)] backdrop-blur-2xl",
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="relative z-10 flex items-center gap-3 rounded-full pr-3 transition duration-500 hover:bg-white/10" aria-label="Alaira Home">
          <BrandLogo
            priority
            className={cn(
              "transition duration-500",
              "border-[rgba(122,0,16,0.18)] bg-[var(--color-ivory-3)] text-[var(--color-ivory)]",
            )}
          />
          <span className="hidden border-l border-current/20 pl-3 sm:block">
            <span className="block font-display text-xl font-semibold leading-5">Alaira Half Saree House</span>
            <span className="font-accent text-[0.66rem] uppercase tracking-[0.3em] opacity-78">Crafted For Grace</span>
          </span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-6 px-6 lg:flex xl:gap-8">
          {navLinks.map((link) => {
            const linkPath = link.href.split("#")[0] || "/";
            const active =
              link.href.includes("#")
                ? pathname === linkPath
                : link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group relative py-2 text-[0.68rem] font-bold tracking-[0.22em] transition duration-300 hover:-translate-y-0.5",
                  "text-[rgba(59,42,40,0.74)] hover:text-[var(--color-maroon)]",
                  active && "text-[var(--color-maroon)]",
                )}
              >
                {link.label}
                <span className="absolute -bottom-1 left-1/2 h-px w-0 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,var(--color-gold),transparent)] transition-all duration-300 group-hover:w-full" />
              </Link>
            );
          })}
        </nav>

        <div className="hidden min-w-[15.5rem] shrink-0 items-center justify-end gap-1 md:flex sm:static sm:translate-y-0 sm:gap-2">
          <Link
            href="/admin"
            className={cn(
              "hidden h-10 w-10 place-items-center rounded-full border border-[rgba(212,163,115,0.45)] bg-[rgba(255,250,243,0.14)] text-current shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-[var(--color-maroon)] hover:text-[var(--color-ivory)] lg:grid",
              !isAdmin && "pointer-events-none invisible",
            )}
            aria-label="Admin Dashboard"
            title="Admin Dashboard"
            aria-hidden={!isAdmin}
            tabIndex={isAdmin ? 0 : -1}
          >
            <LayoutDashboard size={17} />
          </Link>
          <Link href="/collection" className="grid h-9 w-9 place-items-center rounded-full border border-[rgba(212,163,115,0.34)] bg-[rgba(255,250,243,0.16)] text-current shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-[rgba(212,163,115,0.24)] hover:text-[var(--color-gold-soft)] sm:h-10 sm:w-10" aria-label="Search">
            <Search size={18} />
          </Link>
          {user ? (
            <Link href="/account" className="hidden h-9 w-9 place-items-center rounded-full border border-[rgba(212,163,115,0.34)] bg-[rgba(255,250,243,0.16)] text-current shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-[rgba(212,163,115,0.24)] hover:text-[var(--color-gold-soft)] sm:grid sm:h-10 sm:w-10" aria-label="Account">
              <UserRound size={18} />
            </Link>
          ) : (
            <button
              className="hidden h-9 w-9 place-items-center rounded-full border border-[rgba(212,163,115,0.34)] bg-[rgba(255,250,243,0.16)] text-current shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-[rgba(212,163,115,0.24)] hover:text-[var(--color-gold-soft)] sm:grid sm:h-10 sm:w-10"
              onClick={() => requireLogin("/account")}
              aria-label="Sign in"
            >
              <UserRound size={18} />
            </button>
          )}
          {user ? (
            <Link href="/account#wishlist" className="hidden h-10 w-10 place-items-center rounded-full border border-[rgba(212,163,115,0.34)] bg-[rgba(255,250,243,0.16)] text-current shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-[rgba(212,163,115,0.24)] hover:text-[var(--color-gold-soft)] sm:grid" aria-label="Wishlist">
              <Heart size={18} />
            </Link>
          ) : (
            <button className="hidden h-10 w-10 place-items-center rounded-full border border-[rgba(212,163,115,0.34)] bg-[rgba(255,250,243,0.16)] text-current shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-[rgba(212,163,115,0.24)] hover:text-[var(--color-gold-soft)] sm:grid" aria-label="Wishlist" onClick={() => requireLogin("/account#wishlist")}>
              <Heart size={18} />
            </button>
          )}
          <Link href="/cart" className="relative hidden h-9 w-9 place-items-center rounded-full border border-[rgba(212,163,115,0.34)] bg-[rgba(255,250,243,0.16)] text-current shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-[rgba(212,163,115,0.24)] hover:text-[var(--color-gold-soft)] sm:grid sm:h-10 sm:w-10" aria-label="Cart">
            <ShoppingBag size={18} />
            <motion.span
              key={mounted ? itemCount : 0}
              initial={{ scale: 0.75 }}
              animate={{ scale: 1 }}
              className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--color-maroon)] px-1 text-[0.62rem] font-bold text-[var(--color-ivory)]"
            >
              {mounted ? itemCount : 0}
            </motion.span>
          </Link>
          <button className="grid h-9 w-9 place-items-center rounded-full border border-[rgba(212,163,115,0.34)] bg-[rgba(255,250,243,0.16)] text-current shadow-sm backdrop-blur sm:h-10 sm:w-10 lg:hidden" onClick={() => setOpen((value) => !value)} aria-label={open ? "Close menu" : "Open menu"}>
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              aria-label="Close menu"
              className="fixed inset-0 z-[-1] bg-[rgba(24,8,8,0.42)] backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={mounted ? { x: "100%" } : false}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 h-dvh w-[min(23rem,88vw)] overflow-y-auto border-l border-[rgba(212,163,115,0.28)] bg-[var(--color-ivory-3)] p-5 pb-24 pt-24 text-[var(--color-brown)] shadow-2xl lg:hidden"
            >
              <div className="grid gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="border-b border-[rgba(122,0,16,0.12)] px-1 py-4 text-sm font-bold tracking-[0.22em] text-[var(--color-brown)]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="mt-7 rounded-lg border border-[rgba(122,0,16,0.12)] bg-white/60 p-2">
                <p className="px-2 pb-2 pt-1 text-[0.65rem] font-bold uppercase tracking-[0.24em] text-[var(--color-brand-muted)]">
                  Customer
                </p>
                {[
                  { href: "/", label: "Home", icon: Home },
                  { href: "/account", label: "My Account", icon: UserRound },
                  { href: "/account#wishlist", label: "Wishlist", icon: Heart },
                  { href: "/cart", label: "Cart", icon: ShoppingBag },
                  { href: "/account", label: "Orders", icon: PackageCheck },
                ].map((item) => {
                  const Icon = item.icon;
                  const protectedItem = item.label === "My Account" || item.label === "Wishlist" || item.label === "Orders";

                  if (protectedItem && !user) {
                    return (
                      <button
                        key={item.label}
                        className="flex items-center gap-3 rounded-[8px] px-3 py-3 text-left text-sm font-semibold transition hover:bg-[var(--color-ivory-2)]"
                        onClick={() => {
                          setOpen(false);
                          requireLogin(item.href);
                        }}
                      >
                        <Icon size={17} className="text-[var(--color-maroon)]" />
                        {item.label}
                      </button>
                    );
                  }

                  return (
                    <Link key={item.label} href={item.href} className="flex items-center gap-3 rounded-[8px] px-3 py-3 text-sm font-semibold transition hover:bg-[var(--color-ivory-2)]">
                      <Icon size={17} className="text-[var(--color-maroon)]" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {isAdmin && (
                <Link href="/admin" className="mt-6 flex items-center justify-center gap-2 rounded-full bg-[var(--color-maroon)] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-ivory)] shadow-[0_1rem_2rem_rgba(59,42,40,0.16)]">
                  <LayoutDashboard size={16} /> Admin Dashboard
                </Link>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </motion.header>
    </>
  );
}
