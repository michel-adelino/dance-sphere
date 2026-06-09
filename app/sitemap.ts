import { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  let publishedEvents: { slug: string; createdAt: Date }[] = [];

  if (process.env.DATABASE_URL) {
    try {
      publishedEvents = await db
        .select({ slug: events.slug, createdAt: events.createdAt })
        .from(events)
        .where(eq(events.status, "published"));
    } catch {
      publishedEvents = [];
    }
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...publishedEvents.map((event) => ({
      url: `${baseUrl}/events/${event.slug}`,
      lastModified: event.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
