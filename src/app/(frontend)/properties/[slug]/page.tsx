import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Gallery, type GalleryItem } from '@/components/Gallery'
import { Icon, type IconName } from '@/components/Icon'
import { InquiryForm } from '@/components/InquiryForm'
import { JsonLd } from '@/components/JsonLd'
import { ListingCard } from '@/components/ListingCard'
import { MediaImage } from '@/components/MediaImage'
import { RichText } from '@/components/RichText'
import { Videos } from '@/components/Videos'
import { Breadcrumbs, SectionHeading } from '@/components/ui'
import type { Media, Project } from '@/payload-types'
import { asMedia, asMediaList, getListing, getListings, getSettings, populated } from '@/lib/data'
import {
  absoluteUrl,
  bedroomsLabel,
  categoryLabel,
  isVideo,
  listingLocation,
  listingPrice,
  mediaUrl,
  purposeLabel,
  whatsappLink,
} from '@/lib/format'
import { labelOf, LISTING_STATUS_OPTIONS, PROJECT_STATUS_OPTIONS, ZONING_OPTIONS } from '@/lib/options'

export const revalidate = 3600
export const generateStaticParams = async () => []

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const listing = await getListing((await params).slug)
  if (!listing) return {}
  const image = asMedia(listing.meta?.image) ?? asMedia(listing.heroImage)
  const title = listing.meta?.title || `${listing.title} · ${listingPrice(listing)}`
  const description = listing.meta?.description || listing.summary || undefined
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/properties/${listing.slug}` },
    openGraph: { title, description, type: 'website', images: image?.url ? [{ url: absoluteUrl(image.url)! }] : undefined },
  }
}

const toGalleryItem = (m: Media): GalleryItem => ({
  url: m.url!,
  alt: m.alt,
  isVideo: isVideo(m),
  focal: m.focalX != null ? `${m.focalX}% ${m.focalY}%` : undefined,
})

export default async function ListingPage({ params }: Props) {
  const listing = await getListing((await params).slug)
  if (!listing) notFound()

  const settings = await getSettings()
  const project = populated<Project>(listing.project)
  const hero = asMedia(listing.heroImage)
  const media = [hero, ...asMediaList(listing.gallery)].filter((m): m is Media => Boolean(m?.url))
  const plans = asMediaList(listing.floorPlans)
  const isPlot = listing.category === 'plot'
  const isStay = listing.purpose === 'short-stay'
  const variant = isStay ? 'booking' : 'viewing'
  const pageUrl = absoluteUrl(`/properties/${listing.slug}`)
  const waText = `Hello Genesis, I am interested in "${listing.title}" (${pageUrl}).`
  const wa = whatsappLink(settings.whatsapp, waText)

  const similar = (
    await getListings(
      project ? { project: project.id } : { category: listing.category, purpose: listing.purpose },
      4,
    )
  ).docs
    .filter((l) => l.id !== listing.id)
    .slice(0, 3)

  const facts: { icon: IconName; label: string; value: string }[] = isPlot
    ? [
        listing.plotSize ? { icon: 'area' as const, label: 'Plot size', value: `${listing.plotSize.toLocaleString()} m²` } : null,
        listing.zoning ? { icon: 'plan' as const, label: 'Zoning', value: labelOf(ZONING_OPTIONS, listing.zoning) } : null,
        listing.titleDeed ? { icon: 'shield' as const, label: 'Title', value: 'Land title available' } : null,
      ].filter((f) => f !== null)
    : [
        listing.bedrooms != null ? { icon: 'bed' as const, label: 'Bedrooms', value: bedroomsLabel(listing.bedrooms) } : null,
        listing.bathrooms != null ? { icon: 'bath' as const, label: 'Bathrooms', value: String(listing.bathrooms) } : null,
        listing.area != null ? { icon: 'area' as const, label: 'Floor area', value: `${listing.area} m²` } : null,
        listing.parking ? { icon: 'car' as const, label: 'Parking', value: String(listing.parking) } : null,
      ].filter((f) => f !== null)

  return (
    <>
      <div className="container-x pt-28 sm:pt-32">
        <Breadcrumbs
          items={[
            isPlot ? { name: 'Plots', href: '/plots' } : listing.category === 'apartment' ? { name: 'Apartments', href: '/apartments' } : { name: 'Properties', href: '/properties' },
            { name: listing.title, href: `/properties/${listing.slug}` },
          ]}
        />
        <div className="mt-6">
          <Gallery items={media.map(toGalleryItem)} />
        </div>
      </div>

      <div className="container-x grid gap-12 py-12 lg:grid-cols-[1fr_400px] lg:gap-16">
        <article>
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-full bg-ink px-3 py-1 text-white">{purposeLabel(listing.purpose)}</span>
            <span className="rounded-full bg-stone px-3 py-1 text-ink">{categoryLabel(listing.category)}</span>
            {listing.availability !== 'available' && (
              <span className="rounded-full bg-gold px-3 py-1 text-ink">{labelOf(LISTING_STATUS_OPTIONS, listing.availability)}</span>
            )}
            {listing.unitNumber && <span className="rounded-full bg-white px-3 py-1 text-ink">Ref. {listing.unitNumber}</span>}
          </div>
          <h1 className="mt-4 text-4xl leading-tight sm:text-5xl">{listing.title}</h1>
          <p className="mt-3 flex items-center gap-2 text-muted">
            <Icon name="pin" className="size-5 text-gold-600" /> {listingLocation(listing)}
            {listing.mapUrl && (
              <a href={listing.mapUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-sm font-semibold text-gold-600 underline underline-offset-4">
                View on map
              </a>
            )}
          </p>

          {facts.length > 0 && (
            <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {facts.map((f) => (
                <div key={f.label} className="rounded-2xl bg-white p-4">
                  <Icon name={f.icon} className="size-5 text-gold-600" />
                  <dt className="mt-3 text-xs uppercase tracking-wider text-muted">{f.label}</dt>
                  <dd className="mt-0.5 font-display text-xl">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {listing.summary && <p className="mt-10 text-xl leading-9 text-ink/85">{listing.summary}</p>}
          <RichText data={listing.description} className="mt-6" />

          {listing.features && listing.features.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl">Highlights</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {listing.features.map((f) => (
                  <li key={f.id} className="flex items-start gap-3 rounded-2xl bg-white p-4">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-gold-100 text-gold-600">
                      <Icon name="check" className="size-3.5" />
                    </span>
                    {f.feature}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {listing.videos && listing.videos.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl">Videos</h2>
              <div className="mt-5">
                <Videos videos={listing.videos} />
              </div>
            </section>
          )}

          {plans.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl">Floor plans</h2>
              <div className="mt-5">
                <Gallery items={plans.map(toGalleryItem)} layout="grid" />
              </div>
            </section>
          )}

          {project && (
            <section className="mt-12 overflow-hidden rounded-3xl bg-ink text-white sm:grid sm:grid-cols-[220px_1fr]">
              <div className="relative h-48 sm:h-auto">
                <MediaImage media={asMedia(project.heroImage)} sizes="220px" />
              </div>
              <div className="p-6 sm:p-8">
                <p className="eyebrow text-gold!">Part of a development · {labelOf(PROJECT_STATUS_OPTIONS, project.stage)}</p>
                <h2 className="mt-2 text-3xl">{project.title}</h2>
                {project.summary && <p className="mt-3 text-white/75">{project.summary}</p>}
                <Link href={`/projects/${project.slug}`} className="btn-gold mt-6">
                  See the development <Icon name="arrow" className="size-4" />
                </Link>
              </div>
            </section>
          )}
        </article>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6 sm:p-7">
            <p className="text-sm text-muted">{isStay ? 'Price' : listing.purpose === 'rent' ? 'Rent' : 'Price'}</p>
            <p className="font-display text-4xl">{listingPrice(listing)}</p>
            {listing.priceNote && <p className="mt-1 text-sm text-gold-600">{listing.priceNote}</p>}
            <div className="mt-6 border-t border-line pt-6">
              <p className="mb-4 font-display text-xl">{isStay ? 'Book this apartment' : 'Arrange a viewing'}</p>
              <InquiryForm
                variant={variant}
                listingId={listing.id}
                projectId={project?.id}
                defaultMessage={`I am interested in ${listing.title}.`}
                whatsapp={settings.whatsapp}
                whatsappText={waText}
              />
            </div>
          </div>
          {wa && (
            <p className="mt-4 text-center text-sm text-muted">
              Prefer to talk?{' '}
              <a href={wa} className="font-semibold text-ink underline underline-offset-4" target="_blank" rel="noopener noreferrer">
                Message us on WhatsApp
              </a>
            </p>
          )}
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="bg-white py-20">
          <div className="container-x">
            <SectionHeading
              eyebrow={project ? `More at ${project.title}` : 'Similar'}
              title={project ? 'Other units available' : 'You may also like'}
              action={project ? { href: `/projects/${project.slug}`, label: 'All units' } : { href: '/properties', label: 'All properties' }}
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          </div>
        </section>
      )}

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'RealEstateListing',
          name: listing.title,
          description: listing.summary ?? undefined,
          url: pageUrl,
          datePosted: listing.publishedAt ?? listing.createdAt,
          image: media.filter((m) => !isVideo(m)).map((m) => absoluteUrl(mediaUrl(m))),
          about: {
            '@type': isPlot ? 'Landform' : listing.category === 'apartment' ? 'Apartment' : listing.category === 'house' || listing.category === 'villa' ? 'SingleFamilyResidence' : 'Place',
            name: listing.title,
            numberOfRooms: isPlot ? undefined : (listing.bedrooms ?? undefined),
            numberOfBathroomsTotal: isPlot ? undefined : (listing.bathrooms ?? undefined),
            floorSize: listing.area ? { '@type': 'QuantitativeValue', value: listing.area, unitCode: 'MTK' } : undefined,
            address: {
              '@type': 'PostalAddress',
              addressLocality: listing.neighbourhood ?? 'Kigali',
              addressRegion: listing.district ?? undefined,
              addressCountry: 'RW',
            },
          },
          offers:
            listing.price != null
              ? {
                  '@type': 'Offer',
                  price: listing.price,
                  priceCurrency: listing.currency,
                  availability:
                    listing.availability === 'available' ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
                  businessFunction: listing.purpose === 'sale' ? 'http://purl.org/goodrelations/v1#Sell' : 'http://purl.org/goodrelations/v1#LeaseOut',
                }
              : undefined,
        }}
      />
    </>
  )
}
