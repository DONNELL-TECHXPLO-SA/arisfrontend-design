"use client";

import { ChevronDown } from "lucide-react";

interface FormSectionProgressProps {
  sections: { key: string; label: string }[];
  currentIndex: number;
  onJump: (index: number) => void;
}

// Replaces the full row of section pills: shows only where you are and how far along,
// with a quiet menu to jump elsewhere. The hatched track matches the dashboard charts.
export default function FormSectionProgress({ sections, currentIndex, onJump }: FormSectionProgressProps) {
  const total = sections.length;
  const pct = total ? Math.round(((currentIndex + 1) / total) * 100) : 0;
  const current = sections[currentIndex];

  return (
    <div className="rounded-3xl bg-white p-5 shadow-card sm:p-6 flat:rounded-xl flat:border flat:border-gray-200 flat:p-5 flat:shadow-theme-xs dark:bg-gray-900 dark:flat:border-white/10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-theme-xs font-medium tracking-[0.12em] text-gray-400 uppercase">
            Section {currentIndex + 1} of {total}
          </p>
          <p className="mt-1 truncate text-lg font-medium tracking-tight text-ink dark:text-white">{current?.label}</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="relative inline-flex">
            <span className="sr-only">Jump to section</span>
            <select
              value={currentIndex}
              onChange={(e) => onJump(Number(e.target.value))}
              className="h-9 max-w-56 appearance-none truncate rounded-full border-0 bg-gray-100 ps-3.5 pe-8 text-theme-xs font-medium text-ink focus:ring-4 focus:ring-ink/5 focus:outline-hidden dark:bg-white/5 dark:text-white"
            >
              {sections.map((s, i) => (
                <option key={s.key} value={i}>
                  {i + 1}. {s.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute inset-e-2.5 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" />
          </label>
          <span className="text-title-sm leading-none font-medium tracking-tight text-ink tabular-nums dark:text-white">{pct}%</span>
        </div>
      </div>

      <div
        className="mt-4 h-3 overflow-hidden rounded-full bg-hatch"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label={`Claim form progress, section ${currentIndex + 1} of ${total}`}
      >
        <div className="h-full rounded-full bg-brand-500 transition-[width] duration-500 ease-out" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
