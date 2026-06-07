import Image from "next/image";
import { cn } from "@/lib/utils";
import { brandLogoPath } from "@/lib/brand";

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
        "relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full border border-[rgba(226,189,141,0.82)] bg-[var(--color-maroon)] shadow-[0_0.9rem_1.8rem_rgba(38,7,11,0.2)]",
        className,
      )}
    >
      <span className="absolute inset-[2px] rounded-full border border-[rgba(255,231,166,0.8)]" />
      <span className="relative grid h-full w-full place-items-center overflow-hidden rounded-full">
        <Image
          src={brandLogoPath}
          alt="Alaira Half Saree House logo"
          fill
          priority={priority}
          quality={100}
          sizes="192px"
          className="scale-[3.1] object-cover object-center"
        />
      </span>
    </span>
  );
}
