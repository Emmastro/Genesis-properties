import type { Metadata } from 'next'

import { Icon } from '@/components/Icon'
import { InquiryForm } from '@/components/InquiryForm'
import { ListingBrowser, type SearchParams } from '@/components/ListingBrowser'
import { PageHero } from '@/components/ui'
import { getService, getSettings } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Plots for sale in Rwanda — plot search',
  description:
    'Find a plot in Kigali or anywhere in Rwanda by location, size and budget. We check the land record and zoning before you buy.',
  alternates: { canonical: '/plots' },
}

export default async function PlotsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const [settings, service] = await Promise.all([getSettings(), getService('plot-search')])
  return (
    <>
      <PageHero
        eyebrow="Plot search"
        title="Plots to build on"
        intro="Building your own home often costs less than buying one — if you start with the right plot. Browse what is listed, or let us search for you."
        crumbs={[{ name: 'Plots', href: '/plots' }]}
      >
        <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink/80">
          {['Matched to your location, size and budget', 'Land record and zoning checked', 'An architect’s view of what you can build'].map((t) => (
            <li key={t} className="flex items-center gap-2">
              <Icon name="check" className="size-4 text-gold-600" /> {t}
            </li>
          ))}
        </ul>
      </PageHero>
      <ListingBrowser basePath="/plots" searchParams={await searchParams} fixed={{ category: 'plot' }} hideCategory />
      <section className="bg-white py-20">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Can’t see the right plot?</p>
            <h2 className="mt-3 text-4xl leading-tight">Tell us what you want to build. We’ll find the land.</h2>
            <p className="mt-5 text-lg leading-8 text-muted">
              Share the area, the size and your budget. We shortlist plots, check each one, and arrange visits — in person or by video if you are abroad.
            </p>
          </div>
          <div className="card p-6 sm:p-8">
            <InquiryForm variant="plot-search" serviceId={service?.id} whatsapp={settings.whatsapp} whatsappText="Hello Genesis, I am looking for a plot." />
          </div>
        </div>
      </section>
    </>
  )
}
