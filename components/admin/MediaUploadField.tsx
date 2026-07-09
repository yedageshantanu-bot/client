"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronUp, FileImage, Loader2, Plus, Trash2, Video } from "lucide-react";
import type { MediaAsset } from "@/lib/types";
import { cn } from "@/lib/utils";
import { localAssetList } from "@/lib/localAssets";

type MediaUploadFieldProps = {
  title: string;
  helperText?: string;
  accept: string;
  multiple?: boolean;
  value: MediaAsset | MediaAsset[] | null;
  onChange: (value: MediaAsset | MediaAsset[] | null) => void;
  uploadFiles: (
    files: File[],
    onProgress?: (progress: number) => void,
  ) => Promise<MediaAsset | MediaAsset[]>;
  allowReorder?: boolean;
  emptyStateLabel?: string;
  allowLocalAssets?: boolean;
};

const isMediaArray = (value: MediaAsset | MediaAsset[] | null): value is MediaAsset[] =>
  Array.isArray(value);

const isVideoAsset = (asset: MediaAsset) =>
  asset.resourceType === "video" || /\.(mp4|mov|webm)$/i.test(asset.url);

const IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

const validateFile = (file: File, accept: string) => {
  const acceptedTypes = accept.split(",").map((item) => item.trim()).filter(Boolean);
  const isVideo = file.type.startsWith("video/");
  const allowedTypes = isVideo ? VIDEO_TYPES : IMAGE_TYPES;
  const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

  if (!acceptedTypes.includes(file.type) || !allowedTypes.includes(file.type)) {
    throw new Error(
      `${file.name} is not supported. Use JPG, JPEG, PNG, WEBP, MP4, or MOV.`,
    );
  }

  if (file.size > maxSize) {
    throw new Error(
      `${file.name} is too large. Max ${isVideo ? "50MB" : "10MB"} allowed.`,
    );
  }
};

