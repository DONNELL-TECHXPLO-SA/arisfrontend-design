"use client";

import ComponentCard from "@/components/common/ComponentCard";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import StepProgress from "@/components/ui/step-progress/StepProgress";
import { useAuth } from "@/context/AuthContext";
import { Link } from "@/i18n/navigation";
import { findClient, findSection, formatDateTime } from "@/lib/mock/helpers";
import { statusLabel } from "@/lib/mock/status";
import { ASSESSMENT_SEQUENCE, useData } from "@/lib/mock/store";
import { useClaimAccess } from "@/lib/mock/useClaimAccess";
import { cn } from "@/utils";
import { CircleCheck, Send } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

const ASSESSMENT_STEPS = ASSESSMENT_SEQUENCE.map((status) => ({ key: status, label: statusLabel(status) }));

function StepBadge({ n, done }: { n: number; done: boolean }) {
  return (
    <span
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-full text-theme-xs font-semibold",
        done ? "bg-success-500 text-white" : "bg-ink text-white dark:bg-white dark:text-ink",
      )}
    >
      {done ? <CircleCheck className="size-4" strokeWidth={2} /> : n}
    </span>
  );
}

// Two separate hand-offs, in the order they happen:
//  1. Broker forwards the claim to the insurer and records the insurer's claim number
//     (gates progression past "Submitted", FR-21).
//  2. The insurer appoints an assessor; the broker passes the assessor's details on to
//     the CLIENT, who the assessor will contact to arrange an inspection.
export default function ClaimInsurerAssessorPage() {
  const { id } = useParams<{ id: string }>();
  const { claim } = useClaimAccess(id);
  const { state, processToInsurer, saveAssessor, advanceAssessment } = useData();
  const { currentUser } = useAuth();

  const [insurerClaimNo, setInsurerClaimNo] = useState(claim?.insurerClaimNo ?? "");
  const [assessorName, setAssessorName] = useState(claim?.assessor?.name ?? "");
  const [assessorCompany, setAssessorCompany] = useState(claim?.assessor?.company ?? "");
  const [assessorContact, setAssessorContact] = useState(claim?.assessor?.contact ?? "");
  const [assessorEmail, setAssessorEmail] = useState(claim?.assessor?.email ?? "");
  const [note, setNote] = useState("");

  if (!claim || !currentUser) return null;

  const client = findClient(state, claim.clientId);
  const insurer = findSection(state, claim.sectionId)?.insurer ?? "the insurer";
  const forwarded = !!claim.insurerClaimNo;
  const sharedAt = claim.assessor?.sharedWithClientAt;
  const hasAssessor = !!(assessorName.trim() || assessorCompany.trim());
  const hasContact = !!(assessorContact.trim() || assessorEmail.trim());

  function handleForward(e: React.FormEvent) {
    e.preventDefault();
    if (!insurerClaimNo.trim()) return;
    processToInsurer({ claimId: claim!.id, insurerClaimNo: insurerClaimNo.trim(), actorId: currentUser!.id, actorRole: currentUser!.role });
  }

  function handleAssessor(notifyClient: boolean) {
    if (!hasAssessor) return;
    saveAssessor({
      claimId: claim!.id,
      assessor: {
        name: assessorName.trim() || undefined,
        company: assessorCompany.trim() || undefined,
        contact: assessorContact.trim() || undefined,
        email: assessorEmail.trim() || undefined,
      },
      notifyClient,
      note,
      actorId: currentUser!.id,
      actorRole: currentUser!.role,
    });
    if (notifyClient) setNote("");
  }

  const stepIndex = ASSESSMENT_SEQUENCE.indexOf(claim.status);
  const next = stepIndex === -1 ? undefined : ASSESSMENT_SEQUENCE[stepIndex + 1];

  return (
    <div className="max-w-2xl space-y-6">
      <ComponentCard
        title="1 · Forward to insurer"
        desc={forwarded ? `Forwarded to ${insurer}.` : `Email the claim to ${insurer}, then record the claim number they give you.`}
        action={<StepBadge n={1} done={forwarded} />}
      >
        <form onSubmit={handleForward} className="space-y-4">
          <div>
            <Label>
              {insurer} claim number <span className="text-error-500">*</span>
            </Label>
            <Input value={insurerClaimNo} onChange={(e) => setInsurerClaimNo(e.target.value)} placeholder="e.g. OM-MT-55219" />
            {!forwarded && <p className="mt-1.5 text-theme-xs text-gray-400">Required to progress this claim past &ldquo;Submitted.&rdquo;</p>}
          </div>
          <Button size="sm" disabled={!insurerClaimNo.trim() || insurerClaimNo.trim() === claim.insurerClaimNo}>
            {forwarded ? "Update claim number" : "Mark as forwarded to insurer"}
          </Button>
        </form>
      </ComponentCard>

      <ComponentCard
        title="2 · Assessor appointed"
        desc={
          forwarded
            ? `Once ${insurer} appoints an assessor, send their details to ${client?.name ?? "the client"} — the assessor will contact them to arrange an inspection.`
            : "Available once the claim has been forwarded to the insurer."
        }
        action={<StepBadge n={2} done={!!sharedAt} />}
      >
        <fieldset disabled={!forwarded} className={cn("space-y-4", !forwarded && "opacity-50")}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>Assessor name</Label>
              <Input value={assessorName} onChange={(e) => setAssessorName(e.target.value)} placeholder="e.g. Chris Oosthuizen" />
            </div>
            <div>
              <Label>Company</Label>
              <Input value={assessorCompany} onChange={(e) => setAssessorCompany(e.target.value)} placeholder="e.g. Independent Assessors SA" />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={assessorContact} onChange={(e) => setAssessorContact(e.target.value)} placeholder="e.g. 082 445 1290" inputMode="tel" />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={assessorEmail} onChange={(e) => setAssessorEmail(e.target.value)} placeholder="name@company.co.za" />
            </div>
          </div>
          <div>
            <Label>Note to the client (optional)</Label>
            <TextArea rows={2} value={note} onChange={setNote} placeholder="e.g. Please have the vehicle available at your premises." />
          </div>

          {sharedAt && (
            <div className="flex items-start gap-3 rounded-2xl bg-success-50 p-4 dark:bg-success-500/10">
              <CircleCheck className="mt-0.5 size-5 shrink-0 text-success-600 dark:text-success-400" strokeWidth={1.75} />
              <p className="text-theme-sm text-ink dark:text-white">
                Sent to the client on {formatDateTime(sharedAt)} — it&apos;s in the{" "}
                <Link href={`/claims/${claim.id}/communication`} className="font-medium underline underline-offset-2">
                  Communication
                </Link>{" "}
                thread and on their claim page.
              </p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="brand" disabled={!hasAssessor || !hasContact} onClick={() => handleAssessor(true)} startIcon={<Send className="size-4" />}>
              {sharedAt ? "Re-send to client" : "Send details to client"}
            </Button>
            <Button size="sm" variant="outline" disabled={!hasAssessor} onClick={() => handleAssessor(false)}>
              Save without sending
            </Button>
            {hasAssessor && !hasContact && <span className="text-theme-xs text-gray-400">Add a phone number or email so the client can reach them.</span>}
          </div>
        </fieldset>
      </ComponentCard>

      {stepIndex !== -1 && (
        <ComponentCard title="Assessment progress" desc="Milestones between forwarding to the insurer and their decision.">
          <StepProgress steps={ASSESSMENT_STEPS} currentIndex={stepIndex} className="mb-5" />
          {next && (
            <Button size="sm" onClick={() => advanceAssessment({ claimId: claim.id, actorId: currentUser.id, actorRole: currentUser.role })}>
              Mark as {statusLabel(next)}
            </Button>
          )}
        </ComponentCard>
      )}
    </div>
  );
}
