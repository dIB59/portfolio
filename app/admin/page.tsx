import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import dynamic from "next/dynamic";

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
