import React from "react";
import { Link } from "react-router-dom";
import { Heart, Sparkles, Gift, Truck, PenTool, ArrowRight, Star } from "lucide-react";

export default function About() {
  return (
    <main data-testid="about-page" className="pt-28 pb-24 bg-[#FAF8F5] min-h-screen grain-overlay">
      {/* SECTION 1: HERO / HERITAGE */}
      <section className="py-12 md:py-20 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Title and Subtext */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2">
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#C4A55A] bg-[#C4A55A]/10 px-3 py-1 rounded-full">Our Heritage</span>
            </div>
            <h1 className="font-display font-bold text-[#1C1924] text-4xl sm:text-5xl lg:text-6xl leading-[1.1] tracking-tight">
              We Believe Every Gift <br />
              Tells a <span className="font-serif-italic text-[#E5497C] font-medium">Story.</span>
            </h1>
            <p className="text-[16px] md:text-[18px] text-[#4A4652] leading-relaxed font-body max-w-2xl">
              At Alaira, we don't just deliver gifts—we deliver emotions, memories, and moments that last forever. Every parcel is a bridge built of love, warmth, and attention.
            </p>
          </div>
          {/* Right Column: Image */}
          <div className="lg:col-span-5">
            <div className="relative rounded-[28px] overflow-hidden shadow-xl aspect-[4/3] md:aspect-[16/10] lg:aspect-[4/3] border border-[#E8DFD0]">
              <img 
                src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80" 
                alt="Alaira Gift Packaging" 
                className="w-full h-full object-cover hover:scale-105 transition duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE NARRATIVE */}
      <section className="py-12 md:py-20 bg-[#FDFBF7] border-y border-[#E8DFD0]/60">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Image */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="relative rounded-[28px] overflow-hidden shadow-xl aspect-[3/4] md:aspect-[16/10] lg:aspect-[3/4] border border-[#E8DFD0]">
                <img 
                  src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=800&auto=format&fit=crop&q=80" 
                  alt="Wrapping gifts with love" 
                  className="w-full h-full object-cover hover:scale-105 transition duration-700" 
                />
              </div>
            </div>
            {/* Right Column: Story Copy */}
            <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#C4A55A]">The Alaira Narrative</span>
              <h2 className="font-display font-semibold text-[#1C1924] text-3xl md:text-4xl tracking-tight leading-snug">
                About Alaira
              </h2>
              <div className="space-y-4 text-[15px] md:text-[16px] text-[#4A4652] leading-relaxed font-body">
                <p className="font-semibold text-lg text-[#1C1924]">
                  At Alaira we believe every gift should tell a story.
                </p>
                <p>
                  We created Alaira to make gifting more personal, thoughtful, and unforgettable. From aesthetic jewellery, handcrafted bouquets, and adorable soft toys to our growing collection of carefully selected gifts, every product is chosen to help you celebrate life's most meaningful moments.
                </p>
                <p>
                  What makes Alaira truly special is the emotion behind every order. Whether you're celebrating a birthday, anniversary, expressing love, saying "I'm sorry," or simply making someone smile, you can personalize your gift with a heartfelt message. We'll beautifully present your words as a handwritten-style letter, creating a gift that's as meaningful as the person receiving it.
                </p>
              </div>
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <Link to="/shop" className="btn-primary flex items-center justify-center gap-2">
                  Shop Our Collection <ArrowRight size={16} />
                </Link>
                <div className="font-handwritten text-[#C4A55A] text-3xl self-start sm:self-center pl-2">
                  Made with Love, Made for You.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: THE PILLARS / PHILOSOPHY */}
      <section className="py-12 md:py-20 max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#C4A55A]">Our Philosophy</span>
          <h2 className="font-display font-semibold text-[#1C1924] text-3xl md:text-4xl tracking-tight">The Pillars of Our Craft</h2>
          <p className="text-[14px] text-[#8b8790]">The principles that guide every ribbon we tie and every box we pack.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white border border-[#E8DFD0] rounded-3xl p-8 space-y-6 hover:shadow-lg transition duration-300">
            <span className="inline-flex w-12 h-12 rounded-2xl bg-[#FFF4F7] text-[#E5497C] items-center justify-center shadow-sm">
              <Heart size={20} className="fill-[#E5497C]" />
            </span>
            <h3 className="font-display font-bold text-[#1C1924] text-lg">Made With Love</h3>
            <p className="text-[14px] text-[#4A4652] leading-relaxed font-body">
              We believe the energy put into creating a gift transfers to the recipient. Every item is selected and assembled with genuine care and intention.
            </p>
          </div>
          {/* Card 2 */}
          <div className="bg-white border border-[#E8DFD0] rounded-3xl p-8 space-y-6 hover:shadow-lg transition duration-300">
            <span className="inline-flex w-12 h-12 rounded-2xl bg-[#FDFBF7] text-[#C4A55A] items-center justify-center shadow-sm">
              <PenTool size={20} />
            </span>
            <h3 className="font-display font-bold text-[#1C1924] text-lg">100% Customized</h3>
            <p className="text-[14px] text-[#4A4652] leading-relaxed font-body">
              A gift is complete only with your words. We transform your feelings into beautiful handwritten-style letters that capture the soul of your connection.
            </p>
          </div>
          {/* Card 3 */}
          <div className="bg-white border border-[#E8DFD0] rounded-3xl p-8 space-y-6 hover:shadow-lg transition duration-300">
            <span className="inline-flex w-12 h-12 rounded-2xl bg-[#EAF5FF] text-[#3182CE] items-center justify-center shadow-sm">
              <Truck size={20} />
            </span>
            <h3 className="font-display font-bold text-[#1C1924] text-lg">Delivered With Care</h3>
            <p className="text-[14px] text-[#4A4652] leading-relaxed font-body">
              Every package is carefully prepared with elegance, attention to detail, and love because we believe the smallest touches create the biggest memories.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: STATISTICS GRID */}
      <section className="bg-[#FCF9F3] border-y border-[#E8DFD0]/60 py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x-0 sm:divide-x divide-[#E8DFD0]/80">
            <div className="text-center p-4">
              <p className="font-display font-bold text-3xl md:text-4xl text-[#1C1924]">24,000+</p>
              <p className="text-[10px] uppercase font-bold tracking-widest text-[#8b8790] mt-2">Customers Delighted</p>
            </div>
            <div className="text-center p-4">
              <p className="font-display font-bold text-3xl md:text-4xl text-[#1C1924]">500+</p>
              <p className="text-[10px] uppercase font-bold tracking-widest text-[#8b8790] mt-2">Bespoke Designs</p>
            </div>
            <div className="text-center p-4">
              <p className="font-display font-bold text-3xl md:text-4xl text-[#1C1924]">100+</p>
              <p className="text-[10px] uppercase font-bold tracking-widest text-[#8b8790] mt-2">Cities Reached</p>
            </div>
            <div className="text-center p-4">
              <p className="font-display font-bold text-3xl md:text-4xl text-[#1C1924] flex items-center justify-center gap-1">4.9 <Star size={20} className="fill-[#C4A55A] text-[#C4A55A]" /></p>
              <p className="text-[10px] uppercase font-bold tracking-widest text-[#8b8790] mt-2">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: THE PROCESS */}
      <section className="py-12 md:py-20 max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#C4A55A]">The Process</span>
          <h2 className="font-display font-semibold text-[#1C1924] text-3xl md:text-4xl tracking-tight">The Art of Curating</h2>
          <div className="w-12 h-px bg-[#C4A55A] mx-auto mt-2"></div>
          <p className="text-[14px] text-[#8b8790] mt-2">A meticulous journey from concept to unboxing.</p>
        </div>

        {/* 5-Step Row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
          {[
            { step: "1", title: "Sourcing", desc: "Discovering premium and aesthetic treasures to capture the perfect emotion." },
            { step: "2", title: "Crafting", desc: "Hand-arranging fresh bouquets and styling premium combinations with care." },
            { step: "3", title: "Personalizing", desc: "Translating your feelings into a handwritten-style letter with a custom design." },
            { step: "4", title: "Packaging", desc: "Wrapping every box with protective details and tying our signature satin ribbon." },
            { step: "5", title: "Delivering", desc: "Delivering emotions and moments that last forever to their doorstep." }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center space-y-4 group">
              <div className="relative">
                <span className="w-12 h-12 rounded-full border border-[#E8DFD0] bg-[#FAF8F5] text-[#C4A55A] font-display font-bold text-lg flex items-center justify-center shadow-sm group-hover:bg-[#C4A55A] group-hover:text-white transition duration-300">
                  {item.step}
                </span>
                {idx < 4 && (
                  <div className="hidden md:block absolute top-6 left-12 w-[calc(100%+32px)] h-px bg-[#E8DFD0] -z-10"></div>
                )}
              </div>
              <h4 className="font-display font-bold text-[#1C1924] text-[16px]">{item.title}</h4>
              <p className="text-[12.5px] text-[#4A4652] leading-relaxed font-body max-w-[160px] mx-auto">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
