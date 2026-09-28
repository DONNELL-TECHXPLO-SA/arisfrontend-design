"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import NotFoundPanel from "@/components/common/NotFoundPanel";
import StatusBadge from "@/components/claims/StatusBadge";
import Tabs from "@/components/ui/tabs/Tabs";
import { AlertIcon } from "@/icons";
import { findClient, findSection, formatDate } from "@/lib/mock/helpers";
import { useData } from "@/lib/mock/store";
import { useClaimAccess } from "@/lib/mock/useClaimAccess";
import { Link, usePathname } from "@/i18n/navigation";
import { useParams } from "next/navigation";

export default function ClaimDetailLayout({ children }: { children: React.ReactNode }) {
  const { id } = useParams<{ id: string }>();
  const { claim, notFound } = useClaimAccess(id);
  const { state } = useData();
  const pathname = usePathname();

  if (notFound || !claim) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Claim" />
        <NotFoundPanel backHref="/claims" />
      </div>
    );
  }

  const client = findClient(state, claim.clientId);
  const section = findSection(state, claim.sectionId);
  const base = `/claims/${claim.id}`;

  const tabs = [
    { key: "overview", label: "Overview", href: base },
    { key: "claim-form", label: "Claim Form", href: `${base}/claim-form` },
    { key: "documents", label: "Documents", href: `${base}/documents` },
    { key: "insurer-assessor", label: "Insurer & Assessor", href: `${base}/insurer-assessor` },
    { key: "decision", label: "Decision & Settlement", href: `${base}/decision` },
    { key: "financials", label: "Financials", href: `${base}/financials` },
    { key: "communication", label: "Communication", href: `${base}/communication` },
    { key: "comments", label: "Comments", href: `${base}/comments` },
    { key: "activity", label: "Activity", href: `${base}/activity` },
  ];
  const active =
    [...tabs]
      .sort((a, b) => b.href.length - a.href.length)
      .find((t) => pathname === t.href || pathname.startsWith(`${t.href}/`))?.key ?? "overview";

  return (
    <div>
      <nav className="mb-3 flex items-center gap-1.5 text-theme-xs text-gray-400">
        <Link href="/claims" className="transition-colors hover:text-ink dark:hover:text-white">Claims</Link>
        <span aria-hidden className="text-gray-300 dark:text-gray-600">/</span>
        <span className="text-gray-600 dark:text-gray-300">{claim.reference}</span>
      </nav>

      <div className="mb-5 rounded-3xl bg-white p-5 shadow-card sm:p-6 dark:bg-gray-900">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-title-sm font-medium tracking-tight text-ink dark:text-white">{claim.reference}</h1>
              {claim.lateReported && (
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-theme-xs font-medium text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
                  <AlertIcon className="size-3" /> Late reported
                </span>
              )}
            </div>
            <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">{client?.name}</p>
          </div>
          <StatusBadge status={claim.status} />
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
          {[
            { label: "Client", value: client?.name ?? "—" },
            { label: "Claim type", value: claim.claimType },
            { label: "Insurer", value: section?.insurer ?? "—" },
            { label: "Date of loss", value: formatDate(claim.dateOfLoss) },
          ].map((f) => (
            <div key={f.label} className="rounded-2xl bg-gray-50 px-4 py-3 dark:bg-white/[0.03]">
              <dt className="text-theme-xs text-gray-400">{f.label}</dt>
              <dd className="mt-1 truncate text-theme-sm font-medium text-ink dark:text-white">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <Tabs tabs={tabs} active={active} className="mb-6" />

      {children}
    </div>
  );
}
