import config from '@payload-config'
import { getPayload, type Where } from 'payload'
import { cache } from 'react'

import type { Homepage, Listing, Media, Post, Project, Service, SiteSetting, Team, Testimonial } from '@/payload-types'

export const getPayloadClient = cache(() => getPayload({ config }))

export const getSettings = cache(async (): Promise<SiteSetting> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 1, overrideAccess: false })
})

export const getHomepage = cache(async (): Promise<Homepage> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'homepage', depth: 1, overrideAccess: false })
})

export const getServices = cache(async (): Promise<Service[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'services', overrideAccess: false, limit: 50, sort: 'order', depth: 1 })
  return res.docs
})

export const getService = cache(async (slug: string): Promise<Service | null> => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'services', overrideAccess: false, where: { slug: { equals: slug } }, limit: 1, depth: 1 })
  return res.docs[0] ?? null
})

export const getProjects = cache(async (opts: { featured?: boolean } = {}): Promise<Project[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'projects', overrideAccess: false,
    where: opts.featured ? { featured: { equals: true } } : undefined,
    sort: 'order',
    limit: 50,
    depth: 1,
  })
  return res.docs
})

export const getProject = cache(async (slug: string): Promise<Project | null> => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'projects', overrideAccess: false, where: { slug: { equals: slug } }, limit: 1, depth: 1 })
  return res.docs[0] ?? null
})

export type ListingFilters = {
  category?: string
  purpose?: string
  district?: string
  q?: string
  minBeds?: number
  maxPrice?: number
  project?: number
  sort?: string
  includeUnavailable?: boolean
}

const SORTS: Record<string, string> = {
  newest: '-publishedAt',
  'price-asc': 'price',
  'price-desc': '-price',
  'size-desc': '-area',
}

export const getListings = cache(
  async (filters: ListingFilters = {}, limit = 60, page = 1): Promise<{ docs: Listing[]; total: number }> => {
    const payload = await getPayloadClient()
    const and: Where[] = []
    if (filters.category) and.push({ category: { equals: filters.category } })
    if (filters.purpose) and.push({ purpose: { equals: filters.purpose } })
    if (filters.district) and.push({ district: { equals: filters.district } })
    if (filters.project) and.push({ project: { equals: filters.project } })
    if (filters.minBeds) and.push({ bedrooms: { greater_than_equal: filters.minBeds } })
    // Budgets on the site are in USD.
    if (filters.maxPrice) and.push({ price: { less_than_equal: filters.maxPrice } }, { currency: { equals: 'USD' } })
    if (!filters.includeUnavailable) and.push({ availability: { in: ['available', 'reserved'] } })
    if (filters.q) {
      and.push({
        or: [
          { title: { like: filters.q } },
          { neighbourhood: { like: filters.q } },
          { summary: { like: filters.q } },
        ],
      })
    }
    const res = await payload.find({
      collection: 'listings', overrideAccess: false,
      where: and.length ? { and } : undefined,
      sort: SORTS[filters.sort ?? ''] ?? ['-featured', 'price'],
      limit,
      page,
      depth: 1,
    })
    return { docs: res.docs, total: res.totalDocs }
  },
)

export const getFeaturedListings = cache(async (limit = 6): Promise<Listing[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'listings', overrideAccess: false,
    where: { availability: { in: ['available', 'reserved'] } },
    sort: ['-featured', '-publishedAt'],
    limit,
    depth: 1,
  })
  return res.docs
})

export const getListing = cache(async (slug: string): Promise<Listing | null> => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'listings', overrideAccess: false, where: { slug: { equals: slug } }, limit: 1, depth: 2 })
  return res.docs[0] ?? null
})

export const getStats = cache(async () => {
  const payload = await getPayloadClient()
  const [available, projects, cheapest] = await Promise.all([
    payload.count({ collection: 'listings', overrideAccess: false, where: { availability: { equals: 'available' } } }),
    payload.count({ collection: 'projects' }),
    payload.find({
      collection: 'listings', overrideAccess: false,
      where: { and: [{ availability: { equals: 'available' } }, { purpose: { equals: 'sale' } }, { currency: { equals: 'USD' } }, { price: { exists: true } }] },
      sort: 'price',
      limit: 1,
      depth: 0,
    }),
  ])
  return {
    available: available.totalDocs,
    projects: projects.totalDocs,
    fromPrice: cheapest.docs[0]?.price ?? null,
  }
})

export const getTeam = cache(async (): Promise<Team[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'team', overrideAccess: false, sort: 'order', limit: 50, depth: 1 })
  return res.docs
})

export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'testimonials', overrideAccess: false, limit: 12, depth: 1 })
  return res.docs
})

export const getPosts = cache(async (limit = 30): Promise<Post[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'posts', overrideAccess: false, sort: '-publishedAt', limit, depth: 1 })
  return res.docs
})

export const getPost = cache(async (slug: string): Promise<Post | null> => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'posts', overrideAccess: false, where: { slug: { equals: slug } }, limit: 1, depth: 1 })
  return res.docs[0] ?? null
})

/** Narrow a relationship value to the populated document. */
export const populated = <T extends object>(value: number | T | null | undefined): T | null =>
  value && typeof value === 'object' ? value : null

export const asMedia = (value: number | Media | null | undefined) => populated<Media>(value)

export const asMediaList = (values: (number | Media)[] | null | undefined): Media[] =>
  (values ?? []).map(asMedia).filter((m): m is Media => Boolean(m?.url))
