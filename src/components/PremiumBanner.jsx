import React from "react";
import { Link } from "react-router-dom";

export default function PremiumBanner() {
  return (
    <section data-testid="premium-banner" className="relative py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="relative rounded-[32px] overflow-hidden">
          <div className="absolute inset-0 hero-mesh grain-overlay" />
          <div className="absolute inset-0 opacity-40 mix-blend-multiply">
            <img
              src="https://images.unsplash.com/photo-1484876632310-ddb3b48133cc?auto=format&fit=crop&w=1600&q=80"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10 px-8 md:px-20 py-16 md:py-24 text-center">
            <p className="overline">Every gift, a chapter</p>
            <h3 className="mt-4 font-display font-semibold text-[#1C1924] text-4xl md:text-6xl tracking-tight leading-[1.05]">
              Every gift tells a <span className="font-serif-italic text-[#E5497C]">love story.</span>
            </h3>
            <p className="mt-5 max-w-xl mx-auto text-[#4A4652] text-[16px] md:text-[17px]">
              Because distance shouldn’t change how loved they feel — begin their next chapter with something they’ll hold on to.
            </p>
            <Link to="/shop" data-testid="premium-banner-shop-btn" className="btn-primary mt-8 inline-flex">Shop Now →</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
