import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { EventForm } from "@/components/dashboard/EventForm";
import { updateEventAction } from "@/lib/actions/events";
import { getCurrentProfile } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  return { title: "Edit Event" };
}

export default async function EditEventPage({ params }: { params: Params }) {
  const { id } = await params;
  const profile = await getCurrentProfile();

  const event = await db.query.events.findFirst({
    where: eq(events.id, id),
  });

  if (!event) notFound();
  if (event.organizerId !== profile!.id && profile!.role !== "admin") {
    notFound();
  }

  const boundAction = updateEventAction.bind(null, id);

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-bold">Edit Event</h1>
      <p className="mt-2 text-muted">Update your event details</p>
      <div className="mt-8">
        <EventForm action={boundAction} event={event} />
      </div>
    </div>
  );
}
