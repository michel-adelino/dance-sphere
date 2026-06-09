import { EventForm } from "@/components/dashboard/EventForm";
import { createEventAction } from "@/lib/actions/events";

export const metadata = { title: "Create Event" };

export default function NewEventPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-bold">Create Event</h1>
      <p className="mt-2 text-muted">Fill in the details for your dance event</p>
      <div className="mt-8">
        <EventForm action={createEventAction} />
      </div>
    </div>
  );
}
