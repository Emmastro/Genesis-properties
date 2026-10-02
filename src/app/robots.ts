import type { MetadataRoute } from 'next'

import { getServerSideURL } from '@/lib/url'

export default function robots(): MetadataRoute.Robots {
  const base = getServerSideURL()
  return {
    rules: [{ userAgent: '*', allow: ['/', '/api/media/'], disallow: ['/admin', '/api/'] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
