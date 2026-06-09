import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Calendar, MapPin, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getEventBySlug, getSoldTicketsCount } from "@/lib/db/queries/events";
import { formatPrice } from "@/lib/utils";
import { PLACEHOLDER_EVENT_IMAGE } from "@/lib/constants";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Event Not Found" };

  return {
    title: event.title,
    description: event.description.slice(0, 160),
    openGraph: {
      title: event.title,
      description: event.description.slice(0, 160),
      images: [event.imageUrl || PLACEHOLDER_EVENT_IMAGE],
    },
  };
}

export default async function EventDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event || event.status !== "published") {
    notFound();
  }

  const sold = await getSoldTicketsCount(event.id);
  const remaining = event.capacity - sold;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative aspect-[21/9] overflow-hidden rounded-3xl">
        <Image
          src={event.imageUrl || PLACEHOLDER_EVENT_IMAGE}
          alt={event.title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1200px) 100vw, 1024px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <Badge variant="accent" className="mb-3 capitalize">
            {event.eventType}
          </Badge>
          <h1 className="font-display text-4xl font-bold sm:text-5xl">
            {event.title}
          </h1>
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="font-display text-xl font-semibold">About</h2>
            <p className="mt-4 whitespace-pre-wrap text-muted leading-relaxed">
              {event.description}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
              <Calendar className="mt-0.5 h-5 w-5 text-secondary" />
              <div>
                <p className="text-sm font-medium">Date & Time</p>
                <p className="text-sm text-muted">
                  {format(event.startDate, "PPP p")}
                </p>
                <p className="text-sm text-muted">
                  to {format(event.endDate, "PPP p")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
              <MapPin className="mt-0.5 h-5 w-5 text-secondary" />
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-muted">{event.location}</p>
                <p className="text-sm text-muted">
                  {event.city}, {event.country}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
              <User className="mt-0.5 h-5 w-5 text-secondary" />
              <div>
                <p className="text-sm font-medium">Organizer</p>
                <p className="text-sm text-muted">
                  {event.organizer.firstName} {event.organizer.lastName}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
              <Users className="mt-0.5 h-5 w-5 text-secondary" />
              <div>
                <p className="text-sm font-medium">Capacity</p>
                <p className="text-sm text-muted">
                  {remaining} of {event.capacity} spots left
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-border bg-surface p-6">
            <p className="text-sm text-muted">Ticket price</p>
            <p className="font-display text-4xl font-bold text-primary">
              {formatPrice(event.price)}
            </p>

            {remaining > 0 ? (
              <Button asChild size="lg" className="mt-6 w-full">
                <Link href={`/checkout?event=${event.slug}`}>
                  Buy Ticket
                </Link>
              </Button>
            ) : (
              <Button disabled size="lg" className="mt-6 w-full">
                Sold Out
              </Button>
            )}

            <p className="mt-4 text-center text-xs text-muted">
              Secure payment via Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
