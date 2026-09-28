"use client";

import ClaimsFilterBar from "@/components/claims/ClaimsFilterBar";
import ClaimsSearchInput from "@/components/claims/ClaimsSearchInput";
import ClaimsTable from "@/components/claims/ClaimsTable";
import { activeFilterCount, applyClaimFilters, EMPTY_FILTERS, filterOptions, type ClaimFilters } from "@/components/claims/claimFilters";
import Button from "@/components/ui/button/Button";
import { useAuth } from "@/context/AuthContext";
import { Link } from "@/i18n/navigation";
import { sortClaimsByAttention } from "@/lib/mock/helpers";
import { useData, useScopedClaims } from "@/lib/mock/store";
import { Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

// Admin Portal Claims List — ux-blueprint.md §5.2/§13.3: sorted by what needs
// attention, not a flat alphabetical list. Scoped per §3.3 (Broker = own clients only;
// Manager/Administrator = everyone, unscoped). Search + filters narrow within that scope.
function ClaimsList({ initialQuery }: { initialQuery: string }) {
  const { currentUser } = useAuth();
  const { state } = useData();
  const role = currentUser?.role ?? "broker";
  const claims = useScopedClaims(role, currentUser?.id ?? "", currentUser?.clientId);
  const canLodge = role === "broker" || role === "administrator";

  const [filters, setFilters] = useState<ClaimFilters>({ ...EMPTY_FILTERS, q: initialQuery });
  const options = useMemo(() => filterOptions(state, claims), [state, claims]);
  const results = useMemo(() => sortClaimsByAttention(applyClaimFilters(state, claims, filters)), [state, claims, filters]);
  const activeCount = activeFilterCount(filters);

  const update = (patch: Partial<ClaimFilters>) => setFilters((f) => ({ ...f, ...patch }));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 items-center gap-4 pt-2 lg:grid-cols-[1fr_minmax(0,28rem)_1fr]">
        <div>
          <nav className="mb-2 flex items-center gap-1.5 text-theme-xs text-gray-400">
            <Link href="/" className="transition-colors hover:text-ink dark:hover:text-white">Home</Link>
            <span aria-hidden className="text-gray-300 dark:text-gray-600">/</span>
            <span className="text-gray-600 dark:text-gray-300">Claims</span>
          </nav>
          <h1 className="text-title-sm font-medium tracking-tight text-ink dark:text-white">Claims</h1>
        </div>

        <ClaimsSearchInput
          value={filters.q}
          onChange={(q) => update({ q })}
          placeholder="Search reference, client, insurer, broker…"
        />

        <div className="flex lg:justify-end">
          {canLodge && (
            <Link href="/claims/new">
              <Button startIcon={<Plus className="size-4" />}>New claim</Button>
            </Link>
          )}
        </div>
      </div>

      <p className="text-theme-sm text-gray-500 dark:text-gray-400">
        {role === "broker" ? "Your assigned clients' claims" : "All claims, across every client"}, sorted by what needs attention.
      </p>

      <ClaimsFilterBar
        filters={filters}
        onChange={update}
        onClear={() => setFilters(EMPTY_FILTERS)}
        options={options}
        showBrokerFilter={role !== "broker"}
        resultCount={results.length}
        totalCount={claims.length}
        activeCount={activeCount}
      />

      <ClaimsTable
        claims={results}
        showBrokerColumn={role !== "broker"}
        emptyMessage={
          claims.length === 0
            ? role === "broker"
              ? "None of your assigned clients have any claims yet."
              : "No claims have been lodged yet."
            : "No claims match your search and filters."
        }
      />
    </div>
  );
}

function ClaimsListFromUrl() {
  const q = useSearchParams().get("q") ?? "";
  // Keyed on the query so a new search from the header search box re-seeds the list.
  return <ClaimsList key={q} initialQuery={q} />;
}

export default function AdminClaimsListPage() {
  return (
    <Suspense fallback={null}>
      <ClaimsListFromUrl />
    </Suspense>
  );
}
