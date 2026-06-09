# Deployment Guide

Deploy DanceSphere to Vercel with Neon and Stripe.

## 1. Neon PostgreSQL

1. Create a project at [neon.tech](https://neon.tech)
2. Copy the connection string (with `?sslmode=require`)
3. Run migrations:
   ```bash
   DATABASE_URL="your-neon-url" npm run db:push
   DATABASE_URL="your-neon-url" npm run db:seed
   ```

## 2. Vercel

1. Push your repo to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Neon connection string |
| `BETTER_AUTH_SECRET` | Random 32+ char secret |
| `BETTER_AUTH_URL` | `https://your-domain.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.vercel.app` |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `RESEND_API_KEY` | Resend API key (optional) |
| `EMAIL_FROM` | `DanceSphere <tickets@yourdomain.com>` (optional) |

4. Deploy

## 3. Stripe

No webhook is required. Payments are confirmed on the success page when Stripe redirects back with `session_id`.

1. Use your Stripe **test** or **live** secret key in `STRIPE_SECRET_KEY`
2. Ensure `NEXT_PUBLIC_APP_URL` matches your deployed domain (used in Checkout redirect URLs)

## 4. Resend (optional)

Email sending is mocked until Resend is configured. To enable real emails:

1. Create account at [resend.com](https://resend.com)
2. Verify your sending domain
3. Uncomment the Resend block in `lib/email/send.ts`
4. Set `RESEND_API_KEY` and `EMAIL_FROM` in Vercel

## 5. Post-Deploy Checklist

- [ ] Register first admin account (or use seed data)
- [ ] Test event creation in dashboard
- [ ] Test ticket purchase with Stripe test card `4242 4242 4242 4242`
- [ ] Verify tickets appear on `/tickets` after successful payment
- [ ] Check sitemap at `/sitemap.xml`
