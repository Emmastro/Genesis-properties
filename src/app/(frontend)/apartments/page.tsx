import type { Metadata } from 'next'

import { ListingBrowser, type SearchParams } from '@/components/ListingBrowser'
import { PageHero } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Apartments in Kigali — buy, rent or book',
  description:
    'Browse and book apartments in Kigali: off-plan and completed units for sale, long-term rentals and short stays, with photos, prices and floor plans.',
  alternates: { canonical: '/apartments' },
}

export default async function ApartmentsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return (
    <>
      <PageHero
        eyebrow="Apartment booking"
        title="Apartments to buy, rent or book"
        intro="Studios to three-bedroom homes in Kigali’s new buildings. Send a viewing or booking request in a minute."
        crumbs={[{ name: 'Apartments', href: '/apartments' }]}
      />
      <ListingBrowser basePath="/apartments" searchParams={await searchParams} fixed={{ category: 'apartment' }} hideCategory emptyVariant="booking" />
    </>
  )
}
