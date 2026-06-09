import Link from "next/link";
import { Suspense } from "react";
import { EventCard } from "@/components/events/EventCard";
import { EventFilters } from "@/components/events/EventFilters";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getEvents,
  getDistinctCities,
  getDistinctCountries,
} from "@/lib/db/queries/events";

export const metadata = {
  title: "Events",
  description: "Browse and discover dance events worldwide",
};

type SearchParams = Promise<{
  search?: string;
  city?: string;
  country?: string;
  eventType?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: string;
}>;

export default async function EventsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const [{ events, totalPages }, cities, countries] = await Promise.all([
    getEvents({
      search: params.search,
      city: params.city,
      country: params.country,
      eventType: params.eventType,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
      page,
    }),
    getDistinctCities(),
    getDistinctCountries(),
  ]);

  const buildPageUrl = (p: number) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v && k !== "page") q.set(k, v);
    });
    q.set("page", String(p));
    return `/events?${q.toString()}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-bold">Dance Events</h1>
        <p className="mt-2 text-muted">
          Find your next dance experience
        </p>
      </div>

      <Suspense fallback={<Skeleton className="h-40 w-full" />}>
        <EventFilters cities={cities} countries={countries} />
      </Suspense>

      {events.length > 0 ? (
        <>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              {page > 1 && (
                <Button variant="outline" asChild>
                  <Link href={buildPageUrl(page - 1)}>Previous</Link>
                </Button>
              )}
              <span className="px-4 text-sm text-muted">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Button variant="outline" asChild>
                  <Link href={buildPageUrl(page + 1)}>Next</Link>
                </Button>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-border bg-surface p-16 text-center">
          <p className="text-lg text-muted">No events match your filters</p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/events">Clear filters</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
