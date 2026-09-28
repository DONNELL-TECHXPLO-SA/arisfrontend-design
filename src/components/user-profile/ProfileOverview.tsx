"use client";

import ComponentCard from "@/components/common/ComponentCard";
import UserAvatar from "@/components/common/UserAvatar";
import { useAuth } from "@/context/AuthContext";
import { getLanguage } from "@/i18n/languages";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { findClient } from "@/lib/mock/helpers";
import { useData } from "@/lib/mock/store";
import type { Role } from "@/lib/mock/types";
import { ShieldCheck } from "lucide-react";
import { useLocale } from "next-intl";

const ROLE_LABEL: Record<Role, string> = {
  administrator: "Administrator",
  manager: "Manager",
  broker: "Broker",
  client_primary: "Primary contact",
  client_secondary: "Secondary contact",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-gray-50 px-4 py-3 dark:bg-white/[0.03]">
      <dt className="text-theme-xs text-gray-400">{label}</dt>
      <dd className="mt-1 text-theme-sm font-medium text-ink dark:text-white">{children}</dd>
    </div>
  );
}

// The signed-in user's own profile — shared by the Admin Portal and the Client Portal.
export default function ProfileOverview({ portal }: { portal: "admin" | "client" }) {
  const { currentUser } = useAuth();
  const { state } = useData();
  const locale = useLocale() as Locale;
  if (!currentUser) return null;

  const language = getLanguage(locale);
  const LanguageFlag = language.FlagIcon;
  const organisation =
    portal === "client" ? (findClient(state, currentUser.clientId)?.name ?? "—") : state.companySettings.companyName;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-card dark:bg-gray-900">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <UserAvatar name={currentUser.name} size="xl" />
          <div className="min-w-0">
            <h2 className="text-title-sm font-medium tracking-tight text-ink dark:text-white">{currentUser.name}</h2>
            <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
              {ROLE_LABEL[currentUser.role]} · {organisation}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ComponentCard title="Account">
          <dl className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <Field label="Full name">{currentUser.name}</Field>
            <Field label="Email">{currentUser.email}</Field>
            <Field label="Role">{ROLE_LABEL[currentUser.role]}</Field>
            <Field label="Organisation">{organisation}</Field>
          </dl>
        </ComponentCard>

        <ComponentCard title="Preferences">
          <dl className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <Field label="Language">
              <span className="inline-flex items-center gap-2">
                <LanguageFlag className="size-5 shrink-0 overflow-hidden rounded-full ring-1 ring-gray-200 dark:ring-white/10" />
                {language.name}
              </span>
            </Field>
            <Field label="Time zone">South Africa (SAST, UTC+2)</Field>
            <Field label="Currency">South African rand (ZAR)</Field>
            <Field label="Date format">25 Sept 2026</Field>
          </dl>
        </ComponentCard>
      </div>

      <ComponentCard title="Security">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400">
              <ShieldCheck className="size-5" strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-theme-sm font-medium text-ink dark:text-white">Multi-factor authentication is on</p>
              <p className="text-theme-xs text-gray-500 dark:text-gray-400">Required on every sign-in, for every role.</p>
            </div>
          </div>
          <Link
            href="/mfa-enrol"
            className="inline-flex h-10 items-center rounded-full bg-gray-100 px-4 text-theme-sm font-medium text-ink transition-colors hover:bg-gray-200 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          >
            Re-enrol a device
          </Link>
        </div>
      </ComponentCard>
    </div>
  );
}
