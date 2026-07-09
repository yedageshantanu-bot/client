import type { MediaAsset } from "./types";

export type LocalAssetKey =
  | "wedding"
  | "silk"
  | "party"
  | "cotton"
  | "daily";

export const localAssets: Record<
  LocalAssetKey,
  MediaAsset & { label: string; category: string }
> = {
  wedding: {
    label: "Cute Plushies",
    category: "Cute Plushies",
    url: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=600",
    publicId: "local/cute-plushies",
    altText: "Teddy Bear",
    resourceType: "image",
    format: "jpg",
    mimeType: "image/jpeg",
  },
  silk: {
    label: "Fine Jewelry",
    category: "Fine Jewelry",
    url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600",
    publicId: "local/fine-jewelry",
    altText: "Interlocking Hearts",
    resourceType: "image",
    format: "jpg",
    mimeType: "image/jpeg",
  },
  party: {
    label: "Romantic Combos",
    category: "Romantic Combos",
    url: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=600",
    publicId: "local/romantic-combos",
    altText: "Love Gift Hamper",
    resourceType: "image",
    format: "jpg",
    mimeType: "image/jpeg",
  },
  cotton: {
    label: "Personalized Gifts",
    category: "Personalized Gifts",
    url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600",
    publicId: "local/personalized-gifts",
    altText: "Star Map Constellation",
    resourceType: "image",
    format: "jpg",
    mimeType: "image/jpeg",
  },
  daily: {
    label: "Surprise Boxes",
    category: "Surprise Boxes",
    url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600",
    publicId: "local/surprise-boxes",
    altText: "365 Reasons Jar",
    resourceType: "image",
    format: "jpg",
    mimeType: "image/jpeg",
  },
};

export const localAssetList = Object.values(localAssets);

export const getLocalAssetForCategory = (category?: string | null): MediaAsset => {
  const value = (category || "").toLowerCase();

  if (value.includes("jewel") || value.includes("necklace") || value.includes("ring")) {
    return localAssets.silk;
  }

  if (value.includes("combo") || value.includes("hamper")) {
    return localAssets.party;
  }

  if (value.includes("personal") || value.includes("map")) {
    return localAssets.cotton;
  }

  if (value.includes("box") || value.includes("letter") || value.includes("jar")) {
    return localAssets.daily;
  }

  return localAssets.wedding;
};

export const isBlockedExternalImage = (url?: string | null) => false;

export const normalizeLocalAssetUrl = (url: string) => {
  const match = url.match(/\/assets\/(.+)$/i);
  return match?.[1] ? `/assets/${decodeURIComponent(match[1])}` : url;
};

export const getSafeImageUrl = (
  url?: string | null,
  category?: string | null,
) => {
  const normalized = url ? normalizeLocalAssetUrl(url) : "";
  return normalized && !isBlockedExternalImage(normalized)
    ? normalized
    : getLocalAssetForCategory(category).url;
};
