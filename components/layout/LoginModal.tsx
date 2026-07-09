"use client";

import { X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Modal } from "@/components/ui/Modal";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
import { sanitizeInternalPath } from "@/lib/authRules";
import { BrandLogo } from "@/components/layout/BrandLogo";

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
      className="max-w-sm bg-[var(--color-ivory)] border-[rgba(122,0,16,0.18)] shadow-2xl overflow-hidden rounded-[24px]"
    >
      <div className="relative flex flex-col items-center justify-center pt-8 pb-7 text-center overflow-hidden hero-red-bg border-b border-[rgba(212,163,115,0.22)] px-6">
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
          <BrandLogo className="h-14 w-14" />
        </div>
        <h2 className="relative z-10 font-display text-2xl font-semibold tracking-wide text-white mt-3 leading-tight">
          Welcome to Alaira
        </h2>
        <p className="relative z-10 font-accent text-[10px] tracking-[0.25em] text-[var(--color-gold-soft)] uppercase mt-1 font-medium">
          Crafted For Grace
        </p>
      </div>

      <div className="px-6 py-7 sm:px-8 sm:py-8">
        <p className="text-[13px] leading-relaxed text-brand-muted text-center max-w-sm mx-auto mb-6">
          Sign in to save your wishlist, synchronize cart items, track orders, and experience the premium collection tailored for you.
        </p>

        <div className="mb-2">
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
