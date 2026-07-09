import Link from "next/link";
import { Camera, Mail, MapPin, Phone, Send } from "lucide-react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { contactDetails, navLinks } from "@/lib/constants";

function FooterFloral() {
  return (
    <svg viewBox="0 0 260 260" aria-hidden="true" className="absolute -right-12 top-8 h-72 w-72 text-[var(--color-gold-soft)] opacity-[0.08]">
      <path className="botanical-line" fill="none" d="M45 217C82 141 136 87 214 48" />
      <path className="botanical-line" fill="none" d="M94 153c-29-22-34-52-16-90 37 28 42 58 16 90Z" />
      <path className="botanical-line" fill="none" d="M135 119c34-28 67-33 100-15-29 34-62 39-100 15Z" />
      <path className="botanical-line" fill="none" d="M71 188c-30-5-50-25-61-60 38 3 59 23 61 60Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[var(--color-brown)] text-[var(--color-ivory)]" suppressHydrationWarning>
      <FooterFloral />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.15fr_0.8fr_0.8fr_1.25fr] lg:px-8">
        <div>
          <BrandLogo className="h-14 w-14" />
          <p className="font-accent mt-4 text-lg uppercase tracking-[0.22em] text-[var(--color-gold-soft)]">
            Gifts of Love
          </p>
          <p className="mt-5 max-w-sm text-sm leading-7 text-[rgba(248,243,235,0.72)]">
            CupidAura is a premium aesthetic gift boutique designed for couples. Find the perfect cute toys, elegant promise jewelry, and curated surprise combos for your loved ones.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--color-gold-soft)]">Quick Links</h3>
          <div className="mt-5 grid gap-3 text-sm text-[rgba(248,243,235,0.74)]">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-[var(--color-gold-soft)]">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--color-gold-soft)]">Categories</h3>
          <div className="mt-5 grid gap-3 text-sm text-[rgba(248,243,235,0.74)]">
            {["Cute Plushies", "Fine Jewelry", "Romantic Combos", "Matching Pieces", "Sweet Surprises"].map((item) => (
              <Link key={item} href={`/collection?category=${encodeURIComponent(item)}`} className="transition hover:text-[var(--color-gold-soft)]">
                {item}
              </Link>
            ))}
            {["Shipping Policy", "Returns", "FAQs"].map((item) => (
              <Link key={item} href="/contact" className="transition hover:text-[var(--color-gold-soft)]">
                {item}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--color-gold-soft)]">Contact Info</h3>
          <div className="mt-5 grid gap-4 text-sm leading-6 text-[rgba(248,243,235,0.74)]">
            <a className="flex gap-3 transition hover:text-[var(--color-gold-soft)]" href={`mailto:${contactDetails.email}`}>
              <Mail size={17} className="mt-1 shrink-0 text-[var(--color-gold)]" />
              {contactDetails.email}
            </a>
            <a className="flex gap-3 transition hover:text-[var(--color-gold-soft)]" href={`tel:${contactDetails.phone.replace(/\s/g, "")}`}>
              <Phone size={17} className="mt-1 shrink-0 text-[var(--color-gold)]" />
              {contactDetails.phone}
            </a>
            <span className="flex gap-3">
              <MapPin size={17} className="mt-1 shrink-0 text-[var(--color-gold)]" />
              <span>{contactDetails.addressLines.join(" ")}</span>
            </span>
            <a href={contactDetails.instagramUrl} target="_blank" rel="noreferrer" className="flex gap-3 transition hover:text-[var(--color-gold-soft)]">
              <Camera size={17} className="mt-1 text-[var(--color-gold)]" />
              Instagram: {contactDetails.instagramHandle}
            </a>
          </div>
          <form className="mt-7 flex rounded-full border border-[rgba(212,163,115,0.28)] bg-white/5 p-1">
            <input aria-label="Newsletter email" placeholder="Email for new drops" className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-white/45" />
            <button type="button" className="grid h-10 w-10 place-items-center rounded-full bg-[var(--color-gold)] text-[var(--color-brown)]" aria-label="Subscribe">
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-[rgba(212,163,115,0.18)] px-4 py-5 text-center text-xs text-[rgba(248,243,235,0.62)]">
        © 2026 CupidAura. All rights reserved. Made with love for couples.
      </div>
    </footer>
  );
}
