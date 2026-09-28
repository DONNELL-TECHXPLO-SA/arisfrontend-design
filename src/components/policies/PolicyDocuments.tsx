"use client";

import Button from "@/components/ui/button/Button";
import { useAuth } from "@/context/AuthContext";
import { formatDate, findUser } from "@/lib/mock/helpers";
import { useData } from "@/lib/mock/store";
import type { Policy, PolicyDocumentType } from "@/lib/mock/types";
import { formatFileSize, INLINE_FILE_LIMIT_BYTES, readFileAsDataUrl } from "@/lib/files";
import { cn } from "@/utils";
import { ChevronDown, FileText, Paperclip, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { POLICY_DOCUMENT_TYPES, policyDocumentLabel } from "./policyDocumentTypes";

// Attach / view / remove the policy schedule, wording and endorsements for one policy.
export default function PolicyDocuments({ policy, canEdit }: { policy: Policy; canEdit: boolean }) {
  const { currentUser } = useAuth();
  const { state, attachPolicyDocument, removePolicyDocument } = useData();
  const [type, setType] = useState<PolicyDocumentType>("schedule");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const documents = policy.documents ?? [];

  async function handleAttach() {
    if (!file || !currentUser) return;
    setBusy(true);
    setError("");
    try {
      const dataUrl = file.size <= INLINE_FILE_LIMIT_BYTES ? await readFileAsDataUrl(file) : undefined;
      attachPolicyDocument({
        policyId: policy.id,
        document: { type, filename: file.name, sizeBytes: file.size, uploadedById: currentUser.id, dataUrl },
        actorId: currentUser.id,
        actorRole: currentUser.role,
      });
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not attach the file.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl bg-gray-50 p-4 dark:bg-white/[0.03]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-theme-sm font-medium text-ink dark:text-white">Policy documents</p>
        <span className="text-theme-xs text-gray-400">{documents.length} attached</span>
      </div>

      {documents.length === 0 ? (
        <p className="mb-3 text-theme-sm text-gray-500 dark:text-gray-400">No schedule or wording attached yet.</p>
      ) : (
        <ul className="mb-3 space-y-2">
          {documents.map((doc) => (
            <li key={doc.id} className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-card dark:bg-gray-900">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
                <FileText className="size-4" strokeWidth={1.75} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-theme-sm font-medium text-ink dark:text-white">{doc.filename}</p>
                <p className="text-theme-xs text-gray-400">
                  {policyDocumentLabel(doc.type)} · {formatFileSize(doc.sizeBytes)} · {formatDate(doc.uploadedAt)} ·{" "}
                  {findUser(state, doc.uploadedById)?.name ?? "—"}
                </p>
              </div>
              {doc.dataUrl ? (
                <a
                  href={doc.dataUrl}
                  target="_blank"
                  rel="noopener"
                  download={doc.filename}
                  className="rounded-full bg-gray-100 px-3 py-1.5 text-theme-xs font-medium text-ink transition-colors hover:bg-gray-200 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                >
                  Open
                </a>
              ) : (
                <span className="text-theme-xs text-gray-400" title="Large files are recorded but not stored in this prototype.">
                  Recorded
                </span>
              )}
              {canEdit && (
                <button
                  type="button"
                  aria-label={`Remove ${doc.filename}`}
                  onClick={() =>
                    currentUser &&
                    removePolicyDocument({ policyId: policy.id, documentId: doc.id, actorId: currentUser.id, actorRole: currentUser.role })
                  }
                  className="flex size-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-error-50 hover:text-error-500 dark:hover:bg-error-500/10"
                >
                  <Trash2 className="size-4" strokeWidth={1.75} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {canEdit && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="relative inline-flex">
            <span className="sr-only">Document type</span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as PolicyDocumentType)}
              className="h-10 w-full appearance-none rounded-full border-0 bg-white ps-4 pe-9 text-theme-sm font-medium text-ink shadow-card focus:ring-4 focus:ring-ink/5 focus:outline-hidden sm:w-auto dark:bg-gray-900 dark:text-white"
            >
              {POLICY_DOCUMENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute inset-e-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          </label>

          <label
            className={cn(
              "flex h-10 min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-full bg-white px-4 text-theme-sm shadow-card transition-colors hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-white/5",
              file ? "text-ink dark:text-white" : "text-gray-400",
            )}
          >
            <Paperclip className="size-4 shrink-0" strokeWidth={1.75} />
            <span className="truncate">{file ? file.name : "Choose a PDF or image…"}</span>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.doc,.docx,image/*"
              className="sr-only"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>

          <Button size="sm" disabled={!file || busy} onClick={handleAttach}>
            {busy ? "Attaching…" : "Attach"}
          </Button>
        </div>
      )}
      {error && <p className="mt-2 text-theme-xs text-error-500">{error}</p>}
    </div>
  );
}
