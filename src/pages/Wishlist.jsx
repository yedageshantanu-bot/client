import React from "react";
import { Link } from "react-router-dom";
import { useStore } from "@/context/StoreContext";
import { formatINR } from "@/lib/format";
import { Heart, ShoppingBag, X } from "lucide-react";
import { toast } from "sonner";

export default function Wishlist() {
  const { wishlist, toggleWishlist, addToCart } = useStore();

  return (
    <main data-testid="wishlist-page" className="pt-28 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        <p className="overline">Saved with love</p>
        <h1 className="mt-2 font-display font-semibold text-[#1C1924] text-4xl md:text-5xl tracking-tight">Your Wishlist</h1>

        {wishlist.length === 0 ? (
          <div className="mt-14 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#FFF4F7] grid place-items-center"><Heart className="text-[#E5497C]" /></div>
            <p className="mt-4 text-[#4A4652]">You haven’t saved any gifts yet.</p>
            <Link to="/shop" data-testid="wishlist-shop-btn" className="btn-primary mt-6 inline-flex">Browse gifts →</Link>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
            {wishlist.map((p) => (
              <div key={p.id} data-testid={`wishlist-item-${p.id}`} className="group relative">
                <div className="relative aspect-[4/5] rounded-[22px] overflow-hidden bg-[#FFF4F7]">
                  <img src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <button data-testid={`wishlist-remove-${p.id}`} onClick={() => toggleWishlist(p)} className="absolute top-3 right-3 w-9 h-9 grid place-items-center rounded-full bg-white/85 hover:bg-white"><X size={15} /></button>
                </div>
                <Link to={`/product/${p.id}`} className="block mt-3">
                  <p className="font-display font-semibold text-[15px] text-[#1C1924] line-clamp-2">{p.name}</p>
                  <p className="text-[14px] font-semibold text-[#1C1924] mt-1">{formatINR(p.price)}</p>
                </Link>
                <button
                  data-testid={`wishlist-add-cart-${p.id}`}
                  onClick={() => { addToCart(p); toast.success(`${p.name} added to cart`); }}
                  className="btn-ghost w-full mt-3 justify-center !py-2 text-[13px]"
                >
                  <ShoppingBag size={13} /> Add to cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
