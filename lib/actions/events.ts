"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { events, profiles } from "@/lib/db/schema";
import { eventSchema } from "@/lib/validations/event";
import { slugify } from "@/lib/utils";

async function requireOrganizer() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, session.user.id),
  });

  if (!profile || (profile.role !== "organizer" && profile.role !== "admin")) {
    throw new Error("Forbidden");
  }

  return { session, profile };
}

export async function createEventAction(formData: FormData) {
  const { profile } = await requireOrganizer();

  const raw = Object.fromEntries(formData.entries());
  const parsed = eventSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input" };
  }

  const data = parsed.data;
  const slug = slugify(data.title) + "-" + nanoid(6);

  await db.insert(events).values({
    id: nanoid(),
    title: data.title,
    slug,
    description: data.description,
    eventType: data.eventType,
    imageUrl: data.imageUrl || null,
    location: data.location,
    city: data.city,
    country: data.country,
    startDate: new Date(data.startDate),
    endDate: new Date(data.endDate),
    capacity: data.capacity,
    price: Math.round(data.price * 100),
    organizerId: profile.id,
    status: data.status,
  });

  revalidatePath("/events");
  revalidatePath("/dashboard");
  redirect("/dashboard/events");
}

export async function updateEventAction(eventId: string, formData: FormData) {
  const { profile } = await requireOrganizer();

  const event = await db.query.events.findFirst({
    where: eq(events.id, eventId),
  });

  if (!event) return { error: "Event not found" };
  if (event.organizerId !== profile.id && profile.role !== "admin") {
    return { error: "Forbidden" };
  }

  const raw = Object.fromEntries(formData.entries());
  const parsed = eventSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input" };
  }

  const data = parsed.data;

  await db
    .update(events)
    .set({
      title: data.title,
      description: data.description,
      eventType: data.eventType,
      imageUrl: data.imageUrl || null,
      location: data.location,
      city: data.city,
      country: data.country,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      capacity: data.capacity,
      price: Math.round(data.price * 100),
      status: data.status,
    })
    .where(eq(events.id, eventId));

  revalidatePath("/events");
  revalidatePath(`/events/${event.slug}`);
  revalidatePath("/dashboard");
  redirect("/dashboard/events");
}

export async function deleteEventAction(eventId: string) {
  const { profile } = await requireOrganizer();

  const event = await db.query.events.findFirst({
    where: eq(events.id, eventId),
  });

  if (!event) return { error: "Event not found" };
  if (event.organizerId !== profile.id && profile.role !== "admin") {
    return { error: "Forbidden" };
  }

  await db
    .update(events)
    .set({ status: "cancelled" })
    .where(eq(events.id, eventId));

  revalidatePath("/events");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function moderateEventAction(
  eventId: string,
  status: "draft" | "published" | "cancelled"
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return { error: "Unauthorized" };

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, session.user.id),
  });

  if (profile?.role !== "admin") return { error: "Forbidden" };

  await db.update(events).set({ status }).where(eq(events.id, eventId));
  revalidatePath("/events");
  revalidatePath("/admin");
  return { success: true };
}
