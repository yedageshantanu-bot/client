import React from "react";
import { Link } from "react-router-dom";
import { Heart, Star, ShoppingBag } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { formatINR } from "@/lib/format";
import { toast } from "sonner";

export default function ProductCard({ product, testIdPrefix = "product" }) {
  const { addToCart, toggleWishlist, isWished } = useStore();
  const wished = isWished(product.id);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    toast.success(wished ? "Removed from wishlist" : "Added to wishlist");
  };

  const handleAddToCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  // Determine tag badge
  const getBadge = () => {
    if (product.badge) return product.badge;
    if (product.rating >= 4.9) return "Top Rated";
    if (product.stock <= 12) return "Low Stock";
    return "";
  };

  const badge = getBadge();

  return (
    <div
      data-testid={`${testIdPrefix}-card-${product.id}`}
      className="group bg-white border border-[#EEE7FA] rounded-[28px] p-3 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between"
    >
      <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] rounded-[22px] overflow-hidden bg-[#FFF4F7] flex items-center justify-center p-3">
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />

        {/* Badge Overlays */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          {badge && (
            <span className="bg-[#1C1924] text-white text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full shadow-sm font-body">
              {badge}
            </span>
          )}
          {product.on_sale && product.discount_pct > 0 && (
            <span className="bg-[#E5497C] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm font-body">
              -{product.discount_pct}%
            </span>
          )}
        </div>

        {/* Top-Right Wishlist Heart Icon Button */}
        <button
          data-testid={`${testIdPrefix}-wishlist-${product.id}`}
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 border border-[#EEE7FA] flex items-center justify-center shadow-sm transition cursor-pointer z-10 ${wished ? "text-[#E5497C]" : "text-[#1C1924] hover:text-[#E5497C]"}`}
          aria-label="Wishlist"
        >
          <Heart size={14} className={wished ? "fill-[#E5497C] text-[#E5497C]" : ""} />
        </button>

        {/* Bottom-Right Floating Quick Add Bag Button */}
        <button
          data-testid={`${testIdPrefix}-quick-add-${product.id}`}
          onClick={handleAddToCartClick}
          className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-[#1C1924] text-white flex items-center justify-center shadow-md hover:bg-black transition-all duration-300 transform scale-90 group-hover:scale-100 opacity-0 group-hover:opacity-100 z-10 cursor-pointer"
          aria-label="Quick Add"
        >
          <ShoppingBag size={14} />
        </button>
      </Link>

      {/* Info fields */}
      <div className="mt-3.5 px-1 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-[#C4A55A] text-[10.5px] font-semibold tracking-wider font-body">
            ✦ Premium Handcrafted
          </p>
          <Link to={`/product/${product.id}`} className="block mt-1">
            <h3 className="font-display font-semibold text-[14px] leading-tight text-[#1C1924] tracking-wide uppercase group-hover:text-[#E5497C] transition duration-300 truncate">
              {product.name}
            </h3>
          </Link>
          <p className="text-[12.5px] text-[#8b8790] font-body mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Bottom Ratings + Price Row */}
        <div className="mt-3.5 pt-3 border-t border-[#EEE7FA]/60 flex items-center justify-between">
          <div className="flex items-center gap-1 text-[12.5px] font-semibold text-[#1C1924] font-body">
            <Star size={13} className="fill-[#E5497C] text-[#E5497C]" />
            <span>{product.rating.toFixed(1)}</span>
            <span className="text-[#8b8790] font-normal">({product.reviews_count})</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[15.5px] font-semibold text-[#E5497C] font-display">
              {formatINR(product.price)}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-[12px] text-[#8b8790] line-through font-display">
                {formatINR(product.original_price)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
