import { PlayCircle } from "lucide-react";
import { videoStories } from "@/lib/mockData";

export function VideoShowcase() {
  return (
    <section className="section bg-white">
      <div className="container-page">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-dark">
            Video Showcase
          </p>
          <h2 className="mt-2 font-display text-5xl font-semibold text-ink">
            See the fabric move
          </h2>
          <p className="mt-3 text-sm leading-6 text-brand-muted">
            A closer look at drape, texture, shimmer, and movement across the
            wedding, festive, and everyday edits.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {videoStories.map((story) => (
            <div
              key={story.title}
              className="overflow-hidden rounded-[8px] border border-brand-border bg-beige-soft"
            >
              <div className="relative aspect-[4/5]">
                <video
                  src={story.video}
                  className="h-full w-full object-cover"
                  muted
                  loop
                  playsInline
                  autoPlay
                />
                <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-ink">
                  <PlayCircle size={20} />
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-display text-3xl font-semibold text-ink">
                  {story.title}
                </h3>
                <p className="mt-1 text-sm text-brand-muted">
                  {story.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
