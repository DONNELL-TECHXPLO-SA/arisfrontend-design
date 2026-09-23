"use client";

import ClaimsTable from "@/components/claims/ClaimsTable";
import ComponentCard from "@/components/common/ComponentCard";
import { useAuth } from "@/context/AuthContext";
import { Link } from "@/i18n/navigation";
import { findClient, findUser, needsAttentionClaims, sortClaimsByAttention } from "@/lib/mock/helpers";
import { useData, useScopedClaims } from "@/lib/mock/store";

// ux-blueprint.md §13 — role-varying dashboards. Deliberately no charts/vanity metrics
// (§13.4: "if a number can only be produced by running a report, it's report content,
// not dashboard content") — every tile here is a live, actionable filter/count.
export default function AdminDashboardPage() {
  const { currentUser } = useAuth();
  const { state } = useData();
  const role = currentUser?.role ?? "broker";
  const ownClaims = useScopedClaims(role, currentUser?.id ?? "", currentUser?.clientId);

  if (!currentUser) return null;

  if (role === "administrator") {
    const attention = needsAttentionClaims(state.claims);
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">Welcome back, {currentUser.name.split(" ")[0]}</h1>
          <p className="text-theme-sm text-gray-500 dark:text-gray-400">Cross-broker overview — unscoped, every client.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link href="/claims" className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-brand-300 dark:border-gray-800 dark:bg-white/3">
            <p className="text-title-sm font-semibold text-gray-800 dark:text-white/90">{attention.length}</p>
            <p className="text-theme-sm text-gray-500 dark:text-gray-400">Claims needing attention</p>
          </Link>
          <Link href="/claims" className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-brand-300 dark:border-gray-800 dark:bg-white/3">
            <p className="text-title-sm font-semibold text-gray-800 dark:text-white/90">{state.claims.filter((c) => c.lateReported).length}</p>
            <p className="text-theme-sm text-gray-500 dark:text-gray-400">Late-reported claims</p>
          </Link>
          <Link href="/clients" className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-brand-300 dark:border-gray-800 dark:bg-white/3">
            <p className="text-title-sm font-semibold text-gray-800 dark:text-white/90">{state.clients.length}</p>
            <p className="text-theme-sm text-gray-500 dark:text-gray-400">Clients on file</p>
          </Link>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/users" className="text-theme-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400">Users &amp; Access →</Link>
          <Link href="/settings/products" className="text-theme-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400">Product &amp; Document Configuration →</Link>
          <Link href="/settings/company" className="text-theme-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400">Company &amp; Report Settings →</Link>
        </div>
        <ComponentCard title="Needs Attention">
          <ClaimsTable claims={attention} showBrokerColumn emptyMessage="Nothing currently needs attention." />
        </ComponentCard>
      </div>
    );
  }

  if (role === "manager") {
    const attention = needsAttentionClaims(state.claims);
    const byBroker = new Map<string, number>();
    attention.forEach((c) => byBroker.set(c.brokerId, (byBroker.get(c.brokerId) ?? 0) + 1));
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">Welcome back, {currentUser.name.split(" ")[0]}</h1>
          <p className="text-theme-sm text-gray-500 dark:text-gray-400">Portfolio-level exception view, across every Broker.</p>
        </div>
        <ComponentCard title="Which Broker's queue needs stepping in?">
          <ul className="space-y-2">
            {[...byBroker.entries()].map(([brokerId, count]) => (
              <li key={brokerId} className="flex items-center justify-between">
                <span className="text-theme-sm text-gray-700 dark:text-gray-300">{findUser(state, brokerId)?.name}</span>
                <span className="text-theme-sm font-medium text-warning-600 dark:text-warning-400">{count} needing attention</span>
              </li>
            ))}
            {byBroker.size === 0 && <li className="text-theme-sm text-gray-400">No claims currently need attention.</li>}
          </ul>
        </ComponentCard>
        <ComponentCard title="Needs Attention (all brokers)">
          <ClaimsTable claims={attention} showBrokerColumn emptyMessage="Nothing currently needs attention." />
        </ComponentCard>
      </div>
    );
  }

  // Broker: the dashboard IS the sorted claims queue (§13.3).
  const sorted = sortClaimsByAttention(ownClaims);
  const attention = needsAttentionClaims(ownClaims);
  // eslint-disable-next-line react-hooks/purity -- a dashboard tile snapshotting "now" for a display count is fine outside the compiler
  const lateThisWeek = ownClaims.filter((c) => c.lateReported && Date.now() - new Date(c.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000).length;
  const clientIds = [...new Set(ownClaims.map((c) => c.clientId))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">Welcome back, {currentUser.name.split(" ")[0]}</h1>
        <p className="text-theme-sm text-gray-500 dark:text-gray-400">Your claims, sorted by what needs action.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <p className="text-title-sm font-semibold text-gray-800 dark:text-white/90">{attention.length}</p>
          <p className="text-theme-sm text-gray-500 dark:text-gray-400">Claims need action</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <p className="text-title-sm font-semibold text-gray-800 dark:text-white/90">{lateThisWeek}</p>
          <p className="text-theme-sm text-gray-500 dark:text-gray-400">Late-reported this week</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <p className="text-title-sm font-semibold text-gray-800 dark:text-white/90">{clientIds.length}</p>
          <p className="text-theme-sm text-gray-500 dark:text-gray-400">Assigned clients</p>
        </div>
      </div>
      <ComponentCard title="Assigned Clients">
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {clientIds.map((cid) => {
            const client = findClient(state, cid);
            const count = ownClaims.filter((c) => c.clientId === cid).length;
            return (
              <li key={cid}>
                <Link href={`/clients/${cid}`} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2 text-theme-sm hover:border-brand-300 dark:border-white/10">
                  <span className="text-gray-700 dark:text-gray-300">{client?.name}</span>
                  <span className="text-gray-400">{count} claims</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </ComponentCard>
      <ComponentCard title="My Claims">
        <ClaimsTable claims={sorted} emptyMessage="No claims assigned to you yet." />
      </ComponentCard>
    </div>
  );
}
