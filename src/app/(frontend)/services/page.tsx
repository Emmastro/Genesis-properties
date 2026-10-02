import type { Metadata } from 'next'
import Link from 'next/link'

import { Icon, type IconName } from '@/components/Icon'
import { MediaImage } from '@/components/MediaImage'
import { PageHero } from '@/components/ui'
import { asMedia, getServices } from '@/lib/data'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Services — architectural design and real estate consultancy',
  description:
    'Exterior, interior and landscape design with 3D visualization; plot search, property advisory, real estate consultancy and apartment booking in Rwanda.',
  alternates: { canonical: '/services' },
}

const GROUPS = [
  {
    key: 'architectural',
    title: 'Architectural services',
    intro: 'From the first sketch to photo-real 3D — buildings, interiors and outdoor spaces designed around you.',
  },
  {
    key: 'real-estate',
    title: 'Real estate services',
    intro: 'Finding, checking and securing the right property or plot, with a consultant beside you all the way.',
  },
]

export default async function ServicesPage() {
  const services = await getServices()
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Everything between a plot and a home"
        intro="Two disciplines, one team. Our architects and property consultants work side by side, so the place you buy and the place you design fit together."
        crumbs={[{ name: 'Services', href: '/services' }]}
      />
      {GROUPS.map((g, gi) => (
        <section key={g.key} className={gi % 2 ? 'bg-white py-20' : 'pb-20'}>
          <div className="container-x">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow">{String(gi + 1).padStart(2, '0')}</p>
                <h2 className="mt-2 text-4xl sm:text-5xl">{g.title}</h2>
              </div>
              <p className="max-w-md text-muted">{g.intro}</p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {services
                .filter((s) => s.group === g.key)
                .map((s) => (
                  <Link key={s.id} href={`/services/${s.slug}`} className="group card grid sm:grid-cols-[200px_1fr]">
                    <div className="relative h-48 sm:h-full">
                      <MediaImage media={asMedia(s.image)} sizes="(min-width: 640px) 200px, 100vw" className="transition duration-700 group-hover:scale-105" />
                    </div>
                    <div className="flex flex-col p-6">
                      <span className="grid size-11 place-items-center rounded-xl bg-gold-100 text-gold-600">
                        <Icon name={s.icon as IconName} className="size-5" />
                      </span>
                      <h3 className="mt-4 text-2xl">{s.title}</h3>
                      <p className="mt-2 text-muted">{s.shortDescription}</p>
                      <span className="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-semibold text-gold-600">
                        Learn more <Icon name="arrow" className="size-4 transition group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      ))}
    </>
  )
}
