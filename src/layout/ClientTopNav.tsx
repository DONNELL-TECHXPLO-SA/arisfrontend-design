"use client";

import ClientUserMenu, { initialsOf } from "@/components/header/ClientUserMenu";
import { useAuth } from "@/context/AuthContext";
import { Link, usePathname } from "@/i18n/navigation";
import { findClient } from "@/lib/mock/helpers";
import { useData } from "@/lib/mock/store";
import { cn } from "@/utils";
import { CLIENT_NAV_ITEMS, isClientNavActive } from "./clientNav";

// Top nav for the User/Client Portal (UC-03). No sidebar — the client org's own
// identity on the left, "powered by" the Broker underneath, so a client never mistakes
// this for the Broker's internal tool. A red rule across the top carries the brand.
// The mobile equivalent of the nav links is ClientBottomNav.
export default function ClientTopNav() {
  const pathname = usePathname();
  const { currentUser } = useAuth();
  const { state } = useData();
  const org = findClient(state, currentUser?.clientId);
  const brokerName = state.companySettings.companyName.replace(/\s*\(Pty\)\s*Ltd\.?$/i, "");

  return (
    <header className="sticky top-0 z-40 border-t-[3px] border-b border-t-brand-500 border-b-gray-200 bg-white dark:border-b-gray-800 dark:bg-gray-900">
      <div className="flex h-16 w-full items-center justify-between gap-4 px-4 md:px-6 lg:px-10">
        <Link href="/portal" className="flex min-w-0 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-500 text-theme-xs font-bold tracking-wide text-white shadow-theme-xs">
            {org ? initialsOf(org.name) : "—"}
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-theme-sm font-semibold text-gray-900 dark:text-white">{org?.name ?? "Claims portal"}</span>
            <span className="block truncate text-theme-xs text-gray-500 dark:text-gray-400">Claims portal · powered by {brokerName}</span>
          </span>
        </Link>

        <div className="flex h-full items-center gap-2 md:gap-6">
          <nav className="hidden h-16 items-stretch gap-6 md:flex" aria-label="Primary">
            {CLIENT_NAV_ITEMS.map(({ href, label }) => {
              const isActive = isClientNavActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative flex items-center text-theme-sm font-medium transition-colors",
                    isActive
                      ? "text-gray-900 after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-brand-500 dark:text-white"
                      : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white",
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
          <ClientUserMenu />
        </div>
      </div>
    </header>
  );
}
