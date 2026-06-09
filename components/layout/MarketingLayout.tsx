import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { getCurrentProfile } from "@/lib/auth/session";

export async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();

  const user = profile
    ? {
        name: `${profile.firstName} ${profile.lastName}`,
        email: profile.email,
        image: profile.avatarUrl,
        role: profile.role,
      }
    : null;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
