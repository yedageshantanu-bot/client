"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { 
  Heart, Star, ArrowRight, ShieldCheck, Mail, Gift, 
  Map, Sparkles, Send, Coffee, Check, MessageCircle, 
  Clock, Package, HelpCircle, FileText, CheckCircle
} from "lucide-react";
import { ProductCard } from "@/components/shop/ProductCard";
import { useStore } from "@/context/StoreContext";
import { useCart } from "@/context/CartContext";
import { mockTestimonials } from "@/lib/mockData";
import toast from "react-hot-toast";

// Defer all motion animations to after hydration to prevent SSR/CSR style mismatch
function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}

export default function Home() {
  const { products } = useStore();
  const { addProduct } = useCart();
  const hydrated = useHydrated();

  // Top 8 Products
  const featuredProducts = products.slice(0, 8);

  // Love Note Generator State
  const [noteText, setNoteText] = useState(
    "My dearest,\n\nDistance means so little when you mean so much. I count down the days until I can hold you again.\n\nAlways yours,\nNoah"
  );
  const [sealColor, setSealColor] = useState("rose"); // rose, navy, gold
  const [paperStyle, setPaperStyle] = useState("lined"); // lined, blank, grid
  const [noteSaved, setNoteSaved] = useState(false);

  // Combos data with constituent product IDs
  const combos = [
    {
      id: "c1",
      title: "The Long-Distance Starter Combo",
      price: 5299,
      originalPrice: 7498,
      items: ["Cloud Bear plushie", "Matching Infinity Bracelets", "Wax-sealed love note"],
      products: ["p1", "p4"],
      image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80",
      tag: "Best Seller"
    },
    {
      id: "c2",
      title: "Forever & Always Cuddle Bundle",
      price: 6999,
      originalPrice: 10100,
      items: ["Blush Cuddle Bear", "Twin Hearts Necklace", "Wax-sealed love note"],
      products: ["p2", "p3"],
      image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=600&auto=format&fit=crop&q=80",
      tag: "Popular"
    },
    {
      id: "c3",
      title: "Starry Nights & Sunrise Mugs",
      price: 5199,
      originalPrice: 6998,
      items: ["Star Map (Night We Met)", "His & Hers Sunrise Mugs", "Custom letter print"],
      products: ["p5", "p8"],
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
      tag: "Cozy Choice"
    },
    {
      id: "c4",
      title: "Aesthetic Sleepover Gift Hamper",
      price: 9999,
      originalPrice: 14998,
      items: ["Lavender Cloud Bear", "Premium Love Hamper", "Room fragrance mist"],
      products: ["p1", "p7"],
      image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=600&auto=format&fit=crop&q=80",
      tag: "Luxury Pack"
    },
    {
      id: "c5",
      title: "Infinity & Interlocking Love Set",
      price: 8499,
      originalPrice: 12400,
      items: ["Twin Hearts Necklace", "Matching Infinity Bracelets", "Ferrero Rocher truffles"],
      products: ["p3", "p4"],
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
      tag: "Romance Pick"
    },
    {
      id: "c6",
      title: "365 Days Sweet Promise Box",
      price: 3499,
      originalPrice: 5400,
      items: ["365 Reasons Jar", "Blush Cuddle Bear", "Preserved Red Rose velvet box"],
      products: ["p6", "p2"],
      image: "https://images.unsplash.com/photo-1596495572065-1d48c1073d89?w=600&auto=format&fit=crop&q=80",
      tag: "Daily Warmth"
    }
  ];

  // Benefits
  const benefits = [
    { title: "Same-Day Dispatch", desc: "Orders placed before 3 PM ship the same business day.", icon: Clock },
    { title: "Free Premium Wrap", desc: "Beautiful pastel boxes tied with luxury satin ribbons.", icon: Gift },
    { title: "Tracked Express Delivery", desc: "Real-time updates straight to your partner's doorstep.", icon: Package },
    { title: "Dedicated Help Line", desc: "Our customer success support is active 24/7 for you.", icon: MessageCircle },
    { title: "100% Secure Checkout", desc: "Fully encrypted transaction gateways.", icon: ShieldCheck },
    { title: "Happiness Guarantee", desc: "Easy, hassle-free returns on any item.", icon: HelpCircle },
    { title: "Handwritten Letters", desc: "Your love notes are physically printed and wax-sealed.", icon: Mail },
    { title: "Sustainable Packaging", desc: "Premium, recyclable materials for low carbon footprint.", icon: FileText }
  ];

  // Add all products of a combo to the cart
  const handleAddCombo = (comboProducts: string[], comboTitle: string) => {
    let count = 0;
    comboProducts.forEach((pId) => {
      const match = products.find((p) => p._id === pId);
      if (match) {
        addProduct(match);
        count++;
      }
    });
    if (count > 0) {
      toast.success(`✨ Added ${comboTitle} constituents to cart!`);
    } else {
      toast.error("Products currently unavailable.");
    }
  };

  const handleSaveNote = () => {
    if (!noteText.trim()) {
      toast.error("Please write a message first!");
      return;
    }
    localStorage.setItem("alaira_love_note", JSON.stringify({
      text: noteText,
      seal: sealColor,
      paper: paperStyle
    }));
    setNoteSaved(true);
    toast.success("✨ Love note wax-sealed and attached to order!");
  };

  return (
    <div className="min-h-screen bg-[#F5F9FD] font-body text-[#1C1924]">
      {/* ── HERO SECTION ── */}
      <section className="relative min-h-[90vh] overflow-hidden pt-28 pb-16 md:pt-36">
        {/* Soft pastel decorative gradients */}
        <div className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-pink-100/40 blur-3xl" />
        <div className="absolute bottom-[10%] right-[-10%] h-[55%] w-[50%] rounded-full bg-blue-100/40 blur-3xl" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            
            {/* Left Column: Title & Intro */}
            <div className="lg:col-span-7 flex flex-col justify-center text-left">
              <div className="inline-flex w-max items-center gap-2 rounded-full bg-pink-100/60 px-4 py-1.5 text-xs font-semibold tracking-wider text-pink-600">
                <span>✨ LONG-DISTANCE LOVE</span>
                <span className="h-1 w-1 rounded-full bg-pink-400" />
                <span>EST. 2019</span>
              </div>
              
              <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl lg:text-[4.2rem]">
                Distance means <span className="font-cursive text-pink-500 italic lowercase font-normal leading-none pr-1">nothing</span> <br className="hidden sm:inline" />
                when love finds a way.
              </h1>
              
              <p className="mt-6 max-w-xl font-body text-base md:text-lg leading-relaxed text-gray-600">
                Send warmth, sweetness, and soft cuddle plushies to your favorite person. Beautifully hand-wrapped and delivered across any miles with wax-sealed letters.
              </p>
              
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link 
                  href="/collection" 
                  className="inline-flex items-center justify-center rounded-full bg-pink-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-pink-600 hover:-translate-y-0.5"
                >
                  Shop Gifts
                  <ArrowRight size={16} className="ml-2" />
                </Link>
                <Link 
                  href="#personalize" 
                  className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-gray-700 shadow-md border border-gray-200 transition hover:bg-gray-50 hover:-translate-y-0.5"
                >
                  Send a Love Note
                </Link>
              </div>
              
              {/* Couple Reviews Rating */}
              <div className="mt-8 flex items-center gap-3">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={16} fill="#FF758F" className="text-pink-500" />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-600">
                  <strong className="text-gray-900">4.9 average rating</strong> from 1,200+ long-distance couples
                </span>
              </div>
            </div>
            
            {/* Right Column: Visual Frame */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto aspect-[3/4] max-w-sm overflow-hidden rounded-2xl border border-white/60 bg-white/40 p-3 shadow-2xl backdrop-blur-md">
                <div className="relative h-full w-full overflow-hidden rounded-xl bg-pink-100">
                  <Image 
                    src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop&q=80" 
                    alt="Couple together" 
                    fill 
                    className="object-cover"
                    priority
                  />
                  
                  {/* Hearts animations */}
                  <div className="absolute inset-0 pointer-events-none">
                    <span className="absolute left-[15%] top-[25%] animate-bounce text-2xl">💖</span>
                    <span className="absolute right-[20%] top-[40%] animate-pulse text-xl">🧸</span>
                    <span className="absolute left-[30%] bottom-[20%] animate-pulse text-2xl">✉️</span>
                  </div>

                  {/* Delivery notification card */}
                  <div className="absolute bottom-4 inset-x-4 rounded-xl border border-white/60 bg-white/70 p-4 shadow-lg backdrop-blur-md">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-pink-500 text-white text-lg">✨</span>
                      <div>
                        <p className="text-xs font-semibold text-pink-600 uppercase tracking-wider">Delivered with love</p>
                        <p className="text-xs text-gray-600 font-medium">To Emma in Barcelona . From Noah in Tokyo</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* ── BROWSE BY LOVE LANGUAGE (CATEGORIES) ── */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pink-500">Love Languages</p>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl text-[#1C1924]">Browse by Category</h2>
          </div>
          
          <div className="grid gap-6 md:grid-cols-12">
            
            {/* Left Card: Teddy Bears (p1 - p2 / Cute Plushies) */}
            <Link 
              href="/collection?category=Cute+Plushies"
              className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-[#FBF9F7] shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-xl md:col-span-4 aspect-[4/5] md:aspect-auto"
            >
              <Image 
                src="https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=600&auto=format&fit=crop&q=80" 
                alt="Teddy Bears" 
                fill 
                className="object-cover transition duration-750 group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <span className="text-[10px] font-bold uppercase tracking-widest text-pink-300">Aesthetic Hugs</span>
                <h3 className="mt-1 font-display text-2xl font-bold">Teddy Bears</h3>
              </div>
            </Link>

            {/* Middle Grid: Couple Jewelry, Gift Hampers, Personalized, Mugs */}
            <div className="grid gap-6 md:col-span-5 sm:grid-cols-2">
              
              <Link 
                href="/collection?category=Fine+Jewelry"
                className="group relative aspect-[1/1] overflow-hidden rounded-2xl border border-gray-100 bg-[#F5FBFD] shadow-md transition hover:-translate-y-1"
              >
                <Image 
                  src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80" 
                  alt="Couple Jewelry" 
                  fill 
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-display text-lg font-bold">Couple Jewelry</h4>
                </div>
              </Link>
              
              <Link 
                href="/collection?category=Romantic+Combos"
                className="group relative aspect-[1/1] overflow-hidden rounded-2xl border border-gray-100 bg-[#FAF7FB] shadow-md transition hover:-translate-y-1"
              >
                <Image 
                  src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=600&auto=format&fit=crop&q=80" 
                  alt="Gift Hampers" 
                  fill 
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-display text-lg font-bold">Gift Hampers</h4>
                </div>
              </Link>
              
              <Link 
                href="/collection?category=Personalized+Gifts"
                className="group relative aspect-[1/1] overflow-hidden rounded-2xl border border-gray-100 bg-[#FAF9F5] shadow-md transition hover:-translate-y-1"
              >
                <Image 
                  src="https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80" 
                  alt="Personalized Gifts" 
                  fill 
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-display text-lg font-bold">Personalized</h4>
                </div>
              </Link>
              
              <Link 
                href="/collection?category=Romantic+Combos"
                className="group relative aspect-[1/1] overflow-hidden rounded-2xl border border-gray-100 bg-[#FDF5F5] shadow-md transition hover:-translate-y-1"
              >
                <Image 
                  src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80" 
                  alt="Couple Mugs" 
                  fill 
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-display text-lg font-bold">Couple Mugs</h4>
                </div>
              </Link>

            </div>

            {/* Right Card: Love Letters (p6 / Surprise Boxes) */}
            <Link 
              href="/collection?category=Surprise+Boxes"
              className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-[#FAF8FA] shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-xl md:col-span-3 aspect-[4/5] md:aspect-auto"
            >
              <Image 
                src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80" 
                alt="Love Letters" 
                fill 
                className="object-cover transition duration-750 group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <span className="text-[10px] font-bold uppercase tracking-widest text-pink-300">Wax-Sealed</span>
                <h3 className="mt-1 font-display text-2xl font-bold">Love Letters</h3>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* ── FEATURED GIFTS SECTION ── */}
      <section className="py-20 bg-[#F5F9FD] border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pink-500">Handpicked Favorites</p>
              <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl text-[#1C1924]">Featured Gift Shop</h2>
            </div>
            <Link 
              href="/collection" 
              className="mt-4 inline-flex items-center text-sm font-semibold text-pink-500 hover:text-pink-600 md:mt-0"
            >
              View the entire shop
              <ArrowRight size={14} className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

        </div>
      </section>

      {/* ── ROMANTIC COMBOS SECTION ── */}
      <section id="combos" className="py-20 bg-white border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pink-500">Perfect Pairings</p>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl text-[#1C1924]">Romantic Combos</h2>
            <p className="mt-4 text-sm text-gray-500">Curated matching boxes designed to bring cozy smiles on any special occasion.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {combos.map((combo) => (
              <div 
                key={combo.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-[#FBF9F7] shadow-sm transition hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-pink-50">
                  <Image 
                    src={combo.image} 
                    alt={combo.title} 
                    fill 
                    className="object-cover transition group-hover:scale-101"
                  />
                  <div className="absolute inset-0 bg-black/10" />
                  <span className="absolute left-4 top-4 rounded-full bg-pink-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    {combo.tag}
                  </span>
                </div>
                
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-xl font-bold text-[#1C1924] group-hover:text-pink-500">
                    {combo.title}
                  </h3>
                  
                  {/* Checklist */}
                  <ul className="mt-4 space-y-2 text-xs text-gray-600 font-medium">
                    {combo.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check size={14} className="text-pink-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-6 flex items-center justify-between gap-4 border-t border-gray-100">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400 line-through">₹{combo.originalPrice.toLocaleString()}</span>
                      <span className="text-lg font-bold text-pink-500">₹{combo.price.toLocaleString()}</span>
                    </div>
                    
                    <button
                      onClick={() => handleAddCombo(combo.products, combo.title)}
                      className="inline-flex h-9 items-center justify-center rounded-full bg-[#1C1924] px-4 text-xs font-semibold text-white transition hover:bg-pink-500"
                    >
                      Add Combo
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── INTERACTIVE LOVE NOTE GENERATOR ── */}
      <section id="personalize" className="py-20 bg-[#F5F9FD] border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            
            {/* Form side */}
            <div className="lg:col-span-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pink-500">Love Letters</p>
              <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl text-[#1C1924]">Write A Love Note</h2>
              <p className="mt-4 text-sm text-gray-600">
                Type your message below. We will print it in gorgeous handwriting cursive font and seal it with authentic wax on a physical premium paper envelope.
              </p>
              
              <div className="mt-8 space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Your Letter Content
                  </label>
                  <textarea
                    rows={6}
                    value={noteText}
                    onChange={(e) => {
                      setNoteText(e.target.value);
                      setNoteSaved(false);
                    }}
                    maxLength={280}
                    className="w-full rounded-xl border border-gray-200 bg-white p-4 text-sm outline-none transition focus:border-pink-300 focus:ring-1 focus:ring-pink-100"
                    placeholder="Dearest..."
                  />
                  <div className="mt-1 flex justify-between text-[11px] text-gray-400">
                    <span>Cursive rendering live</span>
                    <span>{noteText.length}/280 characters</span>
                  </div>
                </div>

                {/* Wax Seal Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Select Wax Seal Color
                  </label>
                  <div className="flex gap-3">
                    {[
                      { id: "rose", name: "Crimson Rose", hex: "#FF4D6D" },
                      { id: "navy", name: "Ocean Navy", hex: "#1D3557" },
                      { id: "gold", name: "Imperial Gold", hex: "#D4AF37" }
                    ].map((color) => (
                      <button
                        key={color.id}
                        onClick={() => {
                          setSealColor(color.id);
                          setNoteSaved(false);
                        }}
                        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                          sealColor === color.id 
                            ? "border-pink-500 bg-pink-50/50 text-pink-600" 
                            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <span className="h-3.5 w-3.5 rounded-full border border-black/10" style={{ backgroundColor: color.hex }} />
                        {color.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Paper Style Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Paper Style
                  </label>
                  <div className="flex gap-3">
                    {[
                      { id: "lined", name: "Lined Notebook" },
                      { id: "blank", name: "Classic Parchment" },
                      { id: "grid", name: "Aesthetic Grid" }
                    ].map((style) => (
                      <button
                        key={style.id}
                        onClick={() => {
                          setPaperStyle(style.id);
                          setNoteSaved(false);
                        }}
                        className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                          paperStyle === style.id 
                            ? "border-pink-500 bg-pink-50/50 text-pink-600" 
                            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {style.name}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSaveNote}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1C1924] py-3 text-sm font-semibold text-white transition hover:bg-pink-500 shadow-md"
                >
                  <Send size={15} />
                  <span>{noteSaved ? "Wax-Seal Locked!" : "Save & Attach to Order"}</span>
                </button>
              </div>
            </div>

            {/* Notebook Preview side */}
            <div className="lg:col-span-7 flex justify-center">
              <div className="relative w-full max-w-md aspect-[4/5] rounded-2xl bg-white p-8 shadow-xl border border-gray-100 flex flex-col justify-between overflow-hidden">
                
                {/* Decorative spiral rings on top if lined */}
                {paperStyle === "lined" && (
                  <div className="absolute top-0 left-8 right-8 flex justify-between pointer-events-none">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <span key={i} className="h-6 w-3.5 rounded-full border border-gray-300 bg-gray-100 -mt-3 shadow-inner" />
                    ))}
                  </div>
                )}
                
                {/* Lined Notebook Paper styling */}
                <div 
                  className={`flex-1 flex flex-col pr-4 pt-4 ${
                    paperStyle === "lined" 
                      ? "bg-[linear-gradient(rgba(229,231,235,0.7)_1px,transparent_1px)] bg-[size:100%_2rem] leading-8" 
                      : paperStyle === "grid"
                      ? "bg-[linear-gradient(rgba(229,231,235,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(229,231,235,0.4)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]"
                      : "bg-[#FFFDF9]"
                  }`}
                >
                  {/* Red line margin if lined */}
                  {paperStyle === "lined" && (
                    <div className="absolute left-10 top-0 bottom-0 w-px bg-red-200 pointer-events-none" />
                  )}

                  <p className="font-cursive text-xl text-gray-700 whitespace-pre-wrap pl-6 leading-8">
                    {noteText || "Type your letter..."}
                  </p>
                </div>
                
                {/* Wax Seal Stamp on bottom right */}
                <div className="absolute bottom-8 right-8 flex items-center justify-center">
                  <div 
                    className="relative grid h-14 w-14 place-items-center rounded-full shadow-lg transition duration-500 scale-100"
                    style={{ 
                      backgroundColor: 
                        sealColor === "navy" 
                          ? "#1D3557" 
                          : sealColor === "gold" 
                          ? "#D4AF37" 
                          : "#FF4D6D" 
                    }}
                  >
                    {/* Ring edge */}
                    <div className="absolute inset-1 rounded-full border-2 border-white/20" />
                    <Heart size={20} fill="white" className="text-white" />
                  </div>
                </div>

                {/* Lock confirmation badge */}
                <AnimatePresence>
                  {noteSaved && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center p-6 text-center backdrop-blur-xs"
                    >
                      <CheckCircle size={56} className="text-green-500" />
                      <h4 className="mt-4 font-display text-xl font-bold text-[#1C1924]">Love Note Locked!</h4>
                      <p className="mt-2 text-xs text-gray-500 max-w-xs">
                        This note will be printed in cursive, hand-folded, wax-sealed, and placed inside your parcel box.
                      </p>
                      <button 
                        onClick={() => setNoteSaved(false)}
                        className="mt-6 text-xs font-semibold text-pink-500 hover:text-pink-600 underline"
                      >
                        Edit Letter
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
                
              </div>
            </div>
            
          </div>
          
        </div>
      </section>

      {/* ── STEPPER SECTION ── */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pink-500">The Journey</p>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl text-[#1C1924]">How It Works</h2>
          </div>

          <div className="relative">
            {/* Horizontal Timeline Connector (visible on desktop) */}
            <div className="absolute left-[10%] right-[10%] top-[40px] hidden h-0.5 bg-pink-100 lg:block" />
            
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { step: "01", title: "Select & Order", desc: "Select the perfect combo, jewelry, or plush companion." },
                { step: "02", title: "Personalize", desc: "Write a sweet letter. We print it in handwriting cursive font." },
                { step: "03", title: "Luxury Wrap", desc: "Sprayed with room mist and hand-sealed with real wax." },
                { step: "04", title: "Ship Express", desc: "Dispatched in 24 hours with live transit maps." },
                { step: "05", title: "Delivered", desc: "Your partner is surprised with a heartwarming surprise!" }
              ].map((item, idx) => (
                <div key={idx} className="relative flex flex-col items-center text-center">
                  <div className="z-10 grid h-20 w-20 place-items-center rounded-full bg-pink-50 text-xl font-bold text-pink-500 border-4 border-white shadow-md">
                    {item.step}
                  </div>
                  <h3 className="mt-6 font-display text-lg font-bold text-[#1C1924]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs text-gray-500 max-w-[12rem]">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── BENEFITS GRID ── */}
      <section className="py-20 bg-[#F5F9FD] border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pink-500">Benefits</p>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl text-[#1C1924]">The Alaira Guarantee</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div 
                  key={idx}
                  className={`p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col gap-4 bg-white`}
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-pink-50 text-pink-500 shrink-0">
                    <Icon size={18} />
                  </span>
                  <div>
                    <h4 className="font-display text-lg font-bold text-[#1C1924]">{b.title}</h4>
                    <p className="mt-2 text-xs text-gray-500 leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── TESTIMONIALS / QUOTES ── */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pink-500">Testimonials</p>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl text-[#1C1924]">Love Notes From Couples</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {mockTestimonials.slice(0, 3).map((review, idx) => (
              <article 
                key={idx}
                className="relative p-8 rounded-2xl border border-gray-100 bg-[#FBF9F7] shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-0.5 text-pink-500">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} size={15} fill="currentColor" />
                    ))}
                  </div>
                  <p className="mt-5 font-serif text-lg italic text-[#1C1924] leading-relaxed">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-pink-100 text-xs font-bold text-pink-600">
                      {review.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1C1924]">{review.name}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">{review.city}</p>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-pink-500 uppercase tracking-widest bg-pink-50 px-2.5 py-1 rounded-full">
                    Verified Couple
                  </div>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* ── INSTAGRAM GRID & NEWSLETTER ── */}
      <section className="py-20 bg-[#F5F9FD] border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pink-500">Newsletter</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-[#1C1924]">Join Alaira House</h2>
              <p className="mt-4 text-sm text-gray-600">
                Subscribe to get love ideas, new product alerts, and coupon drops. No spam, ever.
              </p>
              
              <div className="mt-8 flex gap-3 max-w-md">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm outline-none transition focus:border-pink-300"
                />
                <button 
                  onClick={() => toast.success("Welcome to the Alaira Family! 💖")}
                  className="rounded-full bg-[#1C1924] px-6 text-sm font-semibold text-white transition hover:bg-pink-500"
                >
                  Join
                </button>
              </div>
            </div>

            {/* Instagram Mock Grid */}
            <div className="grid grid-cols-3 gap-3">
              {[
                "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=300",
                "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=300",
                "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300",
                "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=300",
                "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300",
                "https://images.unsplash.com/photo-1596495572065-1d48c1073d89?w=300"
              ].map((url, idx) => (
                <div key={idx} className="relative aspect-square overflow-hidden rounded-xl bg-pink-100">
                  <Image 
                    src={url} 
                    alt="Instagram Post" 
                    fill 
                    className="object-cover transition hover:scale-105"
                  />
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
