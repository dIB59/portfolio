import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import dynamic from "next/dynamic";

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Dashboard",
    robots: {
        index: false,
        follow: false,
    },
};

// Lazy load admin dashboard (heavy component with animations)
const AdminDashboard = dynamic(
    () => import("@/components/admin/admin-dashboard").then((mod) => ({ default: mod.AdminDashboard }))
);

export default async function AdminPage() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
        redirect("/auth/login");
    }

    return <AdminDashboard userEmail={data.user.email || ""} />;
}
