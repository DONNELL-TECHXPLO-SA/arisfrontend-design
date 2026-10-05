"use client";

import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import { useAuth } from "@/context/AuthContext";
import { buildAgreementOfLossPdf, buildExcessInvoicePdf, type SettlementDocInput } from "@/lib/claim-forms/settlementDocs";
import { triggerDownload } from "@/lib/claim-forms/fillPdf";
import { documentsFor, findClient, findSection, formatDate, formatDateTime } from "@/lib/mock/helpers";
import { Download, FileText } from "lucide-react";
import Script from "next/script";
import { useData } from "@/lib/mock/store";
import { useClaimAccess } from "@/lib/mock/useClaimAccess";
import type { DocumentType } from "@/lib/mock/types";
import { useParams } from "next/navigation";
import { useState } from "react";

function ClientUploadRow({ label, docType, claimId, existing, buttonLabel }: { label: string; docType: DocumentType; claimId: string; existing?: { filename: string; uploadedAt: string }; buttonLabel: string }) {
  const { currentUser } = useAuth();
  const { uploadDocument } = useData();
  const [file, setFile] = useState<File | null>(null);

  if (existing) {
    return (
      <div className="rounded-2xl bg-success-50 px-4 py-3 dark:bg-success-500/10">
        <p className="text-theme-sm font-medium text-success-700 dark:text-success-400">{label}</p>
        <p className="text-theme-xs text-success-600/80 dark:text-success-400/70">
          {existing.filename} · {formatDateTime(existing.uploadedAt)}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-gray-50 px-4 py-3 dark:bg-white/[0.03]">
      <p className="mb-2 text-theme-sm font-medium text-ink dark:text-white">{label}</p>
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="text-theme-sm text-gray-600 file:me-3 file:rounded-full file:border-0 file:bg-white file:px-3.5 file:py-1.5 file:text-theme-xs file:font-medium file:text-ink file:shadow-card dark:text-gray-300 dark:file:bg-gray-800 dark:file:text-white"
        />
        <Button
          size="sm"
          disabled={!file || !currentUser}
          onClick={() => {
            if (!file || !currentUser) return;
            uploadDocument({ claimId, docType, filename: file.name, uploadedById: currentUser.id, actorRole: currentUser.role });
            setFile(null);
          }}
        >
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
}

function DownloadRow({ title, filename, build }: { title: string; filename: string; build: () => Promise<Uint8Array> }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3 dark:bg-white/[0.03]">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-ink shadow-card dark:bg-gray-800 dark:text-white">
        <FileText className="size-4" strokeWidth={1.75} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-theme-sm font-medium text-ink dark:text-white">{title}</p>
        <p className="truncate text-theme-xs text-gray-500 dark:text-gray-400">{filename}</p>
        {error && <p className="mt-1 text-theme-xs text-error-500">{error}</p>}
      </div>
      <Button
        size="sm"
        disabled={busy}
        startIcon={<Download className="size-4" />}
        onClick={async () => {
          setBusy(true);
          setError("");
          try {
            triggerDownload(await build(), filename);
          } catch (e) {
            setError(e instanceof Error ? e.message : "Could not create the document.");
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? "Preparing…" : "Download"}
      </Button>
    </div>
  );
}

export default function ClientClaimSettlementPage() {
  const { id } = useParams<{ id: string }>();
  const { claim } = useClaimAccess(id);
  const { state } = useData();
  if (!claim || !claim.decision || claim.decision.outcome !== "settled") return null;

  const documents = documentsFor(state, claim.id);
  const findDoc = (type: DocumentType) => documents.find((d) => d.type === type);
  const isCash = claim.decision.settlementMethod === "cash";
  const section = findSection(state, claim.sectionId);
  const docInput = (amount?: number): SettlementDocInput => ({
    reference: claim.reference,
    clientName: findClient(state, claim.clientId)?.name ?? "",
    claimType: claim.claimType,
    insurer: section?.insurer ?? "Your insurer",
    insurerClaimNo: claim.insurerClaimNo,
    dateOfLoss: formatDate(claim.dateOfLoss),
    issuedOn: formatDate(new Date().toISOString()),
    amount,
    companyName: state.companySettings.companyName,
  });

  return (
    <div className="space-y-6">
      <Script src="/vendor/pdf-lib.min.js" strategy="afterInteractive" />
      {isCash ? (
        <ComponentCard title="Agreement of Loss" desc="Your claim was settled in cash. Download, sign, and upload the Agreement of Loss below.">
          <div className="space-y-3">
            {findDoc("unsigned_aol") ? (
              <DownloadRow
                title="Agreement of Loss — to sign"
                filename={`agreement-of-loss-${claim.reference}.pdf`}
                build={() => buildAgreementOfLossPdf(docInput(claim.financials?.netAmount ?? claim.grossAmount))}
              />
            ) : (
              <p className="text-theme-sm text-gray-500 dark:text-gray-400">Your Broker hasn&apos;t issued the Agreement of Loss yet.</p>
            )}
            {findDoc("unsigned_aol") && (
              <ClientUploadRow label="Signed Agreement of Loss" docType="signed_aol" claimId={claim.id} existing={findDoc("signed_aol")} buttonLabel="Upload signed AOL" />
            )}
            {findDoc("signed_aol") && (
              <ClientUploadRow label="Proof of Payment (from Insurer)" docType="proof_of_payment" claimId={claim.id} existing={findDoc("proof_of_payment")} buttonLabel="Upload proof of payment" />
            )}
          </div>
        </ComponentCard>
      ) : (
        <ComponentCard title="Excess Invoice" desc="Your claim was settled by repair/replacement. Pay the excess invoice and upload proof of payment below.">
          <div className="space-y-3">
            {findDoc("excess_invoice") ? (
              <DownloadRow
                title="Excess invoice"
                filename={`excess-invoice-${claim.reference}.pdf`}
                build={() => buildExcessInvoicePdf(docInput(claim.financials?.excess ?? section?.excess))}
              />
            ) : (
              <p className="text-theme-sm text-gray-500 dark:text-gray-400">Your Broker hasn&apos;t issued the excess invoice yet.</p>
            )}
            {findDoc("excess_invoice") && (
              <ClientUploadRow label="Proof of Payment (excess)" docType="proof_of_payment" claimId={claim.id} existing={findDoc("proof_of_payment")} buttonLabel="Upload proof of payment" />
            )}
          </div>
        </ComponentCard>
      )}
    </div>
  );
}
