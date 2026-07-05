import type { MediaAsset, Product } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://vastraaura-backend.onrender.com/api";
const UPLOAD_API_BASE = API_URL.replace(/\/api$/, "");

const toFormValue = (value: unknown) =>
  typeof value === "string" ? value : JSON.stringify(value);

const appendIfDefined = (formData: FormData, key: string, value: unknown) => {
  if (value === undefined || value === null || value === "") {
    return;
  }

  formData.append(key, toFormValue(value));
};

const parseJsonResponse = async <T,>(response: Response): Promise<T> => {
  const payload = (await response.json().catch(() => null)) as {
    success?: boolean;
    product?: T;
    products?: T[];
    message?: string;
    error?: string;
  } | null;

  if (!response.ok || payload?.success === false) {
    throw new Error(payload?.message || payload?.error || "Request failed");
  }

  if (!payload) {
    throw new Error("Empty server response");
  }

  return (payload.product ?? payload.products ?? (payload as T)) as T;
};

const requestWithProgress = <T,>(options: {
  url: string;
  method: string;
  body: FormData;
  onProgress?: (percent: number) => void;
}): Promise<T> =>
  new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();

    request.open(options.method, options.url, true);
    request.withCredentials = true;

    request.upload.onprogress = (event) => {
      if (!event.lengthComputable || !options.onProgress) {
        return;
      }

      options.onProgress(Math.round((event.loaded / event.total) * 100));
    };

    request.onload = () => {
      try {
        const response = JSON.parse(request.responseText) as T;
        if (request.status >= 200 && request.status < 300) {
          resolve(response);
          return;
        }

        const errorPayload = response as { message?: string; error?: string };
        reject(new Error(errorPayload?.message || errorPayload?.error || "Upload failed"));
      } catch (error) {
        reject(
          new Error(
            request.responseText ||
              (error instanceof Error ? error.message : "Upload failed"),
          ),
        );
      }
    };

    request.onerror = () => reject(new Error("Network error while uploading media"));
    request.send(options.body);
  });

export type ProductUploadPayload = Omit<Product, "_id"> & {
  media?: Product["media"];
};

const serializeProduct = (product: Partial<ProductUploadPayload>) => {
  const formData = new FormData();

  appendIfDefined(formData, "title", product.title);
  appendIfDefined(formData, "slug", product.slug);
  appendIfDefined(formData, "description", product.description);
  appendIfDefined(formData, "descriptionSections", product.descriptionSections);
  appendIfDefined(formData, "declaration", product.declaration);
  appendIfDefined(formData, "shippingReturns", product.shippingReturns);
  appendIfDefined(formData, "faqs", product.faqs);
  appendIfDefined(formData, "shortDescription", product.shortDescription);
  appendIfDefined(formData, "price", product.price);
  appendIfDefined(formData, "discountPrice", product.discountPrice);
  appendIfDefined(formData, "category", product.category);
  appendIfDefined(formData, "subCategory", product.subCategory);
  appendIfDefined(formData, "fabric", product.fabric);
  appendIfDefined(formData, "occasion", product.occasion);
  appendIfDefined(formData, "color", product.color);
  appendIfDefined(formData, "stock", product.stock);
  appendIfDefined(formData, "featured", product.featured);
  appendIfDefined(formData, "isActive", product.isActive);
  appendIfDefined(formData, "displayOrder", product.displayOrder);
  appendIfDefined(formData, "createdBy", product.createdBy);
  appendIfDefined(formData, "sizes", product.sizes);
  appendIfDefined(formData, "colors", product.colors);
  appendIfDefined(formData, "tags", product.tags);
  appendIfDefined(formData, "ratings", product.ratings);
  appendIfDefined(formData, "reviews", product.reviews);
  appendIfDefined(formData, "thumbnailPublicId", product.thumbnail?.publicId);
  appendIfDefined(formData, "thumbnail", product.thumbnail);
  appendIfDefined(formData, "mainImage", product.mainImage);
  appendIfDefined(formData, "media", product.media);
  appendIfDefined(formData, "variants", product.variants);
  appendIfDefined(formData, "galleryImages", product.galleryImages);
  appendIfDefined(formData, "videos", product.videos);
  appendIfDefined(formData, "images", product.images);
  appendIfDefined(formData, "video", product.video);

  return formData;
};

