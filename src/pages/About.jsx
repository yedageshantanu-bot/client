import React from "react";
import { Link } from "react-router-dom";
import { Heart, Shield, Gift, ArrowRight } from "lucide-react";

export default function About() {
  return (
    <main data-testid="about-page" className="pt-32 pb-24 pastel-mesh min-h-screen grain-overlay">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        {/* Hero Section */}
        <div className="text-center relative z-10 max-w-2xl mx-auto mb-16">
          <p className="overline">Our Story</p>
          <h1 className="mt-3 font-display font-semibold text-[#1C1924] text-4xl md:text-6xl tracking-tight leading-tight">
            Crafting love, <br />
            <span className="font-serif-italic text-[#E5497C]">one gift</span> at a time.
          </h1>
          <p className="mt-6 text-[16px] text-[#4A4652] leading-relaxed">
            Welcome to Alaira House. Our journey began with a simple passion for premium Indian textiles and the timeless elegance of handwoven heritage sarees. Today, we extend that same luxury craftsmanship to curate the ultimate expressions of devotion—through handcrafted fine jewelry, soft plush toys, and fresh floral arrangements.
          </p>
        </div>

        {/* Pillars / Values Grid */}
        <div className="grid md:grid-cols-3 gap-6 relative z-10 mb-20">
          <div className="glass-card rounded-[24px] p-6 text-center space-y-4">
            <span className="inline-flex w-12 h-12 rounded-2xl bg-[#F4F0FF] text-[#6B47C1] items-center justify-center">
              <Gift size={20} />
            </span>
            <h3 className="font-display font-semibold text-[#1C1924] text-[18px]">Timeless Heritage</h3>
            <p className="text-[13.5px] text-[#4A4652] leading-relaxed">
              Rooted in the art of classic Indian sarees, we appreciate the beauty of intricate weaving, rich colors, and materials that last generations.
            </p>
          </div>
          <div className="glass-card rounded-[24px] p-6 text-center space-y-4">
            <span className="inline-flex w-12 h-12 rounded-2xl bg-[#FFF4F7] text-[#E5497C] items-center justify-center">
              <Heart size={20} className="fill-[#E5497C]" />
            </span>
            <h3 className="font-display font-semibold text-[#1C1924] text-[18px]">Everyday Devotion</h3>
            <p className="text-[13.5px] text-[#4A4652] leading-relaxed">
              A gift is more than an object—it represents a bridge. We package each item with free hand-tied gift wraps and handwritten wax-sealed letters.
            </p>
          </div>
          <div className="glass-card rounded-[24px] p-6 text-center space-y-4">
            <span className="inline-flex w-12 h-12 rounded-2xl bg-[#EAF5FF] text-[#3182CE] items-center justify-center">
              <Shield size={20} />
            </span>
            <h3 className="font-display font-semibold text-[#1C1924] text-[18px]">Luxury Quality</h3>
            <p className="text-[13.5px] text-[#4A4652] leading-relaxed">
              Whether it is our 925 sterling silver jewelry, organic lavender-infused toys, or fresh crimson roses, we settle for nothing less than premium.
            </p>
          </div>
        </div>

        {/* Brand Details / Heritage Section */}
        <div className="glass-card-lavender rounded-[32px] p-8 md:p-12 relative overflow-hidden grid md:grid-cols-12 gap-8 items-center z-10">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#F7C7DC] rounded-full filter blur-3xl opacity-35 -mr-12 -mt-12"></div>
          
          <div className="md:col-span-7 space-y-5">
            <p className="overline text-[#6B47C1]">Legacy of Elegance</p>
            <h2 className="font-display font-semibold text-[#1C1924] text-3xl md:text-4xl tracking-tight leading-snug">
              From Classic Sarees to Modern Couple Surprises
            </h2>
            <p className="text-[14.5px] text-[#4A4652] leading-relaxed">
              Alaira House originated as a boutique destination celebrating the legacy of Indian sarees—where every fabric tells a story. That dedication to texture, beauty, and emotional expression lives on in all our gifts today. We believe in preserving traditions of gifting with true warmth, tactile beauty, and premium presentation.
            </p>
            <p className="text-[14.5px] text-[#4A4652] leading-relaxed">
              Every package is shipped from our design studios wrapped in protective premium boxes, hand-tied with custom silk ribbons, and accompanied by our signature cotton cardstock notes.
            </p>
            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-[#E5497C] font-semibold text-[14.5px] hover:underline"
              >
                Explore our collection <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="md:col-span-5 relative">
            <img
              src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop&q=80"
              alt="Alaira House Craft"
              className="rounded-2xl shadow-md w-full object-cover aspect-[4/3] rotate-1 hover:rotate-0 transition-all duration-500"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
