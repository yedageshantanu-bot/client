"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CreditCard, PackageCheck, Scissors, ShieldCheck, Sparkles, Star, Truck } from "lucide-react";
import { ProductCard } from "@/components/shop/ProductCard";
import { useStore } from "@/context/StoreContext";
import { mockTestimonials } from "@/lib/mockData";

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0 },
};

// Defer all motion animations to after hydration to prevent SSR/CSR style mismatch
function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}

const categoryCards = [
  { title: "Wedding Sarees", count: "32 curated drapes", image: "/assets/wedding saree.png" },
  { title: "Silk Sarees", count: "28 luminous silks", image: "/assets/silk saree.png" },
  { title: "Party Wear", count: "24 evening edits", image: "/assets/party clothes.png" },
  { title: "Cotton Sarees", count: "18 soft classics", image: "/assets/cotton saree.png" },
];

const features = [
  { title: "Premium Fabrics", text: "Silks, organza, cottons and festive blends selected for graceful drape.", icon: Sparkles },
  { title: "Handcrafted Finishing", text: "Borders, falls and blouse pairings finished with boutique care.", icon: Scissors },
  { title: "Pan India Delivery", text: "Packed carefully for weddings, rituals and celebrations across India.", icon: Truck },
  { title: "Secure Payments", text: "Checkout stays clean, protected and simple for every order.", icon: CreditCard },
];

function FloralMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 260" aria-hidden="true" className={className}>
      <path className="botanical-line" fill="none" d="M45 217C82 141 136 87 214 48" />
      <path className="botanical-line" fill="none" d="M94 153c-29-22-34-52-16-90 37 28 42 58 16 90Z" />
      <path className="botanical-line" fill="none" d="M135 119c34-28 67-33 100-15-29 34-62 39-100 15Z" />
      <path className="botanical-line" fill="none" d="M71 188c-30-5-50-25-61-60 38 3 59 23 61 60Z" />
      <circle cx="210" cy="47" r="5" fill="currentColor" opacity="0.34" />
    </svg>
  );
}

