import StatusBadge from "@/components/claims/StatusBadge";
import { Link } from "@/i18n/navigation";
import { AlertIcon, ChevronDownIcon } from "@/icons";
import { clientAttentionFor, findSection, formatDate } from "@/lib/mock/helpers";
import { useData } from "@/lib/mock/store";
import type { Claim, ClaimDocument } from "@/lib/mock/types";

/** `flat` — for use inside a card: grey tile instead of a floating white card. */
export default function ClientClaimCard({ claim, documents, flat = false }: { claim: Claim; documents: ClaimDocument[]; flat?: boolean }) {
  const { state } = useData();
  const section = findSection(state, claim.sectionId);
  const attention = clientAttentionFor(claim, documents);

  return (
    <Link
      href={`/portal/claims/${claim.id}`}
      className={flat ? "block rounded-2xl bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:bg-white/[0.03] dark:hover:bg-white/5" : "block rounded-3xl bg-white p-5 shadow-card transition-shadow duration-200 hover:shadow-float dark:bg-gray-900"}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold tracking-tight text-ink dark:text-white">{claim.reference}</span>
            {claim.lateReported && (
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-theme-xs font-medium text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
                <AlertIcon className="size-3" /> Late reported
              </span>
            )}
          </div>
          <p className="mt-1 text-theme-xs text-gray-500 dark:text-gray-400">
            {claim.claimType} · {section?.insurer ?? "Insurer"} · Loss on {formatDate(claim.dateOfLoss)}
          </p>
        </div>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-white/5"><ChevronDownIcon className="size-4 -rotate-90 text-ink rtl:rotate-90 dark:text-white" /></span>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-white/5">
        <StatusBadge status={claim.status} size="sm" />
        <span className="text-theme-xs text-gray-400">Updated {formatDate(claim.updatedAt)}</span>
      </div>

      {attention && !flat && (
        <p className="mt-3 rounded-2xl bg-brand-50 px-3.5 py-2.5 text-theme-xs font-medium text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
          {attention}
        </p>
      )}
    </Link>
  );
}
