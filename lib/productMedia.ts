import type { MediaAsset, Product, ProductVariant } from "./types";
import {
  getLocalAssetForCategory,
  isBlockedExternalImage,
  normalizeLocalAssetUrl,
} from "./localAssets";

const asArray = <T,>(value: T | T[] | undefined | null): T[] =>
  Array.isArray(value) ? value : value ? [value] : [];

const isMediaAsset = (value: string | MediaAsset): value is MediaAsset =>
  typeof value !== "string";

const toCleanImageAsset = (
  value: string | MediaAsset | null | undefined,
): MediaAsset | null => {
  if (!value) {
    return null;
  }

  const asset = isMediaAsset(value)
    ? value
    : {
        url: value,
        resourceType: "image" as const,
      };

  const url = normalizeLocalAssetUrl(asset.url);

  if (!url || isBlockedExternalImage(url)) {
    return null;
  }

  return { ...asset, url };
};

const cleanImageList = (
  items: Array<string | MediaAsset | null | undefined>,
  fallback: MediaAsset,
) => {
  const cleaned = items
    .map((item) => toCleanImageAsset(item))
    .filter((item): item is MediaAsset => Boolean(item?.url));

  return cleaned.length ? cleaned : [fallback];
};

export const getMediaUrl = (value?: string | MediaAsset | null) => {
  if (!value) {
    return "";
  }

  return typeof value === "string" ? value : value.url;
};

export const getVariantImages = (variant?: ProductVariant | null) => {
  if (!variant) {
    return [];
  }

  return [variant.frontImage, variant.backImage, ...(variant.galleryImages || [])].filter(
    (item): item is MediaAsset => Boolean(item?.url && !isBlockedExternalImage(item.url)),
  );
};

export const getVariantVideos = (variant?: ProductVariant | null) =>
  variant?.video?.url ? [variant.video] : [];

export const getDisplayProduct = (
  product: Product,
  variant?: ProductVariant | null,
): Product => {
  if (!variant) {
    return product;
  }

  const variantImages = getVariantImages(variant);
  const variantVideos = getVariantVideos(variant);
  const discount = product.price
    ? Math.max(0, Math.round(((product.price - variant.price) / product.price) * 100))
    : product.discount;

  return {
    ...product,
    selectedVariant: variant,
    color: variant.colorName || product.color,
    colors: Array.from(new Set([...(product.colors || []), variant.colorName].filter(Boolean))),
    discountPrice: variant.price || product.discountPrice || product.price,
    stock: Number.isFinite(variant.stock) ? variant.stock : product.stock,
    discount,
    media: {
      ...(product.media || { galleryImages: [], videos: [] }),
      frontImage: variant.frontImage || product.media?.frontImage || null,
      backImage: variant.backImage || product.media?.backImage || null,
      galleryImages: variant.galleryImages || [],
      videos: variantVideos,
      thumbnail: variant.frontImage || product.media?.thumbnail || null,
    },
    thumbnail: variant.frontImage || product.thumbnail || null,
    galleryImages: variantImages,
    videos: variantVideos,
    images: variantImages,
    video: variant.video || null,
  };
};

export const getProductImages = (product: Product) => {
  const fallback = getLocalAssetForCategory(product.category);
  const variantImages = getVariantImages(product.selectedVariant);
  if (variantImages.length) {
    return variantImages;
  }

  const mainImage = product.mainImage;
  const explicitGallery = asArray(product.galleryImages ?? product.media?.galleryImages);
  const legacyImages = product.images ?? [];

  const mediaImages = [
    product.thumbnail,
    mainImage,
    product.media?.frontImage,
    product.media?.thumbnail,
    product.media?.backImage,
    product.media?.sideImage,
    product.media?.hoverImage,
    product.media?.sizeChart,
  ]
    .flatMap((item) => asArray(item))
    .filter(Boolean) as MediaAsset[];

  return cleanImageList([...mediaImages, ...explicitGallery, ...legacyImages], fallback).filter(
    (item, index, list) =>
      item?.url && list.findIndex((candidate) => candidate.url === item.url) === index,
  );
};

