"use client";

import { Link } from "@/i18n/navigation";
import { CLIENT_STAGE_COUNT, claimProgress, clientJourney, clientStatusLabel } from "@/lib/mock/clientJourney";
import { findSection, formatDate } from "@/lib/mock/helpers";
import type { Claim, MockState } from "@/lib/mock/types";
import { cn } from "@/utils";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import ClaimJourney from "./ClaimJourney";

// My claims as an expandable list: each row says which claim and how far along it is;
// opening a row shows "Where your claim is" (stages + who it's waiting on) without
// leaving the list. "Open" goes to the claim itself.
export default function ClaimAccordionList({ claims, state, emptyMessage }: { claims: Claim[]; state: MockState; emptyMessage: string }) {
  const [open, setOpen] = useState<Set<string>>(new Set());
  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  if (claims.length === 0) {
    return <div className="rounded-3xl bg-white p-10 text-center text-theme-sm text-gray-500 shadow-card dark:bg-gray-900 dark:text-gray-400">{emptyMessage}</div>;
  }

  return (
    <ul className="overflow-hidden rounded-3xl bg-white shadow-card dark:bg-gray-900">
      {claims.map((claim, i) => {
        const expanded = open.has(claim.id);
        const progress = claimProgress(claim);
        const done = progress.finished ? CLIENT_STAGE_COUNT : progress.index;
        const panelId = `claim-panel-${claim.id}`;

        return (
          <li key={claim.id} className={cn(i > 0 && "border-t border-gray-100 dark:border-white/5")}>
            <div className={cn("flex items-center gap-3 px-4 py-4 transition-colors sm:gap-4 sm:px-6", expanded ? "bg-gray-50/80 dark:bg-white/[0.02]" : "hover:bg-gray-50/60 dark:hover:bg-white/[0.02]")}>
              <button
                type="button"
                onClick={() => toggle(claim.id)}
                aria-expanded={expanded}
                aria-controls={panelId}
                className="flex min-w-0 flex-1 items-center gap-3 text-start sm:gap-4"
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full transition-colors",
                    expanded ? "bg-ink text-white dark:bg-white dark:text-ink" : "bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400",
                  )}
                >
                  <ChevronDown className={cn("size-4 transition-transform duration-200", expanded && "rotate-180")} />
                </span>

                <span className="min-w-0 flex-1 sm:flex-none sm:basis-64">
                  <span className="flex items-center gap-2">
                    <span className="text-theme-sm font-semibold text-ink dark:text-white">{claim.reference}</span>
                  </span>
                  <span className="mt-0.5 block truncate text-theme-xs text-gray-500 dark:text-gray-400">
                    {claim.claimType} · {findSection(state, claim.sectionId)?.insurer}
                  </span>
                </span>

                {/* Stage at a glance — hidden on small screens, where the expanded panel carries it. */}
                <span className="hidden min-w-0 flex-1 md:block">
                  <span className="flex gap-1" aria-hidden>
                    {Array.from({ length: CLIENT_STAGE_COUNT }, (_, s) => (
                      <span
                        key={s}
                        className={cn(
                          "h-1.5 flex-1 rounded-full",
                          s < done ? "bg-ink dark:bg-white" : s === progress.index && !progress.finished ? "bg-ink/35 dark:bg-white/40" : "bg-hatch",
                        )}
                      />
                    ))}
                  </span>
                  <span className="mt-1.5 block text-theme-xs text-gray-500 dark:text-gray-400">
                    {progress.finished ? clientStatusLabel(claim).label : `Stage ${progress.index + 1} of ${CLIENT_STAGE_COUNT} · ${progress.label}`}
                  </span>
                </span>

                <span className="hidden w-24 shrink-0 text-end text-theme-xs text-gray-400 sm:block">{formatDate(claim.updatedAt)}</span>
              </button>

              <Link
                href={`/portal/claims/${claim.id}`}
                aria-label={`Open claim ${claim.reference}`}
                className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-white transition-colors hover:bg-brand-500 dark:bg-white dark:text-ink dark:hover:bg-brand-500 dark:hover:text-white"
              >
                Open <ArrowUpRight className="size-4" />
              </Link>
            </div>

            <div id={panelId} className={cn("menu-accordion", expanded && "open")}>
              <div>
                <div className="border-t border-gray-100 px-4 pt-5 pb-6 sm:px-6 sm:ps-[4.5rem] dark:border-white/5">
                  <ClaimJourney embedded journey={clientJourney(claim, state)} claimBase={`/portal/claims/${claim.id}`} />
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
