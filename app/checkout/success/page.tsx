import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmailSentNotice } from "@/components/email/EmailSentNotice";
import { getCurrentProfile } from "@/lib/auth/session";
import { confirmCheckoutSession } from "@/lib/stripe/checkout";

export const metadata = { title: "Payment Successful" };

type SearchParams = Promise<{ session_id?: string }>;

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login?redirect=/tickets");
  }

  const { session_id } = await searchParams;

  if (!session_id) {
    return (
      <CheckoutResult
        success={false}
        message="Missing payment session. If you completed payment, check My Tickets."
        email={profile.email}
      />
    );
  }

  const result = await confirmCheckoutSession(session_id, profile.id);

  if (!result.success) {
    return (
      <CheckoutResult
        success={false}
        message={result.error}
        email={profile.email}
      />
    );
  }

  return (
    <CheckoutResult
      success={true}
      message="Your tickets have been generated and are ready to use."
      email={profile.email}
    />
  );
}

function CheckoutResult({
  success,
  message,
  email,
}: {
  success: boolean;
  message: string;
  email: string;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 hero-gradient">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-10 text-center">
        {success ? (
          <CheckCircle className="mx-auto h-16 w-16 text-primary" />
        ) : (
          <XCircle className="mx-auto h-16 w-16 text-muted" />
        )}
        <h1 className="mt-6 font-display text-2xl font-bold">
          {success ? "Payment Successful!" : "Payment Issue"}
        </h1>
        <p className="mt-3 text-muted">{message}</p>

        {success && (
          <div className="mt-6">
            <EmailSentNotice email={email} />
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3">
          <Button asChild>
            <Link href="/tickets">View My Tickets</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/events">Browse More Events</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
