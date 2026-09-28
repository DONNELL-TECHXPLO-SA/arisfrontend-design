"use client";

import RequireAuth from "@/components/auth/RequireAuth";
import { useSidebar } from "@/context/SidebarContext";
import { usePathname } from "@/i18n/navigation";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import { cn } from "@/utils";
import React from "react";

// Overview pages use the full width; task pages (claim detail, lodgement, forms) keep a
// narrower reading column.
const WIDE_ROUTES = ["/portal", "/portal/claims", "/portal/support", "/portal/reports", "/portal/profile"];

// User/Client Portal shell — the same sidebar + floating header as the Admin Portal
// (client feedback: one familiar interface), with the client's own navigation.
// Lives at a real "/portal" path segment because the Admin Portal already owns "/".
export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { isExpanded, isMobileOpen } = useSidebar();
  const pathname = usePathname();
  const wide = WIDE_ROUTES.includes(pathname);

  const mainContentMargin = isMobileOpen ? "ms-0" : isExpanded ? "xl:ms-[280px]" : "xl:ms-[104px]";

  return (
    <RequireAuth portal="client">
      <div className="min-h-screen bg-monogram xl:flex">
        <AppSidebar />
        <Backdrop />
        <div className={cn("min-w-0 flex-1 transition-all duration-300 ease-in-out", mainContentMargin)}>
          <AppHeader />
          <div className={cn("mx-auto px-4 pt-2 pb-10 md:px-6", wide ? "max-w-(--breakpoint-2xl)" : "max-w-4xl")}>{children}</div>
        </div>
      </div>
    </RequireAuth>
  );
}
