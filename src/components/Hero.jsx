import React from "react";
import { Link } from "react-router-dom";
import { Heart, Star, Sparkles, Gift, Cloud } from "lucide-react";

const HeroFloat = ({ className, children, style }) => (
  <div className={`absolute pointer-events-none ${className}`} style={style}>
    <div className="floating">{children}</div>
  </div>
);

export default function Hero() {
  return (
    <section data-testid="hero-section" className="relative pt-28 md:pt-36 overflow-hidden hero-mesh grain-overlay">
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-24 md:pb-32">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card">
              <Sparkles size={14} className="text-[#E5497C]" />
              <span className="text-[12px] font-semibold tracking-[0.18em] uppercase text-[#1C1924]">For everyone you love — including you</span>
            </div>

            <h1 className="mt-6 font-display font-semibold text-[#1C1924] text-[44px] sm:text-[56px] lg:text-[76px] leading-[1.02] tracking-tight">
              Send something <span className="font-serif-italic text-[#E5497C] font-medium">beautiful</span><br />
              to someone you love.
            </h1>
            <p className="mt-6 max-w-xl text-[#4A4652] text-[16px] md:text-[18px] leading-relaxed">
              Hand-tied bouquets, delicate jewellery, and the softest plush toys — for partners, parents, friends, siblings, and yourself. Wrapped with a note, delivered across India.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link data-testid="hero-shop-btn" to="/shop" className="btn-primary">Shop Gifts<span aria-hidden>→</span></Link>
              <Link data-testid="hero-combos-btn" to="/shop/flowers" className="btn-ghost">Explore Bouquets</Link>
            </div>

            <div className="mt-10 flex items-center gap-6 text-[13px] text-[#4A4652]">
              <div className="flex -space-x-2">
                {[
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=60",
                  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=60",
                  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=80&q=60",
                ].map((s, i) => (<img key={i} src={s} alt="" className="w-9 h-9 rounded-full border-2 border-white object-cover" />))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-[#1C1924] font-semibold">
                  {[...Array(5)].map((_, i) => (<Star key={i} size={13} className="fill-[#E5497C] text-[#E5497C]" />))}
                  <span className="ml-1">4.9</span>
                </div>
                <span className="text-[#8b8790]">Loved by 24,000+ people across India</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-[28px] overflow-hidden glass-card-pink">
              <img src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1200&q=80" alt="Alaira House Gift Hamper" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#FFF4F7]/40 via-transparent to-[#EAF5FF]/30" />
              
              {/* Left Floating Panel: Today's Orders */}
              <div className="absolute top-[35%] -left-4 bg-white border border-[#EEE7FA] rounded-2xl p-3.5 shadow-xl z-20 hidden sm:block animate-bounce-slow">
                <p className="text-[9px] uppercase tracking-wider font-semibold text-[#8b8790] font-body">Today's Orders</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-display font-bold text-[#1C1924] text-[16px]">48 Gifted</span>
                  <Gift size={14} className="text-[#C4A55A]" />
                </div>
              </div>

              {/* Right Floating Badge: Customized With Love */}
              <div className="absolute top-[60%] -right-4 bg-white/95 border border-[#EEE7FA] backdrop-blur-md rounded-full px-4 py-2 shadow-lg z-20 hidden sm:flex items-center gap-1.5 animate-bounce-slow" style={{ animationDelay: '1s' }}>
                <span className="text-[11.5px] font-semibold text-[#C4A55A] font-body">Customized With Love</span>
                <Heart size={11} className="fill-[#C4A55A] text-[#C4A55A]" />
              </div>

              <div className="absolute bottom-5 left-5 right-5 glass-card rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full grid place-items-center bg-[#FFF4F7]"><Heart className="text-[#E5497C]" size={18} /></div>
                  <div>
                    <p className="font-display text-[15px] font-semibold text-[#1C1924]">Just delivered</p>
                    <p className="text-[12px] text-[#4A4652]">to Mrs. Sharma in Pune · from her daughter in Bengaluru</p>
                  </div>
                </div>
              </div>
            </div>

            <HeroFloat className="-top-6 -left-4"><div className="w-16 h-16 rounded-[20px] glass-card grid place-items-center"><Heart className="text-[#E5497C]" /></div></HeroFloat>
            <HeroFloat className="top-24 -right-6" style={{ animationDelay: '1.5s' }}><div className="w-14 h-14 rounded-full glass-card grid place-items-center"><Gift className="text-[#1C1924]" size={20} /></div></HeroFloat>
            <HeroFloat className="bottom-10 -left-8" style={{ animationDelay: '2.2s' }}><div className="w-14 h-14 rounded-[18px] glass-card-lavender grid place-items-center"><Cloud className="text-[#7C6FB0]" size={20} /></div></HeroFloat>
            <HeroFloat className="-bottom-6 right-8" style={{ animationDelay: '0.8s' }}><div className="w-12 h-12 rounded-full glass-card-pink grid place-items-center"><Sparkles className="text-[#E5497C]" size={18} /></div></HeroFloat>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 -z-10">
          {[{top:"10%",left:"8%",size:6},{top:"24%",left:"48%",size:4},{top:"60%",left:"12%",size:5},{top:"78%",left:"62%",size:7},{top:"40%",left:"82%",size:5},{top:"88%",left:"30%",size:4}].map((s,i)=>(
            <span key={i} className="twinkle absolute rounded-full bg-[#E5497C]/50" style={{ top:s.top,left:s.left,width:s.size,height:s.size,animationDelay:`${i*0.4}s` }} />
          ))}
        </div>
      </div>
    </section>
  );
}
