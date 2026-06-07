"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  Boxes,
  ChevronDown,
  ChevronRight,
  Command,
  ExternalLink,
  Gauge,
  HelpCircle,
  LayoutGrid,
  LogOut,
  LucideIcon,
  Menu,
  Package,
  Plus,
  ReceiptText,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Tag,
  UsersRound,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";
import { brandName } from "@/lib/brand";
import { cn, getInitials } from "@/lib/utils";

type AdminLink = {
  href: string;
  label: string;
  icon: LucideIcon;
  match: (path: string) => boolean;
  description: string;
  badge?: (counts: Counts) => { label: string; tone: "default" | "dark" } | null;
};

type Counts = {
  orders: number;
  pendingOrders: number;
  products: number;
  lowStock: number;
  customers: number;
  coupons: number;
};

const adminLinks: AdminLink[] = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: Gauge,
    match: (path) => path === "/admin",
    description: "Store overview",
  },
  {
    href: "/admin/products",
    label: "Products",
    icon: Boxes,
    match: (path) => path.startsWith("/admin/products"),
    description: "Catalog & stock",
    badge: (c) =>
      c.lowStock > 0
        ? { label: `${c.lowStock} low`, tone: "dark" }
        : { label: String(c.products), tone: "default" },
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: ReceiptText,
    match: (path) => path.startsWith("/admin/orders"),
    description: "Deliveries & invoices",
    badge: (c) =>
      c.pendingOrders > 0
        ? { label: `${c.pendingOrders} new`, tone: "dark" }
        : { label: String(c.orders), tone: "default" },
  },
  {
    href: "/admin/customers",
    label: "Customers",
    icon: UsersRound,
    match: (path) => path.startsWith("/admin/customers"),
    description: "Buyers & LTV",
    badge: (c) => ({ label: String(c.customers), tone: "default" }),
  },
  {
    href: "/admin/coupons",
    label: "Coupons",
    icon: Tag,
    match: (path) => path.startsWith("/admin/coupons"),
    description: "Promo codes",
    badge: (c) => ({ label: `${c.coupons} live`, tone: "default" }),
  },
  {
    href: "/admin/cms",
    label: "Content",
    icon: LayoutGrid,
    match: (path) => path.startsWith("/admin/cms"),
    description: "Homepage sections",
  },
];

const systemLinks: {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
  meta: string;
}[] = [
  {
    href: "/admin/settings",
    label: "Settings",
    icon: Settings,
    description: "Brand, payments & shipping",
    meta: "Configure",
  },
  {
    href: "/admin/help",
    label: "Help & docs",
    icon: HelpCircle,
    description: "Guides, shortcuts & support",
    meta: "Open",
  },
];

