"use client";

import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Edit3,
  Eye,
  Globe,
  Image as ImageIcon,
  LayoutGrid,
  Megaphone,
  Package,
  Plus,
  Search,
  Settings2,
  Sliders,
  Star,
  Trash2,
  Type,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

type SectionKind =
  | "hero"
  | "featured-collection"
  | "banner"
  | "testimonial"
  | "announcement"
  | "rich-text";

type CmsSection = {
  id: string;
  kind: SectionKind;
  title: string;
  subtitle?: string;
  body?: string;
  image?: string;
  cta?: { label: string; href: string };
  enabled: boolean;
  order: number;
  meta?: Record<string, string | number | boolean>;
};

const STORAGE_KEY = "vastraaura_cms_sections_v1";

const seed: CmsSection[] = [
  {
    id: "announcement-bar",
    kind: "announcement",
    title: "Free shipping on orders above ₹4,999",
    body: "Pan-India express delivery in 3–5 business days.",
    enabled: true,
    order: 0,
    meta: { dismissible: true },
  },
  {
    id: "hero-main",
    kind: "hero",
    title: "Alaira Half Saree House",
    subtitle:
      "Heritage weaves, hand-finished in pure silk and temple cotton. Limited drops every Friday.",
    image: "",
    cta: { label: "Shop the new drop", href: "/collections/new" },
    enabled: true,
    order: 1,
    meta: { eyebrow: "New collection", align: "center" },
  },
  {
    id: "hero-secondary",
    kind: "hero",
    title: "The Bridal Edit",
    subtitle: "Custom-stitched kanjeevarams for the wedding week.",
    image: "",
    cta: { label: "Explore bridal", href: "/collections/bridal" },
    enabled: true,
    order: 2,
    meta: { eyebrow: "Curated", align: "left" },
  },
  {
    id: "featured-new",
    kind: "featured-collection",
    title: "New Arrivals",
    subtitle: "Fresh from the loom — 24 pieces added this week.",
    enabled: true,
    order: 3,
    meta: { collection: "new", limit: 8 },
  },
  {
    id: "featured-bestseller",
    kind: "featured-collection",
    title: "Bestsellers",
    subtitle: "What our community is loving right now.",
    enabled: true,
    order: 4,
    meta: { collection: "bestsellers", limit: 6 },
  },
  {
    id: "banner-mid",
    kind: "banner",
    title: "The Heritage Story",
    subtitle: "From Kanchipuram to your wardrobe — a 40-year weaving legacy.",
    image: "",
    cta: { label: "Read the story", href: "/about" },
    enabled: true,
    order: 5,
  },
  {
    id: "testimonial-block",
    kind: "testimonial",
    title: "What our brides say",
    body: "“The kanjeevaram was exactly like the photo. The fall, the zari, the smell of silk — perfect.”",
    enabled: false,
    order: 6,
    meta: { author: "Ananya R.", role: "Hyderabad" },
  },
];

const sectionMeta: Record<
  SectionKind,
  { label: string; icon: LucideIcon; description: string }
> = {
  hero: {
    label: "Hero banner",
    icon: ImageIcon,
    description: "Full-width hero with image, copy, and CTA.",
  },
  "featured-collection": {
    label: "Featured collection",
    icon: Package,
    description: "Pulls a product collection onto the homepage.",
  },
  banner: {
    label: "Editorial banner",
    icon: Megaphone,
    description: "Wide image-led block with a single CTA.",
  },
  testimonial: {
    label: "Testimonial",
    icon: Star,
    description: "Customer quote with attribution.",
  },
  announcement: {
    label: "Announcement bar",
    icon: Megaphone,
    description: "Top-of-store marquee strip.",
  },
  "rich-text": {
    label: "Rich text",
    icon: Type,
    description: "Free-form marketing copy block.",
  },
};

