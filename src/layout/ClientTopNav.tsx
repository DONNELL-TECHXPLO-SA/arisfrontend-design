"use client";

import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import Wordmark from "@/components/common/Wordmark";
import UserDropdown from "@/components/header/UserDropdown";
import { Link, usePathname } from "@/i18n/navigation";
import { DocsIcon, GridIcon, PlusIcon, UserCircleIcon } from "@/icons";
import { cn } from "@/utils";

const NAV_ITEMS = [
  { href: "/portal", label: "Dashboard", icon: GridIcon },
  { href: "/portal/claims/new", label: "New Claim", icon: PlusIcon },
  { href: "/portal/reports", label: "Reports", icon: DocsIcon },
  { href: "/portal/profile", label: "Profile", icon: UserCircleIcon },
] as const;

// Top nav for the User/Client Portal — per ux-blueprint.md §8.4/§10.2/§12.4: no
// sidebar, primary nav is 3-4 items (Dashboard, New Claim, Reports, Profile), identical
// for Client-Primary and Client-Secondary. Doubles as the desktop/tablet nav; the mobile
// equivalent is ClientBottomNav.
export default function ClientTopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex max-w-(--breakpoint-2xl) items-center justify-between px-4 py-3 md:px-6">
        <Link href="/portal">
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = href === "/portal" ? pathname === "/portal" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-theme-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white/90",
                )}
              >
                <Icon className="size-4.5" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggleButton />
          <UserDropdown />
        </div>
      </div>
    </header>
  );
}
