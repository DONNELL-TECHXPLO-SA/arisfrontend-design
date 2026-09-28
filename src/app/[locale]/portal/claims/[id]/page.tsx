"use client";

import ComponentCard from "@/components/common/ComponentCard";
import Alert from "@/components/ui/alert/Alert";
import { Link } from "@/i18n/navigation";
import UserAvatar from "@/components/common/UserAvatar";
import ClientTimeline from "@/components/portal/ClientTimeline";
import { clientTimeline } from "@/lib/mock/clientJourney";
import { auditFor, checklistFor, documentsFor, findSection, formatDate, formatDateTime } from "@/lib/mock/helpers";
import { Mail, Phone } from "lucide-react";
import { useData } from "@/lib/mock/store";
import { useClaimAccess } from "@/lib/mock/useClaimAccess";
import { useParams } from "next/navigation";

export default function ClientClaimStatusPage() {
  const { id } = useParams<{ id: string }>();
  const { claim } = useClaimAccess(id);
  const { state } = useData();
  if (!claim) return null;

  const documents = documentsFor(state, claim.id);
  const timeline = auditFor(state, { claimId: claim.id });
  const checklist = checklistFor(state, claim.id);
  const claimFormStarted = !!claim.claimFormValues && Object.keys(claim.claimFormValues).length > 0;

  return (
    <div className="space-y-6">
      {claim.lateReported && (
        <Alert
          variant="warning"
          title="Late Reported"
          message="This claim was reported more than 30 days after the date of loss, which the Insurer may consider grounds for rejection."
        />
      )}

      {claim.assessor?.sharedWithClientAt && (
        <ComponentCard
          title="Your assessor"
          desc={`Appointed by ${findSection(state, claim.sectionId)?.insurer ?? "your insurer"} on ${formatDate(claim.assessor.sharedWithClientAt)}. They'll contact you to arrange an inspection.`}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <UserAvatar name={claim.assessor.name ?? claim.assessor.company ?? "Assessor"} size="lg" />
              <div className="min-w-0">
                <p className="truncate text-base font-medium text-ink dark:text-white">{claim.assessor.name ?? claim.assessor.company}</p>
                {claim.assessor.name && claim.assessor.company && (
                  <p className="truncate text-theme-sm text-gray-500 dark:text-gray-400">{claim.assessor.company}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              {claim.assessor.contact && (
                <p className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3.5 py-1.5 text-theme-sm text-ink dark:bg-white/5 dark:text-white">
                  <Phone className="size-4 text-gray-400" strokeWidth={1.75} /> {claim.assessor.contact}
                </p>
              )}
              {claim.assessor.email && (
                <p className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3.5 py-1.5 text-theme-sm text-ink dark:bg-white/5 dark:text-white">
                  <Mail className="size-4 text-gray-400" strokeWidth={1.75} /> {claim.assessor.email}
                </p>
              )}
            </div>
          </div>
        </ComponentCard>
      )}

      <ComponentCard title="Claim Form" desc={claimFormStarted ? "In progress — pick up where you or your broker left off." : "Not started yet."}>
        <div className="flex items-center justify-between">
          <span className="text-theme-sm text-gray-700 dark:text-gray-300">{claimFormStarted ? "In progress" : "Not started"}</span>
          <Link href={`/portal/claims/${claim.id}/claim-form`} className="text-theme-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400">
            {claimFormStarted ? "Continue filling form →" : "Start claim form →"}
          </Link>
        </div>
      </ComponentCard>

      <ComponentCard title="Updates">
        <ClientTimeline events={clientTimeline(timeline, claim, state)} />
      </ComponentCard>

      <ComponentCard title="Document Checklist" desc="Advisory only.">
        <ul className="divide-y divide-gray-100 dark:divide-white/5">
          {checklist.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-2.5">
              <span className="text-theme-sm text-gray-700 dark:text-gray-300">{item.label}</span>
              <span className={item.status === "received" ? "text-theme-xs font-medium text-success-600 dark:text-success-400" : "text-theme-xs font-medium text-gray-400"}>
                {item.status === "received" ? "Received" : "Outstanding"}
              </span>
            </li>
          ))}
        </ul>
      </ComponentCard>

      {documents.length > 0 && (
        <ComponentCard title="Your Documents">
          <ul className="divide-y divide-gray-100 dark:divide-white/5">
            {documents.map((doc) => (
              <li key={doc.id} className="flex items-center justify-between py-2.5">
                <span className="text-theme-sm text-gray-700 dark:text-gray-300">{doc.filename}</span>
                <span className="text-theme-xs text-gray-400">{formatDateTime(doc.uploadedAt)}</span>
              </li>
            ))}
          </ul>
        </ComponentCard>
      )}
    </div>
  );
}
