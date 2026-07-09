import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { Heart } from "lucide-react";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const categories = ["All", "Toys", "Jewelry", "Flowers"];

  useEffect(() => {
    getProducts()
      .then((d) => {
        setProducts(d);
        setFilteredProducts(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    if (category === "All") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((p) => p.category?.toLowerCase() === category.toLowerCase())
      );
    }
  };

  return (
    <section data-testid="featured-section" className="relative py-20 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
        
        {/* Centered Heading block matching Netlify styling */}
        <div className="mb-8 max-w-xl mx-auto">
          <p className="text-[12px] uppercase tracking-widest font-bold text-gold font-body">
            OUR COLLECTION
          </p>
          <h2 className="mt-2 font-display font-semibold text-[#1C1924] text-3xl md:text-5xl tracking-tight">
            Our Most Loved Products
          </h2>
          <p className="text-[13.5px] text-[#8b8790] mt-2 leading-relaxed">
            Each product is handpicked and assembled with care — because your gift deserves to be unforgettable.
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-[1px] w-12 bg-[#EEE7FA]" />
            <Heart size={10} className="fill-[#C4A55A] text-[#C4A55A]" />
            <div className="h-[1px] w-12 bg-[#EEE7FA]" />
          </div>
        </div>

        {/* Centered Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-6 py-2 rounded-full text-[13px] font-semibold tracking-wide border transition-all duration-300 cursor-pointer ${
                activeCategory === cat
                  ? "bg-[#1C1924] border-[#1C1924] text-white shadow-sm"
                  : "bg-white border-[#EEE7FA] text-[#4A4652] hover:bg-[#FAF8F5]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[4/5] skeleton rounded-[24px] bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : activeCategory === "All" ? (
          <div className="space-y-16 text-left">
            {/* Toys Row */}
            <div>
              <div className="flex items-center justify-between mb-6 border-b border-[#EEE7FA] pb-3">
                <h3 className="font-display font-bold text-[#1C1924] text-xl md:text-2xl tracking-wide">
                  ✦ Adorable Toys Collection
                </h3>
                <Link to="/shop/toys" className="text-[13px] font-bold text-gold hover:text-[#E5497C] transition shrink-0 whitespace-nowrap">
                  View All Toys →
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
                {products.filter(p => p.category?.toLowerCase() === "toys").slice(0, 4).map((p) => (
                  <ProductCard key={p.id} product={p} testIdPrefix="featured-product" />
                ))}
              </div>
            </div>

            {/* Jewelry Row */}
            <div>
              <div className="flex items-center justify-between mb-6 border-b border-[#EEE7FA] pb-3">
                <h3 className="font-display font-bold text-[#1C1924] text-xl md:text-2xl tracking-wide">
                  ✦ Sparkling Jewelry Collection
                </h3>
                <Link to="/shop/jewelry" className="text-[13px] font-bold text-gold hover:text-[#E5497C] transition shrink-0 whitespace-nowrap">
                  View All Jewelry →
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
                {products.filter(p => p.category?.toLowerCase() === "jewelry" || p.category?.toLowerCase() === "jewelley").slice(0, 4).map((p) => (
                  <ProductCard key={p.id} product={p} testIdPrefix="featured-product" />
                ))}
              </div>
            </div>

            {/* Flowers Row */}
            <div>
              <div className="flex items-center justify-between mb-6 border-b border-[#EEE7FA] pb-3">
                <h3 className="font-display font-bold text-[#1C1924] text-xl md:text-2xl tracking-wide">
                  ✦ Fresh Flowers Collection
                </h3>
                <Link to="/shop/flowers" className="text-[13px] font-bold text-gold hover:text-[#E5497C] transition shrink-0 whitespace-nowrap">
                  View All Flowers →
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
                {products.filter(p => p.category?.toLowerCase() === "flowers").slice(0, 4).map((p) => (
                  <ProductCard key={p.id} product={p} testIdPrefix="featured-product" />
                ))}
              </div>
            </div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} testIdPrefix="featured-product" />
            ))}
          </div>
        ) : (
          <div className="py-12 text-[#8b8790] text-[14px]">
            No products found in this category.
          </div>
        )}


        <div className="mt-12">
          <Link
            to="/shop"
            data-testid="featured-view-all"
            className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#1C1924] border-b-2 border-[#1C1924] pb-0.5 hover:text-[#E5497C] hover:border-[#E5497C] transition duration-300"
          >
            Shop everything →
          </Link>
        </div>

      </div>
    </section>
  );
}
