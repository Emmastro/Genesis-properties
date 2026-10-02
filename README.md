# Genesis Properties — website & studio

The website for **Genesis Properties** (brand: *Genesis*, domain: genesis.rw): architectural design and
real estate consultancy in Rwanda. It comes with a built-in content studio at **`/admin`** where the team
adds, edits and deletes listings, developments, photos and videos — no code needed.

| | |
|---|---|
| Public site | Apartments · Properties · Plots · Developments · Services · About · Contact · Insights |
| Studio (CMS) | `/admin` — listings, developments, photos & videos, services, team, client reviews, articles, inquiries, homepage, site settings |
| Stack | Next.js 16 · Payload CMS 3 · Postgres · Vercel Blob (photos/videos) · Tailwind CSS 4 |

## What the site does

- **Listings** — apartments, houses, villas, plots and commercial space, for sale, rent or short stay.
  Filter by location (all 30 districts), type, purpose, bedrooms, budget. Each listing has a photo/video
  gallery with full-screen viewer, floor plans, a viewing or booking form and a WhatsApp button that
  pre-fills the listing name.
- **Developments** — Redhill Residence and Tamarind Court are loaded with their real renders, site photos,
  floor plans, unit price list (live availability table), construction timeline and payment terms.
- **Services** — grouped exactly as agreed:
  - *Architectural services:* Exterior Design · Interior Design · Landscape Design (3D visualization included)
  - *Real estate services:* Plot Search · Property Advisory · Real Estate Consultancy · Apartment Booking
- **Inquiries** — every form (viewing, booking, plot search, design, contact) lands in *Studio → Inquiries*
  with the listing/development it came from, so nothing gets lost in WhatsApp.
- **SEO** — per-page titles, descriptions and share images (editable per listing in the *SEO* tab),
  canonical URLs, `sitemap.xml`, `robots.txt`, and structured data (real-estate listing, apartment complex,
  service, breadcrumbs, organization) so Google can show prices and photos.
- **Wording** — the site says *consultancy* / *consultant*, never *agency* / *agent*.

## Put it online on Vercel (one time, ~10 minutes)

1. **Import the repo** — vercel.com → *Add New → Project* → pick `Genesis-properties`. Framework: Next.js
   (auto-detected). Leave build settings as they are: Vercel runs `pnpm vercel-build`, which applies
   database migrations and then builds.
2. **Add a database** — in the project: *Storage → Create → Neon (Postgres)* → connect to the project.
   This sets `DATABASE_URL` for you.
3. **Add file storage** — *Storage → Create → Blob* → connect. This sets `BLOB_READ_WRITE_TOKEN`
   (all photos and videos uploaded in the studio go here; large videos upload straight from the browser).
4. **Environment variables** — *Settings → Environment Variables*:
   - `PAYLOAD_SECRET` — a long random string (e.g. run `openssl rand -hex 32`)
   - `NEXT_PUBLIC_SERVER_URL` — `https://genesis.rw` (or the `*.vercel.app` address until the domain is connected)
   - `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` — the first studio login (optional: without them, the first
     person to open `/admin` creates the account — do that straight after the first deploy)
5. **Deploy.** The first deploy creates the tables and loads the starter content (both developments,
   11 available units, the 7 services, 20 project photos).
6. **Domain** — *Settings → Domains → Add* `genesis.rw` and `www.genesis.rw`, then set the DNS records
   Vercel shows at the .rw registrar. Update `NEXT_PUBLIC_SERVER_URL` and redeploy.

## Using the studio

Log in at `https://<your-site>/admin`.

- **Add a property** — *Listings → Create new*. Fill *Details*, upload photos in *Photos & videos*
  (drag to reorder; the first is the main photo), set *Location*, then **Publish**. *Save draft* keeps it
  hidden from the public. Changes show on the site immediately.
- **Remove a property** — open it and either set *Availability* to *Sold*/*Rented* (it drops off the
  search results but keeps its page), or delete it.
- **Videos** — upload an mp4/mov in the *Videos* block, or paste a YouTube / TikTok / Instagram / Vimeo link.
- **Developments** — units are ordinary listings with the *Development* field set; the development page
  builds its unit table from them automatically.
- **Contact details** — *Site settings → Contact*. **Add the WhatsApp number first**: it switches on every
  WhatsApp button on the site. Social links (Instagram, TikTok, Facebook…) go in *Social*.
- **Homepage** — hero images or a hero video, headline, about text, call to action.
- **Team** — consultants appear on the About page once *Show on site* is ticked.
- **Client reviews** — the homepage section appears once there is at least one (real reviews only).
- **Inquiries** — new requests from the site; set *Follow-up* as you call people back.

## Run it locally

```bash
pnpm install
cp .env.example .env          # set DATABASE_URL to a local Postgres, PAYLOAD_SECRET to anything long
pnpm migrate                  # creates tables + loads starter content into an empty database
pnpm dev                      # http://localhost:3000 — studio at /admin
```

Other scripts: `pnpm typecheck`, `pnpm lint`, `pnpm build`, `pnpm seed` (load starter content into an
empty database without migrations).

### Changing the content model

Schema changes go through migrations in every environment (`push: false`):

1. Edit a file in `src/collections/` or `src/globals/`.
2. `pnpm generate:types && pnpm generate:importmap`
3. `pnpm migrate:create <name>` — commit the generated file in `src/migrations/`.
4. `pnpm migrate` locally; Vercel applies it on the next deploy.

## Project layout

```
src/
  app/(frontend)/    public website (pages, server action for forms)
  app/(payload)/     the studio (generated by Payload — don't edit)
  collections/       content types: Listings, Projects, Media, Services, Posts, Team, Testimonials, Inquiries, Users
  globals/           Homepage, Site settings
  components/        UI building blocks
  lib/               data access, formatting, option lists (districts, types…)
  migrations/        database schema + starter-content migration
  seed/              starter content and the project photos it uploads
```

## Content sources & things to confirm

Starter content comes from the material shared by Fidélité (15 Sep 2026): the Redhill Residence
presentation and 2026 price list, the Tamarind Court presentation, and site photos. Before launch, confirm:

- Redhill prices and availability are still current (units in red on the price list were left out as sold).
- Tamarind: the remaining 3-bedroom units at **$120,000 over 18 months**; the status is shown as *Completed*
  based on the September site photos.
- Redhill's exact neighbourhood is not stated in the brochure, so the site says *Central Kigali*.
  Developer names are deliberately left off the public pages.
- The ~12% yield on Redhill is labelled as the developer's projection.
- Phone, WhatsApp and social links are empty until added in *Site settings*.
