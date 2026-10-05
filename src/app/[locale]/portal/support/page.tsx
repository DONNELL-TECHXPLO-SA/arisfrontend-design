"use client";

import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import BrokerCard from "@/components/portal/BrokerCard";
import PortalPageHeader from "@/components/portal/PortalPageHeader";
import Button from "@/components/ui/button/Button";
import { useAuth } from "@/context/AuthContext";
import { Link } from "@/i18n/navigation";
import { findClient, findUser, formatDateTime } from "@/lib/mock/helpers";
import { useData, useScopedClaims } from "@/lib/mock/store";
import type { Enquiry } from "@/lib/mock/types";
import { cn } from "@/utils";
import { ChevronDown, CircleCheck, FileStack, HelpCircle, ShieldCheck } from "lucide-react";
import { useState } from "react";

const TOPICS: { value: Enquiry["topic"]; label: string; icon: typeof FileStack }[] = [
  { value: "claim", label: "A claim", icon: FileStack },
  { value: "policy", label: "My cover", icon: ShieldCheck },
  { value: "general", label: "Something else", icon: HelpCircle },
];

export default function ClientSupportPage() {
  const { currentUser } = useAuth();
  const { state, sendEnquiry } = useData();
  const claims = useScopedClaims(currentUser?.role ?? "client_primary", currentUser?.id ?? "", currentUser?.clientId);
  const [topic, setTopic] = useState<Enquiry["topic"]>("claim");
  const [claimId, setClaimId] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sent, setSent] = useState<{ claimId?: string } | null>(null);

  if (!currentUser) return null;
  const client = findClient(state, currentUser.clientId);
  const broker = findUser(state, client?.brokerId);
  const history = state.enquiries
    .filter((e) => e.clientId === currentUser.clientId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const needsClaim = topic === "claim";
  const canSend = subject.trim() && body.trim() && (!needsClaim || claimId);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!canSend || !currentUser?.clientId) return;
    sendEnquiry({
      enquiry: {
        clientId: currentUser.clientId,
        authorId: currentUser.id,
        topic,
        subject: subject.trim(),
        body: body.trim(),
        claimId: needsClaim ? claimId : undefined,
      },
      actorRole: currentUser.role,
    });
    setSent({ claimId: needsClaim ? claimId : undefined });
    setSubject("");
    setBody("");
  }

  return (
    <div className="space-y-6">
      <PortalPageHeader title="Support" subtitle={`Messages go to ${broker?.name ?? "your broker"} at Aris Brokers.`} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ComponentCard title="New message" className="lg:col-span-2">
          <form onSubmit={handleSend} className="space-y-5">
            <fieldset>
              <legend className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">What is it about?</legend>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                {TOPICS.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={topic === value}
                    onClick={() => setTopic(value)}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-start transition-colors",
                      topic === value
                        ? "border-brand-500 bg-brand-50/60 text-ink ring-1 ring-brand-500 dark:bg-brand-500/10 dark:text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-white/10 dark:bg-transparent dark:text-gray-300 dark:hover:border-white/20",
                    )}
                  >
                    <Icon className={cn("size-4.5 shrink-0", topic === value ? "text-brand-600 dark:text-brand-400" : "text-gray-400")} strokeWidth={1.75} />
                    <span className="text-theme-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            {needsClaim && (
              <div>
                <Label>Which claim?</Label>
                <div className="relative">
                  <select
                    value={claimId}
                    onChange={(e) => setClaimId(e.target.value)}
                    className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 pe-10 text-sm text-ink focus:border-ink focus:ring-4 focus:ring-ink/5 focus:outline-hidden dark:border-white/10 dark:bg-gray-900 dark:text-white"
                  >
                    <option value="">Select a claim</option>
                    {claims.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.reference} — {c.claimType}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute inset-e-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            )}

            <div>
              <Label>Subject</Label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. When will the assessor visit?" />
            </div>
            <div>
              <Label>Message</Label>
              <TextArea rows={5} value={body} onChange={setBody} placeholder="Tell us what you need…" />
            </div>

            {sent && (
              <div className="flex items-start gap-3 rounded-2xl bg-success-50 p-4 dark:bg-success-500/10">
                <CircleCheck className="mt-0.5 size-5 shrink-0 text-success-600 dark:text-success-400" strokeWidth={1.75} />
                <p className="text-theme-sm text-ink dark:text-white">
                  Sent to {broker?.name ?? "your broker"}.{" "}
                  {sent.claimId ? (
                    <>
                      It&apos;s also in the claim&apos;s{" "}
                      <Link href={`/portal/claims/${sent.claimId}/communication`} className="font-medium underline underline-offset-2">
                        Communication
                      </Link>{" "}
                      tab, where replies will appear.
                    </>
                  ) : (
                    "You'll find it in your message history below."
                  )}
                </p>
              </div>
            )}

            <Button disabled={!canSend}>Send message</Button>
          </form>
        </ComponentCard>

        <div className="space-y-6">
          <ComponentCard title="Your broker">
            <BrokerCard broker={broker} compact />
          </ComponentCard>
        </div>
      </div>

      <ComponentCard title="Sent messages" desc={history.length ? undefined : "Nothing sent yet."} flush={history.length > 0}>
        {history.length > 0 && (
          <ul className="divide-y divide-gray-100 dark:divide-white/5">
            {history.map((e) => {
              const claim = e.claimId ? state.claims.find((c) => c.id === e.claimId) : undefined;
              return (
                <li key={e.id} className="px-5 py-4 sm:px-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-theme-sm font-medium text-ink dark:text-white">{e.subject}</p>
                    <span className="text-theme-xs text-gray-400">{formatDateTime(e.createdAt)}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-theme-sm text-gray-600 dark:text-gray-300">{e.body}</p>
                  <p className="mt-2 text-theme-xs text-gray-400">
                    {TOPICS.find((t) => t.value === e.topic)?.label}
                    {claim && (
                      <>
                        {" · "}
                        <Link href={`/portal/claims/${claim.id}/communication`} className="font-medium text-ink hover:text-brand-600 dark:text-white">
                          {claim.reference}
                        </Link>
                      </>
                    )}
                    {" · "}by {findUser(state, e.authorId)?.name}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </ComponentCard>
    </div>
  );
}
