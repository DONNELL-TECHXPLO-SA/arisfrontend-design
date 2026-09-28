"use client";

import { cn } from "@/utils";
import { useId, useState } from "react";

export interface GaugeSegment {
  key: string;
  label: string;
  value: number;
  /** Stroke classes for the arc, e.g. "stroke-brand-500". */
  strokeClass: string;
  /** Legend swatch classes, e.g. "bg-brand-500". */
  swatchClass: string;
}

interface PayoutGaugeProps {
  /** Solid segments, drawn left → right in pipeline order. */
  segments: GaugeSegment[];
  /** The not-yet-started remainder — rendered as the hatched track. */
  pending: { label: string; value: number };
  centerValue: string;
  centerLabel: string;
}

// Geometry: a semicircle of radius R centred at (CX, CY), drawn left → right over the top.
const R = 96;
const CX = 120;
const CY = 118;
const STROKE = 26;
const ARC = `M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`;

// Each solid segment is an arc from 0 → its cumulative end (pathLength-normalised to 100),
// painted last-to-first so earlier stages sit on top. A slightly wider surface-coloured
// arc under each one gives the 2px separating gap at its rounded end.
export default function PayoutGauge({ segments, pending, centerValue, centerLabel }: PayoutGaugeProps) {
  const patternId = useId();
  const [hovered, setHovered] = useState<string | null>(null);
  const total = segments.reduce((s, x) => s + x.value, 0) + pending.value;

  const arcs = segments
    .map((s, i) => {
      const cumulative = segments.slice(0, i + 1).reduce((sum, x) => sum + x.value, 0);
      return { ...s, end: total ? (cumulative / total) * 100 : 0 };
    })
    .filter((s) => s.value > 0);

  const rows = [
    ...segments.map((s) => ({ key: s.key, label: s.label, value: s.value, swatch: s.swatchClass })),
    { key: "pending", label: pending.label, value: pending.value, swatch: "bg-hatch ring-1 ring-gray-300 ring-inset dark:ring-white/15" },
  ];
  const active = rows.find((r) => r.key === hovered);

  return (
    <div>
      <div className="relative mx-auto max-w-80">
        <svg viewBox="0 0 240 132" className="w-full overflow-visible" role="img" aria-label={`${centerValue} ${centerLabel}`}>
          <defs>
            <pattern id={patternId} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="8" height="8" style={{ fill: "var(--hatch-bg)" }} />
              <rect width="2" height="8" style={{ fill: "var(--hatch-line)" }} />
            </pattern>
          </defs>

          {/* Pending track — the whole arc, hatched; whatever the solid segments don't cover stays visible. */}
          <path
            d={ARC}
            fill="none"
            stroke={`url(#${patternId})`}
            strokeWidth={STROKE}
            strokeLinecap="round"
            className="cursor-pointer"
            onPointerEnter={() => setHovered("pending")}
            onPointerLeave={() => setHovered(null)}
          />

          {[...arcs].reverse().map((a) => (
            <g
              key={a.key}
              className="cursor-pointer"
              onPointerEnter={() => setHovered(a.key)}
              onPointerLeave={() => setHovered(null)}
            >
              <path
                d={ARC}
                pathLength={100}
                fill="none"
                strokeWidth={STROKE + 4}
                strokeLinecap="round"
                strokeDasharray={`${a.end} 200`}
                className="stroke-white motion-safe:animate-arc-draw dark:stroke-gray-900"
              />
              <path
                d={ARC}
                pathLength={100}
                fill="none"
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={`${a.end} 200`}
                className={cn(
                  a.strokeClass,
                  "transition-opacity duration-150 motion-safe:animate-arc-draw",
                  hovered && hovered !== a.key && "opacity-60",
                )}
              />
            </g>
          ))}
        </svg>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 text-center motion-safe:animate-fade-in"
          style={{ animationDelay: "900ms" }}
        >
          <p className="text-title-md leading-none font-medium tracking-tight text-ink dark:text-white">
            {active ? active.value : centerValue}
          </p>
          <p className="mt-2 text-theme-xs text-gray-500 dark:text-gray-400">{active ? active.label : centerLabel}</p>
        </div>
      </div>

      <ul className="mt-6 space-y-2.5">
        {rows.map((r) => (
          <li
            key={r.key}
            onPointerEnter={() => setHovered(r.key)}
            onPointerLeave={() => setHovered(null)}
            className={cn(
              "flex items-center justify-between gap-3 rounded-full px-3 py-1.5 transition-colors",
              hovered === r.key ? "bg-gray-100 dark:bg-white/5" : "",
            )}
          >
            <span className="flex items-center gap-2.5 text-theme-sm text-gray-600 dark:text-gray-300">
              <span className={cn("size-3.5 rounded-full", r.swatch)} />
              {r.label}
            </span>
            <span className="text-theme-sm font-semibold text-ink tabular-nums dark:text-white">
              {r.value}
              <span className="ms-1.5 font-normal text-gray-400">{total ? Math.round((r.value / total) * 100) : 0}%</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
