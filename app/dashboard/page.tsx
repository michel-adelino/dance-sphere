import { Calendar, Ticket, DollarSign, Users } from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { getCurrentProfile } from "@/lib/auth/session";
import { getOrganizerStats } from "@/lib/db/queries/events";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const profile = await getCurrentProfile();
  const stats = await getOrganizerStats(profile!.id);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">
        Welcome, {profile!.firstName}
      </h1>
      <p className="mt-2 text-muted">Here&apos;s how your events are performing</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard title="Total Events" value={stats.totalEvents} icon={Calendar} />
        <KPICard title="Tickets Sold" value={stats.ticketsSold} icon={Ticket} />
        <KPICard
          title="Revenue"
          value={formatPrice(stats.revenue)}
          icon={DollarSign}
        />
        <KPICard
          title="Participants"
          value={stats.participants}
          icon={Users}
        />
      </div>
    </div>
  );
}
