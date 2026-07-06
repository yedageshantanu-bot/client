import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProduct, submitProductReview } from "@/lib/api";
import { useStore } from "@/context/StoreContext";
import { formatINR } from "@/lib/format";
import { Heart, Star, ShoppingBag, ChevronRight, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [p, setP] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const { addToCart, toggleWishlist, isWished, user } = useStore();

  // Accordion tabs state
  const [openTabs, setOpenTabs] = useState({
    desc: true,
    decl: false,
    ship: false,
    faq: false,
  });

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    setP(null);
    setActiveImg(0);
    getProduct(id)
      .then(setP)
      .catch(() => setP(null));
  }, [id]);

  // Mix images and videos into a single gallery list
  const gallery = p
    ? [
        ...(p.images && p.images.length ? p.images : [p.image]),
        ...(p.videos && p.videos.length ? p.videos : [])
      ].filter(Boolean)
    : [];



  if (!p) {
    return (
      <main className="pt-32 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid md:grid-cols-2 gap-10">
          <div className="aspect-square skeleton" />
          <div className="space-y-4">
            <div className="h-8 skeleton" />
            <div className="h-6 skeleton" />
            <div className="h-24 skeleton" />
          </div>
        </div>
      </main>
    );
  }

  const wished = isWished(p.id);

  const isVideoItem = (src) => {
    if (!src) return false;
    return (
      src.includes(".mp4") ||
      src.includes("/video/upload") ||
      p.videos?.includes(src)
    );
  };

  const toggleAccordion = (tab) => {
    setOpenTabs((prev) => ({ ...prev, [tab]: !prev[tab] }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to submit a review");
      navigate("/login");
      return;
    }
    if (!reviewComment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    setSubmittingReview(true);
    try {
      const data = await submitProductReview(p.id, {
        rating: reviewRating,
        comment: reviewComment,
      });

      // Update state locally
      setP((prev) => ({
        ...prev,
        rating: data.ratings.average,
        reviews_count: data.reviews.length,
        reviews: data.reviews,
      }));

      setReviewComment("");
      setReviewRating(5);
      toast.success("Review submitted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Compute rating breakdown stats
  const totalReviews = p.reviews?.length || 0;
  const starsCount = [0, 0, 0, 0, 0]; // indices 0 to 4 correspond to 1 to 5 stars
  p.reviews?.forEach((r) => {
    const star = Math.max(1, Math.min(5, Math.round(r.rating || 5)));
    starsCount[star - 1]++;
  });

  return (
    <main data-testid="product-detail-page" className="pt-28 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[13px] text-[#8b8790] mb-6 flex-wrap">
          <Link to="/" className="hover:text-[#1C1924] transition">Home</Link>
          <ChevronRight size={12} />
          <Link to="/shop" className="hover:text-[#1C1924] transition">Shop</Link>
          <ChevronRight size={12} />
          <Link to={`/shop?category=${p.category.toLowerCase()}`} className="hover:text-[#1C1924] transition capitalize">{p.category}</Link>
          <ChevronRight size={12} />
          <span className="text-[#1C1924] font-medium">{p.name}</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT: Compact Product Image Slider (Fixed size, sticky, never stretches) */}
          <div className="lg:col-span-6 flex flex-col-reverse md:flex-row gap-4 self-start lg:sticky lg:top-24 w-full max-w-[550px] mx-auto">
            
            {/* Vertical/Horizontal Thumbnails list */}
            {gallery.length > 1 && (
              <div className="flex flex-row md:flex-col gap-3 shrink-0 overflow-y-auto max-h-[450px] scrollbar-none justify-start">
                {gallery.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden border-2 transition cursor-pointer ${activeImg === i ? "border-[#E5497C]" : "border-transparent opacity-60 hover:opacity-100"}`}
                  >
                    {isVideoItem(src) ? (
                      <div className="w-full h-full bg-[#1C1924]/10 relative">
                        <video src={src} className="w-full h-full object-cover pointer-events-none" />
                        <div className="absolute inset-0 grid place-items-center bg-black/40 text-[9px] text-white font-bold">▶</div>
                      </div>
                    ) : (
                      <img src={src} alt={`thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Active main product image / video container with navigation indicators */}
            <div className="relative aspect-square flex-1 rounded-[24px] overflow-hidden bg-white border border-[#EEE7FA] shadow-sm flex items-center justify-center group">
              {isVideoItem(gallery[activeImg]) ? (
                <video
                  src={gallery[activeImg]}
                  controls
                  className="absolute inset-0 w-full h-full object-contain p-4 bg-white"
                  autoPlay
                  muted
                />
              ) : (
                <img
                  key={activeImg}
                  src={gallery[activeImg]}
                  alt={p.name}
                  className="absolute inset-0 w-full h-full object-contain p-4 transition-all duration-500 ease-in-out bg-white"
                />
              )}

              {/* Prev / Next navigation arrows on hover */}
              {gallery.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImg((prev) => (prev - 1 + gallery.length) % gallery.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md border border-[#EEE7FA] text-[#1C1924] grid place-items-center opacity-0 group-hover:opacity-100 transition hover:bg-white cursor-pointer z-10 font-bold"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setActiveImg((prev) => (prev + 1) % gallery.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md border border-[#EEE7FA] text-[#1C1924] grid place-items-center opacity-0 group-hover:opacity-100 transition hover:bg-white cursor-pointer z-10 font-bold"
                  >
                    →
                  </button>
                </>
              )}

              {/* Badge Overlays */}
              {p.badge && (
                <span className="absolute top-4 left-4 bg-[#1C1924] text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-1.5 rounded-full z-10">
                  {p.badge}
                </span>
              )}
              {p.on_sale && p.discount_pct > 0 && (
                <span className="absolute top-4 right-4 bg-[#E5497C] text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full z-10">
                  -{p.discount_pct}%
                </span>
              )}

              {/* Slider Indicator Dots overlay */}
              {gallery.length > 1 && (
                <div className="absolute bottom-4 inset-x-0 flex justify-center gap-1.5 z-10">
                  {gallery.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImg(idx)}
                      className={`w-2 h-2 rounded-full transition-all cursor-pointer ${activeImg === idx ? "bg-[#E5497C] w-4" : "bg-gray-300 hover:bg-gray-400"}`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT: Product Details Info */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <p className="overline text-[#E5497C]">{p.category}</p>
              <h1 className="mt-2 font-display font-semibold text-[#1C1924] text-3xl md:text-5xl leading-[1.05] tracking-tight uppercase">
                {p.name}
              </h1>

              {/* Star rating */}
              <div className="mt-4 flex items-center gap-2 text-[13px] text-[#4A4652]">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < Math.round(p.rating) ? "fill-[#E5497C] text-[#E5497C]" : "text-[#EEE7FA]"} />
                  ))}
                </div>
                <span className="font-semibold text-[#1C1924]">{p.rating.toFixed(1)}</span>
                <span className="text-[#8b8790]">· {p.reviews_count} reviews</span>
              </div>

              {/* Price block */}
              <div className="mt-6">
                <div className="flex items-baseline gap-3">
                  <span data-testid="product-price" className="font-display text-[42px] font-semibold text-[#E5497C] leading-none">
                    {formatINR(p.price)}
                  </span>
                  {p.original_price && (
                    <span className="text-[20px] text-[#8b8790] line-through">
                      {formatINR(p.original_price)}
                    </span>
                  )}
                </div>
                <p className="text-[12px] text-[#8b8790] mt-1.5">Tax & Shipping calculated at checkout.</p>
              </div>

              {/* Attributes grid */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="border border-[#EEE7FA] rounded-2xl p-4 bg-[#FAF8F5]">
                  <p className="text-[11px] text-[#8b8790] uppercase tracking-wider font-bold">Fabric / Material</p>
                  <p className="text-[14px] text-[#1C1924] font-semibold mt-1">{p.fabric}</p>
                </div>
                <div className="border border-[#EEE7FA] rounded-2xl p-4 bg-[#FAF8F5]">
                  <p className="text-[11px] text-[#8b8790] uppercase tracking-wider font-bold">Best for</p>
                  <p className="text-[14px] text-[#1C1924] font-semibold mt-1">{p.occasion}</p>
                </div>
                <div className="border border-[#EEE7FA] rounded-2xl p-4 bg-[#FAF8F5]">
                  <p className="text-[11px] text-[#8b8790] uppercase tracking-wider font-bold">Color shade</p>
                  <p className="text-[14px] text-[#1C1924] font-semibold mt-1">{p.color}</p>
                </div>
                <div className="border border-[#EEE7FA] rounded-2xl p-4 bg-[#FAF8F5]">
                  <p className="text-[11px] text-[#8b8790] uppercase tracking-wider font-bold">Category</p>
                  <p className="text-[14px] text-[#1C1924] font-semibold mt-1">{p.category}</p>
                </div>
              </div>

              {/* Actions row */}
              <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                <div className="flex items-center rounded-full bg-white border border-[#EEE7FA] shrink-0 w-full sm:w-auto justify-between">
                  <button
                    data-testid="product-qty-minus"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-12 h-12 grid place-items-center font-bold text-[#1C1924]"
                  >
                    −
                  </button>
                  <span data-testid="product-qty" className="w-8 text-center font-semibold text-[#1C1924]">
                    {qty}
                  </span>
                  <button
                    data-testid="product-qty-plus"
                    onClick={() => setQty((q) => q + 1)}
                    className="w-12 h-12 grid place-items-center font-bold text-[#1C1924]"
                  >
                    +
                  </button>
                </div>
                
                <button
                  data-testid="product-add-to-cart"
                  onClick={() => {
                    addToCart(p, qty);
                    toast.success(`${p.name} added to cart`);
                  }}
                  className="w-full sm:flex-1 h-12 rounded-full bg-[#1C1924] text-white font-semibold text-[14px] tracking-wide hover:bg-black transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag size={16} /> Add to Cart
                </button>

                <button
                  onClick={() => {
                    addToCart(p, qty);
                    navigate("/checkout");
                  }}
                  className="w-full sm:flex-1 h-12 rounded-full border-2 border-[#1C1924] bg-white text-[#1C1924] font-semibold text-[14px] tracking-wide hover:bg-[#1C1924]/5 transition flex items-center justify-center cursor-pointer"
                >
                  Buy Now
                </button>

                <button
                  data-testid="product-wishlist"
                  onClick={() => {
                    toggleWishlist(p);
                    toast.success(wished ? "Removed from wishlist" : "Added to wishlist");
                  }}
                  className={`w-12 h-12 grid place-items-center rounded-full border cursor-pointer transition shrink-0 ${wished ? "bg-[#E5497C] text-white border-[#E5497C]" : "bg-white text-[#1C1924] border-[#EEE7FA] hover:bg-white"}`}
                  aria-label="Wishlist"
                >
                  <Heart size={16} className={wished ? "fill-white" : ""} />
                </button>
              </div>

              {/* Write Review Navigation Quick Link */}
              <div className="mt-4 flex items-center gap-1.5 text-[13px] text-[#E5497C] font-semibold">
                <MessageSquare size={14} />
                <a href="#ratings-reviews-section" className="hover:underline">Rate and comment on this product</a>
              </div>

              {/* Payment trust badges */}
              <div className="mt-5 flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-bold text-[#8b8790]">
                <span className="px-2 py-0.5 border border-[#EEE7FA] rounded bg-white/60">Visa</span>
                <span className="px-2 py-0.5 border border-[#EEE7FA] rounded bg-white/60">MC</span>
                <span className="px-2 py-0.5 border border-[#EEE7FA] rounded bg-white/60">Amex</span>
                <span className="px-2 py-0.5 border border-[#EEE7FA] rounded bg-white/60">UPI</span>
                <span className="px-2 py-0.5 border border-[#EEE7FA] rounded bg-white/60">NetBanking</span>
              </div>

              {/* Accordion list */}
              <div className="mt-8 border-t border-[#EEE7FA] pt-6 space-y-4">
                
                {/* Description tab */}
                <div className="border-b border-[#EEE7FA] pb-3">
                  <button
                    onClick={() => toggleAccordion("desc")}
                    className="w-full flex items-center justify-between font-display font-semibold text-[#1C1924] text-[13.5px] uppercase tracking-wider text-left py-1"
                  >
                    <span>Description</span>
                    <span className="text-[11px] text-[#8b8790]">{openTabs.desc ? "▲" : "▼"}</span>
                  </button>
                  {openTabs.desc && (
                    <p className="mt-2 text-[13px] text-[#4A4652] leading-relaxed">
                      {p.description}
                    </p>
                  )}
                </div>

                {/* Product declaration tab */}
                <div className="border-b border-[#EEE7FA] pb-3">
                  <button
                    onClick={() => toggleAccordion("decl")}
                    className="w-full flex items-center justify-between font-display font-semibold text-[#1C1924] text-[13.5px] uppercase tracking-wider text-left py-1"
                  >
                    <span>Product Declaration</span>
                    <span className="text-[11px] text-[#8b8790]">{openTabs.decl ? "▲" : "▼"}</span>
                  </button>
                  {openTabs.decl && (
                    <p className="mt-2 text-[13px] text-[#4A4652] leading-relaxed">
                      {p.declaration}
                    </p>
                  )}
                </div>

                {/* Shipping & returns tab */}
                <div className="border-b border-[#EEE7FA] pb-3">
                  <button
                    onClick={() => toggleAccordion("ship")}
                    className="w-full flex items-center justify-between font-display font-semibold text-[#1C1924] text-[13.5px] uppercase tracking-wider text-left py-1"
                  >
                    <span>Shipping & Returns</span>
                    <span className="text-[11px] text-[#8b8790]">{openTabs.ship ? "▲" : "▼"}</span>
                  </button>
                  {openTabs.ship && (
                    <p className="mt-2 text-[13px] text-[#4A4652] leading-relaxed">
                      {p.shippingReturns}
                    </p>
                  )}
                </div>

                {/* FAQs tab */}
                <div className="border-b border-[#EEE7FA] pb-3">
                  <button
                    onClick={() => toggleAccordion("faq")}
                    className="w-full flex items-center justify-between font-display font-semibold text-[#1C1924] text-[13.5px] uppercase tracking-wider text-left py-1"
                  >
                    <span>FAQs</span>
                    <span className="text-[11px] text-[#8b8790]">{openTabs.faq ? "▲" : "▼"}</span>
                  </button>
                  {openTabs.faq && (
                    <div className="mt-2.5 space-y-3">
                      {p.faqs.map((faq, idx) => (
                        <div key={idx} className="text-[13px] leading-relaxed">
                          <p className="font-bold text-[#1C1924]">Q: {faq.question}</p>
                          <p className="text-[#4A4652] mt-0.5">A: {faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section id="ratings-reviews-section" data-testid="product-reviews" className="mt-20 md:mt-28 border-t border-[#EEE7FA] pt-16">
          <p className="overline text-[#E5497C]">Ratings & Reviews</p>
          <h2 className="mt-2 font-display font-semibold text-[#1C1924] text-4xl md:text-5xl tracking-tight">
            Customer Reviews
          </h2>

          <div className="grid lg:grid-cols-12 gap-10 mt-10">
            
            {/* LEFT Dashboard Statistics */}
            <div className="lg:col-span-4 border border-[#EEE7FA] rounded-[24px] p-6 bg-[#FAF8F5] flex flex-col justify-center">
              <div className="text-center">
                <p className="font-display text-[64px] font-semibold text-[#1C1924] leading-none">
                  {p.rating.toFixed(1)}
                </p>
                <div className="flex items-center justify-center gap-0.5 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className={i < Math.round(p.rating) ? "fill-[#E5497C] text-[#E5497C]" : "text-[#EEE7FA]"} />
                  ))}
                </div>
                <p className="text-[12.5px] text-[#8b8790] mt-1.5 uppercase tracking-wider font-semibold">
                  Based on {totalReviews} reviews
                </p>
              </div>

              {/* Dynamic Progress bars */}
              <div className="mt-8 space-y-2.5">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = starsCount[stars - 1] || 0;
                  const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                  return (
                    <div key={stars} className="flex items-center gap-3 text-[13px] text-[#4A4652]">
                      <span className="w-12 text-right">{stars} star</span>
                      <div className="flex-1 h-2 rounded-full bg-[#EEE7FA] overflow-hidden">
                        <div className="h-full bg-[#E5497C] rounded-full" style={{ width: `${percent}%` }} />
                      </div>
                      <span className="w-6 text-left">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT Review Form or Write Box */}
            <div className="lg:col-span-8 border border-[#EEE7FA] rounded-[24px] p-6 bg-white shadow-sm">
              <h3 className="font-display font-semibold text-[20px] text-[#1C1924] uppercase tracking-wider">
                Rate this Product
              </h3>
              <p className="text-[12.5px] text-[#8b8790] mt-1">Select stars first, then share your comment.</p>

              <form onSubmit={handleReviewSubmit} className="mt-6 space-y-4">
                {/* Rating selection stars */}
                <div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className={`w-10 h-10 border border-[#EEE7FA] rounded-full flex items-center justify-center transition cursor-pointer hover:bg-[#FFF4F7] ${reviewRating >= star ? "bg-[#FFF4F7] border-[#E5497C] text-[#E5497C]" : "bg-white text-[#8b8790]"}`}
                      >
                        <Star size={16} className={reviewRating >= star ? "fill-[#E5497C]" : ""} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment box */}
                <div>
                  <label className="block text-[12.5px] font-bold text-[#1C1924] uppercase tracking-wider mb-1.5">Comment</label>
                  <textarea
                    rows="4"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Write your review here... How did you like the quality and delivery?"
                    className="w-full rounded-2xl border border-[#EEE7FA] p-4 text-[14px] text-[#1C1924] focus:outline-none focus:border-[#E5497C]"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-6 py-3 rounded-full bg-[#1C1924] text-white font-semibold text-[13px] uppercase tracking-widest hover:bg-black transition cursor-pointer disabled:opacity-50"
                >
                  {submittingReview ? "Submitting..." : "Submit review"}
                </button>
              </form>
            </div>

          </div>

          {/* Reviews List */}
          <div className="mt-14">
            <h3 className="font-display font-semibold text-[22px] text-[#1C1924] uppercase tracking-wider mb-6">
              Customer Feedback
            </h3>

            {p.reviews && p.reviews.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {p.reviews.map((r, i) => (
                  <div key={i} data-testid={`review-card-${i}`} className="border border-[#EEE7FA] rounded-[22px] p-6 bg-[#FAF8F5]">
                    <div className="flex items-center gap-3">
                      <img
                        src={r.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(r.author)}`}
                        alt={r.author}
                        className="w-11 h-11 rounded-full object-cover border border-[#EEE7FA]"
                      />
                      <div>
                        <p className="font-display font-semibold text-[#1C1924] text-[15px]">{r.author}</p>
                        <p className="text-[12px] text-[#8b8790]">{r.date}</p>
                      </div>
                      <div className="ml-auto flex items-center gap-0.5">
                        {[...Array(5)].map((_, j) => (
                          <Star
                            key={j}
                            size={12}
                            className={j < Math.round(r.rating) ? "fill-[#E5497C] text-[#E5497C]" : "text-[#EEE7FA]"}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-4 text-[#4A4652] text-[13.5px] leading-relaxed italic">"{r.comment || r.body}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#8b8790] text-[13.5px] bg-[#FAF8F5] border border-[#EEE7FA] rounded-[16px] p-4 text-center">
                No reviews yet. Be the first to share your thoughts!
              </p>
            )}
          </div>
        </section>

        <div className="mt-14 text-center">
          <Link to="/shop" data-testid="product-continue-shopping" className="btn-ghost">
            Continue browsing
          </Link>
        </div>
      </div>
    </main>
  );
}
