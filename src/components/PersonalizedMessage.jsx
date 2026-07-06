import React from "react";
import { useStore } from "@/context/StoreContext";
import { Heart } from "lucide-react";

export default function PersonalizedMessage() {
  const { note, setNote } = useStore();
  const preview = note || "Ma,\nYou raised us with the softest kind of strength. This little something is nothing compared to what you gave us. I love you, quietly and always.\n— your kid";

  return (
    <section data-testid="personalized-section" className="relative py-20 md:py-28 pastel-mesh grain-overlay">
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <p className="overline">A note, from you</p>
            <h2 className="mt-3 font-display font-semibold text-[#1C1924] text-3xl md:text-5xl tracking-tight">Say the words <span className="font-serif-italic text-[#E5497C]">only you</span> can say.</h2>
            <p className="mt-4 text-[#4A4652] text-[16px] leading-relaxed">Add a handwritten-style note that we’ll tuck into their gift box, sealed with wax. Your words. Their morning.</p>

            <label htmlFor="note" className="mt-8 block text-[12px] font-semibold tracking-wider uppercase text-[#1C1924]/70">Your love note</label>
            <textarea
              id="note"
              data-testid="personalized-note-input"
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 320))}
              placeholder="Write something they’ll remember on the tough days…"
              className="mt-2 w-full rounded-[20px] bg-white/70 backdrop-blur-md border border-white p-4 min-h-[140px] text-[15px] text-[#1C1924] placeholder:text-[#8b8790] outline-none focus:ring-2 focus:ring-[#F7C7DC]"
              maxLength={320}
            />
            <p className="mt-2 text-[12px] text-[#8b8790]">{note.length}/320 · Saved automatically. We’ll include this with your order.</p>
          </div>

          <div className="lg:col-span-7 relative">
            <div className="relative rounded-[24px] glass-card-pink p-6 md:p-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[#E5497C]">
                  <Heart size={16} className="fill-[#E5497C]" />
                  <span className="text-[12px] font-semibold tracking-widest uppercase">Sealed with love</span>
                </div>
                <span className="text-[12px] text-[#8b8790] italic">Alaira · Paris</span>
              </div>
              <div className="note-preview px-4 md:px-8 py-6 md:py-10 bg-white/60 rounded-[18px]">
                <p className="font-handwritten text-[26px] md:text-[36px] leading-[1.3] text-[#1C1924] whitespace-pre-wrap">{preview}</p>
              </div>
              <div className="mt-5 flex items-center justify-between">
                <span className="font-serif-italic text-[#4A4652]">— hand-set on ivory cotton paper</span>
                <span className="w-10 h-10 rounded-full bg-[#E5497C]/15 grid place-items-center text-[#E5497C]"><Heart size={16} className="fill-[#E5497C]" /></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
