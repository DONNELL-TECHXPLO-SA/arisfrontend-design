import { Link } from "@/i18n/navigation";
import type { ClientJourney } from "@/lib/mock/clientJourney";
import { cn } from "@/utils";
import { ArrowRight, Building2, Check, CircleCheck, ClipboardList, Minus, UserRound } from "lucide-react";

const PARTY_ICON = { you: ClipboardList, insurer: Building2, aris: UserRound, none: CircleCheck } as const;

// Where a client's claim is (six milestones) and who it's waiting on right now.
/** `embedded` — render without its own card, for use inside the claim hero. */
export default function ClaimJourney({ journey, claimBase, embedded = false }: { journey: ClientJourney; claimBase: string; embedded?: boolean }) {
  const { stages, waiting } = journey;
  const current = stages.find((s) => s.state === "current") ?? [...stages].reverse().find((s) => s.state === "done");
  const Icon = PARTY_ICON[waiting.party];
  const yourTurn = waiting.party === "you";

  return (
    <div className={embedded ? "" : "rounded-3xl bg-white p-5 shadow-card sm:p-6 dark:bg-gray-900"}>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className={cn("font-medium tracking-tight text-ink flat:text-[15px] flat:font-semibold flat:tracking-normal dark:text-white", embedded ? "text-base" : "text-lg")}>Where your claim is</h2>
        {current && <span className="text-theme-sm text-gray-500 dark:text-gray-400">{current.label}</span>}
      </div>

      {/* Stage tracker */}
      <ol className="no-scrollbar mt-5 flex overflow-x-auto pb-1" aria-label="Claim stages">
        {stages.map((s, i) => (
          <li key={s.key} className="relative flex min-w-20 flex-1 flex-col items-center text-center" aria-current={s.state === "current" ? "step" : undefined}>
            {i > 0 && (
              <span
                aria-hidden
                className={cn(
                  "absolute top-4 end-1/2 h-0.5 w-full -translate-y-1/2",
                  s.state === "done" || s.state === "current" ? "bg-ink dark:bg-white" : "bg-hatch",
                )}
              />
            )}
            <span
              className={cn(
                "relative z-1 flex size-8 items-center justify-center rounded-full text-theme-xs font-semibold",
                s.state === "done" && "bg-ink text-white dark:bg-white dark:text-ink",
                s.state === "current" && "bg-white text-ink ring-2 ring-ink ring-offset-2 ring-offset-white dark:bg-gray-900 dark:text-white dark:ring-white dark:ring-offset-gray-900",
                s.state === "upcoming" && "bg-hatch text-gray-500 ring-1 ring-gray-200 ring-inset dark:text-gray-400 dark:ring-white/10",
                s.state === "skipped" && "bg-gray-100 text-gray-400 dark:bg-white/5",
              )}
            >
              {s.state === "done" ? (
                <Check className="size-4" strokeWidth={2.5} />
              ) : s.state === "skipped" ? (
                <Minus className="size-4" />
              ) : (
                i + 1
              )}
            </span>
            <span
              className={cn(
                "mt-2 px-1 text-theme-xs",
                s.state === "current" ? "font-semibold text-ink dark:text-white" : s.state === "skipped" ? "text-gray-300 line-through dark:text-gray-600" : "text-gray-500 dark:text-gray-400",
              )}
            >
              {s.label}
            </span>
          </li>
        ))}
      </ol>

      {/* Who it's waiting on */}
      <div
        className={cn(
          "mt-6 flex flex-col gap-4 rounded-2xl p-4 flat:mt-5 flat:rounded-lg flat:border sm:flex-row sm:items-center",
          yourTurn
            ? "bg-brand-50 flat:border-brand-100 dark:bg-brand-500/10 dark:flat:border-brand-500/20"
            : waiting.party === "none"
              ? "bg-success-50 flat:border-success-100 dark:bg-success-500/10 dark:flat:border-success-500/20"
              : "bg-gray-50 flat:border-gray-200 dark:bg-white/[0.03] dark:flat:border-white/10",
        )}
      >
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full flat:size-9",
            yourTurn
              ? "bg-brand-500 text-white"
              : waiting.party === "none"
                ? "bg-success-500 text-white"
                : "bg-white text-ink shadow-card dark:bg-gray-800 dark:text-white",
          )}
        >
          <Icon className="size-5" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          {waiting.party !== "none" && (
            <p className={cn("text-theme-xs font-semibold tracking-[0.1em] uppercase", yourTurn ? "text-brand-600 dark:text-brand-400" : "text-gray-400")}>
              {yourTurn ? "Your next step" : `Waiting on ${waiting.who}`}
            </p>
          )}
          <p className="mt-0.5 text-theme-sm font-medium text-ink dark:text-white">{waiting.text}</p>
        </div>
        {waiting.action && (
          <Link
            href={`${claimBase}/${waiting.action.tab}`}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-4.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 flat:h-9 flat:rounded-lg flat:bg-brand-500 flat:px-3.5 flat:hover:bg-brand-600 dark:bg-white dark:text-ink dark:hover:bg-gray-200 dark:flat:bg-brand-500 dark:flat:text-white"
          >
            {waiting.action.label} <ArrowRight className="size-4 rtl:rotate-180" />
          </Link>
        )}
      </div>
    </div>
  );
}
