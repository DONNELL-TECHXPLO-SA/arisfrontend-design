import { Link } from "@/i18n/navigation";
import { cn } from "@/utils";
import { ArrowUpRight } from "lucide-react";
import React from "react";

interface StatTileProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  /** Short context line under the number, e.g. "across 4 clients". */
  caption?: string;
  /** Small pill shown before the caption — use for the count that drives urgency. */
  chip?: string;
  href?: string;
  /** One tile per row can be featured: solid Aris red, reserved for the number that needs action. */
  featured?: boolean;
}

export default function StatTile({ label, value, icon, caption, chip, href, featured = false }: StatTileProps) {
  const body = (
    <>
      {featured && (
        <span className="pointer-events-none absolute -end-16 -bottom-20 size-56 rounded-full bg-white/10" />
      )}
      <div className="relative flex items-start justify-between gap-3">
        <p className={cn("text-base font-medium", featured ? "text-white/90" : "text-gray-600 dark:text-gray-300")}>{label}</p>
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full transition-transform duration-200",
            featured ? "bg-white/15 text-white" : "bg-gray-100 text-ink dark:bg-white/5 dark:text-white",
            href && "group-hover:rotate-12",
          )}
        >
          {icon}
        </span>
      </div>

      <p
        className={cn(
          "relative mt-6 text-title-md font-medium tracking-tight tabular-nums",
          featured ? "text-white" : "text-ink dark:text-white",
        )}
      >
        {value}
      </p>

      {(chip || caption) && (
        <div className="relative mt-3 flex flex-wrap items-center gap-2 text-theme-sm">
          {chip && (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-theme-xs font-medium",
                featured ? "bg-white/15 text-white" : "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400",
              )}
            >
              {chip}
            </span>
          )}
          {caption && <span className={featured ? "text-white/70" : "text-gray-400"}>{caption}</span>}
        </div>
      )}

      {href && (
        <ArrowUpRight
          className={cn(
            "absolute end-5 bottom-5 size-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100",
            featured ? "text-white" : "text-gray-400",
          )}
          strokeWidth={2}
        />
      )}
    </>
  );

  const className = cn(
    "group relative block overflow-hidden rounded-3xl p-5 sm:p-6",
    featured
      ? "bg-linear-to-br from-brand-400 via-brand-500 to-brand-600 text-white shadow-brand-glow"
      : "bg-white shadow-card dark:bg-gray-900",
  );

  return href ? (
    <Link href={href} className={className}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}
