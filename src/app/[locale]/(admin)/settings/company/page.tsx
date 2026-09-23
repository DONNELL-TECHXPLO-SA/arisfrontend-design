"use client";

import AdministratorOnly from "@/components/auth/AdministratorOnly";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import StatusBadge from "@/components/claims/StatusBadge";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import Alert from "@/components/ui/alert/Alert";
import Button from "@/components/ui/button/Button";
import { useData } from "@/lib/mock/store";
import { ALL_STATUSES } from "@/lib/mock/status";
import { useState } from "react";

export default function CompanySettingsPage() {
  const { state, updateCompanySettings } = useData();
  const [form, setForm] = useState(state.companySettings);

  return (
    <AdministratorOnly>
      <PageBreadcrumb pageTitle="Company & Report Settings" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ComponentCard title="Company Details" desc="Feeds every generated report's branding and disclaimer.">
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              updateCompanySettings(form);
            }}
          >
            <div>
              <Label>Company Name</Label>
              <Input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
            </div>
            <div>
              <Label>FSP Licence</Label>
              <Input value={form.fspLicence} onChange={(e) => setForm({ ...form, fspLicence: e.target.value })} />
            </div>
            <div>
              <Label>Disclaimer Text</Label>
              <TextArea rows={3} value={form.disclaimerText} onChange={(v) => setForm({ ...form, disclaimerText: v })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>VAT Rate (%)</Label>
                <Input type="number" value={form.vatRate} onChange={(e) => setForm({ ...form, vatRate: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Default Reminder Interval (days)</Label>
                <Input type="number" value={form.defaultReminderIntervalDays} onChange={(e) => setForm({ ...form, defaultReminderIntervalDays: Number(e.target.value) })} />
              </div>
            </div>
            <Button size="sm">Save</Button>
          </form>
        </ComponentCard>

        <ComponentCard title="Claim Status → Colour Legend" desc="Single source of truth for status badges everywhere (§22.5) and the Reports legend.">
          <Alert
            variant="warning"
            title="Status wording is provisional (Q-003)"
            message="The blueprint's own 16-stage client-facing status list is flagged as a proposal, not final — this prototype synthesises a working list from the states named elsewhere in the document."
          />
          <ul className="mt-4 space-y-2">
            {ALL_STATUSES.map((s) => (
              <li key={s} className="flex items-center justify-between">
                <StatusBadge status={s} size="sm" />
              </li>
            ))}
          </ul>
        </ComponentCard>
      </div>
    </AdministratorOnly>
  );
}
