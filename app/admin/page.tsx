import { Users, Calendar, Ticket, DollarSign } from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { getPlatformStats } from "@/lib/db/queries/events";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Admin" };

export default async function AdminPage() {
  const stats = await getPlatformStats();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Platform Statistics</h1>
      <p className="mt-2 text-muted">Overview of DanceSphere activity</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard title="Total Users" value={stats.users} icon={Users} />
        <KPICard title="Total Events" value={stats.events} icon={Calendar} />
        <KPICard title="Tickets Issued" value={stats.tickets} icon={Ticket} />
        <KPICard
          title="Total Revenue"
          value={formatPrice(stats.revenue)}
          icon={DollarSign}
        />
      </div>
    </div>
  );
}
