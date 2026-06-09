"use client";

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { MapPin, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { PLACEHOLDER_EVENT_IMAGE } from "@/lib/constants";
import type { Event, Profile } from "@/lib/db/schema";

type EventWithOrganizer = Event & { organizer: Profile };

export function EventCard({
  event,
  index = 0,
}: {
  event: EventWithOrganizer;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <Link href={`/events/${event.slug}`} className="group block">
        <article className="card-glow overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300">
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={event.imageUrl || PLACEHOLDER_EVENT_IMAGE}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <Badge variant="accent" className="absolute left-3 top-3 capitalize">
              {event.eventType}
            </Badge>
          </div>

          <div className="p-5">
            <h3 className="font-display text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
              {event.title}
            </h3>

            <div className="mt-3 flex flex-col gap-1.5 text-sm text-muted">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-secondary" />
                {format(event.startDate, "PPP")}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-secondary" />
                {event.city}, {event.country}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="font-semibold text-primary">
                {formatPrice(event.price)}
              </span>
              <span className="text-xs text-muted">
                by {event.organizer.firstName} {event.organizer.lastName}
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
