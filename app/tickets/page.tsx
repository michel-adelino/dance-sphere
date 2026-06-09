import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Ticket } from "lucide-react";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmailSentNotice } from "@/components/email/EmailSentNotice";
import { getCurrentProfile } from "@/lib/auth/session";
import { getUserTickets } from "@/lib/actions/booking";

export const metadata = { title: "My Tickets" };

export default async function TicketsPage() {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/login?redirect=/tickets");
  }

  const bookings = await getUserTickets(profile.id);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4">
        <Link href="/" className="font-display text-lg font-semibold">
          DanceSphere
        </Link>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="flex items-center gap-3">
          <Ticket className="h-8 w-8 text-primary" />
          <h1 className="font-display text-3xl font-bold">My Tickets</h1>
        </div>

        {bookings.length > 0 && (
          <div className="mt-6">
            <EmailSentNotice email={profile.email} />
          </div>
        )}

        {bookings.length > 0 ? (
          <div className="mt-10 space-y-8">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-2xl border border-border bg-surface p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="font-display text-xl font-semibold">
                      {booking.event.title}
                    </h2>
                    <p className="mt-1 text-sm text-muted">
                      {format(booking.event.startDate, "PPP p")}
                    </p>
                    <p className="text-sm text-muted">
                      {booking.event.location}, {booking.event.city}
                    </p>
                  </div>
                  <Badge variant="success">{booking.quantity} ticket(s)</Badge>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {booking.tickets.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center gap-4 rounded-xl border border-border bg-surface-elevated p-4"
                    >
                      <Image
                        src={t.qrCode}
                        alt={`QR ${t.ticketCode}`}
                        width={100}
                        height={100}
                        className="rounded-lg"
                      />
                      <div>
                        <p className="text-xs text-muted">Ticket ID</p>
                        <p className="font-mono text-sm font-medium">{t.ticketCode}</p>
                        <Badge variant="outline" className="mt-2 capitalize">
                          {t.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-border p-16 text-center">
            <p className="text-muted">You don&apos;t have any tickets yet</p>
            <Button asChild className="mt-4">
              <Link href="/events">Browse Events</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
