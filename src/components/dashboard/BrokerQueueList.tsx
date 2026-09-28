interface BrokerQueueRow {
  id: string;
  name: string;
  count: number;
}

// Manager view: who needs help. Bar length is relative to the busiest queue so the
// outlier jumps out without reading numbers.
export default function BrokerQueueList({ rows }: { rows: BrokerQueueRow[] }) {
  if (rows.length === 0) {
    return <p className="text-theme-sm text-gray-400">No claims currently need attention.</p>;
  }

  const max = Math.max(...rows.map((r) => r.count));

  return (
    <ul className="space-y-4">
      {rows.map((row) => {
        const initials = row.name
          .split(" ")
          .map((p) => p[0])
          .slice(0, 2)
          .join("");
        return (
          <li key={row.id} className="flex items-center gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-theme-xs font-semibold text-ink dark:bg-white/5 dark:text-white">
              {initials}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <span className="truncate text-theme-sm font-medium text-ink dark:text-white">{row.name}</span>
                <span className="shrink-0 text-theme-xs text-gray-500 tabular-nums dark:text-gray-400">
                  {row.count} need{row.count === 1 ? "s" : ""} attention
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-white/5">
                <div
                  className="h-full rounded-full bg-brand-500"
                  style={{ width: `${Math.max(8, (row.count / max) * 100)}%` }}
                />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
