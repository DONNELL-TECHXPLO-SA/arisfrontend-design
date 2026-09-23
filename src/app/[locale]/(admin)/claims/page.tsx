"use client";

import ClaimsTable from "@/components/claims/ClaimsTable";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { useAuth } from "@/context/AuthContext";
import { Link } from "@/i18n/navigation";
import { PlusIcon } from "@/icons";
import { sortClaimsByAttention } from "@/lib/mock/helpers";
import { useScopedClaims } from "@/lib/mock/store";

// Admin Portal Claims List — ux-blueprint.md §5.2/§13.3: sorted by what needs
// attention, not a flat alphabetical list. Scoped per §3.3 (Broker = own clients only;
// Manager/Administrator = everyone, unscoped).
export default function AdminClaimsListPage() {
  const { currentUser } = useAuth();
  const role = currentUser?.role ?? "broker";
  const claims = useScopedClaims(role, currentUser?.id ?? "", currentUser?.clientId);
  const sorted = sortClaimsByAttention(claims);
  const canLodge = role === "broker" || role === "administrator";

  return (
    <div>
      <PageBreadcrumb pageTitle="Claims" />
      <div className="mb-5 flex items-center justify-between">
        <p className="text-theme-sm text-gray-500 dark:text-gray-400">
          {role === "broker" ? "Your assigned clients' claims" : "All claims, across every client"}, sorted by what needs attention.
        </p>
        {canLodge && (
          <Link href="/claims/new">
            <Button size="sm" startIcon={<PlusIcon className="size-4" />}>
              New Claim
            </Button>
          </Link>
        )}
      </div>
      <ClaimsTable
        claims={sorted}
        showBrokerColumn={role !== "broker"}
        emptyMessage={role === "broker" ? "None of your assigned clients have any claims yet." : "No claims have been lodged yet."}
      />
    </div>
  );
}
