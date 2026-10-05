import { Link } from "@/i18n/navigation";
import { ChevronRight, CircleCheck } from "lucide-react";

export interface TodoItem {
  claimId: string;
  reference: string;
  action: string;
}

// What the client needs to do next — one row per claim, each a direct link to act.
// Designed for a `flush` card: rows run edge to edge with hairline dividers.
export default function TodoList({ items }: { items: TodoItem[] }) {
  if (items.length === 0) {
    return (
      <div className="flex items-center gap-3 px-5 py-5 sm:px-6">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400">
          <CircleCheck className="size-4.5" strokeWidth={1.75} />
        </span>
        <div>
          <p className="text-theme-sm font-medium text-ink dark:text-white">You&apos;re all caught up</p>
          <p className="text-theme-xs text-gray-500 dark:text-gray-400">Nothing needs your attention right now.</p>
        </div>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-100 dark:divide-white/5">
      {items.map((item) => (
        <li key={item.claimId}>
          <Link
            href={`/portal/claims/${item.claimId}`}
            className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-gray-50/80 sm:px-6 dark:hover:bg-white/[0.02]"
          >
            <span aria-hidden className="size-2 shrink-0 rounded-full bg-brand-500" />
            <div className="min-w-0 flex-1">
              <p className="text-theme-sm font-medium text-ink sm:truncate dark:text-white">{item.action}</p>
              <p className="mt-0.5 font-mono text-theme-xs text-gray-500 dark:text-gray-400">{item.reference}</p>
            </div>
            <span className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full bg-ink px-3.5 text-theme-xs font-medium text-white transition-colors group-hover:bg-brand-500 dark:bg-white dark:text-ink">
              Open <ChevronRight className="size-3.5 rtl:rotate-180" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
