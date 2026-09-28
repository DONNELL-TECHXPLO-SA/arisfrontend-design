"use client";

import ComponentCard from "@/components/common/ComponentCard";
import { formatCurrency } from "@/lib/mock/helpers";
import type { Claim } from "@/lib/mock/types";
import { claimsPerMonth, payoutBreakdown } from "./chartData";
import ClaimsPerMonthChart from "./ClaimsPerMonthChart";
import PayoutGauge from "./PayoutGauge";

function DeltaChip({ current, previous, previousLabel }: { current: number; previous: number; previousLabel: string }) {
  const diff = current - previous;
  const text = diff === 0 ? `Level with ${previousLabel}` : `${diff > 0 ? "+" : "−"}${Math.abs(diff)} vs ${previousLabel}`;
  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1.5 text-theme-xs font-medium text-ink dark:bg-white/5 dark:text-white">
      {text}
    </span>
  );
}

// Two insight charts for the internal dashboards. Scope comes from the caller — a broker
// passes their own book, managers/administrators pass everything.
export default function DashboardInsights({ claims }: { claims: Claim[] }) {
  const months = claimsPerMonth(claims, new Date());
  const current = months[months.length - 1];
  const previous = months[months.length - 2];
  const totalPeriod = months.reduce((s, m) => s + m.count, 0);
  const average = totalPeriod / months.length;

  const payout = payoutBreakdown(claims);
  const approvedPct = payout.active ? Math.round((payout.approved / payout.active) * 100) : 0;

  const monthInsight =
    current.count > average
      ? `${current.count} this month — above the ${average.toFixed(1)}/month average.`
      : `${totalPeriod} lodged over six months, averaging ${average.toFixed(1)} a month.`;

  const payoutInsight = payout.active
    ? payout.approvedValue > 0
      ? `${formatCurrency(payout.approvedValue)} approved and waiting to be paid out.`
      : `${payout.pending} of ${payout.active} active claims haven't reached the insurer yet.`
    : "No active claims in this portfolio.";

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
      <ComponentCard
        title="Claims lodged per month"
        desc={monthInsight}
        action={previous && <DeltaChip current={current.count} previous={previous.count} previousLabel={previous.label} />}
        className="min-w-0 xl:col-span-3"
      >
        <ClaimsPerMonthChart months={months} />
      </ComponentCard>

      <ComponentCard
        title="Payout status breakdown"
        desc={`Operational status across ${payout.active} active claim${payout.active === 1 ? "" : "s"}. ${payoutInsight}`}
        className="min-w-0 xl:col-span-2"
      >
        <PayoutGauge
          centerValue={`${approvedPct}%`}
          centerLabel="approved for payout"
          segments={[
            { key: "approved", label: "Approved, awaiting payout", value: payout.approved, strokeClass: "stroke-brand-500", swatchClass: "bg-brand-500" },
            { key: "insurer", label: "With insurer", value: payout.withInsurer, strokeClass: "stroke-ink dark:stroke-white", swatchClass: "bg-ink dark:bg-white" },
          ]}
          pending={{ label: "Not yet with insurer", value: payout.pending }}
        />
      </ComponentCard>
    </div>
  );
}
