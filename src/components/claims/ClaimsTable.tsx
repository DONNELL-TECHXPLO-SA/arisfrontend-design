"use client";

import StatusBadge from "@/components/claims/StatusBadge";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "@/i18n/navigation";
import { AlertIcon } from "@/icons";
import { findClient, findSection, findUser, formatDate } from "@/lib/mock/helpers";
import { useData } from "@/lib/mock/store";
import type { Claim } from "@/lib/mock/types";

interface ClaimsTableProps {
  claims: Claim[];
  showClientColumn?: boolean;
  showBrokerColumn?: boolean;
  emptyMessage?: string;
  /** Where a row opens — "/claims" (Admin Portal) or "/portal/claims" (Client Portal). */
  basePath?: string;
  /** false — no rounded frame of its own, for use inside a `flush` card. */
  framed?: boolean;
  /** Replace the internal status badge, e.g. with client-facing wording in the Client Portal. */
  renderStatus?: (claim: Claim) => React.ReactNode;
}

export default function ClaimsTable({
  claims,
  showClientColumn = true,
  showBrokerColumn = false,
  emptyMessage = "No claims match this view.",
  basePath = "/claims",
  framed = true,
  renderStatus,
}: ClaimsTableProps) {
  const { state } = useData();

  if (claims.length === 0) {
    return (
      <div
        className={
          framed
            ? "rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-theme-sm text-gray-500 dark:border-gray-700 dark:bg-white/3 dark:text-gray-400"
            : "px-6 py-10 text-center text-theme-sm text-gray-500 dark:text-gray-400"
        }
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={framed ? "overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200/70 flat:rounded-xl flat:ring-gray-200 dark:bg-gray-900 dark:ring-white/5 dark:flat:ring-white/10" : "bg-white dark:bg-gray-900"}>
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-white/[0.03]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                Reference
              </TableCell>
              {showClientColumn && (
                <TableCell isHeader className="px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  Client
                </TableCell>
              )}
              <TableCell isHeader className="px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                Type &amp; Insurer
              </TableCell>
              {showBrokerColumn && (
                <TableCell isHeader className="px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  Broker
                </TableCell>
              )}
              <TableCell isHeader className="px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                Status
              </TableCell>
              <TableCell isHeader className="px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                Updated
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
            {claims.map((claim) => {
              const client = findClient(state, claim.clientId);
              const section = findSection(state, claim.sectionId);
              const broker = findUser(state, claim.brokerId);
              return (
                <TableRow key={claim.id} href={`${basePath}/${claim.id}`} label={`Open claim ${claim.reference}`}>
                  <TableCell className="px-5 py-4 flat:py-3 text-start sm:px-6">
                    <Link href={`${basePath}/${claim.id}`} className="flex items-center gap-2 whitespace-nowrap">
                      <span className="text-theme-sm font-semibold text-ink transition-colors hover:text-brand-600 dark:text-white dark:hover:text-brand-400">{claim.reference}</span>
                      {claim.lateReported && <AlertIcon className="size-4 text-warning-500" />}
                    </Link>
                  </TableCell>
                  {showClientColumn && (
                    <TableCell className="px-4 py-4 flat:py-3 text-start text-theme-sm text-gray-600 dark:text-gray-300">
                      {client?.name ?? "—"}
                    </TableCell>
                  )}
                  <TableCell className="px-4 py-4 flat:py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {claim.claimType}
                    <span className="block text-theme-xs text-gray-400">{section?.insurer}</span>
                  </TableCell>
                  {showBrokerColumn && (
                    <TableCell className="px-4 py-4 flat:py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                      {broker?.name ?? "—"}
                    </TableCell>
                  )}
                  <TableCell className="px-4 py-4 flat:py-3 text-start">
                    {renderStatus ? renderStatus(claim) : <StatusBadge status={claim.status} size="sm" />}
                  </TableCell>
                  <TableCell className="px-4 py-4 flat:py-3 text-start text-theme-xs whitespace-nowrap text-gray-400">{formatDate(claim.updatedAt)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
