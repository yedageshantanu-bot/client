import { Star } from "lucide-react";
import { mockTestimonials } from "@/lib/mockData";

export function Testimonials() {
  return (
    <section className="section bg-[linear-gradient(180deg,_#f8f3eb_0%,_#fff_100%)]">
      <div className="container-page">
        <div className="mb-8 max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-dark">
            Customer Reviews
          </p>
          <h2 className="mt-2 font-display text-5xl font-semibold text-ink">
            Soft words from our family
          </h2>
          <p className="mt-3 text-sm leading-6 text-brand-muted">
            Ivory cards, serif names, and restrained gold star ratings to keep
            the testimonial block aligned with the rest of the luxury system.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {mockTestimonials.map((review) => (
            <article
              key={review.name}
              className="rounded-[1.5rem] border border-brand-border bg-white p-6 shadow-[0_16px_40px_rgba(40,20,20,0.06)]"
            >
              <div className="flex items-center justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-beige font-semibold text-ink">
                  {review.avatar}
                </div>
                <div className="flex text-gold">
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <Star key={index} size={15} fill="currentColor" />
                  ))}
                </div>
              </div>
              <p className="mt-5 text-sm leading-6 text-brand-muted">
                “{review.comment}”
              </p>
              <div className="mt-5">
                <h3 className="font-display text-2xl font-semibold text-ink">
                  {review.name}
                </h3>
                <p className="text-sm text-brand-muted">{review.city}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
