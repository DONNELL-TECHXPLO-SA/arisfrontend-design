"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Button from "@/components/ui/button/Button";
import { useAuth } from "@/context/AuthContext";
import { Link } from "@/i18n/navigation";
import { PlusIcon } from "@/icons";
import { findUser } from "@/lib/mock/helpers";
import { canEditClient, useData, useScopedClients } from "@/lib/mock/store";

export default function ClientsListPage() {
  const { currentUser } = useAuth();
  const { state } = useData();
  const role = currentUser?.role ?? "broker";
  const clients = useScopedClients(role, currentUser?.id ?? "");

  return (
    <div>
      <PageBreadcrumb pageTitle="Clients & Policies" />
      <div className="mb-5 flex items-center justify-between">
        <p className="text-theme-sm text-gray-500 dark:text-gray-400">
          Every client is visible here (§3.3) — you can only edit the ones assigned to you.
        </p>
        {(role === "administrator" || role === "manager") && (
          <Link href="/clients/new">
            <Button size="sm" startIcon={<PlusIcon className="size-4" />}>
              New Client
            </Button>
          </Link>
        )}
      </div>
      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200/70 dark:bg-gray-900 dark:ring-white/5">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-white/[0.03]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Client</TableCell>
              <TableCell isHeader className="px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Broker</TableCell>
              <TableCell isHeader className="px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Policies</TableCell>
              <TableCell isHeader className="px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Access</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
            {clients.map((client) => {
              const broker = findUser(state, client.brokerId);
              const policyCount = state.policies.filter((p) => p.clientId === client.id).length;
              const editable = canEditClient(role, currentUser?.id ?? "", client);
              return (
                <TableRow key={client.id} href={`/clients/${client.id}`} label={`Open ${client.name}`}>
                  <TableCell className="px-5 py-4 sm:px-6">
                    <Link href={`/clients/${client.id}`} className="text-theme-sm font-semibold text-ink transition-colors hover:text-brand-600 dark:text-white dark:hover:text-brand-400">
                      {client.name}
                    </Link>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-theme-sm text-gray-500 dark:text-gray-400">{broker?.name}</TableCell>
                  <TableCell className="px-4 py-4 text-theme-sm text-gray-500 dark:text-gray-400">{policyCount}</TableCell>
                  <TableCell className="px-4 py-4 text-theme-xs">
                    {editable ? (
                      <span className="text-success-600 dark:text-success-400">Editable</span>
                    ) : (
                      <span className="text-gray-400">View only</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
