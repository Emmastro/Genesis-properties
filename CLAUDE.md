@AGENTS.md

# Genesis Properties

Website + Payload CMS studio for Genesis Properties (architecture & real estate consultancy, Rwanda). See README.md.

- Visible copy says **consultancy / consultant** — never "agency" / "agent" (founders' rule).
- Services are grouped as Architectural (Exterior, Interior, Landscape) and Real estate (Plot Search, Property Advisory, Real Estate Consultancy, Apartment Booking).
- Schema changes need a migration (`pnpm migrate:create`); the Postgres adapter runs with `push: false`.
- Public queries go through `src/lib/data.ts` with `overrideAccess: false` so drafts never leak.
- Never invent testimonials, prices or developer facts — content comes from the founders' material.