export function CmsManager() {
  const [sections, setSections] = useState<CmsSection[]>([]);
  const [editing, setEditing] = useState<CmsSection | null>(null);
  const [filter, setFilter] = useState<"all" | "live" | "draft">("all");
  const [search, setSearch] = useState("");
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      setSections(raw ? (JSON.parse(raw) as CmsSection[]) : seed);
    } catch {
      setSections(seed);
    }
    setHydrated(true);
  }, []);

  // Persist
  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sections));
  }, [sections, hydrated]);

  const visible = useMemo(() => {
    return sections
      .filter((s) =>
        filter === "live" ? s.enabled : filter === "draft" ? !s.enabled : true,
      )
      .filter((s) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          s.title.toLowerCase().includes(q) ||
          (s.subtitle || "").toLowerCase().includes(q) ||
          sectionMeta[s.kind].label.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => a.order - b.order);
  }, [sections, filter, search]);

  const stats = useMemo(
    () => ({
      total: sections.length,
      live: sections.filter((s) => s.enabled).length,
      draft: sections.filter((s) => !s.enabled).length,
      heroes: sections.filter((s) => s.kind === "hero").length,
    }),
    [sections],
  );

  const handleAdd = (kind: SectionKind) => {
    const next: CmsSection = {
      id: `${kind}-${Date.now()}`,
      kind,
      title: sectionMeta[kind].label,
      enabled: false,
      order: sections.length + 1,
    };
    setSections((items) => [...items, next]);
    setEditing(next);
  };

  const handleSave = (updated: CmsSection) => {
    setSections((items) =>
      items.map((s) => (s.id === updated.id ? updated : s)),
    );
    setEditing(null);
    toast.success(`${sectionMeta[updated.kind].label} saved`);
  };

  const handleDelete = (id: string) => {
    setSections((items) => items.filter((s) => s.id !== id));
    if (editing?.id === id) setEditing(null);
    toast.success("Section removed");
  };

  const move = (id: string, direction: -1 | 1) => {
    setSections((items) => {
      const sorted = [...items].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex((s) => s.id === id);
      const swapWith = idx + direction;
      if (idx < 0 || swapWith < 0 || swapWith >= sorted.length) return items;
      const a = sorted[idx];
      const b = sorted[swapWith];
      const aOrder = a.order;
      a.order = b.order;
      b.order = aOrder;
      return sorted;
    });
  };

  const toggle = (id: string) => {
    setSections((items) =>
      items.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    );
  };

  return (
    <div className="space-y-6">
      <Header
        stats={stats}
        onPublishAll={() => {
          setSections((items) => items.map((s) => ({ ...s, enabled: true })));
          toast.success("All sections published");
        }}
      />

      <Toolbar
        search={search}
        onSearch={setSearch}
        filter={filter}
        onFilter={setFilter}
        stats={stats}
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="premium-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#e2e8f0] px-5 py-3">
            <div>
              <h2 className="text-[14px] font-bold text-[#0f172a]">
                Homepage sections
              </h2>
              <p className="text-[12px] text-[#64748b]">
                Reorder with the arrows. Toggle visibility. Click the pencil to
                edit.
              </p>
            </div>
            <span className="rounded-full border border-[#e2e8f0] bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#64748b]">
              {visible.length} showing
            </span>
          </div>

          {visible.length === 0 ? (
            <EmptyState onAdd={() => handleAdd("hero")} />
          ) : (
            <ul className="divide-y divide-[#e4e4e7]">
              {visible.map((section, idx) => (
                <SectionRow
                  key={section.id}
                  section={section}
                  isFirst={idx === 0}
                  isLast={idx === visible.length - 1}
                  onEdit={() => setEditing(section)}
                  onDelete={() => handleDelete(section.id)}
                  onToggle={() => toggle(section.id)}
                  onMoveUp={() => move(section.id, -1)}
                  onMoveDown={() => move(section.id, 1)}
                />
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-4">
          <AddSectionCard onAdd={handleAdd} />
          <GlobalSettingsCard />
        </div>
      </div>

      {editing && (
        <SectionEditor
          section={editing}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function Header({
  stats,
  onPublishAll,
}: {
  stats: { total: number; live: number; draft: number; heroes: number };
  onPublishAll: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748b]">
          Storefront content
        </p>
        <h1 className="mt-1.5 text-[26px] font-bold leading-tight text-[#0f172a] sm:text-3xl">
          Content & pages
        </h1>
        <p className="mt-1 max-w-2xl text-[13px] text-[#64748b]">
          Compose the homepage — hero banners, featured collections, editorial
          blocks, and customer stories. Changes apply to the storefront
          immediately.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPublishAll}
          className="premium-btn premium-btn-ghost"
        >
          <CheckCircle2 size={14} /> Publish all
        </button>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="premium-btn"
        >
          <Eye size={14} /> Preview storefront
        </a>
      </div>
    </div>
  );
}

function Toolbar({
  search,
  onSearch,
  filter,
  onFilter,
  stats,
}: {
  search: string;
  onSearch: (v: string) => void;
  filter: "all" | "live" | "draft";
  onFilter: (v: "all" | "live" | "draft") => void;
  stats: { total: number; live: number; draft: number };
}) {
  return (
    <div className="premium-card flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
      <label className="flex h-10 flex-1 items-center gap-2 rounded-xl border border-[#e2e8f0] bg-white px-3 transition focus-within:border-[#0f172a]">
        <Search size={14} className="text-[#64748b]" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search sections…"
          className="h-full w-full bg-transparent text-[13px] text-[#0f172a] outline-none placeholder:text-[#94a3b8]"
        />
      </label>
      <div className="flex gap-1 rounded-xl border border-[#e2e8f0] bg-white p-1">
        {(
          [
            { id: "all", label: "All", count: stats.total },
            { id: "live", label: "Live", count: stats.live },
            { id: "draft", label: "Draft", count: stats.draft },
          ] as const
        ).map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onFilter(opt.id)}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-[11px] font-semibold uppercase tracking-widest transition",
              filter === opt.id
                ? "bg-[#0f172a] text-white"
                : "text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a]",
            )}
          >
            {opt.label}
            <span
              className={cn(
                "rounded-md px-1 text-[9px]",
                filter === opt.id
                  ? "bg-white/15 text-white"
                  : "bg-[#f1f5f9] text-[#64748b]",
              )}
            >
              {opt.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function SectionRow({
  section,
  isFirst,
  isLast,
  onEdit,
  onDelete,
  onToggle,
  onMoveUp,
  onMoveDown,
}: {
  section: CmsSection;
  isFirst: boolean;
  isLast: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const meta = sectionMeta[section.kind];
  const Icon = meta.icon;
  return (
    <li className="flex items-center gap-4 px-5 py-4 transition hover:bg-[#f8fafc]">
      <div className="flex flex-col items-center gap-0.5">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={isFirst}
          className="grid h-6 w-6 place-items-center rounded-md text-[#94a3b8] transition hover:bg-[#f1f5f9] hover:text-[#0f172a] disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Move up"
        >
          <ChevronUp size={14} />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={isLast}
          className="grid h-6 w-6 place-items-center rounded-md text-[#94a3b8] transition hover:bg-[#f1f5f9] hover:text-[#0f172a] disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Move down"
        >
          <ChevronDown size={14} />
        </button>
      </div>

      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[#e2e8f0] bg-[#f8fafc] text-[#0f172a]">
        <Icon size={18} />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-[13px] font-semibold text-[#0f172a]">
            {section.title || meta.label}
          </p>
          <span className="rounded-md border border-[#e2e8f0] bg-white px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#64748b]">
            {meta.label}
          </span>
        </div>
        <p className="mt-0.5 truncate text-[12px] text-[#64748b]">
          {section.subtitle || meta.description}
        </p>
      </div>

      <div className="flex items-center gap-1.5">
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest",
            section.enabled
              ? "bg-[#0f172a] text-white"
              : "bg-[#f1f5f9] text-[#64748b]",
          )}
        >
          {section.enabled ? "Live" : "Draft"}
        </span>
        <button
          type="button"
          onClick={onEdit}
          className="grid h-9 w-9 place-items-center rounded-lg border border-[#e2e8f0] bg-white text-[#0f172a] transition hover:bg-[#f8fafc]"
          aria-label="Edit"
        >
          <Edit3 size={14} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="grid h-9 w-9 place-items-center rounded-lg border border-[#e2e8f0] bg-white text-[#0f172a] transition hover:bg-[#f8fafc]"
          aria-label="Delete"
        >
          <Trash2 size={14} />
        </button>
        <ToggleSwitch on={section.enabled} onChange={onToggle} />
      </div>
    </li>
  );
}

function ToggleSwitch({
  on,
  onChange,
}: {
  on: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      role="switch"
      aria-checked={on}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full border transition",
        on ? "border-[#0f172a] bg-[#0f172a]" : "border-[#e2e8f0] bg-[#f1f5f9]",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 grid h-4 w-4 place-items-center rounded-full bg-white transition-all",
          on ? "left-[22px]" : "left-0.5",
        )}
      />
    </button>
  );
}

function AddSectionCard({ onAdd }: { onAdd: (kind: SectionKind) => void }) {
  const kinds: SectionKind[] = [
    "hero",
    "featured-collection",
    "banner",
    "testimonial",
    "announcement",
    "rich-text",
  ];
  return (
    <div className="premium-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg border border-[#e2e8f0] bg-[#f8fafc]">
          <Plus size={14} />
        </span>
        <div>
          <p className="text-[13px] font-bold text-[#0f172a]">Add section</p>
          <p className="text-[11px] text-[#64748b]">
            Drop a block into the page
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {kinds.map((kind) => {
          const meta = sectionMeta[kind];
          const Icon = meta.icon;
          return (
            <button
              key={kind}
              type="button"
              onClick={() => onAdd(kind)}
              className="group flex flex-col items-start gap-1.5 rounded-xl border border-[#e2e8f0] bg-white p-3 text-left transition hover:border-[#0f172a] hover:bg-[#f8fafc]"
            >
              <Icon
                size={14}
                className="text-[#64748b] group-hover:text-[#0f172a]"
              />
              <p className="text-[12px] font-semibold text-[#0f172a]">
                {meta.label}
              </p>
              <p className="text-[10px] leading-snug text-[#64748b]">
                {meta.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function GlobalSettingsCard() {
  return (
    <div className="premium-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg border border-[#e2e8f0] bg-[#f8fafc]">
          <Settings2 size={14} />
        </span>
        <div>
          <p className="text-[13px] font-bold text-[#0f172a]">
            Storefront settings
          </p>
          <p className="text-[11px] text-[#64748b]">
            Affects every page
          </p>
        </div>
      </div>
      <div className="space-y-2.5">
        <SettingRow icon={Globe} label="Store domain" value="vastraaura.in" />
        <SettingRow
          icon={LayoutGrid}
          label="Layout density"
          value="Comfortable"
        />
        <SettingRow icon={Sliders} label="Theme" value="Light (auto)" />
      </div>
    </div>
  );
}

function SettingRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <button
      type="button"
      className="group flex w-full items-center justify-between rounded-xl border border-[#e2e8f0] bg-white px-3 py-2.5 text-left transition hover:border-[#0f172a]"
    >
      <span className="flex items-center gap-2.5">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#f8fafc] text-[#64748b] group-hover:text-[#0f172a]">
          <Icon size={13} />
        </span>
        <span className="text-[12px] font-medium text-[#0f172a]">{label}</span>
      </span>
      <span className="text-[11px] font-semibold text-[#64748b]">{value}</span>
    </button>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-2xl border border-[#e2e8f0] bg-[#f8fafc]">
        <LayoutGrid size={20} className="text-[#64748b]" />
      </span>
      <p className="text-[14px] font-semibold text-[#0f172a]">
        No sections to show
      </p>
      <p className="max-w-sm text-[12px] text-[#64748b]">
        Add your first section to start composing the homepage.
      </p>
      <button
        type="button"
        onClick={onAdd}
        className="premium-btn premium-btn-primary"
      >
        <Plus size={14} /> Add hero section
      </button>
    </div>
  );
}

function SectionEditor({
  section,
  onClose,
  onSave,
}: {
  section: CmsSection;
  onClose: () => void;
  onSave: (s: CmsSection) => void;
}) {
  const [draft, setDraft] = useState<CmsSection>(section);
  const meta = sectionMeta[draft.kind];
  const Icon = meta.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#0f172a]/40 p-3 backdrop-blur-sm sm:items-center sm:p-6">
      <div className="premium-card flex w-full max-w-2xl flex-col overflow-hidden bg-white">
        <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg border border-[#e2e8f0] bg-[#f8fafc]">
              <Icon size={15} />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748b]">
                Edit {meta.label}
              </p>
              <p className="text-[13px] font-semibold text-[#0f172a]">
                {section.title || meta.label}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#e2e8f0] bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#0f172a] transition hover:bg-[#f8fafc]"
          >
            Close
          </button>
        </div>

        <div className="max-h-[70vh] space-y-4 overflow-y-auto p-6 custom-scrollbar">
          <Field label="Title">
            <input
              className="premium-input"
              value={draft.title}
              onChange={(e) =>
                setDraft((d) => ({ ...d, title: e.target.value }))
              }
              placeholder="Section title"
            />
          </Field>

          {(draft.kind === "hero" ||
            draft.kind === "banner" ||
            draft.kind === "featured-collection") && (
            <Field label="Subtitle">
              <textarea
                className="min-h-[80px] w-full rounded-xl border border-[#e2e8f0] bg-white p-3 text-[13px] text-[#0f172a] outline-none transition focus:border-[#0f172a] focus:ring-4 focus:ring-[#0a0a0a]/10"
                value={draft.subtitle || ""}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, subtitle: e.target.value }))
                }
                placeholder="Supporting copy that appears below the title"
              />
            </Field>
          )}

          {(draft.kind === "testimonial" ||
            draft.kind === "rich-text" ||
            draft.kind === "announcement") && (
            <Field label="Body">
              <textarea
                className="min-h-[120px] w-full rounded-xl border border-[#e2e8f0] bg-white p-3 text-[13px] text-[#0f172a] outline-none transition focus:border-[#0f172a] focus:ring-4 focus:ring-[#0a0a0a]/10"
                value={draft.body || ""}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, body: e.target.value }))
                }
                placeholder="Main content for this section"
              />
            </Field>
          )}

          {(draft.kind === "hero" || draft.kind === "banner") && (
            <div className="grid grid-cols-2 gap-3">
              <Field label="CTA label">
                <input
                  className="premium-input"
                  value={draft.cta?.label || ""}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      cta: { label: e.target.value, href: d.cta?.href || "" },
                    }))
                  }
                  placeholder="Shop now"
                />
              </Field>
              <Field label="CTA link">
                <input
                  className="premium-input"
                  value={draft.cta?.href || ""}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      cta: { label: d.cta?.label || "", href: e.target.value },
                    }))
                  }
                  placeholder="/collections/new"
                />
              </Field>
              <Field label="Image URL" className="col-span-2">
                <input
                  className="premium-input"
                  value={draft.image || ""}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, image: e.target.value }))
                  }
                  placeholder="https://…"
                />
              </Field>
            </div>
          )}

          {draft.kind === "featured-collection" && (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Collection">
                <input
                  className="premium-input"
                  value={String(draft.meta?.collection || "")}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      meta: { ...(d.meta || {}), collection: e.target.value },
                    }))
                  }
                  placeholder="new"
                />
              </Field>
              <Field label="Limit">
                <input
                  type="number"
                  className="premium-input"
                  value={Number(draft.meta?.limit || 6)}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      meta: {
                        ...(d.meta || {}),
                        limit: Number(e.target.value || 0),
                      },
                    }))
                  }
                />
              </Field>
            </div>
          )}

          <Field label="Order">
            <input
              type="number"
              className="premium-input"
              value={draft.order}
              onChange={(e) =>
                setDraft((d) => ({ ...d, order: Number(e.target.value || 0) }))
              }
            />
          </Field>

          <label className="flex items-center justify-between rounded-xl border border-[#e2e8f0] bg-white p-3">
            <div>
              <p className="text-[12px] font-semibold text-[#0f172a]">
                Visible on storefront
              </p>
              <p className="text-[11px] text-[#64748b]">
                When off, this section is hidden everywhere
              </p>
            </div>
            <ToggleSwitch
              on={draft.enabled}
              onChange={() =>
                setDraft((d) => ({ ...d, enabled: !d.enabled }))
              }
            />
          </label>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[#e2e8f0] bg-[#f8fafc] px-6 py-3">
          <button type="button" onClick={onClose} className="premium-btn">
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave(draft)}
            className="premium-btn premium-btn-primary"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[#64748b]">
        {label}
      </span>
      {children}
    </label>
  );
}



