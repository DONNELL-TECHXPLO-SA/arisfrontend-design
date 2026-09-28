import { checklistFor, clientAttentionFor, findSection } from "./helpers";
import { OVERALL_STAGES, STATUS_META } from "./status";
import type { AuditEntry, Claim, ClaimStatus, DocumentType, MockState } from "./types";

// Client-facing view of a claim's progress: the same six milestones the broker sees
// (OVERALL_STAGES), in plain words, plus who the claim is waiting on right now.

const CLIENT_STAGE_LABELS: Record<string, string> = {
  submitted: "Lodged",
  insurer: "With insurer",
  assessment: "Being assessed",
  decision: "Decision",
  settlement: "Settlement",
  closed: "Closed",
};

export type StageState = "done" | "current" | "upcoming" | "skipped";
export type WaitingParty = "you" | "insurer" | "aris" | "none";

export interface ClientJourney {
  stages: { key: string; label: string; state: StageState }[];
  waiting: {
    party: WaitingParty;
    /** Who, in words — "You", "Old Mutual", "Aris Brokers". */
    who: string;
    /** One sentence: what is happening / what to do. */
    text: string;
    /** When it's the client's turn, where to go to do it. */
    action?: { label: string; tab: "claim-form" | "documents" | "settlement" };
  };
}

// Outcomes where the claim ends at the decision — there is no settlement stage.
const NO_SETTLEMENT: ClaimStatus[] = ["repudiated", "within_excess", "not_taken_up"];

function stageIndexOf(status: ClaimStatus): number {
  const i = OVERALL_STAGES.findIndex((s) => s.statuses.includes(status));
  return i === -1 ? 3 : i;
}

export function clientJourney(claim: Claim, state: MockState): ClientJourney {
  const insurer = findSection(state, claim.sectionId)?.insurer ?? "Your insurer";
  // A dispute sits "on top of" whichever stage the claim had reached.
  const effective: ClaimStatus = claim.status === "disputed" ? (claim.preDisputeStatus ?? "awaiting_insurer_decision") : claim.status;
  const current = stageIndexOf(effective);
  const endsAtDecision = NO_SETTLEMENT.includes(claim.status);
  const closed = claim.status === "closed";

  const stages = OVERALL_STAGES.map((s, i) => {
    let st: StageState = i < current ? "done" : i === current ? "current" : "upcoming";
    if (closed) st = "done";
    if (endsAtDecision && s.key === "settlement") st = "skipped";
    if (endsAtDecision && s.key === "decision") st = "done";
    if (endsAtDecision && s.key === "closed") st = "done";
    return { key: s.key, label: CLIENT_STAGE_LABELS[s.key] ?? s.label, state: st };
  });

  const attention = clientAttentionFor(claim, state.documents);
  const you = (text: string, action?: ClientJourney["waiting"]["action"]) => ({ party: "you" as const, who: "You", text, action });
  const ins = (text: string) => ({ party: "insurer" as const, who: insurer, text });
  const aris = (text: string) => ({ party: "aris" as const, who: "Aris Brokers", text });
  const none = (text: string) => ({ party: "none" as const, who: "", text });

  let waiting: ClientJourney["waiting"];
  switch (claim.status) {
    case "partially_submitted":
      waiting = you(attention ?? "Complete the insurer claim form.", { label: "Open claim form", tab: "claim-form" });
      break;
    case "documents_outstanding": {
      const missing = checklistFor(state, claim.id).filter((c) => c.status === "outstanding").map((c) => c.label);
      waiting = you(
        missing.length ? `Upload the outstanding ${missing.length === 1 ? "document" : "documents"}: ${missing.join(", ")}.` : "Upload the outstanding documents.",
        { label: "Upload documents", tab: "documents" },
      );
      break;
    }
    case "submitted":
      waiting = aris("We're checking your claim before sending it to the insurer.");
      break;
    case "submitted_to_insurer":
      waiting = ins(`${insurer} is registering your claim${claim.insurerClaimNo ? ` (their reference ${claim.insurerClaimNo})` : ""}.`);
      break;
    case "under_assessment":
      waiting = ins(
        claim.assessor?.sharedWithClientAt
          ? `${claim.assessor.name ?? claim.assessor.company ?? "The assessor"} is assessing the loss — they'll contact you to arrange an inspection.`
          : "An assessor is looking at the loss.",
      );
      break;
    case "assessment_completed":
      waiting = ins(`${insurer} is reviewing the assessor's report.`);
      break;
    case "awaiting_insurer_decision":
      waiting = ins(`Waiting for ${insurer} to decide on your claim.`);
      break;
    case "disputed":
      waiting = aris(`We're challenging ${insurer}'s decision on your behalf.`);
      break;
    case "settled":
      waiting = aris("Your claim was approved — we're preparing the settlement.");
      break;
    case "awaiting_signed_aol":
      waiting = attention?.startsWith("Your signed")
        ? aris("We have your signed Agreement of Loss and will send it to the insurer.")
        : you(attention ?? "Sign and upload your Agreement of Loss.", { label: "Go to settlement", tab: "settlement" });
      break;
    case "awaiting_excess_invoice_and_pop":
      waiting = attention
        ? you(attention, { label: "Go to settlement", tab: "settlement" })
        : aris("We'll send you the excess invoice shortly.");
      break;
    case "awaiting_insurer_payment":
      waiting = ins(`${insurer} is processing the payment.`);
      break;
    case "repudiated":
      waiting = none(`${insurer} declined this claim. Speak to your broker if you'd like to understand why or challenge it.`);
      break;
    case "within_excess":
      waiting = none("The loss is within your policy excess, so there's no payout. Nothing else is needed from you.");
      break;
    case "not_taken_up":
      waiting = none("This claim was withdrawn. Nothing else is needed from you.");
      break;
    case "closed":
    default:
      waiting = none("This claim is complete. Nothing else is needed from you.");
  }

  return { stages, waiting };
}

