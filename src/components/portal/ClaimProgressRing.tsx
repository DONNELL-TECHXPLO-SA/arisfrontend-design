"use client";

import PayoutGauge from "@/components/dashboard/PayoutGauge";
import { CLIENT_STAGE_COUNT, claimProgress } from "@/lib/mock/clientJourney";
import type { Claim } from "@/lib/mock/types";

// Client dashboard ring — same half-gauge as the manager's payout breakdown.
//  · One claim: the arc fills through its six stages (done · current · still to come).
//  · Several claims: the arc splits them by how far along they are, furthest first.
export default function ClaimProgressRing({ claims }: { claims: Claim[] }) {
  if (claims.length === 0) {
    return <p className="text-theme-sm text-gray-400">Your claims will show here once you lodge one.</p>;
  }

  if (claims.length === 1) {
    const p = claimProgress(claims[0]);
    const done = p.finished ? CLIENT_STAGE_COUNT : p.index;
    return (
      <PayoutGauge
        hideEmpty
        showPercent={false}
        centerValue={p.finished ? "Done" : `${p.index + 1} of ${CLIENT_STAGE_COUNT}`}
        centerLabel={p.finished ? "claim complete" : p.label}
        segments={[
          { key: "done", label: "Stages done", value: done, strokeClass: "stroke-ink dark:stroke-white", swatchClass: "bg-ink dark:bg-white" },
          ...(p.finished
            ? []
            : [{ key: "current", label: `Now: ${p.label}`, value: 1, strokeClass: "stroke-gray-400 dark:stroke-gray-500", swatchClass: "bg-gray-400 dark:bg-gray-500" }]),
        ]}
        pending={{ label: "Still to come", value: CLIENT_STAGE_COUNT - done - (p.finished ? 0 : 1) }}
      />
    );
  }

  const progress = claims.map(claimProgress);
  const finished = progress.filter((p) => p.finished).length;
  // Stage indexes: 0 lodged · 1 with insurer · 2 assessment · 3 decision · 4 settlement · 5 closed
  const nearlyThere = progress.filter((p) => !p.finished && p.index >= 3).length;
  const withInsurer = progress.filter((p) => !p.finished && (p.index === 1 || p.index === 2)).length;
  const lodged = progress.filter((p) => !p.finished && p.index === 0).length;
  const open = claims.length - finished;

  return (
    <PayoutGauge
      hideEmpty
      centerValue={open === 0 ? "All done" : String(open)}
      centerLabel={open === 0 ? "every claim is complete" : open === 1 ? "claim in progress" : "claims in progress"}
      segments={[
        { key: "finished", label: "Finished", value: finished, strokeClass: "stroke-gray-200 dark:stroke-gray-700", swatchClass: "bg-gray-200 dark:bg-gray-700" },
        { key: "decision", label: "Decision & settlement", value: nearlyThere, strokeClass: "stroke-ink dark:stroke-white", swatchClass: "bg-ink dark:bg-white" },
        { key: "insurer", label: "With the insurer", value: withInsurer, strokeClass: "stroke-gray-400 dark:stroke-gray-500", swatchClass: "bg-gray-400 dark:bg-gray-500" },
      ]}
      pending={{ label: "Not yet with the insurer", value: lodged }}
    />
  );
}
