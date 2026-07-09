"use client";

import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { heroSlides } from "@/lib/mockData";
import { Button } from "@/components/ui/Button";

export function HeroSlider() {
  const [active, setActive] = useState(0);
  const slide = heroSlides[active];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % heroSlides.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-beige-soft">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.image}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/75 to-white/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="container-page relative flex min-h-[calc(100vh-4rem)] items-center pb-16 pt-10">
        <motion.div
          key={slide.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="max-w-xl"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-dark">
            {slide.eyebrow}
          </p>
          <h1 className="mt-4 font-display text-6xl font-semibold leading-[0.92] text-ink sm:text-7xl lg:text-8xl">
            {slide.title}
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-brand-muted">
            {slide.description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/shop" size="lg">
              Shop Now
              <ArrowRight size={18} />
            </Button>
            <Button href="/shop" size="lg" variant="outline">
              Explore Collection
            </Button>
          </div>
        </motion.div>
      </div>

      <div className="container-page relative -mt-24 mb-8 flex items-center justify-between">
        <div className="flex gap-2">
          {heroSlides.map((item, index) => (
            <button
              key={item.title}
              className={`h-1.5 rounded-full transition-all ${
                index === active ? "w-10 bg-ink" : "w-5 bg-ink/25"
              }`}
              onClick={() => setActive(index)}
              aria-label={`View slide ${index + 1}`}
            />
          ))}
        </div>
        <div className="hidden gap-2 sm:flex">
          <button
            className="grid h-11 w-11 place-items-center rounded-full border border-brand-border bg-white text-ink transition hover:border-gold"
            onClick={() =>
              setActive((value) =>
                value === 0 ? heroSlides.length - 1 : value - 1,
              )
            }
            aria-label="Previous slide"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            className="grid h-11 w-11 place-items-center rounded-full border border-brand-border bg-white text-ink transition hover:border-gold"
            onClick={() =>
              setActive((value) => (value + 1) % heroSlides.length)
            }
            aria-label="Next slide"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
