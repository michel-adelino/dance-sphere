import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { format } from "date-fns";
import { Calendar, MapPin } from "lucide-react";
import { getEventBySlug, getSoldTicketsCount } from "@/lib/db/queries/events";
import { getCurrentProfile } from "@/lib/auth/session";
import { formatPrice } from "@/lib/utils";
import { PLACEHOLDER_EVENT_IMAGE } from "@/lib/constants";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

type SearchParams = Promise<{ event?: string }>;

export const metadata = { title: "Checkout" };

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect(`/login?redirect=/checkout?event=${params.event}`);
  }

  if (!params.event) {
    notFound();
  }

  const event = await getEventBySlug(params.event);
  if (!event || event.status !== "published") {
    notFound();
  }

  const sold = await getSoldTicketsCount(event.id);
  const remaining = event.capacity - sold;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4">
        <Link href="/" className="font-display text-lg font-semibold">
          DanceSphere
        </Link>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="font-display text-3xl font-bold">Checkout</h1>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface overflow-hidden">
            <div className="relative aspect-video">
              <Image
                src={event.imageUrl || PLACEHOLDER_EVENT_IMAGE}
                alt={event.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h2 className="font-display text-xl font-semibold">{event.title}</h2>
              <div className="mt-4 space-y-2 text-sm text-muted">
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-secondary" />
                  {format(event.startDate, "PPP p")}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-secondary" />
                  {event.location}, {event.city}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6">
            <p className="text-sm text-muted">Price per ticket</p>
            <p className="font-display text-3xl font-bold text-primary">
              {formatPrice(event.price)}
            </p>
            <p className="mt-2 text-sm text-muted">
              {remaining} tickets remaining
            </p>

            {remaining > 0 ? (
              <CheckoutForm eventSlug={event.slug} maxQuantity={remaining} />
            ) : (
              <p className="mt-6 text-destructive">This event is sold out.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
