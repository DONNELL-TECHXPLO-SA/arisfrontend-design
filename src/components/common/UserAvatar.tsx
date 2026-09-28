import { cn } from "@/utils";

interface UserAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const SIZES = {
  sm: "size-8 text-[11px]",
  md: "size-10 text-theme-xs",
  lg: "size-14 text-base",
  xl: "size-20 text-title-sm",
};

// Deterministic tone per person, so the same user always gets the same roundel.
const TONES = [
  "bg-ink text-white dark:bg-white dark:text-ink",
  "bg-brand-500 text-white",
  "bg-charcoal-soft text-white",
  "bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300",
  "bg-gray-200 text-ink dark:bg-white/10 dark:text-white",
];

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function toneFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return TONES[hash % TONES.length];
}

// Initials roundel — the default avatar for every user (no stock photography).
export default function UserAvatar({ name, size = "md", className }: UserAvatarProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold tracking-wide select-none",
        SIZES[size],
        toneFor(name),
        className,
      )}
    >
      {initialsOf(name)}
    </span>
  );
}
