import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { mockCategories } from "@/lib/mockData";

export function CategorySection() {
  return (
    <section id="collections" className="section bg-white">
      <div className="container-page">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-dark">
              Featured Categories
            </p>
            <h2 className="mt-2 font-display text-5xl font-semibold text-ink">
              Curated by occasion
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-brand-muted">
              Editorial category cards with full-image backgrounds and soft gold
              overlays for wedding, silk, festive, and daily edits.
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden items-center gap-2 text-sm font-semibold text-ink md:flex"
          >
            View all
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {mockCategories.map((category) => (
            <Link
              key={category.name}
              href={`/shop?category=${encodeURIComponent(category.name)}`}
              className="group"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-beige-soft shadow-[0_18px_40px_rgba(40,20,20,0.08)]">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,12,12,0.06)_10%,rgba(18,12,12,0.7)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <h3 className="font-display text-2xl font-semibold">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/75">
                    {category.count} styles
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
