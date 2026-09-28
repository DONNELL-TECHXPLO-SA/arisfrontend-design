import { brandLogo } from "@/config/brand";
import { cn } from "@/utils";
import Image from "next/image";

interface WordmarkProps {
  /** "full" — horizontal logo; "lockup" — logo with tagline (sign-in); "mark" — icon only (collapsed nav). */
  variant?: "full" | "lockup" | "mark";
  /** "brand" for light surfaces (swaps to the inverted art in dark mode); "inverted" for always-dark surfaces. */
  tone?: "brand" | "inverted";
  className?: string;
}

const SIZES = {
  full: { width: 618, height: 165, className: "h-10 w-auto" },
  lockup: { width: 618, height: 197, className: "h-16 w-auto" },
};

// Uses the uploaded logo from src/config/brand.ts; any empty slot falls back to a text
// lockup — a red roundel carries the "A" and the name sits beside it.
export default function Wordmark({ variant = "full", tone = "brand", className = "" }: WordmarkProps) {
  if (variant === "mark") {
    return (
      <span className={cn("inline-flex", className)}>
        {brandLogo.mark ? (
          <Image src={brandLogo.mark} alt="Aris Brokers" width={40} height={40} unoptimized className="size-10 object-contain" />
        ) : (
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-500 text-base font-semibold tracking-tight text-white">
            A
          </span>
        )}
      </span>
    );
  }

  const light = variant === "lockup" ? (brandLogo.lockup ?? brandLogo.full) : brandLogo.full;
  const dark =
    variant === "lockup"
      ? (brandLogo.lockupInverted ?? brandLogo.fullInverted ?? light)
      : (brandLogo.fullInverted ?? light);
  const size = SIZES[variant];

  if (light) {
    const img = (src: string, extra?: string) => (
      <Image src={src} alt="Aris Brokers" width={size.width} height={size.height} unoptimized className={cn(size.className, "object-contain", extra)} />
    );
    return (
      <span className={cn("inline-flex items-center", className)}>
        {tone === "inverted" ? (
          img(dark ?? light)
        ) : (
          <>
            {img(light, "dark:hidden")}
            {img(dark ?? light, "hidden dark:block")}
          </>
        )}
      </span>
    );
  }

  const name = tone === "inverted" ? "text-white" : "text-ink dark:text-white";
  const descriptor = tone === "inverted" ? "text-white/50" : "text-gray-400 dark:text-gray-500";
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-500 text-base font-semibold tracking-tight text-white">
        A
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn("text-lg font-semibold tracking-tight", name)}>Aris</span>
        <span className={cn("mt-0.5 text-[10px] font-medium tracking-[0.18em] uppercase", descriptor)}>Claims</span>
      </span>
    </span>
  );
}
