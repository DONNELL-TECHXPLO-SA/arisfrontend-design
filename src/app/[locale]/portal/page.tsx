"use client";

import ClaimsTable from "@/components/claims/ClaimsTable";
import ComponentCard from "@/components/common/ComponentCard";
import BrokerCard from "@/components/portal/BrokerCard";
import ClaimProgressRing from "@/components/portal/ClaimProgressRing";
import ClientStatusBadge from "@/components/portal/ClientStatusBadge";
import DashboardHero from "@/components/portal/DashboardHero";
import TodoList from "@/components/portal/TodoList";
import { useAuth } from "@/context/AuthContext";
import { Link } from "@/i18n/navigation";
import { claimProgress } from "@/lib/mock/clientJourney";
import { clientAttentionFor, findClient, findUser } from "@/lib/mock/helpers";
import { useData, useScopedClaims } from "@/lib/mock/store";
import { ChevronRight } from "lucide-react";

const viewAll = (
  <Link
    href="/portal/claims"
    className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3.5 py-2 text-theme-xs font-medium text-ink transition-colors hover:bg-gray-200 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
  >
    View all <ChevronRight className="size-3.5 rtl:rotate-180" />
  </Link>
);

// Client Portal dashboard — key figures, then the work that needs the client, where every
// claim stands, their latest claims and the broker to talk to.
export default function ClientDashboardPage() {
  const { currentUser } = useAuth();
  const { state } = useData();
  const claims = useScopedClaims(
    currentUser?.role ?? "client_primary",
    currentUser?.id ?? "",
    currentUser?.clientId,
  );
  // null until the user toggles a card — until then the most actionable claim stays open.
  const [expanded, setExpanded] = useState<Set<string> | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  if (!currentUser) return null;

  const client = findClient(state, currentUser.clientId);
  const broker = findUser(state, client?.brokerId);
  const todos = claims
    .map((claim) => ({ claimId: claim.id, reference: claim.reference, action: clientAttentionFor(claim, state.documents) }))
    .filter((t): t is { claimId: string; reference: string; action: string } => !!t.action);
  const recent = [...claims].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5);
  const complete = claims.filter((c) => claimProgress(c).finished).length;
  const open = claims.length - complete;
  const today = new Date().toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
      <DashboardHero
        eyebrow={today}
        title={`Welcome back, ${currentUser.name.split(" ")[0]}`}
        subtitle={client?.name ?? ""}
        metrics={[
          { label: "Open claims", value: open, hint: "In progress", href: "/portal/claims" },
          { label: "Needs your action", value: todos.length, hint: todos.length ? "Waiting on you" : "All caught up", emphasis: todos.length > 0 },
          { label: "Completed", value: complete, hint: "Closed or resolved" },
          { label: "Total lodged", value: claims.length, hint: "All time" },
        ]}
      />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <ComponentCard title="Needs your action" desc="Tasks only you can complete." flush className="lg:col-span-2">
          <TodoList items={todos} />
        </ComponentCard>
        <ComponentCard title="Claim progress" desc="Where your claims are in the process.">
          <ClaimProgressRing claims={claims} />
        </ComponentCard>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <ComponentCard title="Recent claims" action={viewAll} flush className="min-w-0 lg:col-span-2">
          <ClaimsTable
            claims={recent}
            showClientColumn={false}
            basePath="/portal/claims"
            framed={false}
            renderStatus={(c) => <ClientStatusBadge claim={c} />}
            emptyMessage="No claims yet."
          />
        </ComponentCard>
        <ComponentCard title="Your broker">
          <BrokerCard broker={broker} />
        </ComponentCard>
      </div>
    </div>
  );
}
