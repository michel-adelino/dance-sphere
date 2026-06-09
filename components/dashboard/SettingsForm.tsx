"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfileAction } from "@/lib/actions/auth";
import { authClient } from "@/lib/auth/client";
import { toast } from "sonner";
import type { Profile } from "@/lib/db/schema/profiles";

export function SettingsForm({ profile }: { profile: Profile }) {
  const [loading, setLoading] = useState(false);

  async function handleProfileSubmit(formData: FormData) {
    setLoading(true);
    const result = await updateProfileAction(formData);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Profile updated");
    }
    setLoading(false);
  }

  async function handlePasswordChange(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;

    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
    });

    if (error) {
      toast.error(error.message || "Failed to change password");
    } else {
      toast.success("Password changed");
      e.currentTarget.reset();
    }
  }

  return (
    <div className="space-y-10">
      <form action={handleProfileSubmit} className="space-y-5 rounded-2xl border border-border bg-surface p-6">
        <h2 className="font-display text-lg font-semibold">Profile</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              defaultValue={profile.firstName}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              defaultValue={profile.lastName}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="avatarUrl">Avatar URL</Label>
          <Input
            id="avatarUrl"
            name="avatarUrl"
            type="url"
            defaultValue={profile.avatarUrl ?? ""}
            placeholder="https://..."
          />
        </div>

        <Button type="submit" disabled={loading}>
          Save Profile
        </Button>
      </form>

      <form
        onSubmit={handlePasswordChange}
        className="space-y-5 rounded-2xl border border-border bg-surface p-6"
      >
        <h2 className="font-display text-lg font-semibold">Change Password</h2>

        <div className="space-y-2">
          <Label htmlFor="currentPassword">Current Password</Label>
          <Input id="currentPassword" name="currentPassword" type="password" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            minLength={8}
            required
          />
        </div>

        <Button type="submit">Change Password</Button>
      </form>
    </div>
  );
}
