"use client";

import ClaimsTable from "@/components/claims/ClaimsTable";
import ComponentCard from "@/components/common/ComponentCard";
import DashboardGreeting from "@/components/dashboard/DashboardGreeting";
import StatTile from "@/components/dashboard/StatTile";
import BrokerCard from "@/components/portal/BrokerCard";
import TodoList from "@/components/portal/TodoList";
import Button from "@/components/ui/button/Button";
import { useAuth } from "@/context/AuthContext";
import { Link } from "@/i18n/navigation";
import { clientAttentionFor, findClient, findUser } from "@/lib/mock/helpers";
import { useData, useScopedClaims } from "@/lib/mock/store";
import { ArrowRight, FileStack, ListChecks, Plus } from "lucide-react";

const TILE_ICON = "size-[18px]";

// Client Portal home — same layout language as the internal dashboard, kept deliberately
// quiet: two numbers, what needs doing, who to talk to, latest claims.
export default function ClientDashboardPage() {
  const { currentUser } = useAuth();
  const { state } = useData();
  const claims = useScopedClaims(currentUser?.role ?? "client_primary", currentUser?.id ?? "", currentUser?.clientId);

  if (!currentUser) return null;

  const client = findClient(state, currentUser.clientId);
  const broker = findUser(state, client?.brokerId);
  const openClaims = claims.filter((c) => c.status !== "closed");
  const todos = claims
    .map((claim) => ({ claimId: claim.id, reference: claim.reference, action: clientAttentionFor(claim, state.documents) }))
    .filter((t): t is { claimId: string; reference: string; action: string } => !!t.action);
  const recent = [...claims].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5);

  return (
    <div className="space-y-6">
      <DashboardGreeting firstName={currentUser.name.split(" ")[0]} subtitle={client?.name ?? ""}>
        <Link href="/portal/claims/new">
          <Button variant="brand" startIcon={<Plus className="size-4" />}>
            Lodge a claim
          </Button>
        </Link>
      </DashboardGreeting>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <StatTile
          featured
          href="/portal/claims"
          label="Open claims"
          value={openClaims.length}
          icon={<FileStack className={TILE_ICON} strokeWidth={1.75} />}
          caption={`of ${claims.length} lodged`}
        />
        <StatTile label="To do" value={todos.length} icon={<ListChecks className={TILE_ICON} strokeWidth={1.75} />} caption="need your input" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ComponentCard title="Next steps" className="lg:col-span-2">
          <TodoList items={todos} />
        </ComponentCard>
        <ComponentCard title="Your broker">
          <BrokerCard broker={broker} />
        </ComponentCard>
      </div>

      <ComponentCard
        title="Recent claims"
        action={
          <Link
            href="/portal/claims"
            className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3.5 py-2 text-theme-xs font-medium text-ink transition-colors hover:bg-gray-200 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          >
            View all <ArrowRight className="size-3.5 rtl:rotate-180" />
          </Link>
        }
      >
        <ClaimsTable claims={recent} showClientColumn={false} basePath="/portal/claims" emptyMessage="No claims yet." />
      </ComponentCard>
    </div>
  );
}
