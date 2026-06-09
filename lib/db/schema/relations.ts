import { relations } from "drizzle-orm";
import { user, session, account } from "./auth";
import { profiles } from "./profiles";
import { events } from "./events";
import { bookings } from "./bookings";
import { tickets } from "./tickets";
import { payments } from "./payments";

export const userRelations = relations(user, ({ one, many }) => ({
  profile: one(profiles, { fields: [user.id], references: [profiles.id] }),
  sessions: many(session),
  accounts: many(account),
}));

export const profileRelations = relations(profiles, ({ many }) => ({
  events: many(events),
  bookings: many(bookings),
}));

export const eventRelations = relations(events, ({ one, many }) => ({
  organizer: one(profiles, {
    fields: [events.organizerId],
    references: [profiles.id],
  }),
  bookings: many(bookings),
}));

export const bookingRelations = relations(bookings, ({ one, many }) => ({
  user: one(profiles, { fields: [bookings.userId], references: [profiles.id] }),
  event: one(events, { fields: [bookings.eventId], references: [events.id] }),
  tickets: many(tickets),
  payment: one(payments, { fields: [bookings.id], references: [payments.bookingId] }),
}));

export const ticketRelations = relations(tickets, ({ one }) => ({
  booking: one(bookings, {
    fields: [tickets.bookingId],
    references: [bookings.id],
  }),
}));

export const paymentRelations = relations(payments, ({ one }) => ({
  booking: one(bookings, {
    fields: [payments.bookingId],
    references: [bookings.id],
  }),
}));
