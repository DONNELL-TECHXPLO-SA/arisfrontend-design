import StatusBadge from "@/components/claims/StatusBadge";
import { Link } from "@/i18n/navigation";
import { AlertIcon, ChevronDownIcon } from "@/icons";
import { clientAttentionFor, findSection, formatDate } from "@/lib/mock/helpers";
import { useData } from "@/lib/mock/store";
import type { Claim, ClaimDocument } from "@/lib/mock/types";

export default function ClientClaimCard({ claim, documents }: { claim: Claim; documents: ClaimDocument[] }) {
  const { state } = useData();
  const section = findSection(state, claim.sectionId);
  const attention = clientAttentionFor(claim, documents);

  return (
    <Link
      href={`/portal/claims/${claim.id}`}
      className="block rounded-2xl border border-gray-200 bg-white p-4 transition-colors hover:border-brand-300 dark:border-gray-800 dark:bg-white/3 dark:hover:border-brand-800"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-theme-sm font-semibold text-gray-800 dark:text-white/90">{claim.reference}</span>
            {claim.lateReported && (
              <span className="inline-flex items-center gap-1 rounded-full bg-warning-50 px-2 py-0.5 text-theme-xs font-medium text-warning-600 dark:bg-warning-500/15 dark:text-warning-400">
                <AlertIcon className="size-3" /> Late Reported
              </span>
            )}
          </div>
          <p className="mt-1 text-theme-xs text-gray-500 dark:text-gray-400">
            {claim.claimType} · {section?.insurer ?? "Insurer"} · Loss on {formatDate(claim.dateOfLoss)}
          </p>
        </div>
        <ChevronDownIcon className="size-4 shrink-0 -rotate-90 text-gray-400 rtl:rotate-90" />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <StatusBadge status={claim.status} size="sm" />
        <span className="text-theme-xs text-gray-400">Updated {formatDate(claim.updatedAt)}</span>
      </div>

      {attention && (
        <p className="mt-3 rounded-lg bg-brand-50 px-3 py-2 text-theme-xs font-medium text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
          {attention}
        </p>
      )}
    </Link>
  );
}
