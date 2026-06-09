import {
  and,
  count,
  desc,
  eq,
  gte,
  ilike,
  lte,
  or,
  sql,
  sum,
} from "drizzle-orm";
import { db } from "@/lib/db";
import {
  bookings,
  events,
  payments,
  profiles,
  tickets,
} from "@/lib/db/schema";
import { EVENTS_PER_PAGE } from "@/lib/constants";

export type EventFilters = {
  search?: string;
  city?: string;
  country?: string;
  eventType?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  status?: "draft" | "published" | "cancelled";
  organizerId?: string;
};

export async function getEvents(filters: EventFilters = {}) {
  const page = filters.page ?? 1;
  const offset = (page - 1) * EVENTS_PER_PAGE;

  const conditions = [];

  if (filters.status) {
    conditions.push(eq(events.status, filters.status));
  } else if (!filters.organizerId) {
    conditions.push(eq(events.status, "published"));
  }

  if (filters.organizerId) {
    conditions.push(eq(events.organizerId, filters.organizerId));
  }

  if (filters.search) {
    conditions.push(
      or(
        ilike(events.title, `%${filters.search}%`),
        ilike(events.description, `%${filters.search}%`),
        ilike(events.city, `%${filters.search}%`)
      )!
    );
  }

  if (filters.city) {
    conditions.push(ilike(events.city, `%${filters.city}%`));
  }

  if (filters.country) {
    conditions.push(ilike(events.country, `%${filters.country}%`));
  }

  if (filters.eventType) {
    conditions.push(
      eq(events.eventType, filters.eventType as typeof events.eventType.enumValues[number])
    );
  }

  if (filters.dateFrom) {
    conditions.push(gte(events.startDate, new Date(filters.dateFrom)));
  }

  if (filters.dateTo) {
    conditions.push(lte(events.startDate, new Date(filters.dateTo)));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [items, totalResult] = await Promise.all([
    db.query.events.findMany({
      where,
      with: { organizer: true },
      orderBy: [desc(events.startDate)],
      limit: EVENTS_PER_PAGE,
      offset,
    }),
    db.select({ count: count() }).from(events).where(where),
  ]);

  const total = totalResult[0]?.count ?? 0;

  return {
    events: items,
    total,
    page,
    totalPages: Math.ceil(total / EVENTS_PER_PAGE),
  };
}

export async function getEventBySlug(slug: string) {
  return db.query.events.findFirst({
    where: eq(events.slug, slug),
    with: { organizer: true },
  });
}

export async function getEventById(id: string) {
  return db.query.events.findFirst({
    where: eq(events.id, id),
    with: { organizer: true },
  });
}

export async function getFeaturedEvents(limit = 6) {
  return db.query.events.findMany({
    where: and(
      eq(events.status, "published"),
      gte(events.startDate, new Date())
    ),
    with: { organizer: true },
    orderBy: [desc(events.startDate)],
    limit,
  });
}

export async function getSoldTicketsCount(eventId: string) {
  const result = await db
    .select({ total: sum(bookings.quantity) })
    .from(bookings)
    .where(
      and(
        eq(bookings.eventId, eventId),
        eq(bookings.status, "confirmed")
      )
    );
  return Number(result[0]?.total ?? 0);
}

export async function getOrganizerStats(organizerId: string) {
  const organizerEvents = await db
    .select({ id: events.id })
    .from(events)
    .where(eq(events.organizerId, organizerId));

  const eventIds = organizerEvents.map((e) => e.id);
  if (eventIds.length === 0) {
    return { totalEvents: 0, ticketsSold: 0, revenue: 0, participants: 0 };
  }

  const [ticketsSold, revenue, participants] = await Promise.all([
    db
      .select({ total: sum(bookings.quantity) })
      .from(bookings)
      .innerJoin(events, eq(bookings.eventId, events.id))
      .where(
        and(
          eq(events.organizerId, organizerId),
          eq(bookings.status, "confirmed")
        )
      ),
    db
      .select({ total: sum(payments.amount) })
      .from(payments)
      .innerJoin(bookings, eq(payments.bookingId, bookings.id))
      .innerJoin(events, eq(bookings.eventId, events.id))
      .where(
        and(
          eq(events.organizerId, organizerId),
          eq(payments.status, "succeeded")
        )
      ),
    db
      .select({ count: sql<number>`count(distinct ${bookings.userId})` })
      .from(bookings)
      .innerJoin(events, eq(bookings.eventId, events.id))
      .where(
        and(
          eq(events.organizerId, organizerId),
          eq(bookings.status, "confirmed")
        )
      ),
  ]);

  return {
    totalEvents: eventIds.length,
    ticketsSold: Number(ticketsSold[0]?.total ?? 0),
    revenue: Number(revenue[0]?.total ?? 0),
    participants: Number(participants[0]?.count ?? 0),
  };
}

export async function getPlatformStats() {
  const [userCount, eventCount, ticketCount, revenue] = await Promise.all([
    db.select({ count: count() }).from(profiles),
    db.select({ count: count() }).from(events),
    db.select({ count: count() }).from(tickets),
    db
      .select({ total: sum(payments.amount) })
      .from(payments)
      .where(eq(payments.status, "succeeded")),
  ]);

  return {
    users: userCount[0]?.count ?? 0,
    events: eventCount[0]?.count ?? 0,
    tickets: ticketCount[0]?.count ?? 0,
    revenue: Number(revenue[0]?.total ?? 0),
  };
}

export async function getDistinctCities() {
  const result = await db
    .selectDistinct({ city: events.city })
    .from(events)
    .where(eq(events.status, "published"));
  return result.map((r) => r.city).filter(Boolean);
}

export async function getDistinctCountries() {
  const result = await db
    .selectDistinct({ country: events.country })
    .from(events)
    .where(eq(events.status, "published"));
  return result.map((r) => r.country).filter(Boolean);
}
