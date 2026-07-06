import React, { useEffect, useState } from "react";
import { getCombos } from "@/lib/api";
import { useStore } from "@/context/StoreContext";
import { formatINR } from "@/lib/format";
import { Check, Gift } from "lucide-react";
import { toast } from "sonner";

export default function Combos() {
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useStore();

  useEffect(() => {
    getCombos().then((d) => { setCombos(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <section data-testid="combos-section" className="relative py-20 md:py-28 lavender-mesh">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-2xl mb-12">
          <p className="overline">The love bundles</p>
          <h2 className="mt-3 font-display font-semibold text-[#1C1924] text-3xl md:text-5xl tracking-tight">Perfect gift combos <span className="font-serif-italic text-[#E5497C]">for couples.</span></h2>
          <p className="mt-4 text-[#4A4652] text-[16px] leading-relaxed">Beautifully thought-through pairings — priced to make sending love feel effortless.</p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">{[...Array(6)].map((_, i) => <div key={i} className="h-[440px] skeleton" />)}</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {combos.map((c) => (
              <div key={c.id} data-testid={`combo-card-${c.id}`} className="relative rounded-[24px] overflow-hidden glass-card p-2 group hover:-translate-y-1 transition duration-500">
                <div className="relative aspect-[5/4] rounded-[20px] overflow-hidden">
                  <img src={c.image} alt={c.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  <span className="ribbon">{c.ribbon}</span>
                  <span className="absolute top-4 right-4 bg-[#E5497C] text-white text-[11px] font-bold px-3 py-1.5 rounded-full">Save {c.savings_pct}%</span>
                </div>
                <div className="p-5">
                  <p className="text-[12px] text-[#E5497C] font-semibold tracking-wider uppercase">{c.tagline}</p>
                  <h3 className="mt-2 font-display font-semibold text-[#1C1924] text-[20px] leading-snug">{c.name}</h3>

                  <ul className="mt-4 space-y-1.5">
                    {c.included.map((it, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-[13px] text-[#4A4652]">
                        <span className="w-4 h-4 rounded-full bg-[#FFF4F7] grid place-items-center text-[#E5497C]"><Check size={11} strokeWidth={3} /></span>
                        {it}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex items-end justify-between">
                    <div>
                      <p className="text-[12px] text-[#8b8790] line-through">{formatINR(c.original_price)}</p>
                      <p className="text-[24px] font-display font-semibold text-[#1C1924]">{formatINR(c.price)}</p>
                    </div>
                    <button
                      data-testid={`combo-add-${c.id}`}
                      onClick={() => { addToCart({ id: c.id, name: c.name, price: c.price, image: c.image }); toast.success(`${c.name} added to cart`); }}
                      className="btn-primary !py-2.5 !px-4 text-[13px]"
                    >
                      <Gift size={14} /> Add combo
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
