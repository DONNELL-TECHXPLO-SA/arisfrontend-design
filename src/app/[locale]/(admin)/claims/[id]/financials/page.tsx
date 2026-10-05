"use client";

import ComponentCard from "@/components/common/ComponentCard";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { useAuth } from "@/context/AuthContext";
import { findSection, formatCurrency } from "@/lib/mock/helpers";
import { useData } from "@/lib/mock/store";
import { useClaimAccess } from "@/lib/mock/useClaimAccess";
import { useParams } from "next/navigation";
import { useState } from "react";

// Accepts how people type money: "15000", "R 15 000", "15 000,00", "15,000.50". Blank = not set.
function parseAmount(raw: string): number | undefined | null {
  const t = raw.trim();
  if (!t) return undefined;
  let s = t.replace(/^R/i, "").replace(/[\s ]/g, "");
  // "15 000,00" style — a single comma followed by 1–2 digits is the decimal separator.
  if (/^\d+,\d{1,2}$/.test(s)) s = s.replace(",", ".");
  else s = s.replace(/,/g, "");
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

const asText = (n?: number) => (n === undefined ? "" : String(n));

const FIELDS = [
  { key: "gross", label: "Gross claim amount" },
  { key: "excess", label: "Excess" },
  { key: "vat", label: "VAT" },
  { key: "net", label: "Net claim amount" },
] as const;
type FieldKey = (typeof FIELDS)[number]["key"];

// Claim financials are free entry — the broker types each figure as given by the insurer or
// assessor. Nothing is calculated here (no VAT %, no gross − excess), so the record shows
// exactly what was agreed.
export default function ClaimFinancialsPage() {
  const { id } = useParams<{ id: string }>();
  const { claim } = useClaimAccess(id);
  const { state, updateFinancials } = useData();
  const { currentUser } = useAuth();
  const [values, setValues] = useState<Record<FieldKey, string>>({
    gross: asText(claim?.grossAmount),
    excess: asText(claim?.financials?.excess),
    vat: asText(claim?.financials?.vat),
    net: asText(claim?.financials?.netAmount),
  });
  const [notes, setNotes] = useState(claim?.financials?.notes ?? "");
  const [saved, setSaved] = useState(false);

  if (!claim || !currentUser) return null;

  const policyExcess = findSection(state, claim.sectionId)?.excess;
  const parsed = Object.fromEntries(FIELDS.map((f) => [f.key, parseAmount(values[f.key])])) as Record<FieldKey, number | undefined | null>;
  const invalid = FIELDS.filter((f) => parsed[f.key] === null).map((f) => f.key);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (invalid.length || !currentUser) return;
    updateFinancials({
      claimId: claim!.id,
      grossAmount: parsed.gross ?? undefined,
      financials: {
        excess: parsed.excess ?? undefined,
        vat: parsed.vat ?? undefined,
        netAmount: parsed.net ?? undefined,
        notes: notes.trim() || undefined,
      },
      actorId: currentUser.id,
      actorRole: currentUser.role,
    });
    setSaved(true);
  }

  const shown = (n?: number) => (n === undefined ? <span className="text-gray-400">Not entered</span> : formatCurrency(n));

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <ComponentCard title="Claim financials" desc="Enter each figure as given by the insurer or assessor. Leave any blank that doesn't apply.">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {FIELDS.map((f) => (
              <div key={f.key}>
                <Label>{f.label} (ZAR)</Label>
                <Input
                  inputMode="decimal"
                  value={values[f.key]}
                  onChange={(e) => {
                    setValues((v) => ({ ...v, [f.key]: e.target.value }));
                    setSaved(false);
                  }}
                  placeholder="e.g. 15 000"
                  error={invalid.includes(f.key)}
                  hint={
                    invalid.includes(f.key)
                      ? "Enter an amount, e.g. 15 000 or 15 000,00"
                      : f.key === "excess" && policyExcess !== undefined
                        ? `Policy excess on file: ${formatCurrency(policyExcess)}`
                        : undefined
                  }
                />
              </div>
            ))}
          </div>
          <div>
            <Label>Notes</Label>
            <TextArea
              rows={3}
              value={notes}
              onChange={(v) => {
                setNotes(v);
                setSaved(false);
              }}
              placeholder="e.g. Excess waived by insurer; VAT not applicable — client is VAT-registered."
            />
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" disabled={invalid.length > 0}>
              Save
            </Button>
            {saved && <span className="text-theme-xs text-success-600 dark:text-success-400">Saved</span>}
          </div>
        </form>
      </ComponentCard>

      <ComponentCard title="Summary" desc="As entered — nothing on this card is calculated.">
        <dl className="space-y-3">
          <div className="flex justify-between gap-4">
            <dt className="text-theme-sm text-gray-500 dark:text-gray-400">Gross claim amount</dt>
            <dd className="text-theme-sm font-medium text-gray-800 dark:text-white/90">{shown(claim.grossAmount)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-theme-sm text-gray-500 dark:text-gray-400">Excess</dt>
            <dd className="text-theme-sm text-gray-700 dark:text-gray-300">{shown(claim.financials?.excess)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-theme-sm text-gray-500 dark:text-gray-400">VAT</dt>
            <dd className="text-theme-sm text-gray-700 dark:text-gray-300">{shown(claim.financials?.vat)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-gray-100 pt-3 dark:border-white/5">
            <dt className="text-theme-sm font-medium text-gray-700 dark:text-gray-300">Net claim amount</dt>
            <dd className="text-theme-sm font-semibold text-gray-800 dark:text-white/90">{shown(claim.financials?.netAmount)}</dd>
          </div>
          {claim.financials?.notes && (
            <div className="border-t border-gray-100 pt-3 dark:border-white/5">
              <dt className="text-theme-xs text-gray-400">Notes</dt>
              <dd className="mt-1 text-theme-sm whitespace-pre-line text-gray-700 dark:text-gray-300">{claim.financials.notes}</dd>
            </div>
          )}
        </dl>
      </ComponentCard>
    </div>
  );
}
