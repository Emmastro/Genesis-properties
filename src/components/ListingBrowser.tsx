import Link from 'next/link'

import { getListings, getSettings, type ListingFilters } from '@/lib/data'
import { CATEGORY_OPTIONS, PROVINCES, PURPOSE_OPTIONS } from '@/lib/options'

import { InquiryForm } from './InquiryForm'
import { ListingCard } from './ListingCard'
import { EmptyState } from './ui'

export type SearchParams = Record<string, string | string[] | undefined>

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined
const num = (v: string | string[] | undefined) => {
  const n = Number(one(v))
  return Number.isFinite(n) && n > 0 ? n : undefined
}

export const parseFilters = (sp: SearchParams): ListingFilters => ({
  category: one(sp.category),
  purpose: one(sp.purpose),
  district: one(sp.district),
  q: one(sp.q)?.slice(0, 80),
  minBeds: num(sp.minBeds),
  maxPrice: num(sp.maxPrice),
  sort: one(sp.sort),
})

export async function ListingBrowser({
  basePath,
  searchParams,
  fixed = {},
  hideCategory,
  emptyVariant = 'viewing',
}: {
  basePath: string
  searchParams: SearchParams
  fixed?: ListingFilters
  hideCategory?: boolean
  emptyVariant?: 'viewing' | 'plot-search' | 'booking'
}) {
  const filters = { ...parseFilters(searchParams), ...fixed }
  const [{ docs, total }, settings] = await Promise.all([getListings(filters), getSettings()])
  const isPlots = fixed.category === 'plot'
  const select = 'field py-2.5 text-sm'
  const active = Object.entries(parseFilters(searchParams)).some(([, v]) => v !== undefined)

  return (
    <section className="container-x pb-24">
      <form
        method="get"
        action={basePath}
        className="sticky top-[76px] z-30 -mx-2 grid gap-2 rounded-2xl bg-sand/95 p-2 backdrop-blur sm:grid-cols-3 lg:grid-cols-[1.4fr_repeat(5,1fr)_auto]"
      >
        <input name="q" defaultValue={filters.q} placeholder="Search area or name…" className={select} aria-label="Search" />
        <select name="district" defaultValue={filters.district ?? ''} className={select} aria-label="Location">
          <option value="">All locations</option>
          {PROVINCES.map((p) => (
            <optgroup key={p.province} label={p.province}>
              {p.districts.map((d) => (
                <option key={d} value={d.toLowerCase()}>
                  {d}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        {!hideCategory ? (
          <select name="category" defaultValue={filters.category ?? ''} className={select} aria-label="Type">
            <option value="">All types</option>
            {CATEGORY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ) : (
          <span className="hidden lg:block" />
        )}
        <select name="purpose" defaultValue={filters.purpose ?? ''} className={select} aria-label="Buy or rent">
          <option value="">Buy, rent or stay</option>
          {PURPOSE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {!isPlots ? (
          <select name="minBeds" defaultValue={filters.minBeds?.toString() ?? ''} className={select} aria-label="Bedrooms">
            <option value="">Any bedrooms</option>
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n}+ bedrooms
              </option>
            ))}
          </select>
        ) : (
          <span className="hidden lg:block" />
        )}
        <select name="sort" defaultValue={filters.sort ?? ''} className={select} aria-label="Sort">
          <option value="">Recommended</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="newest">Newest</option>
          {!isPlots && <option value="size-desc">Largest first</option>}
        </select>
        <button type="submit" className="btn-ink rounded-xl py-2.5">
          Apply
        </button>
      </form>

      <div className="mt-6 flex items-center justify-between text-sm text-muted">
        <p>
          <span className="font-semibold text-ink">{total}</span> {total === 1 ? 'result' : 'results'}
        </p>
        {active && (
          <Link href={basePath} className="font-semibold text-gold-600 hover:underline">
            Clear filters
          </Link>
        )}
      </div>

      {docs.length > 0 ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {docs.map((l, i) => (
            <ListingCard key={l.id} listing={l} priority={i < 3} />
          ))}
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <EmptyState title={isPlots ? 'No plots listed right now' : 'Nothing matches — yet'}>
            {isPlots
              ? 'Most good plots never reach a website. Tell us the area, size and budget and we will search for you.'
              : 'Not every property we can access is online. Tell us what you need and a consultant will look for you.'}
          </EmptyState>
          <div className="card p-6 sm:p-8">
            <InquiryForm
              variant={isPlots ? 'plot-search' : emptyVariant}
              whatsapp={settings.whatsapp}
              whatsappText={isPlots ? 'Hello Genesis, I am looking for a plot.' : 'Hello Genesis, I am looking for a property.'}
            />
          </div>
        </div>
      )}
    </section>
  )
}
