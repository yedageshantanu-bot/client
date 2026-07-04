import { cn } from "@/lib/utils";

/**
 * Badge — unified monochrome design.
 * All badges are #08142E navy with #FFFFFF text by default.
 * `tone="light"` is the only soft variant (for muted contexts).
 */
export function Badge({
  children,
  className,
  tone = "default",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "light" | "green" | "gold" | "muted" | "red" | "maroon";
}) {
  const tones: Record<string, string> = {
    default: "bg-[var(--color-maroon)] text-white",
    light: "bg-[#f1f5f9] text-[#475569]",
    green: "bg-[#dcfce7] text-[#15803d]",
    gold: "bg-[#fef9c3] text-[#a16207]",
    muted: "bg-[#f1f5f9] text-[#475569]",
    red: "bg-[#fee2e2] text-[#b91c1c]",
    maroon: "bg-[var(--color-maroon)] text-white",
  };

  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-full px-2.5 text-[10px] font-bold uppercase tracking-widest",
        tones[tone] ?? tones.default,
        className,
      )}
    >
      {children}
    </span>
  );
}
