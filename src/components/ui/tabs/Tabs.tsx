import { Link } from "@/i18n/navigation";
import { cn } from "@/utils";

export interface TabItem {
  key: string;
  label: string;
  badge?: number;
  /** When set, the tab renders as a link (route-based tabs) instead of a state toggle. */
  href?: string;
}

interface TabsProps {
  tabs: TabItem[];
  active: string;
  onChange?: (key: string) => void;
  className?: string;
}

// Shared tab primitive — used by admin Claim Detail (Overview/Documents/Insurer &
// Assessor/Decision & Settlement/Financials/Communication/Comments/Activity, §7.3).
// Supports both route-based tabs (pass `href` per item) and controlled in-page tabs
// (omit `href`, handle `onChange`).
const Tabs: React.FC<TabsProps> = ({ tabs, active, onChange, className = "" }) => {
  return (
    <div className={cn("no-scrollbar overflow-x-auto", className)}>
      <nav className="inline-flex min-w-max gap-1 rounded-full bg-white p-1.5 shadow-card dark:bg-gray-900">
        {tabs.map((tab) => {
          const isActive = tab.key === active;
          const content = (
            <>
              {tab.label}
              {typeof tab.badge === "number" && tab.badge > 0 && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-theme-xs font-medium",
                    isActive ? "bg-brand-500 text-white" : "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300",
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </>
          );
          const className = cn(
            "relative flex items-center gap-1.5 rounded-full px-4 py-2 text-theme-sm font-medium transition-colors duration-150",
            isActive
              ? "bg-ink text-white dark:bg-white dark:text-ink"
              : "text-gray-500 hover:bg-gray-100 hover:text-ink dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white",
          );
          return tab.href ? (
            <Link key={tab.key} href={tab.href} className={className}>
              {content}
            </Link>
          ) : (
            <button key={tab.key} type="button" onClick={() => onChange?.(tab.key)} className={className}>
              {content}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Tabs;
