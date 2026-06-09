import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { hashPassword } from "better-auth/crypto";
import { and, eq } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { nanoid } from "nanoid";
import { EVENT_IMAGES } from "@/lib/constants";
import * as schema from "./schema";

const SEED_USERS = [
  {
    email: "admin@dancesphere.com",
    password: "Admin123!",
    firstName: "Admin",
    lastName: "User",
    name: "Admin User",
    role: "admin" as const,
  },
  {
    email: "organizer@dancesphere.com",
    password: "Org123!",
    firstName: "Maria",
    lastName: "Garcia",
    name: "Maria Garcia",
    role: "organizer" as const,
  },
];

async function ensureSeedUser(
  db: ReturnType<typeof drizzle>,
  user: (typeof SEED_USERS)[number]
) {
  const normalizedEmail = user.email.toLowerCase();
  const now = new Date();
  const hashedPassword = await hashPassword(user.password);

  const existingUser = await db
    .select()
    .from(schema.user)
    .where(eq(schema.user.email, normalizedEmail))
    .limit(1);

  let userId: string;

  if (existingUser.length > 0) {
    userId = existingUser[0].id;
    await db
      .update(schema.user)
      .set({ name: user.name, updatedAt: now })
      .where(eq(schema.user.id, userId));
  } else {
    userId = nanoid();
    await db.insert(schema.user).values({
      id: userId,
      name: user.name,
      email: normalizedEmail,
      emailVerified: true,
      createdAt: now,
      updatedAt: now,
    });
  }

  const existingProfile = await db
    .select()
    .from(schema.profiles)
    .where(eq(schema.profiles.id, userId))
    .limit(1);

  if (existingProfile.length > 0) {
    await db
      .update(schema.profiles)
      .set({
        firstName: user.firstName,
        lastName: user.lastName,
        email: normalizedEmail,
        role: user.role,
      })
      .where(eq(schema.profiles.id, userId));
  } else {
    await db.insert(schema.profiles).values({
      id: userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: normalizedEmail,
      role: user.role,
    });
  }

  const existingAccount = await db
    .select()
    .from(schema.account)
    .where(
      and(
        eq(schema.account.userId, userId),
        eq(schema.account.providerId, "credential")
      )
    )
    .limit(1);

  if (existingAccount.length > 0) {
    await db
      .update(schema.account)
      .set({ password: hashedPassword, updatedAt: now })
      .where(eq(schema.account.id, existingAccount[0].id));
  } else {
    await db.insert(schema.account).values({
      id: nanoid(),
      accountId: userId,
      providerId: "credential",
      userId,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    });
  }

  return userId;
}

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql, { schema });

  console.log("Seeding database...");

  const adminId = await ensureSeedUser(db, SEED_USERS[0]);
  const organizerId = await ensureSeedUser(db, SEED_USERS[1]);

  const existingEvents = await db
    .select({ slug: schema.events.slug })
    .from(schema.events);

  const existingSlugs = new Set(existingEvents.map((e) => e.slug));

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

  const newEvents = events.filter((e) => !existingSlugs.has(e.slug));
  if (newEvents.length > 0) {
    await db.insert(schema.events).values(newEvents);
  }

  console.log("Seed complete!");
  console.log("Admin:     admin@dancesphere.com / Admin123!");
  console.log("Organizer: organizer@dancesphere.com / Org123!");
  console.log(
    `Events: ${newEvents.length} created, ${existingSlugs.size} already existed`
  );
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
