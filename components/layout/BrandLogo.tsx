import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
};

export function BrandLogo({
  className,
  priority = false,
}: BrandLogoProps) {
  return (
    <span
      className={cn(
        "relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-[#1C1924] text-white shadow-sm transition duration-500 hover:scale-105",
        className,
      )}
    >
      <span className="font-serif text-lg font-semibold tracking-wide">A</span>
    </span>
  );
}
