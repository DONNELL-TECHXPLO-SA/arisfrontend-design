"use client";

import ClientClaimCard from "@/components/claims/ClientClaimCard";
import Button from "@/components/ui/button/Button";
import { useAuth } from "@/context/AuthContext";
import { Link } from "@/i18n/navigation";
import { PlusIcon } from "@/icons";
import { clientStageNote, clientStageOf } from "@/lib/mock/clientStatus";
import { findClient } from "@/lib/mock/helpers";
import { useData, useScopedClaims } from "@/lib/mock/store";
import type { Claim, MockState } from "@/lib/mock/types";
import { useState } from "react";

// The claim the client most needs to act on — opened by default so the full stage view
// is visible on arrival. Outstanding documents win; then any other claim waiting on the
// client; otherwise nothing is expanded.
function mostActionableClaim(state: MockState, claims: Claim[]): Claim | undefined {
  const blocking = claims.filter((c) => clientStageNote(state, c).blocking);
  return blocking.find((c) => clientStageOf(c.status) === "documents_outstanding") ?? blocking[0];
}

// User Portal home — UC-03 Track Claim Status. The org's claims, most recently lodged
// first, each showing the client-facing status the Broker last set. Only claims linked
// to the signed-in user's own organisation are ever listed (useScopedClaims).
export default function ClientDashboardPage() {
  const { currentUser } = useAuth();
  const { state } = useData();
  const claims = useScopedClaims(currentUser?.role ?? "client_primary", currentUser?.id ?? "", currentUser?.clientId);
  // null until the user toggles a card — until then the most actionable claim stays open.
  const [expanded, setExpanded] = useState<Set<string> | null>(null);

  if (!currentUser) return null;

  const org = findClient(state, currentUser.clientId);
  const sorted = [...claims].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const defaultOpen = mostActionableClaim(state, sorted);
  const openIds = expanded ?? new Set(defaultOpen ? [defaultOpen.id] : []);

  const toggle = (id: string) => {
    const next = new Set(openIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpanded(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-title-sm font-semibold tracking-tight text-gray-900 dark:text-white/90">My Claims</h1>
          <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
            {org?.name} · {claims.length} {claims.length === 1 ? "claim" : "claims"} on file
          </p>
        </div>
        <Link href="/portal/claims/new">
          <Button size="sm" startIcon={<PlusIcon className="size-4" />}>
            Lodge a Claim
          </Button>
        </Link>
      </div>

      {claims.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center dark:border-gray-700 dark:bg-white/3">
          <p className="text-theme-sm font-medium text-gray-700 dark:text-gray-300">No claims yet</p>
          <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
            When you need to report a loss, lodging your first claim only takes a few minutes.
          </p>
          <Link href="/portal/claims/new" className="mt-4 inline-block">
            <Button size="sm">Lodge your first claim</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((claim) => (
            <ClientClaimCard key={claim.id} claim={claim} expanded={openIds.has(claim.id)} onToggle={() => toggle(claim.id)} />
          ))}
        </div>
      )}

      <p className="text-center text-theme-xs text-gray-400 dark:text-gray-500">
        Statuses are updated by your broker as your claim progresses.{" "}
        <Link href="/portal/contact" className="font-medium text-gray-600 underline underline-offset-2 hover:text-gray-800 dark:text-gray-300">
          Questions? Contact your broker
        </Link>
      </p>
    </div>
  );
}
