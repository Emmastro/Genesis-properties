import type { Metadata } from 'next'

import { ListingBrowser, type SearchParams } from '@/components/ListingBrowser'
import { PageHero } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Properties for sale and rent in Rwanda',
  description:
    'Apartments, houses, villas, plots and commercial property for sale and rent in Kigali and across Rwanda, with prices and photos.',
  alternates: { canonical: '/properties' },
}

export default async function PropertiesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return (
    <>
      <PageHero
        eyebrow="Property listings"
        title="Properties for sale and rent"
        intro="Apartments, houses and other properties across Rwanda — filter by area, type and budget."
        crumbs={[{ name: 'Properties', href: '/properties' }]}
      />
      <ListingBrowser basePath="/properties" searchParams={await searchParams} />
    </>
  )
}
