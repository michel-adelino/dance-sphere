"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { registerSchema } from "@/lib/validations/auth";
import { nanoid } from "nanoid";

export async function registerAction(formData: FormData) {
  const raw = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input" };
  }

  const { firstName, lastName, email, password } = parsed.data;

  try {
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: `${firstName} ${lastName}`,
      },
      headers: await headers(),
    });

    if (!result?.user?.id) {
      return { error: "Registration failed" };
    }

    const existingProfiles = await db.select({ count: profiles.id }).from(profiles);
    const isFirstUser = existingProfiles.length === 0;

    await db.insert(profiles).values({
      id: result.user.id,
      firstName,
      lastName,
      email,
      role: isFirstUser ? "admin" : "dancer",
    });

    redirect("/");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Registration failed";
    if (message.includes("NEXT_REDIRECT")) throw error;
    return { error: message };
  }
}

export async function becomeOrganizerAction() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/login?redirect=/");
  }

  await db
    .update(profiles)
    .set({ role: "organizer" })
    .where(eq(profiles.id, session.user.id));

  redirect("/dashboard");
}

export async function updateProfileAction(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const avatarUrl = formData.get("avatarUrl") as string;

  await db
    .update(profiles)
    .set({
      firstName,
      lastName,
      avatarUrl: avatarUrl || null,
    })
    .where(eq(profiles.id, session.user.id));

  return { success: true };
}

export async function updateUserRoleAction(userId: string, role: "dancer" | "organizer" | "admin") {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return { error: "Not authenticated" };

  const adminProfile = await db.query.profiles.findFirst({
    where: eq(profiles.id, session.user.id),
  });

  if (adminProfile?.role !== "admin") {
    return { error: "Forbidden" };
  }

  await db.update(profiles).set({ role }).where(eq(profiles.id, userId));
  return { success: true };
}
