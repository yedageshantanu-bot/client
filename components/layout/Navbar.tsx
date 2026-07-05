"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, LayoutDashboard, Menu, PackageCheck, Search, ShoppingBag, UserRound, X } from "lucide-react";
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
      {/* ── Mobile hamburger toggle (always on top) ── */}
      <div className="fixed right-4 top-5 z-[60] grid w-9 md:hidden" suppressHydrationWarning>
        <button
          className="grid h-9 w-9 place-items-center rounded-full border border-[rgba(212,163,115,0.28)] bg-[rgba(255,250,243,0.9)] text-[var(--color-maroon)] shadow-sm backdrop-blur-md transition duration-500"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* ── Desktop / tablet navbar header ── */}
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
          {/* Brand logo */}
          <Link href="/" className="relative z-10 flex items-center gap-3 rounded-full pr-3 transition duration-500 hover:bg-white/10" aria-label="Alaira Home">
            <BrandLogo
              priority
              className={cn(
                "transition duration-500",
                "border-[rgba(122,0,16,0.18)] bg-[var(--color-ivory-3)] text-[var(--color-ivory)]",
              )}
            />
            <span className="border-l border-[rgba(122,0,16,0.18)] pl-3 flex flex-col">
              <span className="block font-display text-base font-bold tracking-wide leading-none text-[var(--color-maroon)] sm:text-xl sm:leading-5 whitespace-nowrap">
                Alaira
                <span className="hidden sm:inline"> Half Saree House</span>
              </span>
              <span className="font-accent text-[0.55rem] font-medium uppercase tracking-[0.18em] text-[var(--color-gold-dark)] sm:text-[0.66rem] sm:tracking-[0.25em] mt-0.5 whitespace-nowrap">
                <span className="sm:hidden">Half Saree House</span>
                <span className="hidden sm:inline">Crafted For Grace</span>
              </span>
            </span>
          </Link>

          {/* Desktop nav links */}
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
                    "group relative py-2 text-[0.68rem] font-bold tracking-[0.22em] transition duration-300 hover:-translate-y-0.5 whitespace-nowrap",
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

          {/* Desktop action icons */}
          <div className="hidden min-w-[15.5rem] shrink-0 items-center justify-end gap-1 md:flex sm:gap-2">
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
            <button className="grid h-9 w-9 place-items-center rounded-full border border-[rgba(212,163,115,0.34)] bg-[rgba(255,250,243,0.16)] text-current shadow-sm backdrop-blur sm:h-10 sm:w-10 lg:hidden" onClick={() => setOpen((v) => !v)} aria-label={open ? "Close menu" : "Open menu"}>
              {open ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile sidebar drawer ── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop — z-[54] so it's below the aside but above everything else */}
            <motion.button
              aria-label="Close menu"
              className="fixed inset-0 z-[54] bg-[rgba(24,8,8,0.42)] backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Drawer — z-[55] covers the navbar completely (navbar is z-50) */}
            <motion.aside
              initial={mounted ? { x: "100%" } : false}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 z-[55] flex h-dvh w-[min(23rem,88vw)] flex-col overflow-hidden border-l border-[rgba(212,163,115,0.28)] bg-[var(--color-ivory-3)] pt-16 text-[var(--color-brown)] shadow-2xl lg:hidden"
            >

              {/* Nav links */}
              <div className="flex-1 overflow-y-auto px-6 pb-6">
                <ul className="divide-y divide-[rgba(122,0,16,0.08)]">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="flex items-center py-5 text-[15px] font-semibold tracking-[0.18em] text-[var(--color-brown)] transition hover:text-[var(--color-maroon)]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                {isAdmin && (
                  <Link
                    href="/admin"
                    className="mt-6 flex items-center justify-center gap-2 rounded-full bg-[var(--color-maroon)] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-ivory)] shadow-[0_1rem_2rem_rgba(59,42,40,0.16)]"
                  >
                    <LayoutDashboard size={16} /> Admin Dashboard
                  </Link>
                )}

                {/* ── Customer Section (Wishlist, Cart, Orders) ── */}
                <div className="mt-8 rounded-2xl border border-[rgba(122,0,16,0.12)] bg-white/50 p-4 shadow-sm backdrop-blur-sm">
                  <p className="px-2 pb-3 pt-1 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[rgba(59,42,40,0.6)]">
                    Customer
                  </p>
                  <div className="grid gap-1">
                    {[
                      { href: "/account#wishlist", label: "Wishlist", icon: Heart },
                      { href: "/cart", label: "Cart", icon: ShoppingBag, badge: itemCount },
                      { href: "/account", label: "Orders", icon: PackageCheck },
                    ].map((item) => {
                      const Icon = item.icon;
                      const isProtected = item.label === "Wishlist" || item.label === "Orders";

                      const content = (
                        <div className="flex w-full items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Icon size={18} className="text-[var(--color-maroon)]" />
                            <span className="text-[14px] font-semibold tracking-[0.08em] text-[var(--color-brown)] group-hover:text-[var(--color-maroon)]">
                              {item.label}
                            </span>
                          </div>
                          {item.badge !== undefined && item.badge > 0 && (
                            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[var(--color-maroon)] px-1.5 text-[0.62rem] font-bold text-[var(--color-ivory)]">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      );

                      if (isProtected && !user) {
                        return (
                          <button
                            key={item.label}
                            className="group flex w-full items-center justify-between rounded-xl px-2 py-3 text-left transition hover:bg-[rgba(122,0,16,0.04)] cursor-pointer"
                            onClick={() => {
                              setOpen(false);
                              requireLogin(item.href);
                            }}
                          >
                            {content}
                          </button>
                        );
                      }

                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="group flex items-center justify-between rounded-xl px-2 py-3 transition hover:bg-[rgba(122,0,16,0.04)]"
                        >
                          {content}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom — Login / My Account */}
              <div className="shrink-0 border-t border-[rgba(122,0,16,0.08)] px-6 py-5">
                {user ? (
                  <Link
                    href="/account"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 text-sm font-semibold tracking-[0.18em] text-[var(--color-brown)] transition hover:text-[var(--color-maroon)]"
                  >
                    <UserRound size={17} className="text-[var(--color-maroon)]" />
                    <span>MY ACCOUNT</span>
                  </Link>
                ) : (
                  <button
                    onClick={() => { setOpen(false); requireLogin("/account"); }}
                    className="flex items-center gap-3 text-sm font-semibold tracking-[0.18em] text-[var(--color-brown)] transition hover:text-[var(--color-maroon)]"
                  >
                    <UserRound size={17} className="text-[var(--color-maroon)]" />
                    <span>LOGIN</span>
                  </button>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
