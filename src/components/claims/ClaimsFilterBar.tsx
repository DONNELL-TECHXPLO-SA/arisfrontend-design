"use client";

import { cn } from "@/utils";
import { ChevronDown, X } from "lucide-react";
import type { ClaimFilters } from "./claimFilters";

interface Option {
  value: string;
  label: string;
  count?: number;
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
}) {
  const active = value !== "";
  return (
    <label className="relative inline-flex">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-10 max-w-52 appearance-none truncate rounded-full border-0 ps-4 pe-9 text-theme-sm font-medium shadow-card transition-colors focus:ring-4 focus:ring-ink/5 focus:outline-hidden dark:focus:ring-white/5",
          active
            ? "bg-ink text-white dark:bg-white dark:text-ink"
            : "bg-white text-gray-600 hover:text-ink dark:bg-gray-900 dark:text-gray-300 dark:hover:text-white",
        )}
      >
        <option value="">{`All ${label.toLowerCase()}`}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
            {typeof o.count === "number" ? ` (${o.count})` : ""}
          </option>
        ))}
      </select>
      <ChevronDown
        className={cn("pointer-events-none absolute inset-e-3 top-1/2 size-4 -translate-y-1/2", active ? "text-white dark:text-ink" : "text-gray-400")}
      />
    </label>
  );
}

function ToggleChip({ label, on, onToggle }: { label: string; on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onToggle}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-full px-4 text-theme-sm font-medium shadow-card transition-colors",
        on
          ? "bg-brand-500 text-white"
          : "bg-white text-gray-600 hover:text-ink dark:bg-gray-900 dark:text-gray-300 dark:hover:text-white",
      )}
    >
      <span className={cn("size-1.5 rounded-full", on ? "bg-white" : "bg-brand-500")} />
      {label}
    </button>
  );
}

interface ClaimsFilterBarProps {
  filters: ClaimFilters;
  onChange: (patch: Partial<ClaimFilters>) => void;
  onClear: () => void;
  options: { insurers: string[]; clients: Option[]; brokers: Option[]; stages: Option[] };
  showBrokerFilter: boolean;
  resultCount: number;
  totalCount: number;
  activeCount: number;
}

export default function ClaimsFilterBar({
  filters,
  onChange,
  onClear,
  options,
  showBrokerFilter,
  resultCount,
  totalCount,
  activeCount,
}: ClaimsFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <FilterSelect label="Stages" value={filters.stage} options={options.stages} onChange={(stage) => onChange({ stage })} />
        <FilterSelect
          label="Insurers"
          value={filters.insurer}
          options={options.insurers.map((i) => ({ value: i, label: i }))}
          onChange={(insurer) => onChange({ insurer })}
        />
        <FilterSelect label="Clients" value={filters.clientId} options={options.clients} onChange={(clientId) => onChange({ clientId })} />
        {showBrokerFilter && (
          <FilterSelect label="Brokers" value={filters.brokerId} options={options.brokers} onChange={(brokerId) => onChange({ brokerId })} />
        )}
        <ToggleChip label="Needs attention" on={filters.needsAttention} onToggle={() => onChange({ needsAttention: !filters.needsAttention })} />
        <ToggleChip label="Late reported" on={filters.lateOnly} onToggle={() => onChange({ lateOnly: !filters.lateOnly })} />
      </div>

      <div className="flex shrink-0 items-center gap-3 text-theme-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
        <span aria-live="polite">
          Showing <span className="font-semibold text-ink tabular-nums dark:text-white">{resultCount}</span> of {totalCount}
        </span>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 font-medium text-ink transition-colors hover:bg-white dark:text-white dark:hover:bg-white/5"
          >
            <X className="size-3.5" /> Clear all
          </button>
        )}
      </div>
    </div>
  );
}
