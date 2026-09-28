"use client";

import ClaimsTable from "@/components/claims/ClaimsTable";
import ComponentCard from "@/components/common/ComponentCard";
import BrokerQueueList from "@/components/dashboard/BrokerQueueList";
import ClientChipGrid from "@/components/dashboard/ClientChipGrid";
import DashboardGreeting from "@/components/dashboard/DashboardGreeting";
import DashboardInsights from "@/components/dashboard/DashboardInsights";
import { formatRandCompact, lossRatio } from "@/components/dashboard/chartData";
import StatTile from "@/components/dashboard/StatTile";
import Button from "@/components/ui/button/Button";
import { useAuth } from "@/context/AuthContext";
import { Link } from "@/i18n/navigation";
import { findClient, findUser, needsAttentionClaims, sortClaimsByAttention } from "@/lib/mock/helpers";
import { useData, useScopedClaims } from "@/lib/mock/store";
import type { Claim, Policy } from "@/lib/mock/types";
import { ArrowRight, Building2, FileStack, Percent, Plus, TriangleAlert, Users } from "lucide-react";

const TILE_ICON = "size-[18px]";

function ViewAllLink({ href, label = "View all" }: { href: string; label?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3.5 py-2 text-theme-xs font-medium text-ink transition-colors hover:bg-gray-200 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
    >
      {label}
      <ArrowRight className="size-3.5 rtl:rotate-180" />
    </Link>
  );
}

const openCount = (claims: Claim[]) => claims.filter((c) => c.status !== "closed").length;

function OpenClaimsTile({ claims }: { claims: Claim[] }) {
  return (
    <StatTile
      featured
      href="/claims"
      label="Open claims"
      value={openCount(claims)}
      icon={<FileStack className={TILE_ICON} strokeWidth={1.75} />}
      caption={`of ${claims.length} lodged`}
    />
  );
}

function NeedsAttentionTile({ count, caption }: { count: number; caption: string }) {
  return (
    <StatTile
      href="/claims"
      label="Needs attention"
      value={count}
      icon={<TriangleAlert className={TILE_ICON} strokeWidth={1.75} />}
      caption={caption}
    />
  );
}

// Loss ratio = incurred claims ÷ annual premium for the policies in the viewer's scope.
function LossRatioTile({ claims, policies }: { claims: Claim[]; policies: Policy[] }) {
  const lr = lossRatio(claims, policies);
  return (
    <StatTile
      label="Loss ratio"
      value={lr.ratio === null ? "—" : `${Math.round(lr.ratio * 100)}%`}
      icon={<Percent className={TILE_ICON} strokeWidth={1.75} />}
      caption={
        lr.ratio === null
          ? "no premium on file"
          : `${formatRandCompact(lr.incurred)} claims on ${formatRandCompact(lr.premium)} premium`
      }
    />
  );
}

