import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, Search, Menu, X, User, LogOut } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/shop", label: "Shop" },
  { to: "/shop/flowers", label: "Combo" },
];

export default function Navbar() {
  const { totals, wishlist } = useStore();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header
      data-testid="site-navbar"
      className="fixed top-0 inset-x-0 z-50"
    >
      <div className="mx-4 md:mx-8 mt-4 glass-card rounded-full px-5 md:px-7 py-3 flex items-center justify-between gap-4">
        <Link to="/" data-testid="nav-logo" className="flex items-center gap-2 group">
          <span className="w-9 h-9 rounded-full grid place-items-center bg-[#1C1924] text-white font-display font-semibold group-hover:scale-105 transition">A</span>
          <span className="font-display font-semibold tracking-tight text-[15px] md:text-[16px] text-[#1C1924]">ALAIRA HOUSE</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              data-testid={`nav-link-${l.label.toLowerCase()}`}
              className={({ isActive }) =>
                `text-[13.5px] font-medium tracking-wide transition-colors ${isActive ? "text-[#1C1924]" : "text-[#4A4652] hover:text-[#1C1924]"}`
              }
              end
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1 md:gap-2">
          <button
            data-testid="nav-search-btn"
            onClick={() => navigate("/shop")}
            className="hidden md:grid w-10 h-10 place-items-center rounded-full hover:bg-[#F4F0FF] transition text-[#1C1924]"
            aria-label="Search"
          >
            <Search size={18} />
          </button>
          
          {user ? (
            <div className="relative group flex items-center">
              <button
                data-testid="nav-profile-btn"
                onClick={() => navigate("/profile")}
                className="w-10 h-10 rounded-full bg-[#F4F0FF] hover:bg-[#FFF4F7] transition text-[#1C1924] font-display font-semibold text-[13px] grid place-items-center cursor-pointer"
              >
                {user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
              </button>
              
              <div className="absolute right-0 top-10 pt-2 w-48 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300">
                <div className="bg-white border border-[#EEE7FA] rounded-2xl shadow-xl p-2 flex flex-col">
                  <div className="px-3 py-2 border-b border-[#EEE7FA] mb-1">
                    <p className="text-[13px] font-semibold text-[#1C1924] truncate">{user.name}</p>
                    <p className="text-[11px] text-[#8b8790] truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-[13px] text-[#1C1924] hover:bg-[#F4F0FF] rounded-xl transition font-medium mb-1"
                  >
                    <User size={14} /> My Profile
                  </Link>
                  <button
                    data-testid="logout-button"
                    onClick={logout}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-[13px] text-red-500 hover:bg-red-50 rounded-xl transition font-medium"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              data-testid="nav-login-btn"
              className="grid w-10 h-10 place-items-center rounded-full hover:bg-[#F4F0FF] transition text-[#1C1924]"
              aria-label="Sign In"
            >
              <User size={18} />
            </Link>
          )}

          <Link
            to="/wishlist"
            data-testid="nav-wishlist-icon"
            className="relative grid w-10 h-10 place-items-center rounded-full hover:bg-[#FFF4F7] transition text-[#1C1924]"
            aria-label="Wishlist"
          >
            <Heart size={18} />
            {wishlist.length > 0 && (
              <span data-testid="nav-wishlist-count" className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#E5497C] text-white text-[10px] font-bold grid place-items-center">{wishlist.length}</span>
            )}
          </Link>
          <Link
            to="/cart"
            data-testid="nav-cart-icon"
            className="relative grid w-10 h-10 place-items-center rounded-full hover:bg-[#EAF5FF] transition text-[#1C1924]"
            aria-label="Cart"
          >
            <ShoppingBag size={18} />
            {totals.itemCount > 0 && (
              <span data-testid="nav-cart-count" className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#1C1924] text-white text-[10px] font-bold grid place-items-center">{totals.itemCount}</span>
            )}
          </Link>
          <button
            data-testid="nav-menu-toggle"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden grid w-10 h-10 place-items-center rounded-full hover:bg-[#F4F0FF] transition text-[#1C1924]"
            aria-label="Menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div data-testid="mobile-menu" className="mx-4 mt-2 glass-card rounded-3xl p-4 md:hidden">
          <div className="flex flex-col">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                data-testid={`mobile-nav-link-${l.label.toLowerCase()}`}
                className="py-3 px-3 rounded-xl text-[#1C1924] hover:bg-white text-[15px] font-medium"
                end
              >
                {l.label}
              </NavLink>
            ))}
            {user ? (
              <>
                <div className="py-2 px-3 border-t border-[#EEE7FA] mt-2 text-[14px]">
                  <p className="font-semibold text-[#1C1924]">{user.name}</p>
                  <p className="text-[12px] text-[#8b8790]">{user.email}</p>
                </div>
                <button
                  data-testid="logout-button"
                  onClick={() => { setOpen(false); logout(); }}
                  className="mt-1 py-3 px-3 rounded-xl text-red-500 hover:bg-red-50 text-[15px] font-medium text-left flex items-center gap-2"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setOpen(false)}
                data-testid="mobile-nav-link-login"
                className="py-3 px-3 rounded-xl text-[#1C1924] hover:bg-white text-[15px] font-medium border-t border-[#EEE7FA] mt-2"
              >
                Sign In
              </NavLink>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
