# SkillConnect

A mobile-first marketplace connecting customers with artisans/service providers
in Nigeria.

- **Phase 1** (unchanged in this update): foundation, authentication, database, role management, basic navigation.
- **Phase 2** (unchanged in this update): the complete Customer experience — Home, Search, Artisan profiles + booking, Bookings, Notifications, and the full Account section.
- **Phase 3** (this update): the complete Artisan/Service Provider experience — Dashboard, Profile management (with photo upload), Services (add/edit/delete), Portfolio (public on the customer-facing profile), and Availability (status + working hours). Auth, the database's core structure, and the Customer interface were not redesigned; this phase adds new fields/tables on top of what already existed.

## Stack

- **Next.js 14** (App Router) + TypeScript — one project for both frontend and API routes
- **Prisma** ORM, SQLite in dev (swap to PostgreSQL for production — one line)
- **Auth**: bcrypt password hashing + signed JWT session in an httpOnly cookie (no third-party auth vendor, so there's nothing to configure to get started)
- **Tailwind CSS** with a small custom design system (`tailwind.config.ts`)
- **Zod** for shared client/server validation
- **lucide-react** for icons

## Setup

```bash
npm install
cp .env.example .env
# .env.example already points at a local SQLite file — no DB server needed
openssl rand -base64 48   # paste the result into JWT_SECRET in .env

npx prisma db push        # creates dev.db and all tables from schema.prisma
npm run db:seed           # adds the 15 categories + demo artisans + test accounts
npm run dev                # http://localhost:3000
```

> Already have a `dev.db` from an earlier phase? Just re-run `npx prisma db push` —
> it adds the new tables/columns (`saved_artisans`, `availability_days`, and the new
> `ArtisanProfile`/`Service`/`PortfolioItem` fields) without touching existing data.
> Re-run `npm run db:seed` too if you want the demo artisans updated with the new
> profession/service-area/portfolio fields.

Test accounts created by the seed script (password for all: `Password123!`):

| Role     | Email                          | Notes |
|----------|----------------------------------|-------|
| Admin    | admin@skillconnect.ng           | |
| Customer | customer@example.com            | Has a completed, reviewed booking with each demo artisan |
| Artisan  | chidi.electrical@example.com    | Verified · Electrician · Available |
| Artisan  | ngozi.plumbing@example.com      | Verified · Plumber · Available |
| Artisan  | tunde.carpentry@example.com     | Verified · Carpenter · Available |
| Artisan  | blessing.tailoring@example.com  | Pending verification · Tailor · Busy |
| Artisan  | emeka.acrepair@example.com      | Verified · AC Technician · Available |
| Artisan  | fatima.cleaning@example.com     | Unverified · Cleaner · Offline (hidden from customer search) |

## Phase 2: Customer experience

Every screen below reads from and, where noted, writes to the database
directly — there is no hardcoded/mock data standing in for real records.

**Home** (`/customer/home`) — greeting uses the logged-in user's real name and
time of day; location is the customer's saved city/state (editable, prompts
to set it if empty); the notification bell shows a live unread count;
categories are the 15 `ServiceCategory` rows (seeded, but manageable from the
admin dashboard later without any customer-code changes); "Recommended for
you" ranks real `ArtisanProfile` rows by verification status and rating.

**Search** (`/customer/search`) — category chips + a text query, both plain
URL search params, so filtering is a real server-side Prisma query on every
navigation (shareable/bookmarkable URLs, no client-side mock filtering).

**Artisan profile** (`/customer/artisans/[id]`) — verified badge, rating,
review count, location, experience, services with real prices, portfolio,
and the 10 most recent reviews, all from the database. Includes a **Save**
toggle (writes to the new `SavedArtisan` table) and a **Book Now** form that
creates a real `Booking` row and a `Notification` for the artisan.

**Bookings** (`/customer/bookings`) — every booking the logged-in customer
has actually made, with live status, schedule, address and price.

**Notifications** (`/customer/notifications`) — real `Notification` rows;
tap one (or "Mark all read") to mark it read, backed by a server action.