// ux-blueprint.md §13 — role-varying dashboards. Tiles are live, actionable counts; the two
// insight charts (claims per month, payout status) were added at the client's request and
// deviate from §13.4's "no charts on the dashboard" guidance — each carries a written insight.
export default function AdminDashboardPage() {
  const { currentUser } = useAuth();
  const { state } = useData();
  const role = currentUser?.role ?? "broker";
  const ownClaims = useScopedClaims(role, currentUser?.id ?? "", currentUser?.clientId);

  if (!currentUser) return null;
  const firstName = currentUser.name.split(" ")[0];

  if (role === "administrator") {
    const attention = needsAttentionClaims(state.claims);
    return (
      <div className="space-y-6">
        <DashboardGreeting firstName={firstName} subtitle="Cross-broker overview — unscoped, every client.">
          <Link href="/users">
            <Button size="sm" variant="outline">Users &amp; Access</Button>
          </Link>
          <Link href="/claims/new">
            <Button size="sm" startIcon={<Plus className="size-4" />}>New claim</Button>
          </Link>
        </DashboardGreeting>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4 [&>*:first-child]:col-span-2 xl:[&>*:first-child]:col-span-1">
          <OpenClaimsTile claims={state.claims} />
          <NeedsAttentionTile count={attention.length} caption="claims waiting on someone" />
          <LossRatioTile claims={state.claims} policies={state.policies} />
          <StatTile
            href="/clients"
            label="Clients on file"
            value={state.clients.length}
            icon={<Building2 className={TILE_ICON} strokeWidth={1.75} />}
            caption="across every broker"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { href: "/users", label: "Users & Access" },
            { href: "/settings/products", label: "Product & Document Configuration" },
            { href: "/settings/company", label: "Company & Report Settings" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-theme-sm font-medium text-ink shadow-card transition-colors hover:bg-ink hover:text-white dark:bg-gray-900 dark:text-white dark:hover:bg-white dark:hover:text-ink"
            >
              {l.label}
              <ArrowRight className="size-3.5 rtl:rotate-180" />
            </Link>
          ))}
        </div>

        <DashboardInsights claims={state.claims} />

        <ComponentCard title="Needs attention" desc="Oldest first — clear these before anything else." action={<ViewAllLink href="/claims" />}>
          <ClaimsTable claims={attention} showBrokerColumn emptyMessage="Nothing currently needs attention." />
        </ComponentCard>
      </div>
    );
  }

  if (role === "manager") {
    const attention = needsAttentionClaims(state.claims);
    const byBroker = new Map<string, number>();
    attention.forEach((c) => byBroker.set(c.brokerId, (byBroker.get(c.brokerId) ?? 0) + 1));
    const rows = [...byBroker.entries()]
      .map(([id, count]) => ({ id, name: findUser(state, id)?.name ?? "Unassigned", count }))
      .sort((a, b) => b.count - a.count);

    return (
      <div className="space-y-6">
        <DashboardGreeting firstName={firstName} subtitle="Portfolio-level exception view, across every broker.">
          <Link href="/reports">
            <Button size="sm" variant="outline">Generate report</Button>
          </Link>
          <Link href="/claims">
            <Button size="sm">All claims</Button>
          </Link>
        </DashboardGreeting>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4 [&>*:first-child]:col-span-2 xl:[&>*:first-child]:col-span-1">
          <OpenClaimsTile claims={state.claims} />
          <NeedsAttentionTile count={attention.length} caption="across all brokers" />
          <LossRatioTile claims={state.claims} policies={state.policies} />
          <StatTile
            label="Brokers with a backlog"
            value={rows.length}
            icon={<Users className={TILE_ICON} strokeWidth={1.75} />}
            caption="have claims waiting"
          />
        </div>

        <DashboardInsights claims={state.claims} />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <ComponentCard title="Which queue needs stepping in?" desc="Relative to the busiest broker." className="xl:col-span-1">
            <BrokerQueueList rows={rows} />
          </ComponentCard>
          <ComponentCard title="Needs attention" desc="All brokers, oldest first." action={<ViewAllLink href="/claims" />} className="min-w-0 xl:col-span-2">
            <ClaimsTable claims={attention} showBrokerColumn emptyMessage="Nothing currently needs attention." />
          </ComponentCard>
        </div>
      </div>
    );
  }

  // Broker: the dashboard IS the sorted claims queue (§13.3).
  const sorted = sortClaimsByAttention(ownClaims);
  const attention = needsAttentionClaims(ownClaims);
  const clientIds = [...new Set(ownClaims.map((c) => c.clientId))];
  const clients = clientIds.map((cid) => ({
    id: cid,
    name: findClient(state, cid)?.name ?? "Client",
    claimCount: ownClaims.filter((c) => c.clientId === cid).length,
  }));

  return (
    <div className="space-y-6">
      <DashboardGreeting firstName={firstName} subtitle="Your claims, sorted by what needs action.">
        <Link href="/claims">
          <Button size="sm" variant="outline">My claims</Button>
        </Link>
        <Link href="/claims/new">
          <Button size="sm" startIcon={<Plus className="size-4" />}>New claim</Button>
        </Link>
      </DashboardGreeting>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4 [&>*:first-child]:col-span-2 xl:[&>*:first-child]:col-span-1">
        <OpenClaimsTile claims={ownClaims} />
        <NeedsAttentionTile count={attention.length} caption="start with the oldest" />
        <LossRatioTile
          claims={ownClaims}
          policies={state.policies.filter((p) => state.clients.some((c) => c.id === p.clientId && c.brokerId === currentUser.id))}
        />
        <StatTile
          href="/clients"
          label="Assigned clients"
          value={clientIds.length}
          icon={<Building2 className={TILE_ICON} strokeWidth={1.75} />}
          caption="with claims on file"
        />
      </div>

      <DashboardInsights claims={ownClaims} />

      <ComponentCard title="Assigned clients">
        <ClientChipGrid clients={clients} />
      </ComponentCard>

      <ComponentCard title="My claims" desc="Sorted by what needs action." action={<ViewAllLink href="/claims" />}>
        <ClaimsTable claims={sorted} emptyMessage="No claims assigned to you yet." />
      </ComponentCard>
    </div>
  );
}
