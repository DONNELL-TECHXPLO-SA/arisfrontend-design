"use client";

import RequireAuth from "@/components/auth/RequireAuth";
import ClientBottomNav from "@/layout/ClientBottomNav";
import ClientTopNav from "@/layout/ClientTopNav";
import React from "react";

// User/Client Portal shell — no sidebar, per ux-blueprint.md §8.4/§10.3: top nav
// (desktop/tablet) doubling as the header, bottom nav (mobile). Lives at a real
// "/portal" path segment (not a route group) because the Admin Portal already owns "/".
export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth portal="client">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <ClientTopNav />
        <main className="mx-auto max-w-(--breakpoint-md) px-4 pt-6 pb-24 md:pb-10">{children}</main>
        <ClientBottomNav />
      </div>
    </RequireAuth>
  );
}
