import { format } from "date-fns";
import { getCurrentProfile } from "@/lib/auth/session";
import { getParticipantsForOrganizer } from "@/lib/actions/booking";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExportCsvButton } from "@/components/dashboard/ExportCsvButton";

export const metadata = { title: "Participants" };

export default async function ParticipantsPage() {
  const profile = await getCurrentProfile();
  const participants = await getParticipantsForOrganizer(profile!.id);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Participants</h1>
          <p className="mt-2 text-muted">View attendees across your events</p>
        </div>
        <ExportCsvButton data={participants} />
      </div>

      {participants.length > 0 ? (
        <div className="mt-8 rounded-2xl border border-border bg-surface">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Tickets</TableHead>
                <TableHead>Purchased</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.map((p, i) => (
                <TableRow key={i}>
                  <TableCell>
                    {p.firstName} {p.lastName}
                  </TableCell>
                  <TableCell>{p.email}</TableCell>
                  <TableCell>{p.eventTitle}</TableCell>
                  <TableCell>{p.quantity}</TableCell>
                  <TableCell>{format(p.createdAt, "PP")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="text-muted">No participants yet</p>
        </div>
      )}
    </div>
  );
}
