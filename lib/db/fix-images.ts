import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { eq } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { EVENT_IMAGES, PLACEHOLDER_EVENT_IMAGE } from "@/lib/constants";
import * as schema from "./schema";

async function fixImages() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql, { schema });

  console.log("Updating event images...");

  for (const [slug, imageUrl] of Object.entries(EVENT_IMAGES)) {
    await db
      .update(schema.events)
      .set({ imageUrl })
      .where(eq(schema.events.slug, slug));
    console.log(`  ✓ ${slug}`);
  }

  // Fix any events still using broken unsplash URLs
  const allEvents = await db.select().from(schema.events);
  for (const event of allEvents) {
    if (event.imageUrl?.includes("unsplash.com")) {
      await db
        .update(schema.events)
        .set({ imageUrl: PLACEHOLDER_EVENT_IMAGE })
        .where(eq(schema.events.id, event.id));
      console.log(`  ✓ replaced unsplash URL for ${event.slug}`);
    }
  }

  console.log("Done!");
  process.exit(0);
}

fixImages().catch((err) => {
  console.error(err);
  process.exit(1);
});
