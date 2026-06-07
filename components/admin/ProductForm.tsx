"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ChevronDown,
  Layers3,
  Palette,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { MediaAsset, Product, ProductVariant } from "@/lib/types";
import {
  getProductFrontImage,
  getProductHoverImage,
  getProductImages,
  getProductSizeChart,
  getProductThumbnail,
  getProductVideos,
  toMediaAsset,
} from "@/lib/productMedia";
import { uploadImage, uploadImages, uploadVideo } from "@/lib/productApi";
import { MediaUploadField } from "./MediaUploadField";

type ProductFormPayload = Partial<Product> & {
  images?: MediaAsset[];
  videos?: MediaAsset[];
  media?: Product["media"];
  thumbnail?: MediaAsset | null;
  galleryImages?: MediaAsset[];
  variants?: ProductVariant[];
};

type ProductFormState = {
  title: string;
  slug: string;
  description: string;
  descriptionSections: string;
  declaration: string;
  shippingReturns: string;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  shortDescription: string;
  price: string;
  discountPrice: string;
  category: string;
  subCategory: string;
  fabric: string;
  occasion: string;
  color: string;
  stock: string;
  sizesText: string;
  colorsText: string;
  tagsText: string;
  displayOrder: string;
  createdBy: string;
  featured: boolean;
  isActive: boolean;
  frontImage: MediaAsset | null;
  backImage: MediaAsset | null;
  sideImage: MediaAsset | null;
  hoverImage: MediaAsset | null;
  thumbnail: MediaAsset | null;
  sizeChart: MediaAsset | null;
  galleryImages: MediaAsset[];
  videos: MediaAsset[];
  variants: ProductVariant[];
};

const defaultState: ProductFormState = {
  title: "",
  slug: "",
  description: "",
  descriptionSections: "",
  declaration: "",
  shippingReturns: "",
  faqs: [],
  shortDescription: "",
  price: "",
  discountPrice: "",
  category: "Wedding Sarees",
  subCategory: "",
  fabric: "Pure Silk",
  occasion: "Wedding",
  color: "Red",
  stock: "0",
  sizesText: "",
  colorsText: "",
  tagsText: "",
  displayOrder: "0",
  createdBy: "",
  featured: false,
  isActive: true,
  frontImage: null,
  backImage: null,
  sideImage: null,
  hoverImage: null,
  thumbnail: null,
  sizeChart: null,
  galleryImages: [],
  videos: [],
  variants: [],
};

const categoryOptions = [
  "Wedding Sarees",
  "Silk Sarees",
  "Party Wear",
  "Cotton Sarees",
  "Daily Wear",
];

const fabricOptions = [
  "Pure Silk",
  "Georgette",
  "Cotton",
  "Chiffon",
  "Linen",
  "Net",
  "Tussar Silk",
  "Organza",
];

const occasionOptions = [
  "Wedding",
  "Party",
  "Casual",
  "Festival",
  "Office",
  "Ethnic",
  "Reception",
];

const colorOptions = [
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Purple",
  "White",
  "Maroon",
  "Orange",
  "Pink",
  "Ivory",
];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const toTextArray = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const mediaToArray = (...items: Array<MediaAsset | null | undefined>) =>
  items.filter(Boolean).map((item, index) => toMediaAsset(item as MediaAsset, index));

