"use server";

import { and, eq, sum } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { nanoid } from "nanoid";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { bookings, events, payments, profiles } from "@/lib/db/schema";
import { getStripe } from "@/lib/stripe";
import { generateQrCode, generateTicketCode } from "@/lib/tickets/generate";
import { sendTicketConfirmationEmail } from "@/lib/email/send";
import { tickets } from "@/lib/db/schema/tickets";
import { format } from "date-fns";

export async function createCheckoutAction(eventSlug: string, quantity: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect(`/login?redirect=/checkout?event=${eventSlug}`);
  }

  const event = await db.query.events.findFirst({
    where: eq(events.slug, eventSlug),
  });

  if (!event || event.status !== "published") {
    return { error: "Event not found" };
  }

  const soldResult = await db
    .select({ total: sum(bookings.quantity) })
    .from(bookings)
    .where(
      and(eq(bookings.eventId, event.id), eq(bookings.status, "confirmed"))
    );

  const sold = Number(soldResult[0]?.total ?? 0);
  const remaining = event.capacity - sold;

  if (quantity < 1 || quantity > remaining) {
    return { error: `Only ${remaining} tickets remaining` };
  }

  const bookingId = nanoid();
  const paymentId = nanoid();
  const amount = event.price * quantity;

  await db.insert(bookings).values({
    id: bookingId,
    userId: session.user.id,
    eventId: event.id,
    quantity,
    status: "pending",
  });

  const stripeSession = await getStripe().checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: event.title,
            description: `${quantity} ticket(s) for ${event.title}`,
          },
          unit_amount: event.price,
        },
        quantity,
      },
    ],
    metadata: {
      bookingId,
      eventId: event.id,
      userId: session.user.id,
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel?event=${eventSlug}`,
    customer_email: session.user.email,
  });

  await db.insert(payments).values({
    id: paymentId,
    bookingId,
    stripeSessionId: stripeSession.id,
    amount,
    status: "pending",
  });

  if (!stripeSession.url) {
    return { error: "Failed to create checkout session" };
  }

  redirect(stripeSession.url);
}

export async function fulfillBooking(bookingId: string) {
  const booking = await db.query.bookings.findFirst({
    where: eq(bookings.id, bookingId),
    with: {
      event: true,
      user: true,
      payment: true,
    },
  });

  if (!booking || booking.status === "confirmed") return;

  const soldResult = await db
    .select({ total: sum(bookings.quantity) })
    .from(bookings)
    .where(
      and(
        eq(bookings.eventId, booking.eventId),
        eq(bookings.status, "confirmed")
      )
    );

  const sold = Number(soldResult[0]?.total ?? 0);
  if (sold + booking.quantity > booking.event.capacity) {
    await db
      .update(bookings)
      .set({ status: "cancelled" })
      .where(eq(bookings.id, bookingId));
    return;
  }

  await db
    .update(bookings)
    .set({ status: "confirmed" })
    .where(eq(bookings.id, bookingId));

  const generatedTickets = [];
  for (let i = 0; i < booking.quantity; i++) {
    const ticketId = nanoid();
    const ticketCode = await generateTicketCode(booking.event.slug);
    const qrCode = await generateQrCode({
      ticketId,
      eventId: booking.eventId,
      userId: booking.userId,
    });

    await db.insert(tickets).values({
      id: ticketId,
      bookingId,
      ticketCode,
      qrCode,
      status: "valid",
    });

    generatedTickets.push({ ticketCode, qrCode });
  }

  // Email is mocked until Resend is configured — see lib/email/send.ts
  if (booking.user?.email) {
    await sendTicketConfirmationEmail({
      to: booking.user.email,
      eventTitle: booking.event.title,
      eventDate: format(booking.event.startDate, "PPP p"),
      eventLocation: `${booking.event.location}, ${booking.event.city}`,
      tickets: generatedTickets,
    });
  }
}

export async function getUserTickets(userId: string) {
  const results = await db.query.bookings.findMany({
    where: and(
      eq(bookings.userId, userId),
      eq(bookings.status, "confirmed")
    ),
    with: {
      event: true,
      tickets: true,
    },
  });

  return results.sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
}

export async function getParticipantsForOrganizer(organizerId: string, eventId?: string) {
  const conditions = [eq(events.organizerId, organizerId), eq(bookings.status, "confirmed")];

  const query = db
    .select({
      firstName: profiles.firstName,
      lastName: profiles.lastName,
      email: profiles.email,
      quantity: bookings.quantity,
      createdAt: bookings.createdAt,
      eventTitle: events.title,
      eventId: events.id,
    })
    .from(bookings)
    .innerJoin(profiles, eq(bookings.userId, profiles.id))
    .innerJoin(events, eq(bookings.eventId, events.id))
    .where(
      eventId
        ? and(...conditions, eq(events.id, eventId))
        : and(...conditions)
    );

  return query;
}
