import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCategories, getProducts } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { formatINR } from "@/lib/format";
import { SlidersHorizontal } from "lucide-react";

const PRICE_BUCKETS = [
  { label: "All prices", min: null, max: null },
  { label: "Under ₹1,500", min: null, max: 1500 },
  { label: "₹1,500 – ₹2,500", min: 1500, max: 2500 },
  { label: "₹2,500 – ₹3,500", min: 2500, max: 3500 },
  { label: "₹3,500 & above", min: 3500, max: null },
];

export default function Shop() {
  const { category } = useParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("featured");
  const [priceIdx, setPriceIdx] = useState(0);

  useEffect(() => { getCategories().then(setCategories); }, []);

  useEffect(() => {
    setLoading(true);
    const params = category ? { category } : {};
    getProducts(params).then((d) => { setProducts(d); setLoading(false); }).catch(() => setLoading(false));
  }, [category]);

  const currentCat = categories.find((c) => c.slug === category);
  const bucket = PRICE_BUCKETS[priceIdx];

  const filteredSorted = useMemo(() => {
    let arr = products.filter((p) => {
      if (bucket.min != null && p.price < bucket.min) return false;
      if (bucket.max != null && p.price > bucket.max) return false;
      return true;
    });
    if (sort === "price-asc") arr = [...arr].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") arr = [...arr].sort((a, b) => b.price - a.price);
    if (sort === "top") arr = [...arr].sort((a, b) => b.rating - a.rating);
    return arr;
  }, [products, sort, bucket]);

  return (
    <main data-testid="shop-page" className="pt-32 pastel-mesh min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="overline">Shop</p>
            <h1 className="mt-2 font-display font-semibold text-[#1C1924] text-4xl md:text-6xl tracking-tight">{currentCat ? currentCat.name : "All Gifts"}</h1>
            <p className="mt-2 text-[#4A4652]">{filteredSorted.length} thoughtful gifts, ready to send.</p>
          </div>
          <select data-testid="shop-sort" value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-full bg-white border border-[#EEE7FA] px-5 py-2.5 text-[13.5px] font-medium text-[#1C1924] outline-none focus:ring-2 focus:ring-[#F7C7DC]">
            <option value="featured">Featured</option>
            <option value="top">Top rated</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </div>

        <div className="mt-8 flex gap-2 flex-wrap">
          <Link to="/shop" data-testid="shop-chip-all" className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition ${!category ? "bg-[#1C1924] text-white" : "bg-white text-[#1C1924] border border-[#EEE7FA] hover:bg-[#F4F0FF]"}`}>All</Link>
          {categories.map((c) => (
            <Link key={c.slug} to={`/shop/${c.slug}`} data-testid={`shop-chip-${c.slug}`} className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition ${category === c.slug ? "bg-[#1C1924] text-white" : "bg-white text-[#1C1924] border border-[#EEE7FA] hover:bg-[#F4F0FF]"}`}>{c.name}</Link>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 text-[12px] font-semibold text-[#4A4652] uppercase tracking-widest"><SlidersHorizontal size={13} /> Price</span>
          {PRICE_BUCKETS.map((b, i) => (
            <button
              key={i}
              data-testid={`shop-price-${i}`}
              onClick={() => setPriceIdx(i)}
              className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold transition ${priceIdx === i ? "bg-[#E5497C] text-white" : "bg-white text-[#1C1924] border border-[#EEE7FA] hover:bg-[#FFF4F7]"}`}
            >
              {b.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-5">{[...Array(8)].map((_, i) => <div key={i} className="aspect-[4/5] skeleton" />)}</div>
        ) : filteredSorted.length === 0 ? (
          <div className="mt-16 text-center text-[#4A4652]">No gifts match these filters. Try widening your price range.</div>
        ) : (
          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
            {filteredSorted.map((p) => <ProductCard key={p.id} product={p} testIdPrefix="shop-product" />)}
          </div>
        )}
      </div>
    </main>
  );
}
