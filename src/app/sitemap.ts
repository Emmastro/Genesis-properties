import type { MetadataRoute } from 'next'

import { getPayloadClient } from '@/lib/data'
import { getServerSideURL } from '@/lib/url'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getServerSideURL()
  const payload = await getPayloadClient()
  const opts = { limit: 1000, depth: 0, overrideAccess: false, pagination: false } as const
  const [listings, projects, services, posts] = await Promise.all([
    payload.find({ collection: 'listings', ...opts, select: { slug: true, updatedAt: true } }),
    payload.find({ collection: 'projects', ...opts, select: { slug: true, updatedAt: true } }),
    payload.find({ collection: 'services', ...opts, select: { slug: true, updatedAt: true } }),
    payload.find({ collection: 'posts', ...opts, select: { slug: true, updatedAt: true } }),
  ])
  const statics = ['', '/apartments', '/properties', '/plots', '/projects', '/services', '/about', '/contact', '/insights']
  return [
    ...statics.map((p) => ({ url: `${base}${p}`, changeFrequency: 'weekly' as const, priority: p === '' ? 1 : 0.8 })),
    ...projects.docs.map((d) => ({ url: `${base}/projects/${d.slug}`, lastModified: d.updatedAt, priority: 0.9 })),
    ...listings.docs.map((d) => ({ url: `${base}/properties/${d.slug}`, lastModified: d.updatedAt, priority: 0.8 })),
    ...services.docs.map((d) => ({ url: `${base}/services/${d.slug}`, lastModified: d.updatedAt, priority: 0.7 })),
    ...posts.docs.map((d) => ({ url: `${base}/insights/${d.slug}`, lastModified: d.updatedAt, priority: 0.6 })),
  ]
}
