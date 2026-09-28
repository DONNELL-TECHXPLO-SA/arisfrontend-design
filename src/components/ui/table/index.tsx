"use client";

import { useRouter } from "@/i18n/navigation";
import { cn } from "@/utils";
import React, { ReactNode } from "react";

// Props for Table
interface TableProps {
  children: ReactNode; // Table content (thead, tbody, etc.)
  className?: string; // Optional className for styling
}

// Props for TableHeader
interface TableHeaderProps {
  children: ReactNode; // Header row(s)
  className?: string; // Optional className for styling
}

// Props for TableBody
interface TableBodyProps {
  children: ReactNode; // Body row(s)
  className?: string; // Optional className for styling
}

// Props for TableRow
interface TableRowProps {
  children: ReactNode; // Cells (th or td)
  className?: string; // Optional className for styling
  /** Makes the whole row open this route — click, Enter, or Ctrl/Cmd-click for a new tab. */
  href?: string;
  /** Accessible name for the row link, e.g. "Open claim ARB-2026-1001". */
  label?: string;
}

// Props for TableCell
interface TableCellProps {
  children: ReactNode; // Cell content
  isHeader?: boolean; // If true, renders as <th>, otherwise <td>
  className?: string; // Optional className for styling
}

// Table Component
const Table: React.FC<TableProps> = ({ children, className }) => {
  return <table className={`min-w-full  ${className}`}>{children}</table>;
};

// TableHeader Component
const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
  return <thead className={className}>{children}</thead>;
};

// TableBody Component
const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
  return <tbody className={className}>{children}</tbody>;
};

// TableRow Component
const INTERACTIVE = "a, button, input, select, textarea, label, [role='button']";

const TableRow: React.FC<TableRowProps> = ({ children, className, href, label }) => {
  const router = useRouter();
  if (!href) return <tr className={className}>{children}</tr>;

  // Clicks on real controls inside the row keep their own behaviour.
  const open = (e: React.MouseEvent | React.KeyboardEvent, newTab: boolean) => {
    if ((e.target as HTMLElement).closest(INTERACTIVE)) return;
    if (newTab) window.open(href, "_blank", "noopener");
    else router.push(href);
  };

  return (
    <tr
      className={cn(
        "cursor-pointer transition-colors hover:bg-gray-50/80 focus-visible:bg-gray-50 focus-visible:outline-none dark:hover:bg-white/[0.02] dark:focus-visible:bg-white/[0.04]",
        className,
      )}
      tabIndex={0}
      aria-label={label}
      onClick={(e) => open(e, e.metaKey || e.ctrlKey)}
      onAuxClick={(e) => e.button === 1 && open(e, true)}
      onKeyDown={(e) => {
        if (e.key === "Enter") open(e, e.metaKey || e.ctrlKey);
      }}
    >
      {children}
    </tr>
  );
};

// TableCell Component
const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
  className,
}) => {
  const CellTag = isHeader ? "th" : "td";
  return <CellTag className={` ${className}`}>{children}</CellTag>;
};

export { Table, TableHeader, TableBody, TableRow, TableCell };
