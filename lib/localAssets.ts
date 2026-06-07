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
    label: "Wedding Sarees",
    category: "Wedding Sarees",
    url: "/assets/wedding saree.png",
    publicId: "local/wedding-sarees",
    altText: "Wedding sarees",
    resourceType: "image",
    format: "png",
    mimeType: "image/png",
  },
  silk: {
    label: "Silk Sarees",
    category: "Silk Sarees",
    url: "/assets/silk saree.png",
    publicId: "local/silk-sarees",
    altText: "Silk sarees",
    resourceType: "image",
    format: "png",
    mimeType: "image/png",
  },
  party: {
    label: "Party Wear",
    category: "Party Wear",
    url: "/assets/party clothes.png",
    publicId: "local/party-wear",
    altText: "Party wear sarees",
    resourceType: "image",
    format: "png",
    mimeType: "image/png",
  },
  cotton: {
    label: "Cotton Sarees",
    category: "Cotton Sarees",
    url: "/assets/cotton saree.png",
    publicId: "local/cotton-sarees",
    altText: "Cotton sarees",
    resourceType: "image",
    format: "png",
    mimeType: "image/png",
  },
  daily: {
    label: "Daily Wear",
    category: "Daily Wear",
    url: "/assets/home page.png",
    publicId: "local/daily-wear-saree",
    altText: "Daily wear saree",
    resourceType: "image",
    format: "png",
    mimeType: "image/png",
  },
};

export const localAssetList = Object.values(localAssets);

export const getLocalAssetForCategory = (category?: string | null): MediaAsset => {
  const value = (category || "").toLowerCase();

  if (value.includes("silk")) {
    return localAssets.silk;
  }

  if (value.includes("party")) {
    return localAssets.party;
  }

  if (value.includes("cotton")) {
    return localAssets.cotton;
  }

  if (value.includes("daily")) {
    return localAssets.daily;
  }

  return localAssets.wedding;
};

export const isBlockedExternalImage = (url?: string | null) =>
  Boolean(
    url &&
      ((/^(https?:)?\/\//i.test(url) &&
        !/^https:\/\/res\.cloudinary\.com\//i.test(url)) ||
        /(images\.pexels\.com|images\.unsplash\.com|placeholder)/i.test(url)),
  );

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
