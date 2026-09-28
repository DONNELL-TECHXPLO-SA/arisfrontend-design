import { formatDateTime } from "@/lib/mock/helpers";
import type { ClientEvent } from "@/lib/mock/clientJourney";
import { cn } from "@/utils";

// Client-facing claim history — milestones in the client's words, newest first.
export default function ClientTimeline({ events }: { events: ClientEvent[] }) {
  if (events.length === 0) return <p className="text-theme-sm text-gray-400">No updates yet.</p>;
  return (
    <ol className="relative space-y-5 ps-6">
      <span aria-hidden className="absolute top-1.5 bottom-1.5 start-[6px] w-px bg-gray-200 dark:bg-white/10" />
      {events.map((e, i) => (
        <li key={e.id} className="relative">
          <span
            aria-hidden
            className={cn(
              "absolute -start-6 top-1 size-3.5 rounded-full border-2 border-white dark:border-gray-900",
              i === 0 ? "bg-brand-500" : e.milestone ? "bg-ink dark:bg-white" : "bg-gray-300 dark:bg-gray-600",
            )}
          />
          <p className={cn("text-theme-sm text-ink dark:text-white", (i === 0 || e.milestone) && "font-medium")}>{e.title}</p>
          <p className="text-theme-xs text-gray-400">{formatDateTime(e.at)}</p>
        </li>
      ))}
    </ol>
  );
}
