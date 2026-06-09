import { getCurrentProfile } from "@/lib/auth/session";
import { SettingsForm } from "@/components/dashboard/SettingsForm";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const profile = await getCurrentProfile();

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-3xl font-bold">Settings</h1>
      <p className="mt-2 text-muted">Update your profile and account</p>
      <div className="mt-8">
        <SettingsForm profile={profile!} />
      </div>
    </div>
  );
}