export const loadProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_URL}/products`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Failed to load products");
  }

  const payload = (await response.json()) as { products?: Product[] };
  return payload.products ?? [];
};

export const createProduct = async (product: Partial<ProductUploadPayload>) => {
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    body: serializeProduct(product),
    credentials: "include",
  });

  return parseJsonResponse<Product>(response);
};

export const updateProduct = async (id: string, product: Partial<ProductUploadPayload>) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    body: serializeProduct(product),
    credentials: "include",
  });

  return parseJsonResponse<Product>(response);
};

export const deleteProduct = async (id: string) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.message || payload?.error || "Failed to delete product");
  }
};

export const deleteProductMedia = async (
  id: string,
  payload: { publicIds: string[]; mediaType?: "image" | "video" | "all" },
) => {
  const response = await fetch(`${API_URL}/products/${id}/media`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to delete product media");
  }
};

export const uploadImage = async (
  file: File,
  onProgress?: (percent: number) => void,
  folder: "front" | "back" | "gallery" | "images" = "front",
) => {
  const formData = new FormData();
  console.info("[Alaira upload] file selected", {
    name: file.name,
    type: file.type,
    size: file.size,
    folder,
  });
  formData.append("folder", folder);
  formData.append("image", file);
  console.info("[Alaira upload] image upload started", { folder });

  const payload = await requestWithProgress<{
    file?: MediaAsset;
    success?: boolean;
    message?: string;
  }>({
    url: `${UPLOAD_API_BASE}/api/upload/image?folder=${encodeURIComponent(folder)}`,
    method: "POST",
    body: formData,
    onProgress,
  });

  if (payload.success === false || !payload.file) {
    throw new Error(payload.message || "Image upload failed");
  }

  console.info("[Alaira upload] image upload success", payload.file);
  return payload.file;
};

export const uploadImages = async (
  files: File[],
  onProgress?: (percent: number) => void,
  folder: "gallery" | "images" = "gallery",
) => {
  const formData = new FormData();
  formData.append("folder", folder);
  console.info("[Alaira upload] gallery upload started", {
    count: files.length,
    files: files.map((file) => ({ name: file.name, type: file.type, size: file.size })),
    folder,
  });
  files.forEach((file) => formData.append("images", file));

  const payload = await requestWithProgress<{
    files?: MediaAsset[];
    success?: boolean;
    message?: string;
  }>({
    url: `${UPLOAD_API_BASE}/api/upload/images?folder=${encodeURIComponent(folder)}`,
    method: "POST",
    body: formData,
    onProgress,
  });

  if (payload.success === false || !payload.files) {
    throw new Error(payload.message || "Images upload failed");
  }

  console.info("[Alaira upload] gallery upload success", payload.files);
  return payload.files;
};

export const uploadVideo = async (
  file: File,
  onProgress?: (percent: number) => void,
) => {
  const formData = new FormData();
  formData.append("folder", "videos");
  formData.append("video", file);
  console.info("[Alaira upload] video upload started", {
    name: file.name,
    type: file.type,
    size: file.size,
  });

  const payload = await requestWithProgress<{
    file?: MediaAsset;
    success?: boolean;
    message?: string;
  }>({
    url: `${UPLOAD_API_BASE}/api/upload/video`,
    method: "POST",
    body: formData,
    onProgress,
  });

  if (payload.success === false || !payload.file) {
    throw new Error(payload.message || "Video upload failed");
  }

  console.info("[Alaira upload] video upload success", payload.file);
  return payload.file;
};