const breadcrumbMap: Record<string, string> = {
  "/admin": "Overview",
  "/admin/products": "Products",
  "/admin/orders": "Orders",
  "/admin/customers": "Customers",
  "/admin/coupons": "Coupons",
  "/admin/cms": "Content",
  "/admin/settings": "Settings",
  "/admin/help": "Help & docs",
};

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/admin";
  const { user, logout } = useAuth();
  const { orders, products, coupons, customers } = useStore();
  const [profileOpen, setProfileOpen] = useState(false);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [now, setNow] = useState<string>("");
  const profileRef = useRef<HTMLDivElement | null>(null);
  const quickRef = useRef<HTMLDivElement | null>(null);

  // Live clock — defer first paint to client to avoid SSR/CSR mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const update = () =>
      setNow(
        new Date().toLocaleString("en-IN", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    update();
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, []);

  // Close popovers on outside click
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
      if (
        quickRef.current &&
        !quickRef.current.contains(event.target as Node)
      ) {
        setQuickCreateOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  const counts = useMemo<Counts>(() => {
    const pendingOrders = orders.filter(
      (order) => order.deliveryStatus === "Pending",
    ).length;
    const lowStock = products.filter(
      (product) => Number(product.stock) <= 5,
    ).length;
    const activeCoupons = coupons.filter((coupon) => coupon.isActive).length;
    return {
      orders: orders.length,
      pendingOrders,
      products: products.length,
      lowStock,
      customers: customers.length,
      coupons: activeCoupons,
    };
  }, [coupons, customers, orders, products]);

  const activeLink =
    adminLinks.find((link) => link.match(pathname)) ?? adminLinks[0];
  const breadcrumbLabel = breadcrumbMap[pathname] || activeLink.label;

  return (
    <div
      className="admin-shell min-h-screen bg-white text-[#0f172a]"
      suppressHydrationWarning
    >
      {/* Mobile drawer overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          mobileNavOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setMobileNavOpen(false)}
        aria-hidden
      />

      {/* Mobile slide-over drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[280px] transform border-r border-[rgba(255,255,255,0.06)] bg-[#000000] text-white shadow-2xl transition-transform duration-300 ease-out lg:hidden",
          mobileNavOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Sidebar
          counts={counts}
          pathname={pathname}
          onNavigate={() => setMobileNavOpen(false)}
          userName={user?.name || "Admin"}
          email={user?.email || ""}
          onSignOut={() => void logout()}
        />
      </div>

      <div className="flex">
        {/* Desktop fixed sidebar — never moves, full viewport height */}
        <aside
          className="fixed inset-y-0 left-0 z-40 hidden w-[280px] border-r border-[rgba(255,255,255,0.06)] bg-[#000000] text-white lg:block"
          suppressHydrationWarning
        >
          <Sidebar
            counts={counts}
            pathname={pathname}
            userName={user?.name || "Admin"}
            email={user?.email || ""}
            onSignOut={() => void logout()}
          />
        </aside>

        {/* Main column — gets pushed right by sidebar width, NO inner scroll, browser scrolls the whole page */}
        <div className="min-w-0 flex-1 bg-white lg:ml-[280px]">
          {/* Top bar — flows with the page (no sticky) so the single browser scrollbar handles everything */}
          <header className="sticky top-0 z-30 border-b border-[#e2e8f0] bg-white/95 backdrop-blur-md">
            <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                className="grid h-9 w-9 place-items-center rounded-lg border border-[#e2e8f0] bg-white text-[#0f172a] transition hover:bg-[#f8fafc] lg:hidden"
                aria-label="Open menu"
              >
                <Menu size={16} />
              </button>

              <Link
                href="/admin"
                className="flex items-center gap-2 lg:hidden"
              >
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#0f172a] text-white">
                  <Sparkles className="h-4 w-4" />
                </span>
                <span className="text-sm font-bold text-[#0f172a]">
                  {brandName}
                </span>
              </Link>

              <Breadcrumb label={breadcrumbLabel} />

              <div className="ml-auto flex items-center gap-2">
                <div className="hidden items-center gap-2 rounded-xl border border-[#e2e8f0] bg-white px-3 py-1.5 md:flex">
                  <Search size={14} className="text-[#64748b]" />
                  <span className="text-xs text-[#64748b]">
                    Search orders, products, customers…
                  </span>
                  <span className="ml-3 inline-flex items-center gap-0.5 rounded-md border border-[#e2e8f0] bg-[#f8fafc] px-1.5 py-0.5 text-[10px] font-semibold text-[#64748b]">
                    <Command size={10} /> K
                  </span>
                </div>

                <span className="hidden items-center gap-2 rounded-xl border border-[#e2e8f0] bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#64748b] xl:inline-flex" suppressHydrationWarning>
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#0f172a]" />
                  {mounted ? now || "Syncing…" : "Syncing…"}
                </span>

                <Link
                  href="/"
                  target="_blank"
                  className="hidden items-center gap-1.5 rounded-xl border border-[#e2e8f0] bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-widest text-[#0f172a] transition hover:bg-[#f8fafc] md:inline-flex"
                >
                  <ExternalLink size={12} /> Storefront
                </Link>

                <div className="relative" ref={quickRef}>
                  <button
                    type="button"
                    onClick={() => setQuickCreateOpen((v) => !v)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#0f172a] px-3 text-[11px] font-semibold uppercase tracking-widest text-white transition hover:bg-[#1e293b]"
                  >
                    <Plus size={14} /> Create
                  </button>
                  {quickCreateOpen && (
                    <div className="absolute right-0 z-40 mt-2 w-56 overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-xl">
                      <p className="border-b border-[#e2e8f0] bg-[#f8fafc] px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#64748b]">
                        Quick create
                      </p>
                      <div className="grid">
                        <QuickCreateItem
                          href="/admin/products"
                          icon={Package}
                          label="Product"
                          onSelect={() => setQuickCreateOpen(false)}
                        />
                        <QuickCreateItem
                          href="/admin/coupons"
                          icon={Tag}
                          label="Coupon"
                          onSelect={() => setQuickCreateOpen(false)}
                        />
                        <QuickCreateItem
                          href="/admin/customers"
                          icon={UsersRound}
                          label="Customer"
                          onSelect={() => setQuickCreateOpen(false)}
                        />
                        <QuickCreateItem
                          href="/admin/cms"
                          icon={LayoutGrid}
                          label="Collection"
                          onSelect={() => setQuickCreateOpen(false)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="grid h-9 w-9 place-items-center rounded-xl border border-[#e2e8f0] bg-white text-[#0f172a] transition hover:bg-[#f8fafc]"
                  aria-label="Notifications"
                >
                  <Bell size={15} />
                </button>

                <div className="relative" ref={profileRef}>
                  <button
                    type="button"
                    onClick={() => setProfileOpen((v) => !v)}
                    className="flex items-center gap-2 rounded-xl border border-[#e2e8f0] bg-white py-1 pl-1 pr-2.5 text-left transition hover:bg-[#f8fafc]"
                  >
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#0f172a] text-[10px] font-bold uppercase tracking-wider text-white">
                      {user ? getInitials(user.name) : "AD"}
                    </span>
                    <span className="hidden sm:block">
                      <span className="block max-w-[120px] truncate text-[12px] font-semibold text-[#0f172a]">
                        {user?.name || "Admin"}
                      </span>
                      <span className="block text-[9px] font-semibold uppercase tracking-widest text-[#64748b]">
                        Owner
                      </span>
                    </span>
                    <ChevronDown size={13} className="text-[#64748b]" />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 z-40 mt-2 w-72 overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-xl">
                      <div className="border-b border-[#e2e8f0] bg-[#f8fafc] px-4 py-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748b]">
                          Admin account
                        </p>
                        <p className="mt-0.5 truncate text-sm font-semibold text-[#0f172a]">
                          {user?.name || "Admin"}
                        </p>
                        <p
                          className="mt-0.5 truncate text-[11px] text-[#64748b]"
                          style={{ wordBreak: "break-all" }}
                        >
                          {user?.email}
                        </p>
                      </div>
                      <div className="grid gap-0.5 p-1.5 text-sm text-[#0f172a]">
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-[#f8fafc]"
                          onClick={() => setProfileOpen(false)}
                        >
                          <Gauge size={14} className="text-[#64748b]" />
                          Dashboard
                        </Link>
                        <Link
                          href="/account"
                          className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-[#f8fafc]"
                          onClick={() => setProfileOpen(false)}
                        >
                          <ShieldCheck size={14} className="text-[#64748b]" />
                          Account security
                        </Link>
                        <Link
                          href="/admin/cms"
                          className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-[#f8fafc]"
                          onClick={() => setProfileOpen(false)}
                        >
                          <Settings size={14} className="text-[#64748b]" />
                          Store settings
                        </Link>
                        <hr className="my-1 border-[#e2e8f0]" />
                        <button
                          type="button"
                          onClick={() => {
                            setProfileOpen(false);
                            void logout();
                          }}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-[#0f172a] hover:bg-[#f8fafc]"
                        >
                          <LogOut size={14} className="text-[#64748b]" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Content area */}
          <main className="min-w-0 flex-1 bg-white">
            <div className="mx-auto w-full max-w-[1500px] px-4 pb-12 pt-6 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   UNIFIED SIDEBAR COMPONENT
   - 280px wide
   - 100vh height
   - flex column
   - Header: pinned (no scroll)
   - Nav: only this scrolls
   - Footer: pinned (no scroll)
   - Background: #000000
   - Border: 1px solid rgba(255,255,255,0.06)
   - Hover: subtle white overlay
   - Active: white pill / black text
   - 300ms ease transitions
   ============================================================ */
function Sidebar({
  counts,
  pathname,
  onNavigate,
  userName,
  email,
  onSignOut,
}: {
  counts: Counts;
  pathname: string;
  onNavigate?: () => void;
  userName: string;
  email: string;
  onSignOut: () => void;
}) {
  return (
    <nav
      className="flex h-screen w-full flex-col bg-[#000000] text-white"
      aria-label="Admin navigation"
    >
      {/* === FIXED HEADER === */}
      <div
        className={cn(
          "flex shrink-0 items-center gap-3 border-b border-[rgba(255,255,255,0.06)] px-6 py-5",
        )}
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-[#08142E]">
          <Sparkles className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-bold leading-tight text-white">
            {brandName}
          </p>
          <p className="mt-0.5 truncate text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">
            Admin console
          </p>
        </div>
        {onNavigate && (
          <button
            type="button"
            onClick={onNavigate}
            className="grid h-8 w-8 place-items-center rounded-lg text-white/70 transition hover:bg-[rgba(255,255,255,0.08)] hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* === SCROLLABLE NAVIGATION === */}
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3 sidebar-scroll">
        <NavSection title="Store">
          {adminLinks.map((link) => (
            <NavLink
              key={link.href}
              link={link}
              active={link.match(pathname)}
              counts={counts}
            />
          ))}
        </NavSection>

        <NavSection title="System">
          {systemLinks.map((link) => (
            <SystemLink
              key={link.label}
              href={link.href}
              label={link.label}
              icon={link.icon}
              description={link.description}
              meta={link.meta}
            />
          ))}
        </NavSection>

        {/* Store status card (inside scrollable area) */}
        <div className="mt-4 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-white/[0.03] p-4">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-bold uppercase tracking-widest text-white/70">
              Store status
            </p>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#08142E] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white" /> Live
            </span>
          </div>
          <p className="mt-2 text-[11px] leading-snug text-white/70">
            All systems operational
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-black/40 px-2 py-1.5">
              <p className="text-[8px] font-bold uppercase tracking-widest text-white/50">
                Plan
              </p>
              <p className="text-[11px] font-semibold text-white">Boutique</p>
            </div>
            <div className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-black/40 px-2 py-1.5">
              <p className="text-[8px] font-bold uppercase tracking-widest text-white/50">
                Storage
              </p>
              <p className="text-[11px] font-semibold text-white">68% used</p>
            </div>
          </div>
        </div>
      </div>

      {/* === FIXED FOOTER (pinned to bottom) === */}
      <div className="shrink-0 border-t border-[rgba(255,255,255,0.06)] bg-[#000000] p-4">
        <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-white/[0.03] p-3">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-[11px] font-bold uppercase tracking-wider text-[#08142E]">
              {getInitials(userName)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold leading-tight text-white">
                {userName}
              </p>
              <p
                className="mt-0.5 break-all text-[10px] leading-snug text-white/70"
                style={{ wordBreak: "break-all" }}
              >
                {email}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-black py-2 text-[10px] font-bold uppercase tracking-widest text-white/70 transition duration-300 hover:border-white/20 hover:bg-[rgba(255,255,255,0.08)] hover:text-white"
          >
            <LogOut size={12} /> Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}

function NavSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-2">
      <p className="px-3 pb-2 pt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#475569]">
        {title}
      </p>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}

function NavLink({
  link,
  active,
  counts,
}: {
  link: AdminLink;
  active: boolean;
  counts: Counts;
}) {
  const Icon = link.icon;
  const badge = link.badge?.(counts);
  return (
    <Link
      href={link.href}
      className={cn(
        "group flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium transition duration-300 ease-out",
        active
          ? "bg-[#08142E] text-white shadow-lg"
          : "text-white/80 hover:bg-[rgba(255,255,255,0.08)] hover:text-white",
      )}
    >
      <span
        className={cn(
          "grid h-7 w-7 shrink-0 place-items-center rounded-lg transition duration-300",
          active
            ? "bg-white text-[#08142E]"
            : "bg-[rgba(255,255,255,0.06)] text-white/80 group-hover:bg-[rgba(255,255,255,0.12)] group-hover:text-white",
        )}
      >
        <Icon size={14} />
      </span>
      <span className="min-w-0 flex-1 truncate">{link.label}</span>
      {badge && (
        <span
          className={cn(
            "shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider transition duration-300",
            active
              ? "bg-white/15 text-white"
              : badge.tone === "dark"
              ? "bg-white/15 text-white"
              : "bg-[rgba(255,255,255,0.08)] text-white/70",
          )}
        >
          {badge.label}
        </span>
      )}
    </Link>
  );
}

function SystemLink({
  href,
  label,
  icon: Icon,
  description,
  meta,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
  meta: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-xl border border-[rgba(255,255,255,0.06)] bg-white/[0.02] p-3 transition duration-300 ease-out hover:border-white/15 hover:bg-[rgba(255,255,255,0.05)]"
    >
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.04)] text-white/70 transition duration-300 group-hover:border-white/20 group-hover:bg-white/10 group-hover:text-white">
        <Icon size={14} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="truncate text-[12px] font-semibold text-white">
            {label}
          </span>
          <ChevronRight
            size={12}
            className="shrink-0 text-white/50 transition duration-300 group-hover:translate-x-0.5 group-hover:text-white"
          />
        </span>
        <span className="mt-0.5 block truncate text-[10px] leading-snug text-white/70">
          {description}
        </span>
        <span className="mt-1.5 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-white/70">
          {meta}
          <span className="h-1 w-1 rounded-full bg-white/30" />
          <kbd className="rounded border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-1 py-px text-[8px] font-mono text-white/70">
            {label === "Settings" ? "⌘ ," : "?"}
          </kbd>
        </span>
      </span>
    </Link>
  );
}

function Breadcrumb({ label }: { label: string }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="hidden items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#64748b] md:flex"
    >
      <span>Admin</span>
      <ChevronRight size={12} className="opacity-50" />
      <span className="text-[#0f172a]">{label}</span>
    </nav>
  );
}

function QuickCreateItem({
  href,
  icon: Icon,
  label,
  onSelect,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  onSelect: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onSelect}
      className="flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-medium text-[#0f172a] transition hover:bg-[#f8fafc]"
    >
      <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#f8fafc] text-[#0f172a]">
        <Icon size={13} />
      </span>
      {label}
    </Link>
  );
}



