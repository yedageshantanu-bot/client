import React, { useEffect, useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

const REVIEWS = [
  {
    couple: "Ananya Sharma, for her mom",
    location: "Delhi ↔ Jaipur",
    text: "Sent the Twin Hearts Interlocking Pendant to my mother on her birthday. She wore it to a family dinner and hasn't taken it off since. Wrapped like a dream.",
    img: "/jewelley/IMG_3611.JPG.jpeg",
    gift: "Twin Hearts Interlocking Pendant",
  },
  {
    couple: "Rohit Kumar",
    location: "Bengaluru",
    text: "Bought the Calming Lavender Plush Bear for myself, no shame. The lavender scent is very soothing and the plush toy is extremely soft.",
    img: "/toys/IMG_2867.JPG.jpeg",
    gift: "Calming Lavender Plush Bear",
  },
  {
    couple: "Suresh & Meena",
    location: "Mumbai ↔ Pune",
    text: "The Crimson Velvet Rose Bouquet arrived by evening. Anniversary saved! My wife messaged our whole group. Fresh, beautiful, and wonderful presentation.",
    img: "/flowers/IMG_3520.JPG.jpeg",
    gift: "Crimson Velvet Rose Bouquet",
  },
];

export default function Testimonials() {
  const [i, setI] = useState(0);
  const total = REVIEWS.length;
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % total), 6000);
    return () => clearInterval(t);
  }, [total]);
  const r = REVIEWS[i];

  return (
    <section data-testid="testimonials-section" className="relative py-20 md:py-28 lavender-mesh">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-2xl mb-12">
          <p className="overline">Whispered by couples</p>
          <h2 className="mt-3 font-display font-semibold text-[#1C1924] text-3xl md:text-5xl tracking-tight">The letters we get back.</h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-5 relative rounded-[24px] overflow-hidden aspect-[4/5] lg:aspect-auto">
            <img key={r.img} src={r.img} alt={r.couple} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500" />
            <div className="absolute inset-x-4 bottom-4 glass-card rounded-2xl p-3.5">
              <p className="text-[12px] text-[#4A4652]">Gifted:</p>
              <p className="font-display font-semibold text-[14px] text-[#1C1924]">{r.gift}</p>
            </div>
          </div>

          <div className="lg:col-span-7 glass-card rounded-[24px] p-8 md:p-12 flex flex-col justify-between">
            <div>
              <Quote className="text-[#E5497C]" size={36} />
              <p key={r.text} className="mt-5 font-serif-italic text-[#1C1924] text-[24px] md:text-[32px] leading-[1.35]">“{r.text}”</p>
              <div className="mt-6 flex items-center gap-3">
                {[...Array(5)].map((_, k) => <Star key={k} size={15} className="fill-[#E5497C] text-[#E5497C]" />)}
              </div>
              <p className="mt-4 font-display font-semibold text-[#1C1924]">{r.couple}</p>
              <p className="text-[13px] text-[#8b8790]">{r.location}</p>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <div className="flex gap-1.5">
                {REVIEWS.map((_, idx) => (
                  <button
                    key={idx}
                    data-testid={`testimonial-dot-${idx}`}
                    onClick={() => setI(idx)}
                    className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-[#1C1924]" : "w-3 bg-[#1C1924]/20"}`}
                    aria-label={`Review ${idx + 1}`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button data-testid="testimonial-prev" onClick={() => setI((v) => (v - 1 + total) % total)} className="w-10 h-10 grid place-items-center rounded-full bg-white border border-[#EEE7FA] hover:bg-[#F4F0FF]" aria-label="Previous"><ChevronLeft size={16} /></button>
                <button data-testid="testimonial-next" onClick={() => setI((v) => (v + 1) % total)} className="w-10 h-10 grid place-items-center rounded-full bg-[#1C1924] text-white hover:opacity-90" aria-label="Next"><ChevronRight size={16} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