// ---- Client-facing timeline ---------------------------------------------------------

export interface ClientEvent {
  id: string;
  title: string;
  at: string;
  /** Highlights milestones (decision, payment, closed) over routine updates. */
  milestone?: boolean;
}

const DOC_LABELS: Record<DocumentType, string> = {
  claim_form: "claim form",
  photo: "photographs",
  police_report: "police report",
  incident_report: "incident report",
  unsigned_aol: "Agreement of Loss",
  signed_aol: "signed Agreement of Loss",
  proof_of_payment: "proof of payment",
  excess_invoice: "excess invoice",
  repudiation_letter: "insurer's letter",
  policy_schedule: "policy schedule",
  other: "supporting document",
};

// Status moves worth telling the client about, in their words.
const STATUS_EVENTS: Partial<Record<string, string>> = {
  [STATUS_META.under_assessment.label]: "Assessment started",
  [STATUS_META.assessment_completed.label]: "Assessment completed",
  [STATUS_META.awaiting_insurer_decision.label]: "Waiting for the insurer's decision",
  [STATUS_META.awaiting_insurer_payment.label]: "Payment requested from the insurer",
  [STATUS_META.closed.label]: "Claim closed",
};

/**
 * Translates the claim's activity log into what a client should see. Anything not
 * matched here — financial adjustments, internal flags, broker notes, admin actions —
 * is left out on purpose.
 */
export function clientTimeline(entries: AuditEntry[], claim: Claim, state: MockState): ClientEvent[] {
  const insurer = findSection(state, claim.sectionId)?.insurer ?? "the insurer";
  const out: ClientEvent[] = [];

  for (const e of entries) {
    const a = e.action;
    let title: string | undefined;
    let milestone = false;
    let m: RegExpMatchArray | null;

    if (a.startsWith("Claim lodged")) title = "Claim lodged";
    else if ((m = a.match(/^Forwarded to insurer — claim number (.+) recorded$/))) title = `Sent to ${insurer} — their reference ${m[1]}`;
    else if ((m = a.match(/^Assessor appointed — (.+?);/))) title = `Assessor appointed — ${m[1]}`;
    else if ((m = a.match(/^Insurer decision recorded — (.+)$/))) {
      milestone = true;
      const outcome = m[1];
      title = outcome.startsWith("Settled")
        ? `Claim approved by ${insurer}${outcome.includes("(") ? ` — ${outcome.slice(outcome.indexOf("(") + 1, -1).toLowerCase()} settlement` : ""}`
        : outcome === "Repudiated"
          ? `Claim declined by ${insurer}`
          : outcome === "Within Excess"
            ? "Loss is within your excess — no payout"
            : outcome === "Not Taken Up"
              ? "Claim withdrawn"
              : `Decision: ${outcome}`;
    } else if ((m = a.match(/^Claim moved to "(.+)"$/)) && STATUS_EVENTS[m[1]]) title = STATUS_EVENTS[m[1]];
    else if ((m = a.match(/^Document uploaded \((.+)\)$/))) title = `Document received — ${DOC_LABELS[m[1].replace(/ /g, "_") as DocumentType] ?? m[1]}`;
    else if (a === "Unsigned Agreement of Loss uploaded") title = "Agreement of Loss ready for you to sign";
    else if (a === "Excess invoice issued") title = "Excess invoice issued";
    else if (a.startsWith("Proof of payment received")) {
      title = "Payment made";
      milestone = true;
    }
    else if (a === "Claim marked as Disputed") title = `Aris is challenging ${insurer}'s decision for you`;
    else if (a === "Dispute resolved") title = "Dispute resolved";
    else if (a === "Claim closed") {
      title = "Claim closed";
      milestone = true;
    }
    else if (a === "Claim reopened") title = "Claim reopened";

    if (title) out.push({ id: e.id, title, at: e.createdAt, milestone });
  }
  return out;
}
