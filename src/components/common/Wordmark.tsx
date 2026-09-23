import { cn } from "@/utils";

interface WordmarkProps {
  /** "full" — two-line lockup for expanded nav; "mark" — single-letter monogram for collapsed/compact spots. */
  variant?: "full" | "mark";
  /** "brand" for light surfaces; "inverted" for dark surfaces (e.g. the auth side panel). */
  tone?: "brand" | "inverted";
  className?: string;
}

// Text-only brand lockup — no icon/image asset. "ARIS" carries the mark, "Claims
// System" sits underneath as a tracked-out label, the way a wordmark-plus-descriptor
// lockup typically reads.
export default function Wordmark({ variant = "full", tone = "brand", className = "" }: WordmarkProps) {
  const primary = tone === "inverted" ? "text-white" : "text-brand-600 dark:text-brand-400";
  const secondary = tone === "inverted" ? "text-white/60" : "text-gray-400 dark:text-gray-500";

  if (variant === "mark") {
    return <span className={cn("text-title-sm font-bold tracking-tight", primary, className)}>A</span>;
  }

  return (
    <span className={cn("flex flex-col leading-none", className)}>
      <span className={cn("text-theme-xl font-bold tracking-wide", primary)}>ARIS</span>
      <span className={cn("mt-1 text-[10px] font-semibold tracking-[0.2em] uppercase", secondary)}>Claims System</span>
    </span>
  );
}
