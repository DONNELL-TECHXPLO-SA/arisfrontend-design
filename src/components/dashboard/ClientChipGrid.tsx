import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";

interface ClientChip {
  id: string;
  name: string;
  claimCount: number;
}

export default function ClientChipGrid({ clients }: { clients: ClientChip[] }) {
  if (clients.length === 0) {
    return <p className="text-theme-sm text-gray-400">No clients assigned yet.</p>;
  }

  return (
    <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
      {clients.map((client) => (
        <li key={client.id}>
          <Link
            href={`/clients/${client.id}`}
            className="group flex items-center gap-3 rounded-2xl bg-gray-50 p-3 transition-colors hover:bg-gray-100 dark:bg-white/[0.03] dark:hover:bg-white/5"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-theme-sm font-semibold text-ink shadow-card dark:bg-gray-800 dark:text-white">
              {client.name.charAt(0)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-theme-sm font-medium text-ink dark:text-white">{client.name}</span>
              <span className="block text-theme-xs text-gray-400">
                {client.claimCount} claim{client.claimCount === 1 ? "" : "s"}
              </span>
            </span>
            <ArrowUpRight className="size-4 shrink-0 text-gray-300 transition-colors group-hover:text-ink dark:group-hover:text-white" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
