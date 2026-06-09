import Link from "next/link";
import { Calendar, Ticket, Users, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchBar } from "@/components/events/SearchBar";
import { EventCard } from "@/components/events/EventCard";
import { getFeaturedEvents } from "@/lib/db/queries/events";
import { DANCE_STYLES } from "@/lib/constants";
import { becomeOrganizerAction } from "@/lib/actions/auth";

export default async function HomePage() {
  const featuredEvents = await getFeaturedEvents(6);

  return (
    <>
      <section className="relative overflow-hidden hero-gradient grain-overlay">
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-6">
              <Sparkles className="mr-1 h-3 w-3" />
              The dance community platform
            </Badge>
            <h1 className="font-display text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Move.{" "}
              <span className="text-primary">Connect.</span>{" "}
              Dance.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted">
              Discover unforgettable dance events across the globe. Book tickets,
              meet fellow dancers, and let the rhythm guide you.
            </p>
            <div className="mt-10">
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-semibold">Browse by Style</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {DANCE_STYLES.map((style) => (
            <Link key={style.value} href={`/events?eventType=${style.value}`}>
              <Badge
                variant="outline"
                className="cursor-pointer px-4 py-2 text-sm capitalize transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent"
              >
                {style.label}
              </Badge>
            </Link>
          ))}
        </div>
      </section>

      <div className="gradient-divider mx-auto max-w-7xl" />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-semibold">Featured Events</h2>
            <p className="mt-2 text-muted">Handpicked experiences for every dancer</p>
          </div>
          <Button variant="ghost" asChild className="hidden sm:flex gap-1">
            <Link href="/events">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {featuredEvents.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredEvents.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
            <p className="text-muted">No upcoming events yet. Check back soon!</p>
            <Button asChild className="mt-4">
              <Link href="/events">Browse Events</Link>
            </Button>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center font-display text-3xl font-semibold">
          Why DanceSphere?
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            {
              icon: Calendar,
              title: "Discover Events",
              desc: "Find salsa nights, workshops, battles, and festivals in your city and beyond.",
            },
            {
              icon: Ticket,
              title: "Book Instantly",
              desc: "Secure tickets with one click. Get QR codes and email confirmations instantly.",
            },
            {
              icon: Users,
              title: "Connect",
              desc: "Meet organizers, teachers, and dancers who share your passion for movement.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-border bg-surface p-8 text-center transition-colors hover:border-primary/30"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15">
                <item.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/30 via-accent/20 to-secondary/20 p-10 sm:p-14">
          <div className="relative z-10 max-w-xl">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Host your own dance event
            </h2>
            <p className="mt-4 text-muted">
              Sell tickets, manage participants, and grow your dance community
              with our organizer dashboard.
            </p>
            <form action={becomeOrganizerAction} className="mt-8">
              <Button type="submit" size="lg" variant="secondary">
                Become an Organizer
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