const getMediaSeed = (product?: Product | null): ProductFormState => {
  if (!product) {
    return defaultState;
  }

  const frontImage = product.media?.frontImage ?? getProductFrontImage(product);
  const backImage = product.media?.backImage ?? null;
  const sideImage = product.media?.sideImage ?? null;
  const hoverImage = product.media?.hoverImage ?? getProductHoverImage(product);
  const thumbnail = product.media?.thumbnail ?? getProductThumbnail(product);
  const sizeChart = getProductSizeChart(product);
  const galleryImages = product.media?.galleryImages ?? getProductImages(product).slice(1);
  const videos = product.media?.videos ?? getProductVideos(product);

  return {
    title: product.title ?? "",
    slug: product.slug ?? "",
    description: product.description ?? "",
    descriptionSections: product.descriptionSections ?? product.description ?? "",
    declaration: product.declaration ?? "",
    shippingReturns: product.shippingReturns ?? "",
    faqs: product.faqs?.length ? product.faqs : [],
    shortDescription: product.shortDescription ?? "",
    price: String(product.price ?? ""),
    discountPrice: String(product.discountPrice ?? ""),
    category: product.category ?? "Wedding Sarees",
    subCategory: product.subCategory ?? "",
    fabric: product.fabric ?? "Pure Silk",
    occasion: product.occasion ?? "Wedding",
    color: product.color ?? "Red",
    stock: String(product.stock ?? 0),
    sizesText: (product.sizes ?? []).join(", "),
    colorsText: (product.colors ?? []).join(", "),
    tagsText: (product.tags ?? []).join(", "),
    displayOrder: String(product.displayOrder ?? 0),
    createdBy: product.createdBy ?? "",
    featured: product.featured ?? false,
    isActive: product.isActive ?? true,
    frontImage,
    backImage,
    sideImage,
    hoverImage,
    thumbnail,
    sizeChart,
    galleryImages,
    videos,
    variants: product.variants?.length ? product.variants : [],
  };
};

const singleImageUploader =
  (folder: "front" | "back" | "gallery" | "images" = "front") =>
  async (files: File[], onProgress?: (progress: number) => void) => {
  if (!files[0]) {
    throw new Error("Please choose an image file");
  }

  return uploadImage(files[0], onProgress, folder);
  };

const galleryUploader = async (files: File[], onProgress?: (progress: number) => void) =>
  uploadImages(files, onProgress, "gallery");

const videoUploader = async (files: File[], onProgress?: (progress: number) => void) => {
  const uploaded: MediaAsset[] = [];

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    if (!file) {
      continue;
    }

    const asset = await uploadVideo(file, (progress) => {
      const completed = (index / files.length) * 100;
      const current = progress / files.length;
      onProgress?.(Math.round(completed + current));
    });
    uploaded.push(asset);
  }

  return uploaded;
};

