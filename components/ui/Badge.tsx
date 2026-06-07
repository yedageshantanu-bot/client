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
  tone?: "default" | "light";
}) {
  const tones: Record<string, string> = {
    default: "bg-[#08142E] text-white",
    light: "bg-[#f1f5f9] text-[#475569]",
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
