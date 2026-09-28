import { cn } from "@/utils";

// The Africa mark from the Aris Brokers logo, traced stripe-by-stripe from the artwork so
// it stays crisp at any size (the logo PNG blurs when enlarged). Coordinates are the
// stripe centre-lines, top to bottom; caps are drawn by strokeLinecap.
const STROKE = 5.8;
const STRIPES: [number, number, number, number][] = [
  [3.5, 18.9, 32.9, 0.0],
  [0.0, 38.1, 56.0, 2.2],
  [0.0, 55.2, 67.8, 11.8],
  [11.4, 65.2, 88.6, 15.6],
  [36.4, 66.1, 108.1, 20.3],
  [47.8, 75.8, 111.8, 34.9],
  [49.3, 92.0, 113.0, 51.1],
  [51.7, 107.6, 118.7, 64.6],
  [52.9, 123.9, 137.4, 69.8],
  [52.9, 140.9, 105.9, 106.9],
  [69.9, 146.9, 99.8, 127.8],
  [56.1, 155.4, 64.8, 150.8],
].map(([x1, y1, x2, y2]) => {
  // The traced extents include the round caps — pull each end in by half a stroke.
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const k = Math.min(STROKE / 2 / len, 0.45);
  return [x1 + (x2 - x1) * k, y1 + (y2 - y1) * k, x2 - (x2 - x1) * k, y2 - (y2 - y1) * k];
});

interface AfricaStripesProps {
  className?: string;
  /** Stroke classes for the base stripes, e.g. "stroke-white/10". */
  stripeClassName?: string;
  /** Indexes (0–11, top to bottom) drawn in the accent instead. */
  accent?: number[];
  accentClassName?: string;
  /** Draw each stripe in, top to bottom, when the page loads. */
  animate?: boolean;
}

export default function AfricaStripes({
  className,
  stripeClassName = "stroke-brand-500",
  accent = [],
  accentClassName = "stroke-brand-500",
  animate = false,
}: AfricaStripesProps) {
  return (
    <svg viewBox="-4 -4 146 164" fill="none" aria-hidden className={className}>
      {STRIPES.map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x2}
          y1={y2}
          x2={x1}
          y2={y1}
          pathLength={1}
          strokeWidth={STROKE}
          strokeLinecap="round"
          className={cn(
            accent.includes(i) ? accentClassName : stripeClassName,
            animate && "motion-safe:animate-stripe-draw",
          )}
          style={animate ? { strokeDasharray: 1, animationDelay: `${150 + i * 90}ms` } : undefined}
        />
      ))}
    </svg>
  );
}
