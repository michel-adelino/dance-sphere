import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { payments } from "@/lib/db/schema";
import { fulfillBooking } from "@/lib/actions/booking";
import { getStripe } from "@/lib/stripe";

export type CheckoutConfirmResult =
  | { success: true; alreadyFulfilled: boolean }
  | { success: false; error: string };

export async function confirmCheckoutSession(
  stripeSessionId: string,
  userId: string
): Promise<CheckoutConfirmResult> {
  if (!stripeSessionId) {
    return { success: false, error: "Missing payment session" };
  }

  const stripeSession = await getStripe().checkout.sessions.retrieve(
    stripeSessionId
  );

  if (stripeSession.payment_status !== "paid") {
    return { success: false, error: "Payment was not completed" };
  }

  if (stripeSession.metadata?.userId !== userId) {
    return { success: false, error: "This payment does not belong to your account" };
  }

  const bookingId = stripeSession.metadata?.bookingId;
  if (!bookingId) {
    return { success: false, error: "Invalid payment session" };
  }

  const payment = await db.query.payments.findFirst({
    where: eq(payments.stripeSessionId, stripeSessionId),
  });

  if (!payment) {
    return { success: false, error: "Payment record not found" };
  }

  const alreadyFulfilled = payment.status === "succeeded";

  if (!alreadyFulfilled) {
    await db
      .update(payments)
      .set({ status: "succeeded" })
      .where(eq(payments.id, payment.id));

    await fulfillBooking(bookingId);
  }

  return { success: true, alreadyFulfilled };
}
