import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ProfileOverview from "@/components/user-profile/ProfileOverview";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | Aris Claims",
  description: "Your account, preferences and security settings.",
};

export default function Profile() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Profile" />
      <ProfileOverview portal="admin" />
    </div>
  );
}
