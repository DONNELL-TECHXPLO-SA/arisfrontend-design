import type { PolicyDocumentType } from "@/lib/mock/types";

export const POLICY_DOCUMENT_TYPES: { value: PolicyDocumentType; label: string }[] = [
  { value: "schedule", label: "Policy schedule" },
  { value: "wording", label: "Policy wording" },
  { value: "endorsement", label: "Endorsement" },
  { value: "other", label: "Other" },
];

export const policyDocumentLabel = (type: PolicyDocumentType) =>
  POLICY_DOCUMENT_TYPES.find((t) => t.value === type)?.label ?? type;
