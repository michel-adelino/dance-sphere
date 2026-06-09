import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth/session";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login?redirect=/dashboard");
  }

  if (profile.role !== "organizer" && profile.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center border-b border-border px-8">
          <Link href="/" className="text-sm text-muted hover:text-primary">
            ← Back to site
          </Link>
        </header>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