export const getProductVideos = (product: Product) => {
  const variantVideos = getVariantVideos(product.selectedVariant);
  if (variantVideos.length) {
    return variantVideos;
  }

  const explicitVideos = asArray(product.videos ?? product.media?.videos);
  const legacyVideo = product.video
    ? [
        isMediaAsset(product.video)
          ? product.video
          : {
              url: product.video,
              resourceType: "video" as const,
            },
      ]
    : [];

  return [...explicitVideos, ...legacyVideo].filter(
    (item, index, list) =>
      item?.url && list.findIndex((candidate) => candidate.url === item.url) === index,
  );
};

export const getVideoThumbnailUrl = (value?: string | MediaAsset | null) => {
  const url = getMediaUrl(value);

  if (!url) {
    return "";
  }

  if (typeof value !== "string" && value?.thumbnailUrl) {
    return value.thumbnailUrl;
  }

  if (/\.(mp4|mov|webm)(\?|#|$)/i.test(url)) {
    return "";
  }

  if (url.includes("/upload/")) {
    return url.replace("/upload/", "/upload/so_0,w_900,h_1200,c_fill,f_auto/");
  }

  if (/\.(jpe?g|png|webp|gif|avif)(\?|#|$)/i.test(url)) {
    return url;
  }

  return url;
};

export const getProductThumbnail = (product: Product) =>
  toCleanImageAsset(product.thumbnail ?? product.mainImage ?? product.media?.thumbnail) ??
  getProductImages(product)[0] ??
  null;

export const getProductFrontImage = (product: Product) => {
  const images = getProductImages(product);
  return (
    toCleanImageAsset(product.thumbnail ?? product.mainImage ?? product.media?.frontImage) ??
    images[0] ??
    null
  );
};

export const getProductHoverImage = (product: Product) => {
  const images = getProductImages(product);
  return (
    toCleanImageAsset(product.media?.hoverImage) ??
    images[1] ??
    images[0] ??
    null
  );
};

export const getProductSizeChart = (product: Product) =>
  product.media?.sizeChart ?? null;

export const toMediaAsset = (
  input: Partial<MediaAsset> & { url: string; resourceType?: "image" | "video" },
  order = 0,
): MediaAsset => ({
  url: input.url,
  publicId: input.publicId ?? "",
  order: input.order ?? order,
  altText: input.altText ?? "",
  resourceType: input.resourceType ?? "image",
  format: input.format ?? "",
  mimeType: input.mimeType ?? "",
});

export const normalizeProduct = (product: Product): Product => ({
  ...product,
  variants: (product.variants || []).map((variant) => ({
    ...variant,
    price: Number(variant.price || 0),
    stock: Number(variant.stock || 0),
    galleryImages: variant.galleryImages || [],
    video: variant.video || null,
  })),
  media: {
    frontImage: product.media?.frontImage ?? getProductFrontImage(product),
    backImage: product.media?.backImage ?? null,
    sideImage: product.media?.sideImage ?? null,
    hoverImage: product.media?.hoverImage ?? getProductHoverImage(product),
    thumbnail: product.media?.thumbnail ?? product.thumbnail ?? null,
    sizeChart: product.media?.sizeChart ?? null,
    galleryImages: product.media?.galleryImages ?? getProductImages(product),
    videos: product.media?.videos ?? getProductVideos(product),
  },
  thumbnail: product.thumbnail ?? getProductThumbnail(product),
  galleryImages: product.galleryImages ?? getProductImages(product),
  videos: product.videos ?? getProductVideos(product),
  images: getProductImages(product),
  video: product.video ?? (getProductVideos(product)[0]?.url ?? null),
  rating: product.rating ?? product.ratings?.average ?? 0,
  reviews: Array.isArray(product.reviews) ? product.reviews.length : product.reviews ?? 0,
  isNew: product.isNew ?? false,
  isBestSeller: product.isBestSeller ?? false,
});

export const getReviewCount = (product: Product) =>
  Array.isArray(product.reviews) ? product.reviews.length : product.reviews ?? 0;

export const getAverageRating = (product: Product) =>
  product.rating ?? product.ratings?.average ?? 0;