**Account** (`/customer/account`) — a menu with unread/saved counts pulled
live from the database, linking to:
- **Profile** — read-only view of the account
- **Edit Profile** — a real update (name, phone, city, state, address) via a server action, replacing the placeholder save from Phase 1
- **My Bookings** → reuses the Bookings tab
- **Saved Artisans** — everything the customer has bookmarked
- **Messages** → reuses the Messages tab (still a placeholder — messaging itself wasn't in scope for this phase)
- **Reviews** — reviews the customer has written
- **Notifications** → reuses the Notifications screen
- **Settings** — password reset entry point + account info
- **Help & Support** — static FAQ content (support copy, not user data, so this one is intentionally not database-backed)
- **Logout**

All mutations (save/unsave, create booking, edit profile, mark notification
read) are Next.js Server Actions in `src/lib/actions/` — each one re-derives
the current user from the session cookie and checks role/ownership before
touching the database, the same authorization model Phase 1 established for
API routes and middleware.

## Phase 3: Artisan experience

Schema additions: `AvailabilityStatus` enum, a new `AvailabilityDay` model
(one row per weekday per artisan), and new fields on `ArtisanProfile`
(`profession`, `serviceArea`, `availabilityStatus`), `Service`
(`estimatedDuration`), and `PortfolioItem` (`title`, `description`,
`projectDate`, replacing the old single `caption` field). `isAvailable` is
kept in sync with `availabilityStatus` automatically, so none of Phase 2's
customer-facing queries had to change.

**Dashboard** (`/artisan/dashboard`) — profile completion % (a live checklist
across photo, business name, profession, bio, experience, location, service
area, at least one service, at least one portfolio item), verification
status, new/today's/upcoming/completed job counts, all-time earnings from
completed bookings, and rating — all computed from real queries, not stored
or hand-typed. Five quick actions link straight to Add Service, Upload Work,
Edit Profile, Manage Availability, and View Requests.

**Jobs** (`/artisan/jobs`) — tabbed Requests / Today / Upcoming / Completed,
each a real filtered query on `Booking`. Accept / Decline / Start job / Mark
complete buttons call a server action that validates the transition (e.g. a
declined booking can't be "started"), updates the booking, and creates a
`Notification` for the customer — the same table Phase 2's customer
Notifications screen already reads.

**Earnings** (`/artisan/earnings`) — all-time and this-month totals plus a
list of completed jobs, summed from `Booking.agreedPrice` on completed
bookings.

**My Services** (`/artisan/services`, `/new`, `/[id]/edit`) — add, edit, and
delete, with service name, category (from the same `ServiceCategory` table
customers browse), description, starting/maximum price, price basis, and
estimated duration. Deleting a service with existing bookings soft-deletes
(hides it) instead of breaking booking history; a service with none is
removed outright. A visibility toggle lets an artisan hide a service without
deleting it.

**Portfolio** (`/artisan/portfolio`) — upload work with an image, project
title, description, and date; delete any item. Already displayed publicly
on the customer-facing artisan profile page from Phase 2 (updated to show
the new title/date instead of the old caption).

**Availability** (`/artisan/availability`) — a tri-state Available / Busy /
Offline selector (Offline hides the artisan from customer search and
recommendations; Busy keeps them visible but flagged) plus a full working
days/hours grid, both backed by real tables and saved via server actions.

**Profile management** (`/artisan/account/edit`) — profile photo, full name,
business name, profession, biography, years of experience, city/state, and
service area, all through one real server action. Photo upload converts the
file to a base64 data URL client-side and stores it as a string — see
"Needs configuration" below for swapping this to real object storage.

The `/artisan/account` menu was rebuilt to match the Customer account
pattern: a profile summary card plus links to Edit Profile, My Services,
Portfolio, Manage Availability, Earnings, Settings, Help & Support, and
Logout — each with live counts where relevant (e.g. services count).

## What's implemented (Phase 1, unchanged)

**Authentication**
- Register (with the "What are you here to do?" role picker → Customer / Artisan), log in, log out, forgot/reset password, basic profile editing.
- Passwords hashed with bcrypt; sessions are signed JWTs in an httpOnly, sameSite cookie — never in localStorage.
- Password reset generates a real token stored in the database with a 30-minute expiry; the reset link is currently logged to the server console instead of emailed (see "Needs configuration" below).

**Database** (`prisma/schema.prisma`)
All 12 requested tables, with real foreign keys, not just the ones convenient to build:
`User`, `CustomerProfile`, `ArtisanProfile`, `ServiceCategory`, `Service`, `PortfolioItem`, `Booking`, `Message`, `Review`, `Notification`, `VerificationRequest`, `Complaint`.

Notable relationship decisions:
- `User` is the single identity table; `CustomerProfile`/`ArtisanProfile` are 1:1 extensions, so auth logic never has to branch on role.
- `Booking` links a `CustomerProfile`, an `ArtisanProfile`, and the specific `Service` booked.
- `Review` is 1:1 with `Booking` (one review per completed job) and denormalizes both the author and the artisan being reviewed for fast lookups.
- `Message` optionally links to a `Booking` but also supports general pre-booking inquiries.
- `Complaint` can reference a `Booking` and/or a specific user, so admins can triage both booking disputes and general reports.

**Authorization**
- `src/middleware.ts` blocks any `/customer`, `/artisan`, or `/admin` route for unauthenticated requests, and redirects a logged-in user of the wrong role to *their own* home instead of exposing the area.
- Each role layout (`src/app/customer/layout.tsx` etc.) re-checks the session server-side as a second guard, so a route stays protected even if the middleware matcher config is ever edited incorrectly.
- API routes never trust a client-supplied role or user id — the session cookie is the only source of truth.

**Navigation** — exactly the three tab sets requested, as a reusable `BottomNav`/`SideNav` pair (bottom tabs on mobile, a sidebar once there's room, so it stays one component set instead of two parallel implementations):
- Customer: Home · Search · Bookings · Messages · Account
- Artisan: Dashboard · Jobs · Messages · Earnings · Account
- Admin: Dashboard · Users · Artisans · Verification · Services · Bookings · Reviews · Complaints · Analytics · Settings (scrolls horizontally on mobile, full sidebar on larger screens)

All destination pages exist and render (as clearly-labeled empty states) — nothing 404s.

**Design system** — `tailwind.config.ts` + `src/components/ui/*`: a green/amber palette (trust + craftsmanship, not a Nigerian-flag cliché), `Button`, `Input`, `Card`, `Badge`, `EmptyState`, `PageHeader`, built mobile-first and reused across every page.

## Needs configuration before continuing

1. **`npm install` and `JWT_SECRET`** — this sandbox has no network access, so dependencies were never installed and the app hasn't been run here. Do `npm install` and set `JWT_SECRET` locally before first run (steps above).
2. **Database for production** — SQLite is fine for local dev; for staging/production, change `provider` in `prisma/schema.prisma` to `"postgresql"` and point `DATABASE_URL` at a real Postgres instance (Supabase, Neon, RDS, etc.), then re-run `npx prisma db push` (or set up `prisma migrate`).
3. **Transactional email/SMS** — password reset currently logs the reset link to the server console instead of sending it. Wire up a provider (Resend, SendGrid, Termii for Nigerian SMS, etc.) in `src/app/api/auth/forgot-password/route.ts`.
4. **File storage** — profile photos and portfolio images are now actually functional (Phase 3), but they're stored as base64 data URLs directly in the database, not in real object storage. This works for an MVP/demo but doesn't scale: every image inflates row size, `dev.db` will grow quickly, and Postgres row/column limits become a real concern. Swap `ImageUpload` in `src/components/upload/ImageUpload.tsx` to upload to S3/Cloudinary/similar and store just the resulting URL — the rest of the app (forms, server actions, `imageUrl`/`avatarUrl` columns) doesn't need to change, since they already just store a string. Also note `next.config.mjs` raises the Server Action body limit to 8MB to accommodate this — revisit that once real uploads replace base64.
5. **Deployment** — no hosting is configured. Vercel is the natural fit for Next.js; Railway/Render work well if you want the Postgres instance alongside the app.

**How this build was verified**: this sandbox still has no network access, so
`npm install` couldn't run here and the app was never actually started —
nothing below was verified by clicking through a live app. What was checked:
every `@/...` import resolves to a real file, every TS/TSX file passes a
TypeScript syntax parse with zero errors, `schema.prisma` has balanced
braces and all 15 models/6 enums parse, and every route referenced by
navigation/menus/links has a matching `page.tsx`. Run the checklist below
locally to confirm actual behavior.

## Manual test checklist

- [ ] Register as a customer → lands on `/customer/home`, sees Customer nav
- [ ] Register as an artisan → lands on `/artisan/dashboard`, sees Artisan nav
- [ ] Log out, log back in as each account → correct nav reappears
- [ ] Visit `/admin/dashboard` while logged in as the customer → redirected to `/customer/home`, not shown admin content
- [ ] Visit any `/customer`, `/artisan`, or `/admin` route while logged out → redirected to `/login`
- [ ] `npx prisma studio` → confirm `User` ↔ `CustomerProfile`/`ArtisanProfile` rows exist and are linked correctly after registering

**Phase 2 additions** (log in as `customer@example.com`, password `Password123!`):

- [ ] Home shows "Good [morning/afternoon/evening], Amaka", city/state, and all 15 categories
- [ ] Tap a category on Home → Search opens pre-filtered to it
- [ ] Search by text (e.g. "wiring") → returns the matching artisan; clear it → all artisans return
- [ ] Open an artisan profile → real rating/reviews/services/price show; tap the heart → Saved Artisans (Account) now lists them; tap again → removed
- [ ] Submit the booking form on a profile → success message appears, and the booking now shows under Bookings with status "pending"
- [ ] Log in as `chidi.electrical@example.com` → the booking request notification appears in Notifications (Account → Notifications is Customer-only for now; on the artisan side, confirm the same booking shows under Jobs → Requests)
- [ ] Edit Profile → change city/phone → Save → Profile screen and Home's location both reflect the change immediately
- [ ] Account badges (Saved Artisans count, Notifications count) update after saving an artisan / reading a notification
- [ ] Log in as a brand-new customer (register fresh) → Home, Bookings, Saved Artisans, Reviews, Notifications all render empty states instead of errors

**Phase 3 additions** (log in as `chidi.electrical@example.com`, password `Password123!`):

- [ ] Dashboard shows a profile completion percentage under 100% (avatar isn't set by seed), verification "approved", real job counts, earnings, and rating (4–5, from the seeded review)
- [ ] Jobs → Requests tab shows the booking a customer submitted in the Phase 2 checklist above; tap Accept → it disappears from Requests and the customer sees "accepted" under their Bookings, with a new notification
- [ ] My Services → Add Service → fill the form → appears in the list; Edit it → changes persist; toggle visibility (eye icon) → service disappears from that artisan's public profile in a separate customer session; Delete → removed (or hidden, if it has bookings)
- [ ] Portfolio → upload an image with a title → appears in the grid immediately, and shows up on `/customer/artisans/[this artisan's id]` under Portfolio; delete it → disappears from both
- [ ] Manage Availability → switch to Offline → this artisan drops out of `/customer/search` and Home's recommendations (Available/Busy artisans still show); set working hours for a day → reload → values persist
- [ ] Edit Profile → upload a profile photo, set profession/business name/bio/years/service area → Save → Dashboard's profile completion % increases, and the changes are visible on the artisan's public customer-facing profile
- [ ] Log in as `fatima.cleaning@example.com` (seeded Offline) → confirm she does NOT appear in a customer's Home/Search results, but her direct profile link (`/customer/artisans/[id]`) still works
- [ ] As the customer, confirm the artisan profile's Book Now form still lists only that artisan's *active* services (a hidden/deleted one shouldn't appear)
