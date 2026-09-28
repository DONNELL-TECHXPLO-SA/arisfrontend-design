import type { Claim, ClaimStatus, Policy } from "@/lib/mock/types";

// ---- Payout status breakdown -------------------------------------------------------

// Terminal states with no payout still to come — excluded from the "active" portfolio.
const INACTIVE: ClaimStatus[] = ["closed", "not_taken_up", "repudiated", "within_excess"];

// Pipeline order, left → right on the gauge: furthest along first.
const PAYOUT_STAGES = {
  approved: ["settled", "awaiting_signed_aol", "awaiting_excess_invoice_and_pop", "awaiting_insurer_payment"],
  withInsurer: ["submitted_to_insurer", "under_assessment", "assessment_completed", "awaiting_insurer_decision", "disputed"],
  pending: ["partially_submitted", "submitted", "documents_outstanding"],
} satisfies Record<string, ClaimStatus[]>;

export interface PayoutBreakdown {
  active: number;
  approved: number;
  withInsurer: number;
  pending: number;
  /** Gross value of approved claims still waiting for the money to land. */
  approvedValue: number;
}

export function payoutBreakdown(claims: Claim[]): PayoutBreakdown {
  const active = claims.filter((c) => !INACTIVE.includes(c.status));
  const inStage = (stage: ClaimStatus[]) => active.filter((c) => stage.includes(c.status));
  const approved = inStage(PAYOUT_STAGES.approved);
  return {
    active: active.length,
    approved: approved.length,
    withInsurer: inStage(PAYOUT_STAGES.withInsurer).length,
    pending: inStage(PAYOUT_STAGES.pending).length,
    approvedValue: approved.reduce((sum, c) => sum + (c.grossAmount ?? 0), 0),
  };
}

// ---- Claims lodged per month -------------------------------------------------------

export interface MonthBucket {
  key: string; // "2026-09"
  label: string; // "Sep"
  longLabel: string; // "September 2026"
  count: number;
  isCurrent: boolean;
}

export function claimsPerMonth(claims: Claim[], now: Date, months = 6): MonthBucket[] {
  const buckets: MonthBucket[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    buckets.push({
      key,
      label: d.toLocaleString("en-ZA", { month: "short" }),
      longLabel: d.toLocaleString("en-ZA", { month: "long", year: "numeric" }),
      count: 0,
      isCurrent: i === 0,
    });
  }
  const byKey = new Map(buckets.map((b) => [b.key, b]));
  claims.forEach((c) => {
    const d = new Date(c.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const bucket = byKey.get(key);
    if (bucket) bucket.count += 1;
  });
  return buckets;
}

// ---- Loss ratio --------------------------------------------------------------------

export interface LossRatio {
  /** Incurred ÷ premium, 0–1+; null when there's no premium on file to divide by. */
  ratio: number | null;
  incurred: number;
  premium: number;
}

// Incurred = the agreed claim amount on every claim that has one (settled, awaiting payout,
// or paid and closed). Premium = annual premium of the policies in scope. Scope follows the
// viewer: a broker's own clients, or the whole book for managers/administrators.
export function lossRatio(claims: Claim[], policies: Policy[]): LossRatio {
  const incurred = claims
    .filter((c) => !["repudiated", "not_taken_up", "within_excess"].includes(c.status))
    .reduce((sum, c) => sum + (c.grossAmount ?? 0), 0);
  const premium = policies.reduce((sum, p) => sum + (p.annualPremium ?? 0), 0);
  return { ratio: premium > 0 ? incurred / premium : null, incurred, premium };
}

/** "R 234k", "R 1.2m" — for tile captions where the full figure would crowd the line. */
export function formatRandCompact(amount: number): string {
  if (amount >= 1_000_000) return `R ${(amount / 1_000_000).toFixed(1).replace(/\.0$/, "")}m`;
  if (amount >= 1_000) return `R ${Math.round(amount / 1_000)}k`;
  return `R ${amount}`;
}
