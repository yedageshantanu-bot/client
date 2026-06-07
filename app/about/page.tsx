import Image from "next/image";
import Link from "next/link";
import { Camera, Leaf, MapPin, Sparkles, WandSparkles } from "lucide-react";
import { contactDetails } from "@/lib/constants";
import { mockProducts } from "@/lib/mockData";

const values = [
  { title: "Craftsmanship", text: "Careful finishes, thoughtful drapes, and details that honor handwork.", icon: WandSparkles },
  { title: "Sustainability", text: "Small-batch curation that values longevity over disposable occasion wear.", icon: Leaf },
  { title: "Celebrate Womanhood", text: "Pieces designed for confidence, softness, and presence at every celebration.", icon: Sparkles },
];

export default function AboutPage() {
  return (
    <div className="bg-[var(--color-ivory)] pt-20 text-[var(--color-charcoal)]">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_35%_35%,#3D0C0C,#1A0606)] px-4 py-16 text-[var(--color-ivory)] sm:px-6 sm:py-24 lg:px-8">
        <svg viewBox="0 0 300 220" className="absolute right-8 top-10 h-52 text-[var(--color-gold)] opacity-[0.07]" aria-hidden="true">
          <path className="botanical-line" fill="none" d="M30 180c80-88 153-122 220-103" />
          <path className="botanical-line" fill="none" d="M110 129c-15-38-1-71 41-98 17 45 3 78-41 98Z" />
          <path className="botanical-line" fill="none" d="M173 102c34-26 69-27 105-4-38 31-73 32-105 4Z" />
        </svg>
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.34em] text-[var(--color-gold-soft)]">Crafted for Grace</p>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-none sm:text-7xl md:text-8xl">Our Story</h1>
        </div>
      </section>

      <section className="container-page grid gap-10 py-20 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--color-maroon)]">Alaira Half Saree House</p>
          <h2 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-5xl">Born from timeless Indian craftsmanship.</h2>
        </div>
        <div className="space-y-5 text-base leading-8 text-[var(--color-brand-muted)] sm:text-lg sm:leading-9">
          <p>Alaira was born from a love for timeless Indian craftsmanship and the quiet confidence of a beautifully draped half saree. Our collections bring together graceful silhouettes, luminous festive palettes, and traditional finishing details for women dressing for weddings, rituals, and cherished family moments.</p>
          <p>We blend modern styling with heritage weaving cues, creating pieces that feel rooted without feeling dated. Every edit is chosen for movement, comfort, and that special sense of occasion that makes a celebration unforgettable.</p>
          <p>From bridal maroons to soft champagne accents, Alaira celebrates womanhood with warmth, elegance, and cultural memory.</p>
        </div>
      </section>

      <section className="bg-[var(--color-ivory-2)] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <article key={value.title} className="rounded-lg border border-[rgba(201,168,76,0.28)] bg-[var(--color-ivory-3)] p-6 sm:p-7">
                <Icon className="text-[var(--color-gold)]" />
                <h3 className="mt-6 font-display text-2xl font-semibold sm:mt-8 sm:text-3xl">{value.title}</h3>
                <p className="mt-3 leading-7 text-[var(--color-brand-muted)]">{value.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="container-page py-20">
        <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--color-maroon)]">Meet the Artisans</p>
            <h2 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">Hands behind the grace</h2>
          </div>
          <Link href="/contact" className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-maroon)]">Visit us -&gt;</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {mockProducts.slice(0, 3).map((product, index) => {
            const src = typeof product.images?.[0] === "string" ? product.images[0] : product.images?.[0]?.url;
            return (
              <article key={product._id} className="overflow-hidden rounded-lg border border-[rgba(201,168,76,0.28)] bg-[var(--color-ivory-3)]">
                <div className="relative aspect-[4/3]">{src && <Image src={src} alt={product.title} fill sizes="33vw" className="object-cover" />}</div>
                <div className="p-6">
                  <h3 className="font-display text-2xl font-semibold sm:text-3xl">Artisan Studio {index + 1}</h3>
                  <p className="mt-2 leading-7 text-[var(--color-brand-muted)]">Specialists in borders, drape finishing, and celebration-ready detail.</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="container-page pb-20">
        <div className="rounded-lg bg-[var(--color-dark-red)] p-7 text-[var(--color-ivory)] md:p-10">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">Contact Alaira</h2>
          <p className="mt-4 flex gap-3 text-[rgba(250,243,224,0.78)]"><MapPin className="shrink-0 text-[var(--color-gold)]" /> {contactDetails.addressLines.join(" ")}</p>
          <a href={contactDetails.instagramUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-[var(--color-gold-soft)]"><Camera size={18} /> Follow {contactDetails.instagramHandle}</a>
        </div>
      </section>
    </div>
  );
}
