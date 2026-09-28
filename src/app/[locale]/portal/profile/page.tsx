"use client";

import ProfileOverview from "@/components/user-profile/ProfileOverview";

export default function ClientProfilePage() {
  return (
    <div className="space-y-6">
      <h1 className="pt-2 text-title-sm font-medium tracking-tight text-ink dark:text-white">Profile</h1>
      <ProfileOverview portal="client" />
    </div>
  );
}