export default function Home() {
  const { products } = useStore();
  const hydrated = useHydrated();
  const featured = products.filter((item) => item.featured || item.isBestSeller).slice(0, 4);
  const fallbackProducts = products.slice(0, 4);
  const lovedProducts = featured.length ? featured : fallbackProducts;

  return (
    <div className="overflow-hidden bg-[var(--color-ivory)] text-[var(--color-charcoal)]">
      <section className="hero-luxury hero-red-bg relative min-h-[92vh] overflow-hidden pt-24 text-[var(--color-ivory)] md:min-h-screen">
        <span className="hero-shimmer absolute inset-0" />
        <span className="hero-particles absolute inset-0" />
        <span className="mandala-accent absolute left-[8%] top-[18%] hidden h-64 w-64 rounded-full md:block" />
        <span className="mandala-accent absolute bottom-[12%] right-[10%] h-48 w-48 rounded-full opacity-[0.16]" />
        <span className="peacock-accent absolute right-[-4rem] top-[20%] hidden h-80 w-80 md:block" />
        <span className="hero-corner hero-corner-left" />
        <span className="hero-corner hero-corner-right" />
        <FloralMark className="luxury-floral absolute -left-16 bottom-12 h-72 w-72 text-[var(--color-gold-soft)] opacity-[0.12]" />
        <FloralMark className="luxury-floral-reverse absolute right-8 top-24 hidden h-80 w-80 text-[var(--color-gold-soft)] opacity-[0.1] md:block" />
        <span className="petal petal-one" />
        <span className="petal petal-two" />
        <span className="petal petal-three" />
        <span className="gold-dust absolute left-[14%] top-[34%] h-1 w-1 rounded-full bg-[var(--color-gold-soft)]" />
        <span className="gold-dust absolute left-[54%] top-[20%] h-1.5 w-1.5 rounded-full bg-[var(--color-gold-soft)]" />
        <span className="gold-dust absolute left-[82%] top-[58%] h-1 w-1 rounded-full bg-[var(--color-gold-soft)]" />

        <div className="relative z-10 mx-auto flex min-h-[calc(92vh-6rem)] max-w-7xl items-center justify-center px-4 pb-14 pt-10 sm:px-6 md:min-h-[calc(100vh-6rem)] lg:px-8">
          <motion.div
            initial={hydrated ? "hidden" : false}
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.14 } } }}
            className="mx-auto max-w-4xl text-center"
          >
            <motion.div variants={fadeUp} className="mx-auto flex w-fit max-w-full items-center gap-2 sm:gap-4">
              <span className="h-px w-5 bg-[var(--color-gold-soft)] sm:w-14" />
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-gold-soft)]" />
              <p className="font-accent text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[var(--color-gold-soft)] sm:text-sm sm:tracking-[0.46em]">CRAFTED FOR GRACE</p>
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-gold-soft)]" />
              <span className="h-px w-5 bg-[var(--color-gold-soft)] sm:w-14" />
            </motion.div>
            <motion.h1 variants={fadeUp} className="mx-auto mt-7 max-w-[20rem] break-words font-display text-[2.35rem] font-semibold leading-[1.02] text-[var(--color-ivory)] drop-shadow-[0_1.2rem_2.6rem_rgba(0,0,0,0.34)] min-[420px]:text-[3.05rem] sm:max-w-[46rem] sm:text-7xl lg:text-[6.4rem]">
              Alaira Half Saree House
            </motion.h1>
            <motion.div variants={fadeUp} className="mx-auto mt-7 flex w-fit items-center gap-3">
              <span className="h-px w-20 bg-[linear-gradient(90deg,var(--color-gold-soft),transparent)]" />
              <span className="h-1.5 w-1.5 rotate-45 border border-[var(--color-gold-soft)]" />
              <span className="h-px w-20 bg-[linear-gradient(90deg,transparent,var(--color-gold-soft))]" />
            </motion.div>
            <motion.p variants={fadeUp} className="mx-auto mt-7 max-w-[17.5rem] text-[0.82rem] font-medium leading-7 text-[rgba(248,243,235,0.9)] sm:max-w-[38rem] sm:text-xl sm:leading-8">
              Timeless half sarees crafted for weddings, festivals, celebrations and graceful moments.
            </motion.p>
            <motion.div variants={fadeUp} className="mx-auto mt-10 flex w-full max-w-[17.5rem] flex-col justify-center gap-3 sm:max-w-none sm:flex-row">
              <Link href="/collection" className="hero-luxury-button gold-border-sweep inline-flex h-12 w-full min-w-0 items-center justify-center overflow-hidden rounded-full border border-[rgba(226,189,141,0.78)] bg-[var(--color-maroon)] px-3 text-center text-[0.62rem] font-bold uppercase tracking-[0.12em] text-[var(--color-ivory)] shadow-[0_1rem_2.4rem_rgba(38,7,11,0.34)] backdrop-blur transition duration-300 sm:h-13 sm:w-auto sm:px-7 sm:text-xs sm:tracking-[0.2em]">
                Explore Collection
              </Link>
              <Link href="/collection?sort=newest" className="gold-border-sweep inline-flex h-12 w-full min-w-0 items-center justify-center overflow-hidden rounded-full border border-[rgba(226,189,141,0.58)] bg-[rgba(255,250,243,0.08)] px-3 text-center text-[0.62rem] font-bold uppercase tracking-[0.12em] text-[var(--color-ivory)] shadow-[0_1rem_2.4rem_rgba(38,7,11,0.18)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:bg-[rgba(226,189,141,0.18)] hover:text-[var(--color-gold-soft)] sm:h-13 sm:w-auto sm:px-7 sm:text-xs sm:tracking-[0.2em]">
                View New Arrivals
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="relative z-20 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="flex gap-4 rounded-lg border border-[rgba(122,0,16,0.1)] bg-[rgba(255,250,243,0.72)] p-5 shadow-[0_1rem_2.5rem_rgba(59,42,40,0.06)] backdrop-blur">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--color-ivory-2)] text-[var(--color-maroon)]">
                  <Icon size={19} />
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold text-[var(--color-brown)]">{feature.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--color-brand-muted)]">{feature.text}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <FloralMark className="absolute -left-24 top-10 hidden h-64 w-64 text-[var(--color-gold-dark)] opacity-[0.09] lg:block" />
        <FloralMark className="absolute -right-20 bottom-8 hidden h-56 w-56 rotate-180 text-[var(--color-maroon)] opacity-[0.07] lg:block" />
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-accent text-sm font-semibold uppercase tracking-[0.32em] text-[var(--color-maroon)]">Signature edits</p>
              <h2 className="mt-3 font-display text-4xl font-semibold text-[var(--color-brown)] md:text-5xl">Shop by Collection</h2>
            </div>
            <Link href="/collection" className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-maroon)]">View all collections</Link>
          </div>
          <div className="grid gap-5 md:grid-cols-4">
            {categoryCards.map((category) => (
              <Link
                key={category.title}
                href={`/collection?category=${encodeURIComponent(category.title)}`}
                className="group relative aspect-[4/5] overflow-hidden rounded-lg border border-[rgba(122,0,16,0.12)] bg-[var(--color-ivory-2)] shadow-[0_1rem_2.75rem_rgba(59,42,40,0.08)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_1.7rem_3.5rem_rgba(59,42,40,0.15)]"
              >
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-contain object-center p-3 transition duration-700 group-hover:scale-[1.035]"
                />
                <span className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(15,23,42,0.78)_88%)]" />
                <span className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-5">
                  <span className="font-display text-2xl font-semibold leading-tight text-white drop-shadow-sm sm:text-3xl">
                    {category.title}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/90">
                    <span className="h-px w-6 bg-white/60" />
                    {category.count}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="bestsellers" className="bg-[var(--color-ivory-2)] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="font-accent text-sm font-semibold uppercase tracking-[0.32em] text-[var(--color-maroon)]">Featured weekly by admin</p>
            <h2 className="mt-3 font-display text-4xl font-semibold text-[var(--color-brown)] md:text-5xl">Loved This Week</h2>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-4 lg:gap-7">
            {lovedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-4 py-16 sm:px-6 lg:px-8">
        <FloralMark className="absolute left-2 top-4 hidden h-52 w-52 text-[var(--color-gold-dark)] opacity-[0.08] md:block" />
        <div className="relative mx-auto grid max-w-7xl overflow-hidden rounded-lg border border-[rgba(182,139,60,0.34)] bg-[linear-gradient(135deg,#fffaf3_0%,#f8f0e6_54%,#fffaf3_100%)] shadow-[0_1.4rem_3.5rem_rgba(59,42,40,0.07)] lg:grid-cols-[1fr_0.82fr]">
          <div className="relative z-10 p-8 md:p-12 lg:p-14">
            <p className="font-accent text-sm font-semibold uppercase tracking-[0.34em] text-[var(--color-gold-dark)]">Crafted For Grace</p>
            <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-tight text-[var(--color-brown)] md:text-6xl">
              A Celebration Edit for Luminous <span className="text-[var(--color-gold-dark)]">Indian Moments.</span>
            </h2>
            <div className="mt-6 h-px max-w-md bg-[linear-gradient(90deg,var(--color-gold-dark),transparent)]" />
            <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--color-brand-muted)]">
              Curated in the finest fabrics with intricate textures and modern silhouettes, made for every celebration.
            </p>
            <Link href="/collection" className="mt-8 inline-flex h-12 items-center rounded-full border border-[var(--color-gold-dark)] bg-transparent px-7 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-gold-dark)] transition hover:bg-[var(--color-gold)] hover:text-[var(--color-brown)]">
              Discover The Edit
            </Link>
          </div>
          <div className="relative min-h-[19rem] border-t border-[rgba(182,139,60,0.28)] bg-[var(--color-ivory-2)] sm:min-h-[22rem] lg:min-h-0 lg:border-l lg:border-t-0">
            <Image src="/assets/celebration-gold-silk.jpg" alt="Gold silk fabric folds" fill sizes="(max-width: 1024px) 100vw, 42vw" className="object-cover object-center" />
          </div>
        </div>
      </section>

      <section className="container-page relative grid gap-10 py-20 lg:grid-cols-[0.9fr_1fr] lg:items-center">
        <FloralMark className="absolute -right-12 top-10 hidden h-64 w-64 text-[var(--color-gold-dark)] opacity-[0.08] lg:block" />
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-[var(--color-ivory-2)]">
          <Image src="/assets/home page.png" alt="Alaira brand story" fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-contain object-center p-3" />
        </div>
        <div>
          <p className="font-accent text-sm font-semibold uppercase tracking-[0.32em] text-[var(--color-maroon)]">About Alaira</p>
          <h2 className="mt-3 font-display text-4xl font-semibold leading-tight text-[var(--color-brown)] md:text-5xl">
            Traditional Indian elegance, styled for the modern wardrobe.
          </h2>
          <p className="mt-5 text-lg leading-9 text-[var(--color-brand-muted)]">
            Alaira Half Saree House blends traditional Indian elegance with modern fashion styling. Our collections are composed with thoughtful fabrics, refined finishing and graceful colors for women dressing for meaning-filled occasions.
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {["Boutique curation", "Graceful drapes", "Festival-ready colors", "Heritage details"].map((item) => (
              <span key={item} className="flex items-center gap-2 text-sm font-semibold text-[var(--color-brown)]">
                <ShieldCheck size={16} className="text-[var(--color-gold-dark)]" /> {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-ivory-3)] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="font-accent text-sm font-semibold uppercase tracking-[0.32em] text-[var(--color-maroon)]">Customer notes</p>
            <h2 className="mt-3 font-display text-4xl font-semibold text-[var(--color-brown)] md:text-5xl">Grace, in their words</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {mockTestimonials.slice(0, 3).map((review) => (
              <article key={review.name} className="rounded-lg border border-[rgba(122,0,16,0.1)] bg-white/70 p-7 shadow-[0_1rem_2.5rem_rgba(59,42,40,0.06)]">
                <div className="flex gap-1 text-[var(--color-gold-dark)]">{Array.from({ length: review.rating }).map((_, i) => <Star key={i} size={16} fill="currentColor" />)}</div>
                <p className="mt-5 font-display text-2xl leading-8 text-[var(--color-brown)]">&ldquo;{review.comment}&rdquo;</p>
                <p className="mt-5 text-sm font-bold text-[var(--color-maroon)]">{review.name}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-ivory-2)] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-4 text-center text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-brand-muted)]">
          <PackageCheck size={17} className="text-[var(--color-gold-dark)]" />
          Premium packaging for every Alaira order
        </div>
      </section>
    </div>
  );
}
