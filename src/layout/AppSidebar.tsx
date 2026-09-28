"use client";

import Wordmark from "@/components/common/Wordmark";
import { homeForRole, isInternalRole, useAuth } from "@/context/AuthContext";
import { Link, usePathname } from "@/i18n/navigation";
import type { Role } from "@/lib/mock/types";
import { cn } from "@/utils";
import {
  Boxes,
  ChartColumn,
  ChevronDown,
  FilePlus2,
  FileStack,
  History,
  LayoutGrid,
  MessageCircle,
  PanelLeftClose,
  PanelLeftOpen,
  Settings2,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import { useSidebar } from "../context/SidebarContext";

type NavItem = {
  key: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { key: string; path: string }[];
};

const ICON = "size-[18px] shrink-0";

// Role-based Admin Portal nav, per ux-blueprint.md §7.3/§7.4/§3.1: Company & Report
// Settings and Users & Access never render for a Broker (not greyed out — absent).
// Manager sees everything Broker sees (plus unscoped data, applied at the query level,
// not the nav level) but not those two Administrator-only items.
function getNavItems(role: Role): { main: NavItem[]; admin: NavItem[] } {
  // Client Portal — same shell as the Admin Portal, but only the client's own areas.
  if (!isInternalRole(role)) {
    return {
      main: [
        { icon: <LayoutGrid className={ICON} strokeWidth={1.75} />, key: "portalHome", path: "/portal" },
        {
          icon: <FileStack className={ICON} strokeWidth={1.75} />,
          key: "portalClaims",
          subItems: [
            { key: "portalClaimsAll", path: "/portal/claims" },
            { key: "portalClaimsNew", path: "/portal/claims/new" },
          ],
        },
        { icon: <MessageCircle className={ICON} strokeWidth={1.75} />, key: "portalSupport", path: "/portal/support" },
        { icon: <ChartColumn className={ICON} strokeWidth={1.75} />, key: "portalReports", path: "/portal/reports" },
      ],
      admin: [],
    };
  }

  const main: NavItem[] = [
    { icon: <LayoutGrid className={ICON} strokeWidth={1.75} />, key: "dashboard", path: "/" },
    {
      icon: <FileStack className={ICON} strokeWidth={1.75} />,
      key: "claims",
      subItems: [
        { key: "claimsAll", path: "/claims" },
        { key: "claimsNew", path: "/claims/new" },
      ],
    },
    { icon: <Users className={ICON} strokeWidth={1.75} />, key: "clientsPolicies", path: "/clients" },
    {
      icon: <ChartColumn className={ICON} strokeWidth={1.75} />,
      key: "reports",
      subItems: [
        { key: "reportsGenerate", path: "/reports" },
        { key: "reportsHistory", path: "/reports/history" },
      ],
    },
    { icon: <History className={ICON} strokeWidth={1.75} />, key: "auditTrail", path: "/audit" },
  ];

  const admin: NavItem[] =
    role === "administrator"
      ? [
          { icon: <ShieldCheck className={ICON} strokeWidth={1.75} />, key: "usersAccess", path: "/users" },
          { icon: <Boxes className={ICON} strokeWidth={1.75} />, key: "productConfig", path: "/settings/products" },
          { icon: <Settings2 className={ICON} strokeWidth={1.75} />, key: "companySettings", path: "/settings/company" },
        ]
      : [];

  return { main, admin };
}

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const t = useTranslations("sidebar");
  const { currentUser } = useAuth();
  const role = currentUser?.role ?? "broker";
  const { main, admin } = useMemo(() => getNavItems(role), [role]);
  const isClient = !isInternalRole(role);
  const canLodge = isClient || role === "broker" || role === "administrator";
  const lodgeHref = isClient ? "/portal/claims/new" : "/claims/new";

  const isOpen = isExpanded || isHovered || isMobileOpen;
  const isActive = useCallback((path: string) => path === pathname, [pathname]);
  const routeOwner = [...main, ...admin].find((nav) => nav.subItems?.some((s) => isActive(s.path)))?.key ?? null;

  // Open whichever group owns the current route; re-sync (during render) when the route changes.
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(routeOwner);
  const [syncedPath, setSyncedPath] = useState(pathname);
  if (syncedPath !== pathname) {
    setSyncedPath(pathname);
    setOpenSubmenu(routeOwner);
  }

  const renderItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-1">
      {items.map((nav) => {
        const groupActive = !!nav.subItems?.some((s) => isActive(s.path));
        const expanded = openSubmenu === nav.key;
        const itemClass = cn(
          "group menu-item",
          !isOpen && "xl:size-12 xl:justify-center xl:px-0",
        );

        return (
          <li key={nav.key}>
            {nav.subItems ? (
              <button
                type="button"
                onClick={() => setOpenSubmenu((prev) => (prev === nav.key ? null : nav.key))}
                className={cn(itemClass, groupActive && !isOpen ? "menu-item-active" : "menu-item-inactive", groupActive && isOpen && "text-white")}
                title={!isOpen ? t(`items.${nav.key}`) : undefined}
              >
                <span className={groupActive && !isOpen ? "menu-item-icon-active" : groupActive ? "text-white" : "menu-item-icon-inactive"}>
                  {nav.icon}
                </span>
                {isOpen && <span className="menu-item-text">{t(`items.${nav.key}`)}</span>}
                {isOpen && (
                  <ChevronDown
                    className={cn("ms-auto size-4 text-gray-500 transition-transform duration-200", expanded && "rotate-180")}
                  />
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  href={nav.path}
                  className={cn(itemClass, isActive(nav.path) ? "menu-item-active" : "menu-item-inactive")}
                  title={!isOpen ? t(`items.${nav.key}`) : undefined}
                >
                  <span className={isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"}>{nav.icon}</span>
                  {isOpen && <span className="menu-item-text">{t(`items.${nav.key}`)}</span>}
                </Link>
              )
            )}

            {nav.subItems && isOpen && (
              <div className={cn("menu-accordion", expanded && "open")}>
                <div>
                  <ul className="ms-6.5 mt-1 mb-1 space-y-0.5 border-s border-white/10 ps-4">
                    {nav.subItems.map((sub) => (
                      <li key={sub.key}>
                        <Link
                          href={sub.path}
                          className={cn(
                            "menu-dropdown-item",
                            isActive(sub.path) ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive",
                          )}
                        >
                          {t(`items.${sub.key}`)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  const groupLabel = (label: string) =>
    isOpen ? (
      <h2 className="mb-2 px-3.5 text-[11px] font-medium tracking-[0.14em] text-gray-500 uppercase">
        {label}
      </h2>
    ) : (
      <div className="mx-auto mb-3 h-px w-6 bg-white/10" />
    );

  return (
    <aside
      className={cn(
        "fixed inset-y-0 start-0 z-50 flex flex-col bg-charcoal text-white transition-all duration-300 ease-in-out dark:ring-1 dark:ring-white/5",
        "xl:inset-y-3 xl:start-3 xl:rounded-[28px] xl:shadow-card",
        isHovered && !isExpanded && "xl:shadow-float",
        isOpen ? "w-64 px-4" : "w-64 px-4 xl:w-20 xl:px-4",
        isMobileOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full",
        "xl:translate-x-0 xl:rtl:translate-x-0",
      )}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn("flex h-24 shrink-0 items-center", isOpen ? "px-2" : "xl:justify-center")}>
        <Link href={homeForRole(role)}>
          <Wordmark tone="inverted" variant={isOpen ? "full" : "mark"} />
        </Link>
      </div>

      <nav className="no-scrollbar -mx-1 flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-1 pt-2">
        <div className={cn(!isOpen && "xl:flex xl:flex-col xl:items-center")}>
          {groupLabel(t("groups.menu"))}
          {renderItems(main)}
        </div>
        {admin.length > 0 && (
          <div className={cn(!isOpen && "xl:flex xl:flex-col xl:items-center")}>
            {groupLabel("Administration")}
            {renderItems(admin)}
          </div>
        )}
      </nav>

      <div className="shrink-0 space-y-3 py-4">
        {canLodge &&
          (isOpen ? (
            <div className="relative overflow-hidden rounded-3xl bg-charcoal-soft p-5 text-white ring-1 ring-white/5 [@media(max-height:720px)]:hidden">
              <span className="pointer-events-none absolute -end-10 -top-10 size-32 rounded-full bg-brand-500/90 blur-2xl" />
              <span className="relative flex size-9 items-center justify-center rounded-full bg-white/10">
                <FilePlus2 className="size-4.5" strokeWidth={1.75} />
              </span>
              <p className="relative mt-4 text-base leading-snug font-medium">Lodge a new claim</p>
              <p className="relative mt-1 text-theme-xs text-white/60">Capture the loss while the details are fresh.</p>
              <Link
                href={lodgeHref}
                className="relative mt-4 flex h-10 items-center justify-center rounded-full bg-white text-sm font-medium text-ink transition-colors hover:bg-gray-100"
              >
                Start claim
              </Link>
            </div>
          ) : (
            <Link
              href={lodgeHref}
              title="Lodge a new claim"
              className="mx-auto hidden size-12 items-center justify-center rounded-full bg-brand-500 text-white transition-colors hover:bg-brand-600 xl:flex"
            >
              <FilePlus2 className="size-4.5" strokeWidth={1.75} />
            </Link>
          ))}

        <button
          type="button"
          onClick={toggleSidebar}
          className={cn(
            "hidden items-center gap-3 rounded-full py-2.5 text-theme-sm font-medium text-gray-400 transition-colors hover:bg-white/[0.07] hover:text-white xl:flex",
            isOpen ? "w-full px-3.5" : "mx-auto size-12 justify-center",
          )}
          aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isExpanded ? (
            <PanelLeftClose className="size-[18px] rtl:-scale-x-100" strokeWidth={1.75} />
          ) : (
            <PanelLeftOpen className="size-[18px] rtl:-scale-x-100" strokeWidth={1.75} />
          )}
          {isOpen && <span>{isExpanded ? "Collapse sidebar" : "Keep open"}</span>}
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
