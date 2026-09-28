import { findClient, findSection, findUser, needsAttentionClaims } from "@/lib/mock/helpers";
import { OVERALL_STAGES, statusLabel } from "@/lib/mock/status";
import type { Claim, MockState } from "@/lib/mock/types";

export interface ClaimFilters {
  q: string;
  stage: string; // OVERALL_STAGES key, or ""
  insurer: string;
  clientId: string;
  brokerId: string;
  needsAttention: boolean;
  lateOnly: boolean;
}

export const EMPTY_FILTERS: ClaimFilters = {
  q: "",
  stage: "",
  insurer: "",
  clientId: "",
  brokerId: "",
  needsAttention: false,
  lateOnly: false,
};

export function activeFilterCount(f: ClaimFilters): number {
  return [f.q.trim(), f.stage, f.insurer, f.clientId, f.brokerId, f.needsAttention, f.lateOnly].filter(Boolean).length;
}

/** Everything a person might type to find a claim — reference, client, insurer, type, broker, status, insurer claim no., location. */
function haystack(state: MockState, c: Claim): string {
  return [
    c.reference,
    findClient(state, c.clientId)?.name,
    findSection(state, c.sectionId)?.insurer,
    c.claimType,
    findUser(state, c.brokerId)?.name,
    statusLabel(c.status),
    c.insurerClaimNo,
    c.location,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function applyClaimFilters(state: MockState, claims: Claim[], f: ClaimFilters): Claim[] {
  const terms = f.q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const stage = OVERALL_STAGES.find((s) => s.key === f.stage);
  const attention = f.needsAttention ? new Set(needsAttentionClaims(claims).map((c) => c.id)) : null;

  return claims.filter((c) => {
    if (stage && !stage.statuses.includes(c.status)) return false;
    if (f.insurer && findSection(state, c.sectionId)?.insurer !== f.insurer) return false;
    if (f.clientId && c.clientId !== f.clientId) return false;
    if (f.brokerId && c.brokerId !== f.brokerId) return false;
    if (f.lateOnly && !c.lateReported) return false;
    if (attention && !attention.has(c.id)) return false;
    if (terms.length) {
      const text = haystack(state, c);
      if (!terms.every((t) => text.includes(t))) return false;
    }
    return true;
  });
}

/** Filter options drawn from the claims actually in scope — no empty choices. */
export function filterOptions(state: MockState, claims: Claim[]) {
  const insurers = [...new Set(claims.map((c) => findSection(state, c.sectionId)?.insurer).filter(Boolean) as string[])].sort();
  const clients = [...new Set(claims.map((c) => c.clientId))]
    .map((id) => ({ value: id, label: findClient(state, id)?.name ?? id }))
    .sort((a, b) => a.label.localeCompare(b.label));
  const brokers = [...new Set(claims.map((c) => c.brokerId))]
    .map((id) => ({ value: id, label: findUser(state, id)?.name ?? id }))
    .sort((a, b) => a.label.localeCompare(b.label));
  const stages = OVERALL_STAGES.map((s) => ({
    value: s.key,
    label: s.label,
    count: claims.filter((c) => s.statuses.includes(c.status)).length,
  }));
  return { insurers, clients, brokers, stages };
}
