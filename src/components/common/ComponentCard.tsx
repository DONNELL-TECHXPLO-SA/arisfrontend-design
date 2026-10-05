import { cn } from "@/utils";
import React from "react";

interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
  /** Optional right-aligned slot in the card header (a link, filter or button). */
  action?: React.ReactNode;
  /** Body without padding — for tables and lists that should run edge to edge. */
  flush?: boolean;
}

// Borderless surface on the canvas — the white-on-warm-grey contrast does the
// separating, so there's no header rule or outline.
const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
  action,
  flush = false,
}) => {
  return (
    <div
      className={cn(
        "rounded-3xl bg-white shadow-card dark:bg-gray-900",
        "flat:rounded-xl flat:border flat:border-gray-200 flat:shadow-theme-xs dark:flat:border-white/10",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4 px-5 pt-5 sm:px-6 sm:pt-6 flat:px-5 flat:pt-4 flat:sm:px-5 flat:sm:pt-4">
        <div>
          <h3 className="text-lg font-medium tracking-tight text-ink flat:text-[15px] flat:font-semibold flat:tracking-normal dark:text-white">
            {title}
          </h3>
          {desc && (
            <p className="mt-1 text-sm text-gray-500 flat:mt-0.5 flat:text-theme-xs dark:text-gray-400">
              {desc}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>

      {flush ? (
        <div className="mt-4 overflow-hidden rounded-b-3xl border-t border-gray-100 flat:rounded-b-xl dark:border-white/5">{children}</div>
      ) : (
        <div className="p-5 sm:p-6 flat:px-5 flat:pt-4 flat:pb-5 flat:sm:px-5 flat:sm:pt-4 flat:sm:pb-5">
          <div className="space-y-6 flat:space-y-5">{children}</div>
        </div>
      )}
    </div>
  );
};

export default ComponentCard;
