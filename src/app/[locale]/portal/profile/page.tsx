"use client";

import PortalPageHeader from "@/components/portal/PortalPageHeader";
import ProfileOverview from "@/components/user-profile/ProfileOverview";

export default function ClientProfilePage() {
  return (
    <div className="space-y-6">
      <PortalPageHeader title="Profile" subtitle="Your account, preferences and security." />
      <ProfileOverview portal="client" />
    </div>
  );
}
