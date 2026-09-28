"use client";

import RequireAuth from "@/components/auth/RequireAuth";
import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isMobileOpen } = useSidebar();

  // Main column clears the floating sidebar: panel width + its 12px inset + a 12px gutter.
  // Hover-expansion overlays the content rather than reflowing it.
  const mainContentMargin = isMobileOpen
    ? "ms-0"
    : isExpanded
    ? "xl:ms-[280px]"
    : "xl:ms-[104px]";

  return (
    <RequireAuth portal="admin">
      <div className="min-h-screen bg-monogram xl:flex">
        {/* Sidebar and Backdrop */}
        <AppSidebar />
        <Backdrop />
        {/* Main Content Area */}
        <div
          className={`min-w-0 flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
        >
          {/* Header */}
          <AppHeader />
          {/* Page Content */}
          <div className="mx-auto max-w-(--breakpoint-2xl) px-4 pt-2 pb-10 md:px-6">{children}</div>
        </div>
      </div>
    </RequireAuth>
  );
}
