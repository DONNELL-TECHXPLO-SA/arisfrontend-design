import React from "react";

// The page-title pattern for the Client Portal: title, one line of context, actions.
export default function PortalPageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-title-sm font-medium tracking-tight text-ink sm:text-title-md dark:text-white">{title}</h1>
        {subtitle && <p className="mt-2 text-base text-gray-500 dark:text-gray-400">{subtitle}</p>}
      </div>
      {children && <div className="flex shrink-0 flex-wrap items-center gap-2.5">{children}</div>}
    </div>
  );
}
