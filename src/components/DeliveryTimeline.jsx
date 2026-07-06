import React from "react";
import { ShoppingBag, PenLine, Gift, Truck, Heart } from "lucide-react";

const steps = [
  { icon: ShoppingBag, label: "Order", body: "Choose your gift" },
  { icon: PenLine, label: "Personalize", body: "Add a note" },
  { icon: Gift, label: "Gift Wrap", body: "Hand-tied ribbon" },
  { icon: Truck, label: "Ship", body: "Insured & tracked" },
  { icon: Heart, label: "Delivered with love", body: "Their happy day" },
];

export default function DeliveryTimeline() {
  return (
    <section data-testid="delivery-section" className="relative py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="overline">The Alaira process</p>
          <h2 className="mt-3 font-display font-semibold text-[#1C1924] text-3xl md:text-5xl tracking-tight">From your heart, to their doorstep.</h2>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-8 left-[6%] right-[6%] h-[3px] rounded-full timeline-line opacity-90" />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-4 relative">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const tints = ["#FFF4F7", "#F4F0FF", "#EAF5FF", "#F4F0FF", "#FFF4F7"];
              return (
                <div key={i} data-testid={`delivery-step-${i}`} className="flex flex-col items-center text-center">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full grid place-items-center bg-white shadow-[0_10px_30px_rgba(28,25,36,0.08)] border border-white" style={{ boxShadow: `0 12px 30px ${tints[i]}` }}>
                      <div className="w-11 h-11 rounded-full grid place-items-center text-[#1C1924]" style={{ background: tints[i] }}>
                        <Icon size={18} />
                      </div>
                    </div>
                    <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#1C1924] text-white text-[10px] font-bold grid place-items-center">{i + 1}</span>
                  </div>
                  <p className="mt-4 font-display font-semibold text-[#1C1924] text-[15px]">{s.label}</p>
                  <p className="text-[12.5px] text-[#4A4652] mt-0.5">{s.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
