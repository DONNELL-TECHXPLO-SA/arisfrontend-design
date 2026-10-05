"use client";

import RequireAuth from "@/components/auth/RequireAuth";
import { useSidebar } from "@/context/SidebarContext";
import { usePathname } from "@/i18n/navigation";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import { cn } from "@/utils";
import React from "react";

// Task pages (lodging a claim) keep a narrower reading column; the rest use full width.
const NARROW_ROUTES = ["/portal/claims/new"];

// User/Client Portal shell — the same collapsible floating sidebar + header as the Admin
// Portal (client feedback: one familiar interface), on the Aris monogram canvas, with the
// client's own grouped navigation. Lives at "/portal" because the Admin Portal owns "/".
export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { isExpanded, isMobileOpen } = useSidebar();
  const pathname = usePathname();
  const narrow = NARROW_ROUTES.includes(pathname);
  const mainContentMargin = isMobileOpen ? "ms-0" : isExpanded ? "xl:ms-[280px]" : "xl:ms-[104px]";

  return (
    <RequireAuth portal="client">
      <div className="min-h-screen bg-monogram xl:flex">
        <AppSidebar />
        <Backdrop />
        <div className={cn("min-w-0 flex-1 transition-all duration-300 ease-in-out", mainContentMargin)}>
          <AppHeader />
          <div className={cn("mx-auto px-4 pt-2 pb-10 md:px-6", narrow ? "max-w-3xl" : "max-w-(--breakpoint-2xl)")}>{children}</div>
        </div>
      </div>
    </RequireAuth>
  );
}
