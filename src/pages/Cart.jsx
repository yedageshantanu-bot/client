import React from "react";
import { Link } from "react-router-dom";
import { useStore } from "@/context/StoreContext";
import { formatINR } from "@/lib/format";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

export default function Cart() {
  const { cart, updateQty, removeFromCart, totals, note, setNote } = useStore();

  if (cart.length === 0) {
    return (
      <main data-testid="cart-page" className="pt-32 min-h-screen">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#FFF4F7] grid place-items-center mx-auto"><ShoppingBag className="text-[#E5497C]" /></div>
          <h1 className="mt-6 font-display text-3xl md:text-4xl font-semibold">Your bag is empty (for now).</h1>
          <p className="mt-3 text-[#4A4652]">Pick something lovely — we’ll wrap it beautifully.</p>
          <Link to="/shop" data-testid="cart-shop-btn" className="btn-primary mt-8 inline-flex">Shop gifts →</Link>
        </div>
      </main>
    );
  }

  return (
    <main data-testid="cart-page" className="pt-28 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        <p className="overline">Your bag</p>
        <h1 className="mt-2 font-display font-semibold text-[#1C1924] text-4xl md:text-5xl tracking-tight">Ready to send love.</h1>

        <div className="mt-10 grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            {cart.map((i) => (
              <div key={i.id} data-testid={`cart-item-${i.id}`} className="glass-card rounded-[22px] p-4 flex items-center gap-4">
                <img src={i.image} alt={i.name} className="w-24 h-24 rounded-[16px] object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-[#1C1924] text-[15.5px] line-clamp-2">{i.name}</p>
                  <p className="text-[13px] text-[#4A4652] mt-0.5">${i.price.toFixed(2)} · Free gift wrap</p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex items-center rounded-full bg-white border border-[#EEE7FA]">
                      <button data-testid={`cart-minus-${i.id}`} onClick={() => updateQty(i.id, i.qty - 1)} className="w-9 h-9 grid place-items-center"><Minus size={14} /></button>
                      <span className="w-7 text-center text-[13px] font-semibold">{i.qty}</span>
                      <button data-testid={`cart-plus-${i.id}`} onClick={() => updateQty(i.id, i.qty + 1)} className="w-9 h-9 grid place-items-center"><Plus size={14} /></button>
                    </div>
                    <button data-testid={`cart-remove-${i.id}`} onClick={() => removeFromCart(i.id)} className="text-[12px] text-[#8b8790] hover:text-[#E5497C] flex items-center gap-1"><Trash2 size={13} /> Remove</button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-display font-semibold text-[#1C1924]">{formatINR(i.price * i.qty)}</p>
                </div>
              </div>
            ))}

            <div className="mt-6 glass-card-pink rounded-[22px] p-5">
              <p className="font-display font-semibold text-[#1C1924]">Add a handwritten love note (free)</p>
              <p className="text-[13px] text-[#4A4652]">We’ll ink this onto ivory cotton paper and seal it inside your gift.</p>
              <textarea
                data-testid="cart-note"
                value={note}
                onChange={(e) => setNote(e.target.value.slice(0, 320))}
                placeholder="To my favourite person on earth…"
                className="mt-3 w-full rounded-[16px] bg-white/80 border border-white p-3 min-h-[100px] text-[14.5px] outline-none focus:ring-2 focus:ring-[#F7C7DC]"
              />
              <p className="mt-1.5 text-[11px] text-[#8b8790]">{note.length}/320</p>
              {note && (
                <div className="mt-3 rounded-[16px] p-4 bg-white/60 note-preview">
                  <p className="font-handwritten text-[22px] text-[#1C1924] leading-snug whitespace-pre-wrap">{note}</p>
                </div>
              )}
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="glass-card rounded-[22px] p-6 sticky top-28">
              <p className="font-display font-semibold text-[#1C1924] text-lg">Order summary</p>
              <div className="mt-4 space-y-2 text-[14px] text-[#4A4652]">
                <div className="flex justify-between"><span>Subtotal</span><span data-testid="cart-subtotal">{formatINR(totals.subtotal)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span data-testid="cart-shipping">{totals.shipping === 0 ? "Free" : formatINR(totals.shipping)}</span></div>
                <div className="flex justify-between"><span>Gift wrap</span><span>Free</span></div>
              </div>
              <div className="mt-4 pt-4 border-t border-[#EEE7FA] flex items-baseline justify-between">
                <span className="font-display text-[#1C1924]">Total</span>
                <span data-testid="cart-total" className="font-display text-2xl font-semibold text-[#1C1924]">{formatINR(totals.total)}</span>
              </div>
              <Link to="/checkout" data-testid="cart-checkout-btn" className="btn-primary mt-6 w-full justify-center">Checkout →</Link>
              <Link to="/shop" data-testid="cart-continue-btn" className="mt-3 block text-center text-[13px] text-[#4A4652] underline">Continue shopping</Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
