"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import NotFoundPanel from "@/components/common/NotFoundPanel";
import StatusBadge from "@/components/claims/StatusBadge";
import Tabs from "@/components/ui/tabs/Tabs";
import { AlertIcon } from "@/icons";
import { findClient, findSection, formatDate } from "@/lib/mock/helpers";
import { useData } from "@/lib/mock/store";
import { useClaimAccess } from "@/lib/mock/useClaimAccess";
import { usePathname } from "@/i18n/navigation";
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
      <PageBreadcrumb pageTitle={claim.reference} />

      <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-theme-xl font-semibold text-gray-800 dark:text-white/90">{claim.reference}</h1>
              {claim.lateReported && (
                <span className="inline-flex items-center gap-1 rounded-full bg-warning-50 px-2 py-0.5 text-theme-xs font-medium text-warning-600 dark:bg-warning-500/15 dark:text-warning-400">
                  <AlertIcon className="size-3" /> Late Reported
                </span>
              )}
            </div>
            <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
              {client?.name} · {claim.claimType} · {section?.insurer} · Loss on {formatDate(claim.dateOfLoss)}
            </p>
          </div>
          <StatusBadge status={claim.status} />
        </div>
      </div>

      <Tabs tabs={tabs} active={active} className="mb-6" />

      {children}
    </div>
  );
}
