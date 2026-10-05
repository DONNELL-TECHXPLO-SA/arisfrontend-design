import { clientStatusLabel } from "@/lib/mock/clientJourney";
import type { Claim } from "@/lib/mock/types";
import { cn } from "@/utils";

// Status in the client's words (matches the stage tracker) — never the internal 16-stage label.
export default function ClientStatusBadge({ claim, className }: { claim: Claim; className?: string }) {
  const { label, finished } = clientStatusLabel(claim);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-0.5 text-theme-xs font-medium whitespace-nowrap text-gray-700 dark:bg-white/[0.06] dark:text-gray-200",
        className,
      )}
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", finished ? "bg-gray-400" : "bg-ink dark:bg-white")} />
      {label}
    </span>
  );
}
