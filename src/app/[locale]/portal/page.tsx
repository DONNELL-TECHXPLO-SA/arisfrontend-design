"use client";

import ClientClaimCard from "@/components/claims/ClientClaimCard";
import Button from "@/components/ui/button/Button";
import { useAuth } from "@/context/AuthContext";
import { Link } from "@/i18n/navigation";
import { AlertIcon, CheckCircleIcon, PlusIcon } from "@/icons";
import { clientAttentionFor } from "@/lib/mock/helpers";
import { useData, useScopedClaims } from "@/lib/mock/store";

// Client Portal dashboard — ux-blueprint.md §13.5: reminder banner at the top (the
// prototype's only surface for the background Notifications engine, per §1.6), then
// the org's claims list as cards. No count tiles, no filters, no portfolio framing —
// a client org's claim volume is low enough that a plain list is the entire dashboard.
export default function ClientDashboardPage() {
  const { currentUser } = useAuth();
  const { state } = useData();
  const claims = useScopedClaims(currentUser?.role ?? "client_primary", currentUser?.id ?? "", currentUser?.clientId);

  if (!currentUser) return null;

  const attentionClaims = claims
    .map((claim) => ({ claim, attention: clientAttentionFor(claim, state.documents) }))
    .filter((x): x is { claim: (typeof claims)[number]; attention: string } => !!x.attention);

  const sorted = [...claims].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">My Claims</h1>
          <p className="text-theme-sm text-gray-500 dark:text-gray-400">{currentUser.name}</p>
        </div>
        <Link href="/portal/claims/new">
          <Button size="sm" startIcon={<PlusIcon className="size-4" />}>
            New Claim
          </Button>
        </Link>
      </div>

      {claims.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center dark:border-gray-700 dark:bg-white/3">
          <p className="text-theme-sm font-medium text-gray-700 dark:text-gray-300">No claims yet</p>
          <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
            When you need to report a loss, submitting your first claim only takes a few minutes.
          </p>
          <Link href="/portal/claims/new" className="mt-4 inline-block">
            <Button size="sm">Submit your first claim</Button>
          </Link>
        </div>
      ) : attentionClaims.length > 0 ? (
        <div className="rounded-2xl border border-warning-200 bg-warning-50 p-4 dark:border-warning-500/30 dark:bg-warning-500/10">
          <div className="flex items-start gap-3">
            <AlertIcon className="mt-0.5 size-5 shrink-0 text-warning-500" />
            <div className="space-y-2">
              <p className="text-theme-sm font-semibold text-warning-700 dark:text-warning-400">Needs your attention</p>
              <ul className="space-y-1.5">
                {attentionClaims.map(({ claim, attention }) => (
                  <li key={claim.id}>
                    <Link href={`/portal/claims/${claim.id}`} className="text-theme-sm text-warning-700 underline hover:no-underline dark:text-warning-300">
                      {claim.reference}: {attention}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-2xl border border-success-200 bg-success-50 p-4 dark:border-success-500/30 dark:bg-success-500/10">
          <CheckCircleIcon className="size-5 shrink-0 text-success-500" />
          <p className="text-theme-sm font-medium text-success-700 dark:text-success-400">Nothing needs your attention right now.</p>
        </div>
      )}

      <div className="space-y-3">
        {sorted.map((claim) => (
          <ClientClaimCard key={claim.id} claim={claim} documents={state.documents} />
        ))}
      </div>
    </div>
  );
}
