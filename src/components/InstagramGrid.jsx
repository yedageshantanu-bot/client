import React from "react";
import { Instagram, Heart } from "lucide-react";

const shots = [
  { src: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=500&q=80" },
  { src: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=500&q=80" },
  { src: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=500&q=80" },
  { src: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=500&q=80" },
  { src: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=500&q=80" },
  { src: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=500&q=80" }
];

export default function InstagramGrid() {
  return (
    <section data-testid="instagram-section" className="relative py-20 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
        
        {/* Centered Heading Block */}
        <div className="mb-10 max-w-xl mx-auto">
          <p className="text-[12px] uppercase tracking-widest font-bold text-gold font-body">
            @alairaluxe
          </p>
          <h2 className="mt-2 font-display font-semibold text-[#1C1924] text-3xl md:text-5xl tracking-tight">
            Follow Our Journey
          </h2>
          <p className="text-[13.5px] text-[#8b8790] mt-2 leading-relaxed font-body">
            Tag us in your unboxing moments — we love seeing your joy!
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-[1px] w-12 bg-[#EEE7FA]" />
            <Heart size={10} className="fill-[#C4A55A] text-[#C4A55A]" />
            <div className="h-[1px] w-12 bg-[#EEE7FA]" />
          </div>
        </div>

        {/* 6 Horizontal Images in a Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {shots.map((s, i) => (
            <a
              key={i}
              data-testid={`ig-shot-${i}`}
              href="https://www.instagram.com/alairaluxe?igsh=cnJ6anh4cXExMHRp"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-[20px] overflow-hidden aspect-square bg-[#FFF4F7] border border-[#EEE7FA]"
            >
              <img
                src={s.src}
                alt={`Instagram highlight ${i + 1}`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
              <div className="absolute inset-x-3 bottom-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition">
                <span className="text-white text-[11px] font-semibold flex items-center gap-1">
                  <Instagram size={11} /> @alairaluxe
                </span>
                <span className="text-white text-[11px] font-semibold flex items-center gap-1">
                  <Heart size={11} className="fill-white" /> {132 + i * 27}
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* Centered Follow us button at the bottom */}
        <div className="mt-8">
          <a
            href="https://www.instagram.com/alairaluxe?igsh=cnJ6anh4cXExMHRp"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#1C1924] border-b-2 border-[#1C1924] pb-0.5 hover:text-[#E5497C] hover:border-[#E5497C] transition duration-300"
          >
            <Instagram size={15} /> Follow @alairaluxe
          </a>
        </div>

      </div>
    </section>
  );
}
