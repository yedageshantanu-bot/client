"use client";

import { Check, Heart, PackageCheck, ShieldCheck, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Modal } from "@/components/ui/Modal";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
import { sanitizeInternalPath } from "@/lib/authRules";
import { BrandLogo } from "@/components/layout/BrandLogo";

const features = [
  { label: "Secure Checkout & Order Management", icon: ShieldCheck },
  { label: "Wishlist & Favorites Synchronization", icon: Heart },
  { label: "Real-time Order & Delivery Tracking", icon: PackageCheck },
];

export function LoginModal() {
  const { showLoginModal, setShowLoginModal, authRedirectPath } = useAuth();

  const nextPath = sanitizeInternalPath(authRedirectPath, "/");

  return (
    <Modal
      open={showLoginModal}
      onClose={() => setShowLoginModal(false)}
      title="Welcome to Alaira"
      hideHeader={true}
      contentClassName="p-0"
      className="max-w-md bg-[var(--color-ivory)] border-[rgba(122,0,16,0.18)] shadow-2xl overflow-hidden rounded-[24px]"
    >
      <div className="relative flex flex-col items-center justify-center pt-10 pb-9 text-center overflow-hidden hero-red-bg border-b border-[rgba(212,163,115,0.22)] px-6">
        <div className="absolute inset-0 hero-particles pointer-events-none" />
        <div className="absolute inset-0 hero-shimmer pointer-events-none opacity-60" />
        
        <button
          onClick={() => setShowLoginModal(false)}
          className="absolute right-4 top-4 z-20 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white p-2 transition backdrop-blur-md cursor-pointer"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div className="relative z-10 transition-transform duration-300 hover:scale-[1.05]">
          <BrandLogo className="h-16 w-16" />
        </div>
        <h2 className="relative z-10 font-display text-3xl font-semibold tracking-wide text-white mt-4 leading-tight">
          Welcome to Alaira
        </h2>
        <p className="relative z-10 font-accent text-xs tracking-[0.25em] text-[var(--color-gold-soft)] uppercase mt-1.5 font-medium">
          Crafted For Grace
        </p>
      </div>

      <div className="px-6 pb-8 pt-7 sm:px-8 sm:pb-9 sm:pt-8">
        <p className="text-[13px] leading-relaxed text-brand-muted text-center max-w-sm mx-auto mb-6">
          Sign in to save your wishlist, synchronize cart items, track orders, and experience the premium collection tailored for you.
        </p>

        <div className="grid gap-3 mb-6">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.label}
                className="flex items-center gap-3.5 rounded-[12px] border border-[rgba(212,163,115,0.18)] bg-white/40 hover:bg-white/90 px-4 py-3.5 text-xs sm:text-sm transition-all duration-300 hover:shadow-[0_4px_12px_rgba(122,0,16,0.03)] hover:border-[rgba(212,163,115,0.38)]"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--color-maroon)]/5 text-[var(--color-maroon)] shadow-inner">
                  <Icon size={16} />
                </span>
                <span className="flex-1 font-semibold text-[var(--color-charcoal)] leading-tight">{feature.label}</span>
                <Check size={14} className="text-[var(--color-gold-dark)] shrink-0" />
              </div>
            );
          })}
        </div>

        <div className="relative border-t border-[rgba(122,0,16,0.08)] pt-6">
          <GoogleLoginButton
            fullWidth
            nextPath={nextPath}
            className="h-12 shadow-[0_4px_20px_rgba(122,0,16,0.08)] hover:shadow-[0_6px_25px_rgba(122,0,16,0.12)] border border-[rgba(122,0,16,0.18)] rounded-full text-sm font-semibold tracking-wide transition duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            onSuccess={() => setShowLoginModal(false)}
          />
        </div>
      </div>
    </Modal>
  );
}
