"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { DocsIcon, GridIcon, PlusIcon, UserCircleIcon } from "@/icons";
import { cn } from "@/utils";

const NAV_ITEMS = [
  { href: "/portal", label: "Dashboard", icon: GridIcon },
  { href: "/portal/claims/new", label: "New Claim", icon: PlusIcon },
  { href: "/portal/reports", label: "Reports", icon: DocsIcon },
  { href: "/portal/profile", label: "Profile", icon: UserCircleIcon },
] as const;

// Mobile primary nav for the User/Client Portal, per §10.2/§20.2 ("bottom nav, primary
// on mobile"). Hidden at md+ where ClientTopNav carries the same items.
export default function ClientBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden dark:border-gray-800 dark:bg-gray-900">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive = href === "/portal" ? pathname === "/portal" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2.5 text-theme-xs font-medium",
              isActive ? "text-brand-600 dark:text-brand-400" : "text-gray-500 dark:text-gray-400",
            )}
          >
            <Icon className="size-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
