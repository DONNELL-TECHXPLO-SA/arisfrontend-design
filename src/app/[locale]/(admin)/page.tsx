"use client";

import ClaimsTable from "@/components/claims/ClaimsTable";
import ComponentCard from "@/components/common/ComponentCard";
import StatCard from "@/components/common/StatCard";
import ClaimsActivityCharts from "@/components/dashboard/ClaimsActivityCharts";
import Button from "@/components/ui/button/Button";
import { useAuth } from "@/context/AuthContext";
import { Link } from "@/i18n/navigation";
import { findClient, findUser, needsAttentionClaims, sortClaimsByAttention } from "@/lib/mock/helpers";
import { useData, useScopedClaims } from "@/lib/mock/store";
import { Boxes, Building2, ChevronRight, Clock, Plus, Settings2, ShieldCheck, TriangleAlert, Users } from "lucide-react";

const ICON = "size-[18px]";

function DashboardHeader({ name, subtitle, showNewClaim = true }: { name: string; subtitle: string; showNewClaim?: boolean }) {
  const today = new Date().toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 pt-2">
      <div>
        <p className="text-theme-xs font-medium tracking-[0.12em] text-gray-400 uppercase">{today}</p>
        <h1 className="mt-2 text-title-sm font-medium tracking-tight text-ink sm:text-title-md dark:text-white">Welcome back, {name.split(" ")[0]}</h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">{subtitle}</p>
      </div>
      {showNewClaim && (
        <Link href="/claims/new">
          <Button startIcon={<Plus className="size-4" />}>New claim</Button>
        </Link>
      )}
    </div>
  );
}

const viewAll = (
  <Link
    href="/claims"
    className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3.5 py-2 text-theme-xs font-medium text-ink transition-colors hover:bg-gray-200 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
  >
    View all claims <ChevronRight className="size-3.5 rtl:rotate-180" />
  </Link>
);

