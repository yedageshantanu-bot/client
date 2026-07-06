import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "@/lib/api";

export default function Categories() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getCategories().then((d) => { setCats(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <section data-testid="categories-section" className="relative py-20 md:py-28 pastel-mesh">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <p className="overline">Browse by love language</p>
            <h2 className="mt-3 font-display font-semibold text-[#1C1924] text-3xl md:text-5xl tracking-tight">Every category, wrapped in feeling.</h2>
          </div>
          <Link to="/shop" data-testid="categories-view-all" className="text-[13px] font-semibold text-[#1C1924] border-b border-[#1C1924] pb-0.5">View all gifts →</Link>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <div key={i} className="aspect-[4/5] skeleton" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {cats.map((c, i) => (
              <Link
                key={c.slug}
                to={`/shop/${c.slug}`}
                data-testid={`category-card-${c.slug}`}
                className={`group relative rounded-[24px] overflow-hidden aspect-[4/5] transition-transform duration-500 hover:-translate-y-1 ${i % 3 === 0 ? "md:row-span-2 md:aspect-auto md:min-h-[420px]" : ""}`}
                style={{ background: c.tint }}
              >
                <img
                  src={c.image}
                  alt={c.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 mix-blend-multiply opacity-90"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
                  <div className="glass-card px-3.5 py-2 rounded-full flex items-center gap-2">
                    {c.emoji && <span className="text-[15px]" aria-hidden>{c.emoji}</span>}
                    <span className="font-display font-semibold text-[13.5px] text-[#1C1924]">{c.name}</span>
                  </div>
                  <span className="w-9 h-9 rounded-full bg-white/90 grid place-items-center text-[#1C1924] group-hover:bg-[#1C1924] group-hover:text-white transition">→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
