import Link from "next/link";
import { format } from "date-fns";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCurrentProfile } from "@/lib/auth/session";
import { getEvents, getSoldTicketsCount } from "@/lib/db/queries/events";
import { formatPrice } from "@/lib/utils";
import { DeleteEventButton } from "@/components/dashboard/DeleteEventButton";

export const metadata = { title: "My Events" };

export default async function DashboardEventsPage() {
  const profile = await getCurrentProfile();
  const { events } = await getEvents({
    organizerId: profile!.id,
    status: undefined,
  });

  const eventsWithSold = await Promise.all(
    events.map(async (event) => ({
      ...event,
      sold: await getSoldTicketsCount(event.id),
    }))
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">My Events</h1>
          <p className="mt-2 text-muted">Create and manage your dance events</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/events/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Link>
        </Button>
      </div>

      {eventsWithSold.length > 0 ? (
        <div className="mt-8 rounded-2xl border border-border bg-surface">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Sold / Capacity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventsWithSold.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>{format(event.startDate, "PP")}</TableCell>
                  <TableCell>
                    {event.sold} / {event.capacity}
                  </TableCell>
                  <TableCell>{formatPrice(event.price)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        event.status === "published"
                          ? "success"
                          : event.status === "draft"
                          ? "secondary"
                          : "outline"
                      }
                      className="capitalize"
                    >
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/events/${event.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeleteEventButton eventId={event.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="text-muted">No events yet. Create your first one!</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/events/new">Create Event</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
