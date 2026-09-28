import UserAvatar from "@/components/common/UserAvatar";
import { Link } from "@/i18n/navigation";
import type { User } from "@/lib/mock/types";
import { Mail, MessageCircle } from "lucide-react";

// The client's named broker — a person to talk to, not a department.
export default function BrokerCard({ broker, compact = false }: { broker?: User; compact?: boolean }) {
  if (!broker) return <p className="text-theme-sm text-gray-500 dark:text-gray-400">No broker is assigned yet.</p>;
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <UserAvatar name={broker.name} size="lg" />
        <div className="min-w-0">
          <p className="text-base font-medium text-ink dark:text-white">{broker.name}</p>
          <p className="text-theme-xs text-gray-500 dark:text-gray-400">Your broker at Aris Brokers</p>
        </div>
      </div>
      <p className="flex items-center gap-2 rounded-2xl bg-gray-50 px-4 py-3 text-theme-sm text-ink dark:bg-white/[0.03] dark:text-white">
        <Mail className="size-4 shrink-0 text-gray-400" strokeWidth={1.75} />
        <span className="truncate">{broker.email}</span>
      </p>
      {!compact && (
        <Link
          href="/portal/support"
          className="flex h-11 items-center justify-center gap-2 rounded-full bg-ink text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-ink dark:hover:bg-gray-200"
        >
          <MessageCircle className="size-4" strokeWidth={1.75} />
          Send a message
        </Link>
      )}
    </div>
  );
}
