import Link from 'next/link'

import { HeroSlideshow } from '@/components/HeroSlideshow'
import { Icon } from '@/components/Icon'
import { InquiryForm } from '@/components/InquiryForm'
import { ListingCard } from '@/components/ListingCard'
import { MediaImage } from '@/components/MediaImage'
import { ProjectCard } from '@/components/ProjectCard'
import { SearchPanel } from '@/components/SearchPanel'
import { ServiceCard } from '@/components/ServiceCard'
import { SectionHeading } from '@/components/ui'
import {
  asMedia,
  asMediaList,
  getFeaturedListings,
  getHomepage,
  getListings,
  getPosts,
  getProjects,
  getServices,
  getSettings,
  getStats,
  getTestimonials,
} from '@/lib/data'
import { formatDate, formatMoneyShort, mediaUrl } from '@/lib/format'

export const revalidate = 3600

export default async function HomePage() {
  const [home, settings, services, projects, listings, stats, testimonials, posts] = await Promise.all([
    getHomepage(),
    getSettings(),
    getServices(),
    getProjects({ featured: true }),
    getFeaturedListings(6),
    getStats(),
    getTestimonials(),
    getPosts(3),
  ])

  const projectUnits = await Promise.all(
    projects.map(async (p) => {
      const { docs, total } = await getListings({ project: p.id, sort: 'price-asc' }, 1)
      return { total, from: docs[0]?.price ?? null }
    }),
  )

  const slides = asMediaList(home.heroImages).map((m) => ({
    url: m.url!,
    alt: m.alt,
    focal: m.focalX != null ? `${m.focalX}% ${m.focalY}%` : undefined,
  }))
  const heroVideo = mediaUrl(asMedia(home.heroVideo))

  const statItems = home.stats?.length
    ? home.stats.map((s) => ({ value: s.value, label: s.label }))
    : [
        { value: String(stats.available), label: 'homes available now' },
        { value: String(stats.projects), label: `development${stats.projects === 1 ? '' : 's'} in Kigali` },
        ...(stats.fromPrice ? [{ value: formatMoneyShort(stats.fromPrice), label: 'apartments from' }] : []),
        { value: String(services.length), label: 'services, one team' },
      ]

  const architectural = services.filter((s) => s.group === 'architectural')
  const realEstate = services.filter((s) => s.group === 'real-estate')

  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 -z-10">
          <HeroSlideshow slides={slides} video={heroVideo} />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/30 to-ink/85" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/60 to-transparent" />
        </div>
        <div className="container-x flex flex-1 flex-col justify-end pb-10 pt-36 sm:pb-14">
          {home.eyebrow && <p className="eyebrow animate-fade-up text-gold!">{home.eyebrow}</p>}
          <h1 className="mt-4 max-w-4xl animate-fade-up text-[2.9rem] leading-[1.02] [animation-delay:120ms] sm:text-7xl lg:text-[5.4rem]">
            {home.heading}
          </h1>
          {home.subheading && (
            <p className="mt-6 max-w-2xl animate-fade-up text-lg leading-8 text-white/80 [animation-delay:240ms]">
              {home.subheading}
            </p>
          )}
          <div className="mt-8 flex animate-fade-up flex-wrap gap-3 [animation-delay:360ms]">
            <Link href="/apartments" className="btn-gold">
              Browse apartments <Icon name="arrow" className="size-4" />
            </Link>
            <Link href="/services" className="btn-ghost text-white">
              Our services
            </Link>
          </div>
          <div className="mt-12 animate-fade-up [animation-delay:480ms]">
            <SearchPanel />
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="border-b border-line bg-sand">
        <div className="container-x grid grid-cols-2 gap-y-8 py-10 lg:grid-cols-4">
          {statItems.map((s) => (
            <div key={s.label} className="border-l border-gold/50 pl-5">
              <p className="font-display text-4xl text-ink sm:text-5xl">{s.value}</p>
              <p className="mt-1 text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Developments */}
      {projects.length > 0 && (
        <section className="container-x py-20 sm:py-28">
          <SectionHeading
            eyebrow="Developments"
            title="Apartments in Kigali’s new buildings"
            intro="Off-plan and completed developments we represent — with prices, payment plans and real photos from site."
            action={{ href: '/projects', label: 'All developments' }}
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {projects.map((p, i) => (
              <ProjectCard
                key={p.id}
                project={p}
                large
                fromPrice={projectUnits[i]?.from}
                unitsAvailable={projectUnits[i]?.total}
              />
            ))}
          </div>
        </section>
      )}

      {/* Listings */}
      {listings.length > 0 && (
        <section className="bg-white py-20 sm:py-28">
          <div className="container-x">
            <SectionHeading
              eyebrow="Available now"
              title="Homes ready for a viewing"
              action={{ href: '/properties', label: 'See all properties' }}
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      <section className="relative overflow-hidden bg-ink py-20 text-white sm:py-28">
        <div className="pointer-events-none absolute -right-40 -top-40 size-[520px] rounded-full bg-gold/10 blur-3xl" />
        <div className="container-x relative">
          <SectionHeading
            light
            eyebrow="What we do"
            title="Design and real estate, under one roof"
            intro="Find the right property, then shape it — or start from a plot and build exactly what you want."
            action={{ href: '/services', label: 'All services' }}
          />
          <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1.35fr]">
            <div>
              <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold">
                <span className="h-px w-8 bg-gold" /> Architectural services
              </p>
              <div className="mt-6 grid gap-4">
                {architectural.map((s) => (
                  <ServiceCard key={s.id} service={s} dark />
                ))}
              </div>
            </div>
            <div>
              <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold">
                <span className="h-px w-8 bg-gold" /> Real estate services
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {realEstate.map((s) => (
                  <ServiceCard key={s.id} service={s} dark />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="container-x grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-2 lg:gap-20">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
          <MediaImage media={asMedia(home.aboutImage)} sizes="(min-width: 1024px) 50vw, 100vw" />
          <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/92 p-5 backdrop-blur sm:right-auto sm:max-w-xs">
            <p className="font-display text-xl text-ink">See it before it is built.</p>
            <p className="mt-1 text-sm text-muted">Every design comes with 3D visualization.</p>
          </div>
        </div>
        <div>
          <p className="eyebrow">About Genesis</p>
          <h2 className="mt-3 text-[2rem] leading-[1.1] sm:text-[2.6rem]">{home.aboutHeading}</h2>
          {home.aboutBody && <p className="mt-5 text-[1.05rem] leading-8 text-muted">{home.aboutBody}</p>}
          <ol className="mt-10 grid gap-6 sm:grid-cols-2">
            {[
              ['Find', 'Apartments, homes and plots that match your brief and budget.'],
              ['Verify', 'Plots and paperwork checked before any money moves.'],
              ['Design', 'Exterior, interior and landscape — shown in 3D.'],
              ['Settle in', 'Support through payment plans, handover and fit-out.'],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-4">
                <span className="font-display text-3xl text-gold">0{i + 1}</span>
                <div>
                  <p className="font-semibold text-ink">{t}</p>
                  <p className="mt-1 text-sm leading-6 text-muted">{d}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link href="/about" className="btn-ink mt-10">
            More about us <Icon name="arrow" className="size-4" />
          </Link>
        </div>
      </section>

      {/* Testimonials — only when real reviews exist */}
      {testimonials.length > 0 && (
        <section className="bg-white py-20 sm:py-28">
          <div className="container-x">
            <SectionHeading eyebrow="Clients" title="In their words" center />
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <figure key={t.id} className="rounded-3xl bg-sand p-8">
                  <blockquote className="font-display text-xl leading-8 text-ink">“{t.quote}”</blockquote>
                  <figcaption className="mt-6 text-sm">
                    <span className="font-semibold text-ink">{t.name}</span>
                    {t.context && <span className="block text-muted">{t.context}</span>}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Insights */}
      {posts.length > 0 && (
        <section className="container-x py-20 sm:py-28">
          <SectionHeading eyebrow="Insights" title="Notes on property in Rwanda" action={{ href: '/insights', label: 'All insights' }} />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {posts.map((p) => (
              <Link key={p.id} href={`/insights/${p.slug}`} className="group card">
                <div className="relative aspect-[16/10]">
                  <MediaImage media={asMedia(p.cover)} sizes="(min-width: 768px) 33vw, 100vw" />
                </div>
                <div className="p-6">
                  <p className="text-xs text-muted">{formatDate(p.publishedAt)}</p>
                  <h3 className="mt-2 text-xl group-hover:text-gold-600">{p.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Call to action */}
      <section className="relative isolate overflow-hidden bg-ink py-20 text-white sm:py-28">
        <MediaImage media={asMedia(home.ctaImage)} sizes="100vw" className="-z-10 opacity-25" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/90 to-ink/60" />
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="eyebrow text-gold!">Talk to a consultant</p>
            <h2 className="mt-3 text-[2.2rem] leading-[1.08] sm:text-5xl">{home.ctaHeading}</h2>
            {home.ctaBody && <p className="mt-5 max-w-lg text-lg leading-8 text-white/75">{home.ctaBody}</p>}
          </div>
          <div className="rounded-[2rem] bg-white/[0.06] p-6 ring-1 ring-white/10 backdrop-blur sm:p-8">
            <InquiryForm chooseType dark whatsapp={settings.whatsapp} whatsappText="Hello Genesis, I would like some help finding a property." />
          </div>
        </div>
      </section>
    </>
  )
}
