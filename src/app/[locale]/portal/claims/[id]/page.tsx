"use client";

import ComponentCard from "@/components/common/ComponentCard";
import UserAvatar from "@/components/common/UserAvatar";
import ClientTimeline from "@/components/portal/ClientTimeline";
import { clientTimeline } from "@/lib/mock/clientJourney";
import { auditFor, findSection, formatDate } from "@/lib/mock/helpers";
import { Mail, Phone } from "lucide-react";
import { useData } from "@/lib/mock/store";
import { useClaimAccess } from "@/lib/mock/useClaimAccess";
import { useParams } from "next/navigation";

export default function ClientClaimStatusPage() {
  const { id } = useParams<{ id: string }>();
  const { claim } = useClaimAccess(id);
  const { state } = useData();
  if (!claim) return null;

  const timeline = auditFor(state, { claimId: claim.id });

  return (
    <div className="space-y-6">
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

      <ComponentCard title="Updates" desc="Everything that has happened on this claim, newest first.">
        <ClientTimeline events={clientTimeline(timeline, claim, state)} />
      </ComponentCard>
    </div>
  );
}
