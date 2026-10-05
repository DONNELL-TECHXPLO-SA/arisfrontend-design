import AfricaStripes from "@/components/common/AfricaStripes";
import { Link } from "@/i18n/navigation";
import { cn } from "@/utils";
import { Plus } from "lucide-react";

export interface HeroMetric {
  label: string;
  value: number | string;
  hint?: string;
  href?: string;
  /** A small live red dot — the one figure that asks the client to act. */
  emphasis?: boolean;
}

// Client dashboard hero — greeting and primary action over the logo's striped Africa
// (drawn in on load, tone-on-tone with two red stripes), with the key figures set into
// its base so the page opens on one composed panel instead of a row of loose tiles.
export default function DashboardHero({
  eyebrow,
  title,
  subtitle,
  metrics,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  metrics: HeroMetric[];
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-white shadow-card dark:bg-gray-900">
      <div className="relative p-6 sm:p-8">
        {/* The whole Africa, right-aligned, bleeding just under the figures row. */}
        <AfricaStripes
          animate
          accent={[4, 8]}
          stripeClassName="stroke-brand-500/[0.09] dark:stroke-white/[0.06]"
          accentClassName="stroke-brand-500/60"
          className="pointer-events-none absolute end-6 top-5 hidden aspect-[146/164] h-[125%] sm:block lg:end-12"
        />

        <div className="relative max-w-xl">
          <p className="text-theme-xs font-medium tracking-[0.14em] text-gray-400 uppercase">{eyebrow}</p>
          <h1 className="mt-2 text-title-sm font-medium tracking-tight text-ink sm:text-title-md dark:text-white">{title}</h1>
          <p className="mt-2 text-base text-gray-500 dark:text-gray-400">{subtitle}</p>
          <Link
            href="/portal/claims/new"
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-500 px-5 text-sm font-medium text-white shadow-brand-glow transition-colors hover:bg-brand-600"
          >
            <Plus className="size-4" /> Lodge a claim
          </Link>
        </div>
      </div>

      <dl className="relative grid grid-cols-2 border-t border-gray-100 bg-white lg:grid-cols-4 dark:border-white/5 dark:bg-gray-900">
        {metrics.map((m, i) => {
          const body = (
            <>
              <dt className="flex items-center gap-2 text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                {m.emphasis && (
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full rounded-full bg-brand-500 opacity-40 motion-safe:animate-ping" />
                    <span className="relative inline-flex size-2 rounded-full bg-brand-500" />
                  </span>
                )}
                {m.label}
              </dt>
              <dd
                className={cn(
                  "mt-2 text-title-sm leading-none font-medium tracking-tight tabular-nums",
                  "text-ink dark:text-white",
                )}
              >
                {m.value}
              </dd>
              {m.hint && <dd className="mt-1.5 text-theme-xs text-gray-400">{m.hint}</dd>}
            </>
          );
          const cell = cn(
            "block px-6 py-5 sm:px-8",
            i % 2 === 1 && "border-s border-gray-100 dark:border-white/5",
            i >= 2 && "border-t border-gray-100 lg:border-t-0 dark:border-white/5",
            i >= 1 && "lg:border-s",
          );
          return m.href ? (
            <Link key={m.label} href={m.href} className={cn(cell, "transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]")}>
              {body}
            </Link>
          ) : (
            <div key={m.label} className={cell}>
              {body}
            </div>
          );
        })}
      </dl>
    </section>
  );
}
