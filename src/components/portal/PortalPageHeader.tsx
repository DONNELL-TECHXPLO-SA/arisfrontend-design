import React from "react";

export default function PortalPageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-title-sm font-medium tracking-tight text-ink sm:text-title-md dark:text-white">{title}</h1>
        {subtitle && <p className="mt-1 text-base text-gray-500 dark:text-gray-400">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2.5">{children}</div>}
    </div>
  );
}
