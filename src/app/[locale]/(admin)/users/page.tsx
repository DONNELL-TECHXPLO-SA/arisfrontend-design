"use client";

import NotFoundPanel from "@/components/common/NotFoundPanel";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Badge from "@/components/ui/badge/Badge";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Button from "@/components/ui/button/Button";
import { useAuth } from "@/context/AuthContext";
import { Link } from "@/i18n/navigation";
import { PlusIcon } from "@/icons";
import { useData } from "@/lib/mock/store";
import type { Role } from "@/lib/mock/types";

const ROLE_LABEL: Record<Role, string> = {
  administrator: "Administrator",
  manager: "Manager",
  broker: "Broker",
  client_primary: "Client — Primary",
  client_secondary: "Client — Secondary",
};

export default function UsersListPage() {
  const { currentUser } = useAuth();
  const { state, setUserActive } = useData();
  const isAdministrator = currentUser?.role === "administrator";
  const canView = isAdministrator || currentUser?.role === "manager";

  if (currentUser && !canView) {
    return <NotFoundPanel backHref="/" backLabel="Back to Dashboard" />;
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Users & Access" />
      <div className="mb-5 flex items-center justify-between">
        <p className="text-theme-sm text-gray-500 dark:text-gray-400">
          {isAdministrator ? "Full account lifecycle and role assignment." : "View-only — account changes are Administrator-only."}
        </p>
        {isAdministrator && (
          <Link href="/users/new">
            <Button size="sm" startIcon={<PlusIcon className="size-4" />}>
              New User
            </Button>
          </Link>
        )}
      </div>
      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200/70 dark:bg-gray-900 dark:ring-white/5">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-white/[0.03]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Name</TableCell>
              <TableCell isHeader className="px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Role</TableCell>
              <TableCell isHeader className="px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Email</TableCell>
              <TableCell isHeader className="px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Status</TableCell>
              {isAdministrator && <TableCell isHeader className="px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Actions</TableCell>}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
            {state.users.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="px-5 py-3 text-theme-sm font-medium text-gray-700 sm:px-6 dark:text-gray-300">{u.name}</TableCell>
                <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">{ROLE_LABEL[u.role]}</TableCell>
                <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">{u.email}</TableCell>
                <TableCell className="px-4 py-3">
                  <Badge size="sm" color={u.active ? "success" : "light"}>
                    {u.active ? "Active" : "Deactivated"}
                  </Badge>
                </TableCell>
                {isAdministrator && (
                  <TableCell className="px-4 py-3">
                    <button
                      onClick={() => setUserActive(u.id, !u.active)}
                      className="text-theme-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
                    >
                      {u.active ? "Deactivate" : "Reactivate"}
                    </button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