// ux-blueprint.md §13 — role-varying dashboards. Stat cards are live, actionable counts;
// the administrator also gets the claims-activity charts (added at the client's request).
export default function AdminDashboardPage() {
  const { currentUser } = useAuth();
  const { state } = useData();
  const role = currentUser?.role ?? "broker";
  const ownClaims = useScopedClaims(role, currentUser?.id ?? "", currentUser?.clientId);

  if (!currentUser) return null;

  if (role === "administrator") {
    const attention = needsAttentionClaims(state.claims);
    const adminLinks = [
      { href: "/users", label: "Users & Access", desc: "Accounts, roles and MFA", icon: <ShieldCheck className={ICON} strokeWidth={1.75} /> },
      { href: "/settings/products", label: "Product & Document Configuration", desc: "Insurer forms and checklists", icon: <Boxes className={ICON} strokeWidth={1.75} /> },
      { href: "/settings/company", label: "Company & Report Settings", desc: "Branding, statuses, reminders", icon: <Settings2 className={ICON} strokeWidth={1.75} /> },
    ];
    return (
      <div className="space-y-6">
        <DashboardHeader name={currentUser.name} subtitle="Cross-broker overview across every client." showNewClaim={false} />
        <ClaimsActivityCharts state={state} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Claims needing attention" value={attention.length} hint="Across all brokers" icon={<TriangleAlert className={ICON} strokeWidth={1.75} />} tone="attention" href="/claims" />
          <StatCard label="Late-reported claims" value={state.claims.filter((c) => c.lateReported).length} hint="Reported 30+ days after loss" icon={<Clock className={ICON} strokeWidth={1.75} />} href="/claims" />
          <StatCard label="Clients on file" value={state.clients.length} hint={`${state.policies.length} active policies`} icon={<Building2 className={ICON} strokeWidth={1.75} />} href="/clients" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {adminLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group flex items-center gap-3 rounded-3xl bg-white px-4 py-4 shadow-card transition-shadow hover:shadow-float dark:bg-gray-900"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-ink dark:bg-white/5 dark:text-white">{l.icon}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-theme-sm font-medium text-ink dark:text-white">{l.label}</span>
                <span className="block truncate text-theme-xs text-gray-500 dark:text-gray-400">{l.desc}</span>
              </span>
              <ChevronRight className="size-4 text-gray-400 transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
            </Link>
          ))}
        </div>
        <ComponentCard title="Needs attention" desc="Claims waiting on a broker or client action." action={viewAll} flush>
          <ClaimsTable claims={attention} showBrokerColumn framed={false} emptyMessage="Nothing currently needs attention." />
        </ComponentCard>
      </div>
    );
  }

  if (role === "manager") {
    const attention = needsAttentionClaims(state.claims);
    const byBroker = new Map<string, number>();
    attention.forEach((c) => byBroker.set(c.brokerId, (byBroker.get(c.brokerId) ?? 0) + 1));
    const max = Math.max(1, ...byBroker.values());
    return (
      <div className="space-y-6">
        <DashboardHeader name={currentUser.name} subtitle="Portfolio-level exception view, across every broker." showNewClaim={false} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <ComponentCard title="Queues by broker" desc="Where stepping in would help most." className="lg:col-span-1 lg:self-start">
            <ul className="space-y-4">
              {[...byBroker.entries()]
                .sort((a, b) => b[1] - a[1])
                .map(([brokerId, count]) => (
                  <li key={brokerId}>
                    <div className="flex items-center justify-between text-theme-sm">
                      <span className="font-medium text-ink dark:text-white">{findUser(state, brokerId)?.name}</span>
                      <span className="text-gray-500 tabular-nums dark:text-gray-400">{count} open</span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-gray-100 dark:bg-white/5">
                      <div className="h-full rounded-full bg-brand-500" style={{ width: `${(count / max) * 100}%` }} />
                    </div>
                  </li>
                ))}
              {byBroker.size === 0 && <li className="text-theme-sm text-gray-400">No claims currently need attention.</li>}
            </ul>
          </ComponentCard>
          <ComponentCard title="Needs attention" desc="All brokers" action={viewAll} flush className="min-w-0 lg:col-span-2">
            <ClaimsTable claims={attention} showBrokerColumn framed={false} emptyMessage="Nothing currently needs attention." />
          </ComponentCard>
        </div>
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
      <DashboardHeader name={currentUser.name} subtitle="Your claims, sorted by what needs action." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Claims need action" value={attention.length} hint={`Of ${ownClaims.length} claims assigned to you`} icon={<TriangleAlert className={ICON} strokeWidth={1.75} />} tone="attention" href="/claims" />
        <StatCard label="Late-reported this week" value={lateThisWeek} hint="Reported 30+ days after loss" icon={<Clock className={ICON} strokeWidth={1.75} />} />
        <StatCard label="Assigned clients" value={clientIds.length} hint="With at least one claim" icon={<Users className={ICON} strokeWidth={1.75} />} href="/clients" />
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        <ComponentCard title="My claims" desc="Sorted by what needs attention first." action={viewAll} flush className="min-w-0 xl:col-span-3">
          <ClaimsTable claims={sorted} framed={false} emptyMessage="No claims assigned to you yet." />
        </ComponentCard>
        <ComponentCard title="Assigned clients" flush className="xl:col-span-1 xl:self-start">
          <ul className="divide-y divide-gray-100 dark:divide-white/5">
            {clientIds.map((cid) => {
              const client = findClient(state, cid);
              const count = ownClaims.filter((c) => c.clientId === cid).length;
              return (
                <li key={cid}>
                  <Link href={`/clients/${cid}`} className="flex items-center justify-between gap-3 px-5 py-3.5 text-theme-sm transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.03]">
                    <span className="flex min-w-0 items-center gap-2.5">
                      <Building2 className="size-4 shrink-0 text-gray-400" strokeWidth={1.75} />
                      <span className="truncate text-ink dark:text-white">{client?.name}</span>
                    </span>
                    <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-theme-xs font-medium text-ink tabular-nums dark:bg-white/5 dark:text-white">{count}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </ComponentCard>
      </div>
    </div>
  );
}
