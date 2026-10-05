"use client";

import ClaimsSearchInput from "@/components/claims/ClaimsSearchInput";
import { applyClaimFilters, EMPTY_FILTERS } from "@/components/claims/claimFilters";
import ClaimAccordionList from "@/components/portal/ClaimAccordionList";
import Button from "@/components/ui/button/Button";
import { useAuth } from "@/context/AuthContext";
import { Link } from "@/i18n/navigation";
import { OVERALL_STAGES } from "@/lib/mock/status";
import { useData, useScopedClaims } from "@/lib/mock/store";
import { cn } from "@/utils";
import { Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

function ClientClaimsList({ initialQuery }: { initialQuery: string }) {
  const { currentUser } = useAuth();
  const { state } = useData();
  const claims = useScopedClaims(currentUser?.role ?? "client_primary", currentUser?.id ?? "", currentUser?.clientId);
  const [q, setQ] = useState(initialQuery);
  const [stage, setStage] = useState("");

  const results = useMemo(
    () => applyClaimFilters(state, claims, { ...EMPTY_FILTERS, q, stage }).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [state, claims, q, stage],
  );
  const stages = OVERALL_STAGES.map((s) => ({ key: s.key, label: s.label, count: claims.filter((c) => s.statuses.includes(c.status)).length })).filter(
    (s) => s.count > 0,
  );

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 items-center gap-4 pt-2 lg:grid-cols-[1fr_minmax(0,28rem)_1fr]">
        <div>
          <nav className="mb-2 flex items-center gap-1.5 text-theme-xs text-gray-400">
            <Link href="/portal" className="transition-colors hover:text-ink dark:hover:text-white">Home</Link>
            <span aria-hidden className="text-gray-300 dark:text-gray-600">/</span>
            <span className="text-gray-600 dark:text-gray-300">Claims</span>
          </nav>
          <h1 className="text-title-sm font-medium tracking-tight text-ink dark:text-white">My claims</h1>
        </div>
        <ClaimsSearchInput value={q} onChange={setQ} placeholder="Search your claims…" />
        <div className="flex lg:justify-end">
          <Link href="/portal/claims/new">
            <Button variant="brand" startIcon={<Plus className="size-4" />}>
              Lodge a claim
            </Button>
          </Link>
        </div>
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {[{ key: "", label: "All", count: claims.length }, ...stages].map((s) => (
          <button
            key={s.key || "all"}
            type="button"
            onClick={() => setStage(s.key)}
            aria-pressed={stage === s.key}
            className={cn(
              "inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full px-4 text-theme-sm font-medium shadow-card transition-colors",
              stage === s.key
                ? "bg-ink text-white dark:bg-white dark:text-ink"
                : "bg-white text-gray-600 hover:text-ink dark:bg-gray-900 dark:text-gray-300 dark:hover:text-white",
            )}
          >
            {s.label}
            <span className={cn("text-theme-xs", stage === s.key ? "opacity-70" : "text-gray-400")}>{s.count}</span>
          </button>
        ))}
      </div>

      <ClaimAccordionList
        claims={results}
        state={state}
        emptyMessage={claims.length === 0 ? "No claims yet." : "No claims match your search."}
      />
    </div>
  );
}

function FromUrl() {
  const q = useSearchParams().get("q") ?? "";
  return <ClientClaimsList key={q} initialQuery={q} />;
}

export default function ClientClaimsPage() {
  return (
    <Suspense fallback={null}>
      <FromUrl />
    </Suspense>
  );
}
