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
}

export default function ClaimsTable({
  claims,
  showClientColumn = true,
  showBrokerColumn = false,
  emptyMessage = "No claims match this view.",
}: ClaimsTableProps) {
  const { state } = useData();

  if (claims.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-theme-sm text-gray-500 dark:border-gray-700 dark:bg-white/3 dark:text-gray-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/5">
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
                <TableRow key={claim.id} className="hover:bg-gray-50 dark:hover:bg-white/2">
                  <TableCell className="px-5 py-4 text-start sm:px-6">
                    <Link href={`/claims/${claim.id}`} className="flex items-center gap-2">
                      <span className="text-theme-sm font-medium text-brand-600 dark:text-brand-400">{claim.reference}</span>
                      {claim.lateReported && <AlertIcon className="size-4 text-warning-500" />}
                    </Link>
                  </TableCell>
                  {showClientColumn && (
                    <TableCell className="px-4 py-4 text-start text-theme-sm text-gray-600 dark:text-gray-300">
                      {client?.name ?? "—"}
                    </TableCell>
                  )}
                  <TableCell className="px-4 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {claim.claimType}
                    <span className="block text-theme-xs text-gray-400">{section?.insurer}</span>
                  </TableCell>
                  {showBrokerColumn && (
                    <TableCell className="px-4 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                      {broker?.name ?? "—"}
                    </TableCell>
                  )}
                  <TableCell className="px-4 py-4 text-start">
                    <StatusBadge status={claim.status} size="sm" />
                  </TableCell>
                  <TableCell className="px-4 py-4 text-start text-theme-xs text-gray-400">{formatDate(claim.updatedAt)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
