import { cn } from "@/utils";
import type { MonthBucket } from "./chartData";

interface ClaimsPerMonthChartProps {
  months: MonthBucket[];
}

// Pill columns with no gridlines or y-axis — the counts ride on the highlighted bars
// and in every bar's hover/focus tooltip (plus a screen-reader table), so dropping the
// axis never hides a value. Encoding: this month = Aris red, busiest earlier month =
// ink, every other month = hatched (inactive).
export default function ClaimsPerMonthChart({ months }: ClaimsPerMonthChartProps) {
  const max = Math.max(1, ...months.map((m) => m.count));
  const past = months.filter((m) => !m.isCurrent);
  const peakCount = Math.max(0, ...past.map((m) => m.count));
  const peakKey = peakCount > 0 ? [...past].reverse().find((m) => m.count === peakCount)?.key : undefined;

  return (
    <div>
      <div className="flex h-56 items-end justify-between gap-2 sm:gap-4" role="img" aria-label="Claims lodged per month">
        {months.map((m, i) => {
          const isPeak = m.key === peakKey;
          const labelled = m.isCurrent || isPeak;
          return (
            <div key={m.key} className="flex h-full min-w-0 flex-1 flex-col items-center gap-3">
              <div className="relative flex w-full flex-1 items-end justify-center">
                <button
                  type="button"
                  aria-label={`${m.longLabel}: ${m.count} claim${m.count === 1 ? "" : "s"}`}
                  className={cn(
                    "group relative w-full max-w-14 min-h-11 rounded-full transition-[filter,box-shadow] duration-150 motion-safe:animate-bar-rise outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 dark:focus-visible:ring-white dark:focus-visible:ring-offset-gray-900",
                    m.isCurrent
                      ? "bg-brand-500 hover:brightness-110"
                      : isPeak
                        ? "bg-ink hover:brightness-150 dark:bg-white dark:hover:brightness-90"
                        : "bg-hatch hover:ring-2 hover:ring-gray-300 dark:hover:ring-white/20",
                  )}
                  style={{ height: `${(m.count / max) * 100}%`, animationDelay: `${i * 80}ms` }}
                >
                  {labelled && (
                    <span
                      style={{ animationDelay: `${months.length * 80 + 700}ms` }}
                      className="absolute start-1/2 bottom-full mb-2 -translate-x-1/2 rounded-full bg-white px-2 py-0.5 text-theme-xs font-semibold text-ink shadow-card ring-1 ring-gray-200 transition-opacity motion-safe:animate-fade-in group-hover:opacity-0 group-focus-visible:opacity-0 rtl:translate-x-1/2 dark:bg-gray-800 dark:text-white dark:ring-white/10">
                      {m.count}
                    </span>
                  )}
                  <span className="pointer-events-none absolute start-1/2 bottom-full z-10 mb-2 -translate-x-1/2 rounded-xl bg-ink px-3 py-2 text-start whitespace-nowrap opacity-0 shadow-float transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 rtl:translate-x-1/2 dark:bg-white">
                    <span className="block text-theme-sm font-semibold text-white dark:text-ink">
                      {m.count} claim{m.count === 1 ? "" : "s"}
                    </span>
                    <span className="block text-theme-xs text-white/60 dark:text-gray-500">{m.longLabel}</span>
                  </span>
                </button>
              </div>
              <span
                className={cn(
                  "text-theme-xs",
                  m.isCurrent ? "font-semibold text-ink dark:text-white" : "text-gray-400",
                )}
              >
                {m.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-theme-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-2">
          <span className="size-3.5 rounded-full bg-brand-500" /> This month
        </span>
        {peakKey && (
          <span className="flex items-center gap-2">
            <span className="size-3.5 rounded-full bg-ink dark:bg-white" /> Busiest earlier month
          </span>
        )}
        <span className="flex items-center gap-2">
          <span className="size-3.5 rounded-full bg-hatch ring-1 ring-gray-300 ring-inset dark:ring-white/15" /> Other months
        </span>
      </div>

      <table className="sr-only">
        <caption>Claims lodged per month</caption>
        <thead>
          <tr>
            <th scope="col">Month</th>
            <th scope="col">Claims</th>
          </tr>
        </thead>
        <tbody>
          {months.map((m) => (
            <tr key={m.key}>
              <th scope="row">{m.longLabel}</th>
              <td>{m.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
