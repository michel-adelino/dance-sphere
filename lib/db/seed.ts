import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { nanoid } from "nanoid";
import { EVENT_IMAGES } from "@/lib/constants";
import * as schema from "./schema";

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql, { schema });

  const adminId = nanoid();
  const organizerId = nanoid();

  console.log("Seeding database...");

  await db.insert(schema.user).values([
    {
      id: adminId,
      name: "Admin User",
      email: "admin@dancesphere.com",
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: organizerId,
      name: "Maria Garcia",
      email: "organizer@dancesphere.com",
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  await db.insert(schema.profiles).values([
    {
      id: adminId,
      firstName: "Admin",
      lastName: "User",
      email: "admin@dancesphere.com",
      role: "admin",
    },
    {
      id: organizerId,
      firstName: "Maria",
      lastName: "Garcia",
      email: "organizer@dancesphere.com",
      role: "organizer",
    },
  ]);

  const events = [
    {
      id: nanoid(),
      title: "Salsa Night Barcelona",
      slug: "salsa-night-barcelona",
      description:
        "An electrifying night of salsa dancing in the heart of Barcelona. Live band, professional dancers, and open floor for all levels. Beginners welcome with free intro lesson at 8 PM.",
      eventType: "salsa" as const,
      imageUrl: EVENT_IMAGES["salsa-night-barcelona"],
      location: "Club Latino, Carrer de Balmes 142",
      city: "Barcelona",
      country: "Spain",
      startDate: new Date("2026-07-15T20:00:00"),
      endDate: new Date("2026-07-16T02:00:00"),
      capacity: 150,
      price: 2500,
      organizerId,
      status: "published" as const,
    },
    {
      id: nanoid(),
      title: "Bachata Sensual Workshop",
      slug: "bachata-sensual-workshop",
      description:
        "Master the art of bachata sensual with world-renowned instructors. Full-day intensive workshop covering connection, body movement, and musicality.",
      eventType: "bachata" as const,
      imageUrl: EVENT_IMAGES["bachata-sensual-workshop"],
      location: "Dance Studio Milano, Via Torino 45",
      city: "Milan",
      country: "Italy",
      startDate: new Date("2026-08-20T10:00:00"),
      endDate: new Date("2026-08-20T18:00:00"),
      capacity: 40,
      price: 7500,
      organizerId,
      status: "published" as const,
    },
    {
      id: nanoid(),
      title: "Hip-Hop Battle Championship",
      slug: "hip-hop-battle-championship",
      description:
        "The biggest hip-hop dance battle in London. Watch elite crews compete or join the open cypher. Prizes for top 3 performers. DJ sets all night.",
      eventType: "hip-hop" as const,
      imageUrl: EVENT_IMAGES["hip-hop-battle-championship"],
      location: "The Roundhouse, Chalk Farm Road",
      city: "London",
      country: "United Kingdom",
      startDate: new Date("2026-09-10T18:00:00"),
      endDate: new Date("2026-09-11T01:00:00"),
      capacity: 300,
      price: 3500,
      organizerId,
      status: "published" as const,
    },
    {
      id: nanoid(),
      title: "Contemporary Flow Festival",
      slug: "contemporary-flow-festival",
      description:
        "A three-day festival celebrating contemporary dance. Workshops, performances, and networking with artists from across Europe.",
      eventType: "contemporary" as const,
      imageUrl: EVENT_IMAGES["contemporary-flow-festival"],
      location: "Théâtre de la Ville",
      city: "Paris",
      country: "France",
      startDate: new Date("2026-10-05T09:00:00"),
      endDate: new Date("2026-10-07T22:00:00"),
      capacity: 200,
      price: 12000,
      organizerId,
      status: "published" as const,
    },
    {
      id: nanoid(),
      title: "Kizomba Sunset Social",
      slug: "kizomba-sunset-social",
      description:
        "Dance kizomba as the sun sets over Lisbon. Rooftop venue with panoramic views, live DJ, and the warmest community vibes.",
      eventType: "kizomba" as const,
      imageUrl: EVENT_IMAGES["kizomba-sunset-social"],
      location: "Rooftop Bar LX, Rua Augusta 120",
      city: "Lisbon",
      country: "Portugal",
      startDate: new Date("2026-07-28T19:00:00"),
      endDate: new Date("2026-07-29T01:00:00"),
      capacity: 80,
      price: 1800,
      organizerId,
      status: "published" as const,
    },
    {
      id: nanoid(),
      title: "Swing Dance Revival",
      slug: "swing-dance-revival",
      description:
        "Step back in time with an authentic swing dance party. Live big band, vintage dress code encouraged, and lindy hop lessons for beginners.",
      eventType: "swing" as const,
      imageUrl: EVENT_IMAGES["swing-dance-revival"],
      location: "Ballhaus Berlin, Chausseestraße 102",
      city: "Berlin",
      country: "Germany",
      startDate: new Date("2026-08-08T20:00:00"),
      endDate: new Date("2026-08-09T02:00:00"),
      capacity: 120,
      price: 2200,
      organizerId,
      status: "published" as const,
    },
  ];

  await db.insert(schema.events).values(events);

  console.log("Seed complete!");
  console.log("Admin: admin@dancesphere.com (register via app to set password)");
  console.log("Organizer: organizer@dancesphere.com");
  console.log(`Created ${events.length} sample events`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
