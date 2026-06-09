import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Payment Cancelled" };

type SearchParams = Promise<{ event?: string }>;

export default async function CheckoutCancelPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 hero-gradient">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-10 text-center">
        <XCircle className="mx-auto h-16 w-16 text-muted" />
        <h1 className="mt-6 font-display text-2xl font-bold">Payment Cancelled</h1>
        <p className="mt-3 text-muted">
          Your payment was not completed. No charges were made.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          {params.event && (
            <Button asChild>
              <Link href={`/checkout?event=${params.event}`}>Try Again</Link>
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link href="/events">Browse Events</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
