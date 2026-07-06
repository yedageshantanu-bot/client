import React from "react";
import { Gift, Edit3, Heart, Star } from "lucide-react";

const cards = [
  {
    icon: Gift,
    title: "Customized Hampers",
    body: "Every hamper built around your vision"
  },
  {
    icon: Edit3,
    title: "Personalized For You",
    body: "Your message, your style, your moment"
  },
  {
    icon: Heart,
    title: "Made With Love",
    body: "Handcrafted with care every single time"
  },
  {
    icon: Star,
    title: "Every Occasion",
    body: "From birthdays to just-because moments"
  }
];

export default function WhyChooseUs() {
  return (
    <section data-testid="why-section" className="relative py-16 bg-[#FAF8F5] overflow-hidden">
      
      {/* INFINITE SCROLLING TEXT MARQUEE */}
      <div className="border-y border-[#EEE7FA] bg-[#F5EFE4] py-3.5 flex overflow-hidden select-none">
        <div className="animate-marquee flex gap-12 text-[#1C1924] font-display font-medium text-[13px] tracking-wider uppercase">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="flex gap-12 shrink-0 items-center">
              <span>Delivered With Love</span>
              <span>✦</span>
              <span>100% Handcrafted</span>
              <span>✦</span>
              <span>Customized Just For You</span>
              <span>✦</span>
              <span>Pan-India Delivery</span>
              <span>✦</span>
              <span>Free Gift Wrapping</span>
              <span>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* 4 FEATURE CARDS GRID */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-16 md:mt-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                data-testid={`why-card-${i}`}
                className="bg-white border border-[#EEE7FA] rounded-[28px] p-8 flex flex-col items-center text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#FFF4F7] text-[#E5497C] flex items-center justify-center transition-colors duration-300 group-hover:bg-[#E5497C] group-hover:text-white">
                  <Icon size={20} strokeWidth={1.5} />
                </div>
                <h4 className="mt-5 font-display font-semibold text-[17px] text-[#1C1924] uppercase tracking-wide">
                  {card.title}
                </h4>
                <p className="mt-2 text-[13.5px] text-[#8b8790] leading-relaxed max-w-[200px]">
                  {card.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      
    </section>
  );
}
