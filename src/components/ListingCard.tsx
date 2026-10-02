import Link from 'next/link'

import type { Listing } from '@/payload-types'
import { asMedia } from '@/lib/data'
import { bedroomsLabel, categoryLabel, listingLocation, listingPrice } from '@/lib/format'

import { Icon } from './Icon'
import { MediaImage } from './MediaImage'

const AVAILABILITY_STYLE: Record<string, string> = {
  available: 'bg-white/90 text-ink',
  reserved: 'bg-gold text-ink',
  sold: 'bg-ink text-white',
  rented: 'bg-ink text-white',
}

export function ListingCard({ listing, priority }: { listing: Listing; priority?: boolean }) {
  const hero = asMedia(listing.heroImage)
  const isPlot = listing.category === 'plot'
  const tag =
    listing.purpose === 'sale' ? 'For sale' : listing.purpose === 'rent' ? 'For rent' : 'Short stay'

  return (
    <Link
      href={`/properties/${listing.slug}`}
      className="group card flex flex-col transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_50px_-28px_rgba(15,31,53,0.45)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <MediaImage
          media={hero}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="transition duration-700 group-hover:scale-[1.04]"
          priority={priority}
        />
        <div className="absolute left-4 top-4 flex gap-2">
          <span className="rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur">{tag}</span>
          {listing.availability !== 'available' && (
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${AVAILABILITY_STYLE[listing.availability] ?? ''}`}
            >
              {listing.availability}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="flex items-center gap-1.5 text-sm text-muted">
          <Icon name="pin" className="size-4 text-gold-600" />
          {listingLocation(listing)}
        </p>
        <h3 className="mt-2 text-[1.2rem] leading-snug text-ink">{listing.title}</h3>
        <div className="mb-5 mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink/75">
          {isPlot ? (
            listing.plotSize ? (
              <span className="flex items-center gap-1.5">
                <Icon name="area" className="size-4" /> {listing.plotSize.toLocaleString()} m²
              </span>
            ) : null
          ) : (
            <>
              {listing.bedrooms != null && (
                <span className="flex items-center gap-1.5">
                  <Icon name="bed" className="size-4" /> {bedroomsLabel(listing.bedrooms)}
                </span>
              )}
              {listing.bathrooms != null && (
                <span className="flex items-center gap-1.5">
                  <Icon name="bath" className="size-4" /> {listing.bathrooms} bath
                </span>
              )}
              {listing.area != null && (
                <span className="flex items-center gap-1.5">
                  <Icon name="area" className="size-4" /> {listing.area} m²
                </span>
              )}
            </>
          )}
          {!isPlot && listing.bedrooms == null && <span>{categoryLabel(listing.category)}</span>}
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-line pt-4">
          <div>
            <p className="font-display text-[1.35rem] text-ink">{listingPrice(listing)}</p>
            {listing.priceNote && <p className="text-xs text-muted">{listing.priceNote}</p>}
          </div>
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-sand text-ink transition group-hover:bg-gold">
            <Icon name="arrow" className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}
