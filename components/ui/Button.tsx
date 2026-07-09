import Link from "next/link";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BaseProps = {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  href?: string;
};

const variants = {
  // Primary: navy fill, white text — the only "highlight" color allowed
  primary:
    "border border-[#08142E] bg-[#08142E] text-white hover:bg-[#0f2042] hover:border-[#0f2042]",
  // Secondary: white fill, dark text, grey border
  secondary:
    "border border-[#e2e8f0] bg-white text-[#0f172a] hover:bg-[#f8fafc] hover:border-[#cbd5e1]",
  // Ghost: transparent, no border
  ghost:
    "border border-transparent bg-transparent text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0f172a]",
  // Outline: white with grey border (same as secondary for consistency)
  outline:
    "border border-[#e2e8f0] bg-white text-[#0f172a] hover:bg-[#f8fafc]",
  // Danger: NO RED — outlined black style
  danger:
    "border border-[#0f172a] bg-white text-[#0f172a] hover:bg-[#0f172a] hover:text-white",
};

const sizes = {
  sm: "h-9 px-3 text-xs",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-sm",
  icon: "h-10 w-10 p-0",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  href,
  children,
  ...props
}: BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> &
  AnchorHTMLAttributes<HTMLAnchorElement>) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition duration-200 disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
