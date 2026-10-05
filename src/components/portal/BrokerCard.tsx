import UserAvatar from "@/components/common/UserAvatar";
import { Link } from "@/i18n/navigation";
import type { User } from "@/lib/mock/types";
import { Mail, MessageSquare } from "lucide-react";

// The client's named broker — a person to talk to, not a department.
export default function BrokerCard({ broker, compact = false }: { broker?: User; compact?: boolean }) {
  if (!broker) return <p className="text-theme-sm text-gray-500 dark:text-gray-400">No broker is assigned yet.</p>;
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <UserAvatar name={broker.name} size="md" />
        <div className="min-w-0">
          <p className="truncate text-theme-sm font-semibold text-ink dark:text-white">{broker.name}</p>
          <p className="text-theme-xs text-gray-500 dark:text-gray-400">Account broker · Aris Brokers</p>
        </div>
      </div>
      <dl className="rounded-2xl bg-gray-50 px-4 py-3 text-theme-sm dark:bg-white/[0.03]">
        <div className="flex items-center gap-2.5 text-gray-600 dark:text-gray-300">
          <dt className="sr-only">Email</dt>
          <Mail className="size-4 shrink-0 text-gray-400" strokeWidth={1.75} />
          <dd className="truncate">{broker.email}</dd>
        </div>
      </dl>
      {!compact && (
        <Link
          href="/portal/support"
          className="flex h-11 items-center justify-center gap-2 rounded-full bg-ink text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-ink dark:hover:bg-gray-200"
        >
          <MessageSquare className="size-4" strokeWidth={1.75} />
          Message your broker
        </Link>
      )}
    </div>
  );
}