export function MediaUploadField({
  title,
  helperText,
  accept,
  multiple = false,
  value,
  onChange,
  uploadFiles,
  allowReorder = false,
  emptyStateLabel = "Drop files here or click to browse",
  allowLocalAssets = true,
}: MediaUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const assets = useMemo(() => (isMediaArray(value) ? value : value ? [value] : []), [value]);
  const canChooseLocalAssets = allowLocalAssets && accept.includes("image/");

  const upload = async (files: File[]) => {
    if (!files.length) {
      return;
    }

    setError(null);
    console.info("[Alaira upload] files selected", files.map((file) => ({
      name: file.name,
      type: file.type,
      size: file.size,
      field: title,
    })));

    try {
      files.forEach((file) => validateFile(file, accept));
    } catch (validationError) {
      const message = validationError instanceof Error ? validationError.message : "Invalid file";
      console.error("[Alaira upload] validation failed", message);
      setError(message);
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      console.info("[Alaira upload] upload started", { field: title, count: files.length });
      const uploaded = await uploadFiles(files, setProgress);
      const nextAssets = Array.isArray(uploaded) ? uploaded : [uploaded];

      onChange(multiple ? [...assets, ...nextAssets] : nextAssets[0] ?? null);
      console.info("[Alaira upload] upload success", { field: title, uploaded: nextAssets });
    } catch (uploadError) {
      const message = uploadError instanceof Error ? uploadError.message : "Upload failed";
      console.error("[Alaira upload] upload failed", { field: title, message });
      setError(message);
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const onBrowse = async (files: FileList | null) => {
    if (!files?.length) {
      return;
    }

    await upload(Array.from(files));
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const moveAsset = (index: number, direction: -1 | 1) => {
    if (!multiple || !allowReorder) {
      return;
    }

    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= assets.length) {
      return;
    }

    const nextAssets = [...assets];
    [nextAssets[index], nextAssets[nextIndex]] = [nextAssets[nextIndex], nextAssets[index]];
    onChange(nextAssets);
  };

  const removeAsset = (index: number) => {
    if (multiple) {
      onChange(assets.filter((_, currentIndex) => currentIndex !== index));
      return;
    }

    onChange(null);
  };

  const chooseLocalAsset = (asset: MediaAsset) => {
    const nextAsset = {
      ...asset,
      order: multiple ? assets.length : 0,
      altText: asset.altText || title,
    };

    onChange(multiple ? [...assets, nextAsset] : nextAsset);
  };

  return (
    <section className="rounded-[16px] border border-[#e2e8f0] bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#64748b]">
            {title}
          </h3>
          {helperText && <p className="mt-1 text-sm text-[#64748b]">{helperText}</p>}
        </div>
        {multiple && (
          <span className="rounded-full bg-[#f8fafc] px-3 py-1 text-xs font-semibold text-[#0f172a]">
            {assets.length} selected
          </span>
        )}
      </div>

      <label
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={async (event) => {
          event.preventDefault();
          setIsDragging(false);
          await upload(Array.from(event.dataTransfer.files));
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-[16px] border-2 border-dashed p-6 text-center transition",
          isDragging ? "border-[#0f172a] bg-[#f8fafc]" : "border-[#e2e8f0] bg-[#f8fafc]/60",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(event) => onBrowse(event.target.files)}
        />
        <div className="grid h-12 w-12 place-items-center rounded-full bg-white text-[#64748b] shadow-sm">
          <Plus size={20} />
        </div>
        <p className="mt-4 text-sm font-semibold text-[#0f172a]">{emptyStateLabel}</p>
        <p className="mt-1 text-xs text-[#64748b]">
          {multiple ? "Drag, drop, or select multiple files" : "Drag, drop, or select one file"}
        </p>
        {isUploading && (
          <div className="mt-4 flex items-center gap-2 text-sm text-[#64748b]">
            <Loader2 className="animate-spin" size={16} />
            Uploading {progress > 0 ? `${progress}%` : "..."}
          </div>
        )}
      </label>

      {error && (
        <p className="mt-3 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-3 py-2 text-sm text-[#0f172a]">{error}</p>
      )}

      {canChooseLocalAssets && (
        <div className="mt-5 rounded-[14px] border border-[#e2e8f0] bg-[#f8fafc]/35 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#64748b]">
                Choose from Local Assets
              </h4>
              <p className="mt-1 text-xs text-[#64748b]">
                Select an existing Alaira image without uploading again.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {localAssetList.map((asset) => (
              <button
                key={asset.publicId || asset.url}
                type="button"
                onClick={() => chooseLocalAsset(asset)}
                className="group overflow-hidden rounded-[10px] border border-[#e2e8f0] bg-white text-left transition hover:border-[#0f172a]"
              >
                <div className="relative aspect-[4/3] bg-[#f8fafc]">
                  <Image
                    src={asset.url}
                    alt={asset.altText || asset.label}
                    fill
                    sizes="(max-width: 640px) 50vw, 180px"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="px-3 py-2">
                  <p className="truncate text-xs font-semibold text-[#0f172a]">{asset.label}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {assets.length > 0 && (
        <div className={cn("mt-5", multiple ? "grid gap-3 sm:grid-cols-2 xl:grid-cols-3" : "") }>
          {assets.map((asset, index) => {
            const video = isVideoAsset(asset);

            return (
              <article
                key={`${asset.publicId || asset.url}-${index}`}
                className="overflow-hidden rounded-[16px] border border-[#e2e8f0] bg-white shadow-sm"
              >
                <div className="relative aspect-[4/3] bg-[#f8fafc]">
                  {video ? (
                    <video
                      src={asset.url}
                      controls
                      muted
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Image
                      src={asset.url}
                      alt={asset.altText || title}
                      fill
                      sizes="(max-width: 640px) 100vw, 260px"
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 px-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#0f172a]">{asset.altText || title}</p>
                    <p className="mt-0.5 text-xs text-[#64748b]">
                      {video ? "Video" : "Image"}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    {multiple && allowReorder && (
                      <>
                        <button
                          type="button"
                          onClick={() => moveAsset(index, -1)}
                          className="grid h-8 w-8 place-items-center rounded-full border border-[#e2e8f0] text-[#0f172a] hover:border-[#0f172a]"
                          aria-label="Move up"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveAsset(index, 1)}
                          className="grid h-8 w-8 place-items-center rounded-full border border-[#e2e8f0] text-[#0f172a] hover:border-[#0f172a]"
                          aria-label="Move down"
                        >
                          <ChevronDown size={14} />
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => removeAsset(index)}
                      className="grid h-8 w-8 place-items-center rounded-full border border-[#e2e8f0] bg-white text-[#0f172a] hover:border-[#0f172a] hover:bg-[#f8fafc]"
                      aria-label="Remove media"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {!assets.length && (
        <div className="mt-4 flex items-center gap-2 text-sm text-[#64748b]">
          {multiple ? <FileImage size={16} /> : <Video size={16} />}
          <span>No media selected yet.</span>
        </div>
      )}

      {multiple && allowReorder && assets.length > 1 && (
        <p className="mt-3 text-xs text-[#64748b]">
          Tip: use the arrow buttons to control gallery order.
        </p>
      )}
    </section>
  );
}




