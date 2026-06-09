import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import type { Profile } from "@/lib/db/schema/profiles";

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const session = await getSession();
  if (!session?.user?.id) return null;

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, session.user.id),
  });

  return profile ?? null;
}

export async function requireProfile(allowedRoles?: Profile["role"][]) {
  const profile = await getCurrentProfile();
  if (!profile) {
    throw new Error("Unauthorized");
  }
  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    throw new Error("Forbidden");
  }
  return profile;
}
