# Database Schema

DanceSphere uses Drizzle ORM with PostgreSQL (Neon). Schema files live in `lib/db/schema/`.

## Tables

### Auth (Better Auth)

| Table | Purpose |
|-------|---------|
| `user` | Auth users (id, name, email, emailVerified, image) |
| `session` | Active sessions |
| `account` | Credential accounts (password hashes) |
| `verification` | Email verification tokens |

### Application

| Table | Key Fields |
|-------|------------|
| `profiles` | id (FK→user), firstName, lastName, email, avatarUrl, role |
| `events` | title, slug, description, eventType, location, city, country, dates, capacity, price, organizerId, status |
| `bookings` | userId, eventId, quantity, status (pending/confirmed/cancelled) |
| `tickets` | bookingId, ticketCode, qrCode, status (valid/used/cancelled) |
| `payments` | bookingId, stripeSessionId, amount, status |

## Enums

- `role`: dancer, organizer, admin
- `event_type`: salsa, bachata, hip-hop, contemporary, ballroom, tango, swing, kizomba, other
- `event_status`: draft, published, cancelled
- `booking_status`: pending, confirmed, cancelled
- `ticket_status`: valid, used, cancelled
- `payment_status`: pending, succeeded, failed

## Relationships

```
user 1──1 profiles
profiles 1──* events (as organizer)
profiles 1──* bookings (as buyer)
events 1──* bookings
bookings 1──* tickets
bookings 1──1 payments
```

## Migration Workflow

```bash
# Push schema directly (development)
npm run db:push

# Generate migration files
npm run db:generate

# Apply migrations (production)
npm run db:migrate

# Open visual browser
npm run db:studio
```

## Indexes

- `events.slug` — unique
- `events(city, country, eventType, startDate)` — filter index
- `tickets.ticketCode` — unique
- `payments.stripeSessionId` — unique

## Seed Data

```bash
npm run db:seed
```

Creates sample organizer profile and 6 published events across European cities.
