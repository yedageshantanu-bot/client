"use client";

import { FormEvent, useMemo, useState } from "react";
import { CheckCircle2, MessageSquareText, Star } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";
import type { Product, Review } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { getAverageRating, getReviewCount } from "@/lib/productMedia";

function Stars({ rating, size = 18 }: { rating: number; size?: number }) {
  return (
    <div className="flex text-gold">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={size}
          fill={index < rating ? "currentColor" : "none"}
          className={index < rating ? "text-gold" : "text-brand-border"}
        />
      ))}
    </div>
  );
}

export function ReviewSection({ product }: { product: Product }) {
  const { user } = useAuth();
  const { reviews, addReview } = useStore();
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const productReviews = useMemo(
    () => reviews.filter((review) => review.productId === product._id),
    [product._id, reviews],
  );

  const ratingCounts = useMemo(
    () =>
      [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: productReviews.filter((review) => review.rating === star).length,
      })),
    [productReviews],
  );

  const totalVisibleRatings =
    ratingCounts.reduce((sum, item) => sum + item.count, 0) || 1;
  const visibleReviews = productReviews.slice(0, 6);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!rating) {
      toast.error("Please select a star rating first");
      return;
    }

    if (comment.trim().length < 8) {
      toast.error("Please write a little more about the saree");
      return;
    }

    addReview({
      productId: product._id,
      name: user?.name || name.trim() || "Alaira Customer",
      email: user?.email,
      rating,
      title: title.trim() || `${rating} star review`,
      comment: comment.trim(),
      verified: Boolean(user),
    });

    setRating(0);
    setName("");
    setTitle("");
    setComment("");
  };

  return (
    <section
      id="reviews"
      className="border-y border-brand-border bg-beige-soft py-14"
    >
      <div className="container-page">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-dark">
              Ratings & Reviews
            </p>
            <h2 className="mt-2 font-display text-5xl font-semibold text-ink">
              Customer reviews
            </h2>
          </div>
          <a
            href="#write-review"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-brand-border bg-white px-5 text-sm font-semibold text-ink transition hover:border-gold"
          >
            <MessageSquareText size={17} />
            Write a review
          </a>
        </div>

        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <aside className="h-fit rounded-[8px] border border-brand-border bg-white p-5 lg:sticky lg:top-24">
            <div className="flex items-end gap-2">
              <span className="text-5xl font-semibold text-ink">
                {getAverageRating(product)}
              </span>
              <span className="pb-2 text-sm text-brand-muted">out of 5</span>
            </div>
            <div className="mt-2">
              <Stars rating={Math.round(getAverageRating(product))} />
            </div>
            <p className="mt-2 text-sm text-brand-muted">
              Based on {getReviewCount(product)} ratings
            </p>

            <div className="mt-6 grid gap-3">
              {ratingCounts.map((item) => (
                <div
                  key={item.star}
                  className="grid grid-cols-[42px_1fr_28px] items-center gap-3 text-sm"
                >
                  <span className="font-medium text-ink">{item.star} star</span>
                  <div className="h-2 overflow-hidden rounded-full bg-beige">
                    <div
                      className="h-full rounded-full bg-gold"
                      style={{
                        width: `${(item.count / totalVisibleRatings) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-right text-brand-muted">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </aside>

          <div className="grid gap-6">
            <form
              id="write-review"
              onSubmit={submit}
              className="rounded-[8px] border border-brand-border bg-white p-5"
            >
              <h3 className="font-display text-3xl font-semibold text-ink">
                Rate this saree
              </h3>
              <p className="mt-1 text-sm text-brand-muted">
                Select stars first, then share your comment.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {Array.from({ length: 5 }).map((_, index) => {
                  const value = index + 1;

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      className={`flex h-11 items-center gap-1 rounded-full border px-4 text-sm font-semibold transition ${
                        rating >= value
                          ? "border-gold bg-gold/10 text-gold-dark"
                          : "border-brand-border text-brand-muted hover:border-gold"
                      }`}
                    >
                      <Star
                        size={17}
                        fill={rating >= value ? "currentColor" : "none"}
                      />
                      {value}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {!user && (
                  <label>
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-muted">
                      Your name
                    </span>
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Your name"
                      className="mt-2 h-11 w-full rounded-[8px] border border-brand-border px-3 text-sm outline-none focus:border-gold"
                    />
                  </label>
                )}
                <label className={user ? "md:col-span-2" : ""}>
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-muted">
                    Review title
                  </span>
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    disabled={!rating}
                    placeholder="Example: Beautiful fabric and finish"
                    className="mt-2 h-11 w-full rounded-[8px] border border-brand-border px-3 text-sm outline-none focus:border-gold disabled:bg-beige-soft"
                  />
                </label>
                <label className="md:col-span-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-muted">
                    Comment
                  </span>
                  <textarea
                    rows={5}
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    disabled={!rating}
                    placeholder={
                      rating
                        ? "Tell shoppers about fabric, color, drape, delivery, or occasion."
                        : "Select a star rating first"
                    }
                    className="mt-2 w-full rounded-[8px] border border-brand-border p-3 text-sm outline-none focus:border-gold disabled:bg-beige-soft"
                  />
                </label>
              </div>

              <Button className="mt-5" type="submit">
                Submit review
              </Button>
            </form>

            <div className="grid gap-4">
              {visibleReviews.map((review: Review) => (
                <article
                  key={review._id}
                  className="rounded-[8px] border border-brand-border bg-white p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <Stars rating={review.rating} size={16} />
                      <h3 className="mt-2 font-semibold text-ink">
                        {review.title}
                      </h3>
                    </div>
                    {review.verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 size={14} />
                        Verified buyer
                      </span>
                    )}
                  </div>
                  <p className="mt-4 text-sm leading-6 text-brand-muted">
                    {review.comment}
                  </p>
                  <div className="mt-4 text-xs text-brand-muted">
                    {review.name} |{" "}
                    {new Date(review.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
