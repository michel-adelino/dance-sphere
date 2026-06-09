import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { profiles } from "./profiles";

export const eventTypeEnum = pgEnum("event_type", [
  "salsa",
  "bachata",
  "hip-hop",
  "contemporary",
  "ballroom",
  "tango",
  "swing",
  "kizomba",
  "other",
]);

export const eventStatusEnum = pgEnum("event_status", [
  "draft",
  "published",
  "cancelled",
]);

export const events = pgTable(
  "events",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description").notNull(),
    eventType: eventTypeEnum("event_type").notNull().default("other"),
    imageUrl: text("image_url"),
    location: text("location").notNull(),
    city: text("city").notNull(),
    country: text("country").notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    capacity: integer("capacity").notNull(),
    price: integer("price").notNull(),
    organizerId: text("organizer_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    status: eventStatusEnum("status").notNull().default("draft"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("events_filter_idx").on(
      table.city,
      table.country,
      table.eventType,
      table.startDate
    ),
  ]
);

export type Event = typeof events.$inferSelect;
export type EventType = (typeof eventTypeEnum.enumValues)[number];
