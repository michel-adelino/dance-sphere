# DanceSphere

A dance event ticketing platform built with Next.js 15, Drizzle ORM, Better Auth, Stripe, and Resend.

## Features

- **Public site** — Homepage, event listing with filters, event detail pages
- **Authentication** — Email/password registration and login via Better Auth
- **Organizer dashboard** — Create events, view KPIs, manage participants, export CSV
- **Ticketing** — Stripe Checkout, QR code tickets, email confirmations
- **Admin panel** — User management, event moderation, platform statistics

## Tech Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui components
- Drizzle ORM + Neon PostgreSQL
- Better Auth
- Stripe (payments)
- Resend (emails)
- Vercel (hosting)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in all values:

```bash
cp .env.example .env.local
```

Required variables:
- `DATABASE_URL` — Neon PostgreSQL connection string
- `BETTER_AUTH_SECRET` — Random 32+ character secret
- `BETTER_AUTH_URL` — `http://localhost:3000` in development
- `NEXT_PUBLIC_APP_URL` — `http://localhost:3000` in development
- `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `RESEND_API_KEY`, `EMAIL_FROM` (optional — emails are mocked until Resend is set up)

### 3. Set up the database

```bash
npm run db:push
npm run db:seed
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Test payments

Use Stripe test card `4242 4242 4242 4242`. After payment, Stripe redirects to `/checkout/success` where the app verifies the session and generates tickets — no webhook setup required.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run db:push` | Push schema to database |
| `npm run db:generate` | Generate migrations |
| `npm run db:migrate` | Run migrations |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run db:seed` | Seed sample events |

## User Roles

| Role | Access |
|------|--------|
| Dancer | Browse events, buy tickets, view tickets |
| Organizer | Dashboard, event CRUD, participants |
| Admin | All organizer access + admin panel |

The first registered user automatically becomes an admin. Use the homepage CTA to become an organizer.

## Documentation

- [Deployment Guide](docs/DEPLOYMENT.md)
- [Database Schema](docs/DATABASE.md)
