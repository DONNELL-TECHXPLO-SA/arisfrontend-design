"use client";

import NotFoundPanel from "@/components/common/NotFoundPanel";
import ClientStatusBadge from "@/components/portal/ClientStatusBadge";
import { clientJourney } from "@/lib/mock/clientJourney";
import Tabs from "@/components/ui/tabs/Tabs";
import { Link, usePathname } from "@/i18n/navigation";
import { AlertIcon } from "@/icons";
import { findSection, formatDate } from "@/lib/mock/helpers";
import { useData } from "@/lib/mock/store";
import { useClaimAccess } from "@/lib/mock/useClaimAccess";
import { useParams } from "next/navigation";

// Client Claim Detail — a single scrolling record with light sub-nav (not full admin
// tabs), per ux-blueprint.md §8.2/§10.3/§20.2's shallow-app, mobile-first framing.
export default function ClientClaimDetailLayout({ children }: { children: React.ReactNode }) {
  const { id } = useParams<{ id: string }>();
  const { claim, notFound } = useClaimAccess(id);
  const { state } = useData();
  const pathname = usePathname();

  if (notFound || !claim) {
    return <NotFoundPanel backHref="/portal/claims" backLabel="Back to My claims" />;
  }

  const section = findSection(state, claim.sectionId);
  const base = `/portal/claims/${claim.id}`;
  const showSettlement = claim.decision?.outcome === "settled";
  const journey = clientJourney(claim, state);

  const tabs = [
    { key: "status", label: "Updates", href: base },
    { key: "claim-form", label: "Claim Form", href: `${base}/claim-form` },
    { key: "documents", label: "Documents", href: `${base}/documents` },
    { key: "communication", label: "Communication", href: `${base}/communication` },
    { key: "comment", label: "Comment", href: `${base}/comment` },
    ...(showSettlement ? [{ key: "settlement", label: "Settlement", href: `${base}/settlement` }] : []),
  ];
  const active =
    [...tabs]
      .sort((a, b) => b.href.length - a.href.length)
      .find((t) => pathname === t.href || pathname.startsWith(`${t.href}/`))?.key ?? "status";

  return (
    <div>
      <nav className="mb-3 flex items-center gap-1.5 pt-2 text-theme-xs text-gray-400">
        <Link href="/portal/claims" className="transition-colors hover:text-ink dark:hover:text-white">My claims</Link>
        <span aria-hidden className="text-gray-300 dark:text-gray-600">/</span>
        <span className="text-gray-600 dark:text-gray-300">{claim.reference}</span>
      </nav>

      {/* Slim header — which claim and its status. The full stage view lives on My claims. */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-title-sm font-medium tracking-tight text-ink dark:text-white">{claim.reference}</h1>
            <ClientStatusBadge claim={claim} />
            {claim.lateReported && (
              <span className="inline-flex items-center gap-1 rounded-full bg-warning-50 px-2.5 py-1 text-theme-xs font-medium text-warning-700 dark:bg-warning-500/15 dark:text-warning-400">
                <AlertIcon className="size-3" /> Late reported
              </span>
            )}
          </div>
          <p className="mt-1.5 text-theme-sm text-gray-500 dark:text-gray-400">
            {claim.claimType} · {section?.insurer ?? "—"} · Loss on {formatDate(claim.dateOfLoss)}
          </p>
        </div>
      </div>

      {/* Only when the client has something to do — so nobody opens a claim without knowing the next step. */}
      {journey.waiting.party === "you" && journey.waiting.action && (
        <div className="mb-5 flex flex-col gap-3 rounded-2xl bg-brand-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:bg-brand-500/10">
          <p className="flex items-center gap-2.5 text-theme-sm text-ink dark:text-white">
            <span aria-hidden className="size-2 shrink-0 rounded-full bg-brand-500" />
            <span>
              <span className="font-semibold text-brand-600 dark:text-brand-400">Your next step: </span>
              {journey.waiting.text}
            </span>
          </p>
          <Link
            href={`${base}/${journey.waiting.action.tab}`}
            className="inline-flex h-9 shrink-0 items-center justify-center rounded-full bg-ink px-4 text-theme-xs font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-ink"
          >
            {journey.waiting.action.label}
          </Link>
        </div>
      )}

      <Tabs tabs={tabs} active={active} className="mb-6" />

      {children}
    </div>
  );
}
