import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Statistics" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/events", label: "Events" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login?redirect=/admin");
  }

  if (profile.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 shrink-0 border-r border-border bg-surface p-6">
        <h2 className="font-display text-lg font-semibold">Admin</h2>
        <p className="text-xs text-muted">Platform management</p>
        <nav className="mt-8 space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "block rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface-elevated hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/"
          className="mt-8 block text-sm text-muted hover:text-primary"
        >
          ← Back to site
        </Link>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
