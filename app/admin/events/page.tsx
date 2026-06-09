import { format } from "date-fns";
import Link from "next/link";
import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EventStatusSelect } from "@/components/admin/EventStatusSelect";
import { desc } from "drizzle-orm";

export const metadata = { title: "Manage Events" };

export default async function AdminEventsPage() {
  const allEvents = await db
    .select()
    .from(events)
    .orderBy(desc(events.createdAt));

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Events</h1>
      <p className="mt-2 text-muted">Moderate and manage all platform events</p>

      <div className="mt-8 rounded-2xl border border-border bg-surface">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allEvents.map((event) => (
              <TableRow key={event.id}>
                <TableCell>
                  <Link
                    href={`/events/${event.slug}`}
                    className="font-medium hover:text-primary"
                  >
                    {event.title}
                  </Link>
                </TableCell>
                <TableCell>{event.city}</TableCell>
                <TableCell>{format(event.startDate, "PP")}</TableCell>
                <TableCell>
                  <Badge className="capitalize">{event.status}</Badge>
                </TableCell>
                <TableCell>
                  <EventStatusSelect
                    eventId={event.id}
                    currentStatus={event.status}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
