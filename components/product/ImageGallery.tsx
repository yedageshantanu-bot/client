"use client";

import Image from "next/image";
import { PlayCircle } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { getProductImages, getProductVideos, getVideoThumbnailUrl } from "@/lib/productMedia";

export function ImageGallery({ product }: { product: Product }) {
  const images = getProductImages(product);
  const videos = getProductVideos(product);
  const [active, setActive] = useState<string>(images[0]?.url || videos[0]?.url || "");

  const media = [
    ...images.map((item) => ({ type: "image" as const, url: item.url })),
    ...videos.map((item) => ({ type: "video" as const, url: item.url, thumbnailUrl: getVideoThumbnailUrl(item) })),
  ];
  const activeMediaUrl = media.some((item) => item.url === active)
    ? active
    : media[0]?.url || "";

  return (
    <div className="grid gap-4 md:grid-cols-[88px_1fr]">
      <div className="order-2 flex gap-3 overflow-x-auto md:order-1 md:block md:space-y-3 md:overflow-visible">
        {media.map((item) => (
          <button
            key={item.url}
            onClick={() => setActive(item.url)}
            className={cn(
              "relative h-20 w-20 shrink-0 overflow-hidden rounded-[8px] border bg-beige-soft",
              activeMediaUrl === item.url ? "border-ink" : "border-brand-border",
            )}
            aria-label="Select media"
          >
            {item.type === "video" ? (
              <>
                {item.thumbnailUrl ? (
                  <Image
                    src={item.thumbnailUrl}
                    alt="Video thumbnail"
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <span className="grid h-full w-full place-items-center text-ink">
                    <PlayCircle size={24} />
                  </span>
                )}
                <span className="absolute inset-0 bg-black/10" />
                <span className="absolute inset-0 grid place-items-center text-white drop-shadow">
                  <PlayCircle size={24} />
                </span>
              </>
            ) : (
              <Image
                src={item.url}
                alt={product.title}
                fill
                sizes="80px"
                className="object-cover"
              />
            )}
          </button>
        ))}
      </div>

      <div className="order-1 overflow-hidden rounded-[8px] bg-beige-soft md:order-2">
        <div className="relative aspect-[4/5]">
          {videos.some((item) => item.url === activeMediaUrl) ? (
            <video
              src={activeMediaUrl}
              className="h-full w-full object-cover"
              controls
              autoPlay
              muted
              loop
              playsInline
              poster={getVideoThumbnailUrl(videos.find((item) => item.url === activeMediaUrl) || null)}
            />
          ) : (
            <Image
              src={activeMediaUrl || images[0]?.url || ""}
              alt={product.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition duration-500 hover:scale-110"
            />
          )}
        </div>
      </div>
    </div>
  );
}
