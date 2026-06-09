import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { bookings } from "./bookings";

export const ticketStatusEnum = pgEnum("ticket_status", [
  "valid",
  "used",
  "cancelled",
]);

export const tickets = pgTable("tickets", {
  id: text("id").primaryKey(),
  bookingId: text("booking_id")
    .notNull()
    .references(() => bookings.id, { onDelete: "cascade" }),
  ticketCode: text("ticket_code").notNull().unique(),
  qrCode: text("qr_code").notNull(),
  status: ticketStatusEnum("status").notNull().default("valid"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Ticket = typeof tickets.$inferSelect;
