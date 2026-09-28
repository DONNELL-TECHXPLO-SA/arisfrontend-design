import { Link } from "@/i18n/navigation";
import { CircleCheck } from "lucide-react";

export interface TodoItem {
  claimId: string;
  reference: string;
  action: string;
}

// What the client needs to do next — one line per claim, each a direct link to act.
export default function TodoList({ items }: { items: TodoItem[] }) {
  if (items.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-success-50 p-4 dark:bg-success-500/10">
        <CircleCheck className="size-5 shrink-0 text-success-600 dark:text-success-400" strokeWidth={1.75} />
        <div>
          <p className="text-theme-sm font-medium text-ink dark:text-white">You&apos;re all caught up</p>
        </div>
      </div>
    );
  }

  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item.claimId}>
          <Link
            href={`/portal/claims/${item.claimId}`}
            className="group flex items-center gap-4 rounded-2xl bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:bg-white/[0.03] dark:hover:bg-white/5"
          >
            <span className="relative flex size-2.5 shrink-0">
              <span className="absolute inline-flex size-full rounded-full bg-brand-500 opacity-30 motion-safe:animate-ping" />
              <span className="relative inline-flex size-2.5 rounded-full bg-brand-500" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-theme-sm font-medium text-ink dark:text-white">{item.action}</p>
              <p className="text-theme-xs text-gray-400">{item.reference}</p>
            </div>
            <span className="shrink-0 rounded-full bg-ink px-3.5 py-1.5 text-theme-xs font-medium text-white transition-colors group-hover:bg-brand-500 dark:bg-white dark:text-ink">
              Open
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
