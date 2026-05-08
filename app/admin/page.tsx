import { redirect } from "next/navigation";
import nextDynamic from "next/dynamic";
import type { Metadata } from "next";
import { getSession } from "@/lib/db/auth";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

// Auth check needs request cookies; never prerender.
export const dynamic = "force-dynamic";

const AdminDashboard = nextDynamic(
  () =>
    import("@/components/admin/admin-dashboard").then((mod) => ({
      default: mod.AdminDashboard,
    })),
);

export default async function AdminPage() {
  const session = await getSession();

  if (!session.isAdmin) {
    redirect("/auth/login");
  }

  return <AdminDashboard userEmail={session.email ?? "admin"} />;
}
