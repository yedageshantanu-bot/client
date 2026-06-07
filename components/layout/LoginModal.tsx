"use client";

import { Check, Heart, PackageCheck, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Modal } from "@/components/ui/Modal";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
import { sanitizeInternalPath } from "@/lib/authRules";
import { BrandLogo } from "@/components/layout/BrandLogo";

const features = [
  { label: "Secure checkout", icon: ShieldCheck },
  { label: "Wishlist sync", icon: Heart },
  { label: "Order tracking", icon: PackageCheck },
];

export function LoginModal() {
  const { showLoginModal, setShowLoginModal, authRedirectPath } = useAuth();

  const nextPath = sanitizeInternalPath(authRedirectPath, "/");

  return (
    <Modal
      open={showLoginModal}
      onClose={() => setShowLoginModal(false)}
      title="Welcome to Alaira"
      className="overflow-hidden border-[rgba(212,163,115,0.38)] bg-[var(--color-ivory)] shadow-[0_2rem_5rem_rgba(59,42,40,0.28)]"
    >
      <div className="px-5 pb-6 sm:px-6 sm:pb-7">
        <div className="relative -mx-5 -mt-5 mb-6 overflow-hidden border-b border-[rgba(212,163,115,0.28)] bg-[linear-gradient(135deg,#fffaf3_0%,#f4e2c3_52%,#7a0010_53%,#3b1518_100%)] px-5 pb-6 pt-8 sm:-mx-6 sm:px-6">
          <div className="absolute right-6 top-6 text-[rgba(255,250,243,0.78)]">
            <Sparkles size={26} />
          </div>
          <div className="w-fit rounded-[8px] bg-[var(--color-maroon)] px-4 py-3 shadow-[0_1rem_2.5rem_rgba(122,0,16,0.2)]">
            <BrandLogo />
          </div>
        </div>

        <p className="text-sm leading-6 text-brand-muted">
          Sign in to save favourites, track orders, and enjoy a seamless shopping experience.
        </p>

        <div className="mt-5 grid gap-2.5">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div key={feature.label} className="flex items-center gap-3 rounded-[8px] border border-[rgba(212,163,115,0.24)] bg-white/70 px-3 py-2.5 text-sm font-semibold text-ink">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-[rgba(122,0,16,0.08)] text-[var(--color-maroon)]">
                  <Icon size={15} />
                </span>
                <span className="flex-1">{feature.label}</span>
                <Check size={15} className="text-gold-dark" />
              </div>
            );
          })}
        </div>

        <GoogleLoginButton
          fullWidth
          nextPath={nextPath}
          className="mt-6 h-12 shadow-[0_1rem_2rem_rgba(122,0,16,0.16)]"
          onSuccess={() => setShowLoginModal(false)}
        />
      </div>
    </Modal>
  );
}
