import type { Metadata } from 'next'
import Link from 'next/link'

import { Icon, type IconName } from '@/components/Icon'
import { MediaImage } from '@/components/MediaImage'
import { PageHero, SectionHeading } from '@/components/ui'
import { asMedia, getHomepage, getServices, getTeam } from '@/lib/data'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'About Genesis Properties',
  description:
    'Genesis Properties brings architects and property consultants together in Rwanda — from finding the right property or plot to designing the space.',
  alternates: { canonical: '/about' },
}

const VALUES: { icon: IconName; title: string; body: string }[] = [
  { icon: 'shield', title: 'Honest advice', body: 'We tell you what we would do in your place — including when to wait or walk away.' },
  { icon: 'check', title: 'Checked before you commit', body: 'Plots, papers and payment plans are reviewed before any money moves.' },
  { icon: 'visualization', title: 'See it first', body: 'Every design is shown in 3D, so decisions are made with your eyes, not on faith.' },
  { icon: 'consultancy', title: 'One consultant, start to finish', body: 'The person you meet first is the person who hands you the keys.' },
]

export default async function AboutPage() {
  const [home, team, services] = await Promise.all([getHomepage(), getTeam(), getServices()])
  return (
    <>
      <PageHero
        eyebrow="About us"
        title={home.aboutHeading ?? 'One team from plot to keys'}
        intro="Genesis Properties is an architecture and real estate consultancy based in Kigali, Rwanda."
        crumbs={[{ name: 'About', href: '/about' }]}
      />
      <section className="container-x grid items-center gap-12 pb-20 lg:grid-cols-2 lg:gap-20">
        <div>
          {home.aboutBody && <p className="text-xl leading-9 text-ink/85">{home.aboutBody}</p>}
          <p className="mt-6 text-lg leading-8 text-muted">
            Buying property is rarely just a transaction. A plot needs a design; an off-plan apartment needs an interior; an investment needs someone who knows the market and the paperwork. We put those skills in one place, so you deal with one team you trust.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/services" className="btn-ink">
              Our services <Icon name="arrow" className="size-4" />
            </Link>
            <Link href="/contact" className="btn-ghost text-ink">
              Contact us
            </Link>
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
          <MediaImage media={asMedia(home.ctaImage) ?? asMedia(home.aboutImage)} sizes="(min-width: 1024px) 50vw, 100vw" />
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-x">
          <SectionHeading eyebrow="How we work" title="What you can count on" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-3xl bg-sand p-7">
                <span className="grid size-12 place-items-center rounded-2xl bg-gold-100 text-gold-600">
                  <Icon name={v.icon} className="size-6" />
                </span>
                <h3 className="mt-5 text-xl">{v.title}</h3>
                <p className="mt-2 text-muted">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {team.length > 0 && (
        <section className="container-x py-20">
          <SectionHeading eyebrow="Team" title="Your consultants" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m) => (
              <div key={m.id} className="card">
                <div className="relative aspect-[4/5]">
                  <MediaImage media={asMedia(m.photo)} sizes="(min-width: 1024px) 33vw, 50vw" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl">{m.name}</h3>
                  <p className="text-sm font-semibold text-gold-600">{m.role}</p>
                  {m.bio && <p className="mt-3 text-muted">{m.bio}</p>}
                  <div className="mt-4 flex flex-wrap gap-4 text-sm">
                    {m.phone && <a href={`tel:${m.phone}`} className="font-semibold hover:text-gold-600">{m.phone}</a>}
                    {m.email && <a href={`mailto:${m.email}`} className="font-semibold hover:text-gold-600">{m.email}</a>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="bg-ink py-20 text-white">
        <div className="container-x">
          <SectionHeading light eyebrow="Services" title={`${services.length} services, one team`} action={{ href: '/services', label: 'Explore' }} />
          <div className="mt-10 flex flex-wrap gap-3">
            {services.map((s) => (
              <Link key={s.id} href={`/services/${s.slug}`} className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm hover:bg-gold hover:text-ink">
                <Icon name={s.icon as IconName} className="size-4" /> {s.title}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