export function ProductForm({
  product,
  onSubmit,
  onCancel,
}: {
  product?: Product | null;
  onSubmit: (product: ProductFormPayload) => void | Promise<void>;
  onCancel?: () => void;
}) {
  const initial = useMemo(() => getMediaSeed(product), [product]);
  const [form, setForm] = useState<ProductFormState>(initial);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setForm(getMediaSeed(product)));
  }, [product]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    const images = mediaToArray(
      form.frontImage,
      form.backImage,
      form.sideImage,
      form.hoverImage,
      form.sizeChart,
      ...form.galleryImages,
    );

    const videos = mediaToArray(...form.videos);
    const thumbnail = form.thumbnail ?? form.frontImage ?? images[0] ?? null;

    const payload: ProductFormPayload = {
      title: form.title.trim(),
      slug: form.slug.trim() || slugify(form.title),
      description: form.description.trim(),
      descriptionSections: form.descriptionSections.trim() || form.description.trim(),
      declaration: form.declaration.trim(),
      shippingReturns: form.shippingReturns.trim(),
      faqs: form.faqs
        .map((faq) => ({
          question: faq.question.trim(),
          answer: faq.answer.trim(),
        }))
        .filter((faq) => faq.question || faq.answer),
      shortDescription: form.shortDescription.trim(),
      price: Number(form.price),
      discountPrice: Number(form.discountPrice),
      category: form.category,
      subCategory: form.subCategory.trim(),
      fabric: form.fabric,
      occasion: form.occasion,
      color: form.color,
      stock: Number(form.stock),
      sizes: toTextArray(form.sizesText),
      colors: toTextArray(form.colorsText),
      tags: toTextArray(form.tagsText),
      displayOrder: Number(form.displayOrder),
      createdBy: form.createdBy.trim() || undefined,
      featured: form.featured,
      isActive: form.isActive,
      images,
      videos,
      media: {
        frontImage: form.frontImage,
        backImage: form.backImage,
        sideImage: form.sideImage,
        hoverImage: form.hoverImage,
        thumbnail,
        sizeChart: form.sizeChart,
        galleryImages: form.galleryImages,
        videos: form.videos,
      },
      thumbnail,
      variants: form.variants.map((variant, index) => ({
        ...variant,
        colorName: variant.colorName.trim(),
        colorCode: variant.colorCode || "#C4A55A",
        price: Number(variant.price || 0),
        stock: Number(variant.stock || 0),
        sku: variant.sku?.trim() || `${slugify(variant.colorName || form.title).toUpperCase()}-${index + 1}`,
        galleryImages: variant.galleryImages || [],
        video: variant.video || null,
      })).filter((variant) => variant.colorName),
    };

    try {
      await onSubmit(payload);
      if (!product) {
        setForm(defaultState);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const updateFaq = (
    index: number,
    key: "question" | "answer",
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      faqs: current.faqs.map((faq, currentIndex) =>
        currentIndex === index ? { ...faq, [key]: value } : faq,
      ),
    }));
  };

  const addFaq = () => {
    setForm((current) => ({
      ...current,
      faqs: [...current.faqs, { question: "", answer: "" }],
    }));
  };

  const removeFaq = (index: number) => {
    setForm((current) => ({
      ...current,
      faqs: current.faqs.filter((_, currentIndex) => currentIndex !== index),
    }));
  };

  const addVariant = () => {
    setForm((current) => ({
      ...current,
      variants: [
        ...current.variants,
        {
          colorName: "",
          colorCode: "#C4A55A",
          price: Number(current.discountPrice || current.price || 0),
          stock: 0,
          frontImage: null,
          backImage: null,
          galleryImages: [],
          video: null,
          sku: "",
        },
      ],
    }));
  };

  const updateVariant = <K extends keyof ProductVariant>(
    index: number,
    key: K,
    value: ProductVariant[K],
  ) => {
    setForm((current) => ({
      ...current,
      variants: current.variants.map((variant, currentIndex) =>
        currentIndex === index ? { ...variant, [key]: value } : variant,
      ),
    }));
  };

  const removeVariant = (index: number) => {
    setForm((current) => ({
      ...current,
      variants: current.variants.filter((_, currentIndex) => currentIndex !== index),
    }));
  };

  const moveFaq = (index: number, direction: -1 | 1) => {
    setForm((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.faqs.length) {
        return current;
      }

      const faqs = [...current.faqs];
      [faqs[index], faqs[nextIndex]] = [faqs[nextIndex], faqs[index]];
      return { ...current, faqs };
    });
  };

  return (
    <form
      onSubmit={submit}
      className="space-y-6 rounded-[24px] border border-[#e2e8f0] bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
    >
      <div className="flex flex-col gap-4 rounded-[20px] bg-[linear-gradient(135deg,#1e1b16_0%,#2a2217_55%,#3f3321_100%)] p-6 text-white md:flex-row md:items-end md:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-gold-soft">
            <Sparkles size={14} />
            Product CMS
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold">
            {product ? "Edit product" : "Add product"}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80">
            Upload media directly from your computer, preview it instantly, and
            publish a fully ordered ecommerce product record.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-white/85">
          <span className="rounded-full border border-white/15 px-3 py-2">Cloudinary</span>
          <span className="rounded-full border border-white/15 px-3 py-2">Drag & drop</span>
          <span className="rounded-full border border-white/15 px-3 py-2">Gallery reorder</span>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <section className="rounded-[20px] border border-[#e2e8f0] bg-white p-5">
            <div className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#64748b]">
              <Layers3 size={16} />
              Product details
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748b]">
                  Product title
                </span>
                <input
                  required
                  value={form.title}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      title: event.target.value,
                      slug: current.slug || slugify(event.target.value),
                    }))
                  }
                  className="mt-2 h-12 w-full rounded-[12px] border border-[#e2e8f0] px-4 text-sm outline-none transition focus:border-[#0f172a]"
                />
              </label>

              <label className="md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748b]">
                  Slug
                </span>
                <input
                  value={form.slug}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, slug: event.target.value }))
                  }
                  placeholder="auto-generated if empty"
                  className="mt-2 h-12 w-full rounded-[12px] border border-[#e2e8f0] px-4 text-sm outline-none transition focus:border-[#0f172a]"
                />
              </label>

              <label className="md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748b]">
                  Short description
                </span>
                <input
                  value={form.shortDescription}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      shortDescription: event.target.value,
                    }))
                  }
                  className="mt-2 h-12 w-full rounded-[12px] border border-[#e2e8f0] px-4 text-sm outline-none transition focus:border-[#0f172a]"
                />
              </label>

              <label className="md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748b]">
                  Product Description
                </span>
                <textarea
                  required
                  rows={5}
                  value={form.descriptionSections}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      description: event.target.value,
                      descriptionSections: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-[12px] border border-[#e2e8f0] p-4 text-sm outline-none transition focus:border-[#0f172a]"
                />
              </label>

              {[
                ["price", "MRP"],
                ["discountPrice", "Selling price"],
                ["stock", "Stock"],
                ["displayOrder", "Display order"],
              ].map(([key, label]) => (
                <label key={key}>
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748b]">
                    {label}
                  </span>
                  <input
                    required
                    type="number"
                    min="0"
                    value={form[key as keyof ProductFormState] as string}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        [key]: event.target.value,
                      }))
                    }
                    className="mt-2 h-12 w-full rounded-[12px] border border-[#e2e8f0] px-4 text-sm outline-none transition focus:border-[#0f172a]"
                  />
                </label>
              ))}

              {[
                ["category", categoryOptions],
                ["fabric", fabricOptions],
                ["occasion", occasionOptions],
                ["color", colorOptions],
              ].map(([key, options]) => (
                <label key={key as string}>
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748b]">
                    {key}
                  </span>
                  <select
                    value={form[key as keyof ProductFormState] as string}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, [key as string]: event.target.value }))
                    }
                    className="mt-2 h-12 w-full rounded-[12px] border border-[#e2e8f0] px-4 text-sm outline-none transition focus:border-[#0f172a]"
                  >
                    {(options as string[]).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              ))}

              <label className="md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748b]">
                  Sub category
                </span>
                <input
                  value={form.subCategory}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      subCategory: event.target.value,
                    }))
                  }
                  className="mt-2 h-12 w-full rounded-[12px] border border-[#e2e8f0] px-4 text-sm outline-none transition focus:border-[#0f172a]"
                />
              </label>

              <label className="md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748b]">
                  Tags
                </span>
                <input
                  value={form.tagsText}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, tagsText: event.target.value }))
                  }
                  placeholder="festive, premium, handloom"
                  className="mt-2 h-12 w-full rounded-[12px] border border-[#e2e8f0] px-4 text-sm outline-none transition focus:border-[#0f172a]"
                />
              </label>

              <label>
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748b]">
                  Sizes
                </span>
                <input
                  value={form.sizesText}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, sizesText: event.target.value }))
                  }
                  placeholder="S, M, L"
                  className="mt-2 h-12 w-full rounded-[12px] border border-[#e2e8f0] px-4 text-sm outline-none transition focus:border-[#0f172a]"
                />
              </label>

              <label>
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748b]">
                  Colors
                </span>
                <input
                  value={form.colorsText}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, colorsText: event.target.value }))
                  }
                  placeholder="Red, Gold"
                  className="mt-2 h-12 w-full rounded-[12px] border border-[#e2e8f0] px-4 text-sm outline-none transition focus:border-[#0f172a]"
                />
              </label>

              <label className="md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748b]">
                  Created by
                </span>
                <input
                  value={form.createdBy}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, createdBy: event.target.value }))
                  }
                  placeholder="Admin user id"
                  className="mt-2 h-12 w-full rounded-[12px] border border-[#e2e8f0] px-4 text-sm outline-none transition focus:border-[#0f172a]"
                />
              </label>
            </div>
          </section>

          <section className="rounded-[20px] border border-[#e2e8f0] bg-white p-5">
            <div className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#64748b]">
              <ChevronDown size={16} />
              Accordion content
            </div>

            <div className="grid gap-4">
              <label>
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748b]">
                  Product Declaration
                </span>
                <textarea
                  rows={4}
                  value={form.declaration}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      declaration: event.target.value,
                    }))
                  }
                  placeholder="Material, origin, care, artisan or compliance details."
                  className="mt-2 w-full rounded-[12px] border border-[#e2e8f0] p-4 text-sm outline-none transition focus:border-[#0f172a]"
                />
              </label>

              <label>
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748b]">
                  Shipping & Returns
                </span>
                <textarea
                  rows={4}
                  value={form.shippingReturns}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      shippingReturns: event.target.value,
                    }))
                  }
                  placeholder="Dispatch timelines, delivery, exchange, return, and care conditions."
                  className="mt-2 w-full rounded-[12px] border border-[#e2e8f0] p-4 text-sm outline-none transition focus:border-[#0f172a]"
                />
              </label>
            </div>
          </section>

          <section className="rounded-[20px] border border-[#e2e8f0] bg-white p-5">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#64748b]">
                  <Palette size={16} />
                  Color Variants
                </div>
                <p className="mt-1 text-sm text-[#64748b]">
                  Give each color its own price, stock, front/back images, gallery, and video.
                </p>
              </div>
              <Button type="button" variant="outline" onClick={addVariant}>
                <Plus size={16} />
                Add Color Variant
              </Button>
            </div>

            <div className="space-y-5">
              {form.variants.map((variant, index) => (
                <article
                  key={`${variant.sku || variant.colorName || "variant"}-${index}`}
                  className="rounded-[16px] border border-[#e2e8f0] bg-[#f8fafc]/35 p-4"
                >
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="h-9 w-9 rounded-full border border-white shadow-sm ring-1 ring-brand-border"
                        style={{ backgroundColor: variant.colorCode || "#C4A55A" }}
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-sm font-semibold text-[#0f172a]">
                          {variant.colorName || `Color variant ${index + 1}`}
                        </p>
                        <p className="text-xs text-[#64748b]">
                          {variant.sku || "SKU generated on save"}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="grid h-9 w-9 place-items-center rounded-full border border-[#e2e8f0] bg-white text-[#0f172a] transition hover:border-[#0f172a] hover:bg-[#f8fafc]"
                      aria-label="Remove color variant"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-4">
                    <label>
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748b]">
                        Color name
                      </span>
                      <input
                        value={variant.colorName}
                        onChange={(event) => updateVariant(index, "colorName", event.target.value)}
                        placeholder="Red"
                        className="mt-2 h-11 w-full rounded-[12px] border border-[#e2e8f0] bg-white px-4 text-sm outline-none transition focus:border-[#0f172a]"
                      />
                    </label>
                    <label>
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748b]">
                        Color hex
                      </span>
                      <div className="mt-2 flex h-11 overflow-hidden rounded-[12px] border border-[#e2e8f0] bg-white">
                        <input
                          type="color"
                          value={variant.colorCode || "#C4A55A"}
                          onChange={(event) => updateVariant(index, "colorCode", event.target.value)}
                          className="h-11 w-12 cursor-pointer border-0 bg-transparent"
                          aria-label="Variant color code"
                        />
                        <input
                          value={variant.colorCode}
                          onChange={(event) => updateVariant(index, "colorCode", event.target.value)}
                          className="min-w-0 flex-1 px-3 text-sm outline-none"
                        />
                      </div>
                    </label>
                    <label>
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748b]">
                        Variant price
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={variant.price}
                        onChange={(event) => updateVariant(index, "price", Number(event.target.value))}
                        className="mt-2 h-11 w-full rounded-[12px] border border-[#e2e8f0] bg-white px-4 text-sm outline-none transition focus:border-[#0f172a]"
                      />
                    </label>
                    <label>
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748b]">
                        Stock
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={variant.stock}
                        onChange={(event) => updateVariant(index, "stock", Number(event.target.value))}
                        className="mt-2 h-11 w-full rounded-[12px] border border-[#e2e8f0] bg-white px-4 text-sm outline-none transition focus:border-[#0f172a]"
                      />
                    </label>
                    <label className="md:col-span-4">
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748b]">
                        SKU
                      </span>
                      <input
                        value={variant.sku || ""}
                        onChange={(event) => updateVariant(index, "sku", event.target.value)}
                        placeholder="Optional; generated if empty"
                        className="mt-2 h-11 w-full rounded-[12px] border border-[#e2e8f0] bg-white px-4 text-sm outline-none transition focus:border-[#0f172a]"
                      />
                    </label>
                  </div>

                  <div className="mt-4 grid gap-4 xl:grid-cols-2">
                    <MediaUploadField
                      title="Variant Front Image"
                      helperText="Primary image for this selected color."
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      value={variant.frontImage || null}
                      onChange={(value) => updateVariant(index, "frontImage", value as MediaAsset | null)}
                      uploadFiles={singleImageUploader("front")}
                    />
                    <MediaUploadField
                      title="Variant Back Image"
                      helperText="Back angle for this selected color."
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      value={variant.backImage || null}
                      onChange={(value) => updateVariant(index, "backImage", value as MediaAsset | null)}
                      uploadFiles={singleImageUploader("back")}
                    />
                    <div className="xl:col-span-2">
                      <MediaUploadField
                        title="Variant Gallery"
                        helperText="Drag, drop, delete, and reorder images for this color."
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        multiple
                        allowReorder
                        value={variant.galleryImages || []}
                        onChange={(value) =>
                          updateVariant(
                            index,
                            "galleryImages",
                            Array.isArray(value) ? value : value ? [value] : [],
                          )
                        }
                        uploadFiles={galleryUploader}
                        emptyStateLabel="Drop color gallery images here"
                      />
                    </div>
                    <div className="xl:col-span-2">
                      <MediaUploadField
                        title="Variant Video"
                        helperText="Optional video specific to this color."
                        accept="video/mp4,video/quicktime,video/webm"
                        value={variant.video || null}
                        onChange={(value) => updateVariant(index, "video", value as MediaAsset | null)}
                        uploadFiles={async (files, onProgress) => {
                          const uploaded = await videoUploader(files, onProgress);
                          if (!uploaded[0]) {
                            throw new Error("Please choose a video file");
                          }
                          return uploaded[0];
                        }}
                        emptyStateLabel="Drop a color video here"
                      />
                    </div>
                  </div>
                </article>
              ))}

              {!form.variants.length && (
                <div className="rounded-[16px] border border-dashed border-[#e2e8f0] bg-[#f8fafc]/40 p-5 text-sm text-[#64748b]">
                  No variants yet. Add at least one color to unlock storefront color switching.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-[20px] border border-[#e2e8f0] bg-white p-5">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#64748b]">
                  <Layers3 size={16} />
                  FAQ Manager
                </div>
                <p className="mt-1 text-sm text-[#64748b]">
                  Add customer-facing product questions in the exact display order.
                </p>
              </div>
              <Button type="button" variant="outline" onClick={addFaq}>
                <Plus size={16} />
                Add FAQ
              </Button>
            </div>

            <div className="space-y-4">
              {form.faqs.map((faq, index) => (
                <article
                  key={index}
                  className="rounded-[16px] border border-[#e2e8f0] bg-[#f8fafc]/40 p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748b]">
                      FAQ {index + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveFaq(index, -1)}
                        disabled={index === 0}
                        className="grid h-8 w-8 place-items-center rounded-full border border-[#e2e8f0] bg-white text-[#0f172a] transition hover:border-[#0f172a] disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Move FAQ up"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveFaq(index, 1)}
                        disabled={index === form.faqs.length - 1}
                        className="grid h-8 w-8 place-items-center rounded-full border border-[#e2e8f0] bg-white text-[#0f172a] transition hover:border-[#0f172a] disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Move FAQ down"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFaq(index)}
                        className="grid h-8 w-8 place-items-center rounded-full border border-[#e2e8f0] bg-white text-[#0f172a] transition hover:border-[#0f172a] hover:bg-[#f8fafc]"
                        aria-label="Remove FAQ"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <input
                      value={faq.question}
                      onChange={(event) => updateFaq(index, "question", event.target.value)}
                      placeholder="Question"
                      className="h-11 w-full rounded-[12px] border border-[#e2e8f0] bg-white px-4 text-sm outline-none transition focus:border-[#0f172a]"
                    />
                    <textarea
                      rows={3}
                      value={faq.answer}
                      onChange={(event) => updateFaq(index, "answer", event.target.value)}
                      placeholder="Answer"
                      className="w-full rounded-[12px] border border-[#e2e8f0] bg-white p-4 text-sm outline-none transition focus:border-[#0f172a]"
                    />
                  </div>
                </article>
              ))}

              {!form.faqs.length && (
                <div className="rounded-[16px] border border-dashed border-[#e2e8f0] bg-[#f8fafc]/40 p-5 text-sm text-[#64748b]">
                  No FAQs added yet.
                </div>
              )}
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <label className="flex items-center justify-between rounded-[16px] border border-[#e2e8f0] bg-white px-4 py-4 text-sm">
              Featured product
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) =>
                  setForm((current) => ({ ...current, featured: event.target.checked }))
                }
                className="h-4 w-4 accent-gold"
              />
            </label>
            <label className="flex items-center justify-between rounded-[16px] border border-[#e2e8f0] bg-white px-4 py-4 text-sm">
              Product active
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) =>
                  setForm((current) => ({ ...current, isActive: event.target.checked }))
                }
                className="h-4 w-4 accent-gold"
              />
            </label>
          </section>
        </div>

        <div className="space-y-4">
          <MediaUploadField
            title="Front Main Image"
            helperText="The primary image shown on homepage, shop grid, and product detail hero."
            accept="image/jpeg,image/jpg,image/png,image/webp"
            value={form.frontImage}
            onChange={(value) =>
              setForm((current) => ({ ...current, frontImage: value as MediaAsset | null }))
            }
            uploadFiles={singleImageUploader("front")}
          />

          <MediaUploadField
            title="Back Image"
            helperText="Optional alternate angle for detail pages."
            accept="image/jpeg,image/jpg,image/png,image/webp"
            value={form.backImage}
            onChange={(value) =>
              setForm((current) => ({ ...current, backImage: value as MediaAsset | null }))
            }
            uploadFiles={singleImageUploader("back")}
          />

          <MediaUploadField
            title="Side Image"
            helperText="Optional side angle for premium product galleries."
            accept="image/jpeg,image/jpg,image/png,image/webp"
            value={form.sideImage}
            onChange={(value) =>
              setForm((current) => ({ ...current, sideImage: value as MediaAsset | null }))
            }
            uploadFiles={singleImageUploader("gallery")}
          />

          <MediaUploadField
            title="Hover Image"
            helperText="Used on product cards when shoppers hover the item."
            accept="image/jpeg,image/jpg,image/png,image/webp"
            value={form.hoverImage}
            onChange={(value) =>
              setForm((current) => ({ ...current, hoverImage: value as MediaAsset | null }))
            }
            uploadFiles={singleImageUploader("gallery")}
          />

          <MediaUploadField
            title="Thumbnail Image"
            helperText="Performance-friendly image used for fast listing previews."
            accept="image/jpeg,image/jpg,image/png,image/webp"
            value={form.thumbnail}
            onChange={(value) =>
              setForm((current) => ({ ...current, thumbnail: value as MediaAsset | null }))
            }
            uploadFiles={singleImageUploader("front")}
          />

          <MediaUploadField
            title="Size Chart Image"
            helperText="Show size guidance for customers before checkout."
            accept="image/jpeg,image/jpg,image/png,image/webp"
            value={form.sizeChart}
            onChange={(value) =>
              setForm((current) => ({ ...current, sizeChart: value as MediaAsset | null }))
            }
            uploadFiles={singleImageUploader("gallery")}
          />

          <MediaUploadField
            title="Gallery Images"
            helperText="Add as many gallery images as you need and reorder them with the arrows."
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            allowReorder
            value={form.galleryImages}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                galleryImages: Array.isArray(value) ? value : value ? [value] : [],
              }))
            }
            uploadFiles={galleryUploader}
            emptyStateLabel="Drop gallery images here"
          />

          <MediaUploadField
            title="Product Videos"
            helperText="Upload multiple product videos for demos, styling, or close-up showcases."
            accept="video/mp4,video/quicktime,video/webm"
            multiple
            allowReorder
            value={form.videos}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                videos: Array.isArray(value) ? value : value ? [value] : [],
              }))
            }
            uploadFiles={videoUploader}
            emptyStateLabel="Drop product videos here"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-[#e2e8f0] pt-5">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <>
              <CheckCircle2 size={17} />
              Saving...
            </>
          ) : product ? (
            "Save changes"
          ) : (
            "Create product"
          )}
        </Button>

        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}

        <div className="ml-auto flex items-center gap-2 text-xs text-[#64748b]">
          <ChevronDown size={14} />
          Uploads are sent directly to Cloudinary before the product is saved.
        </div>
      </div>
    </form>
  );
}




