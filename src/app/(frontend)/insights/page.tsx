import type { Metadata } from 'next'
import Link from 'next/link'

import { MediaImage } from '@/components/MediaImage'
import { EmptyState, PageHero } from '@/components/ui'
import { asMedia, getPosts } from '@/lib/data'
import { formatDate } from '@/lib/format'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Insights — property in Rwanda',
  description: 'Notes from Genesis Properties on buying, building and investing in property in Rwanda.',
  alternates: { canonical: '/insights' },
}

export default async function InsightsPage() {
  const posts = await getPosts()
  return (
    <>
      <PageHero eyebrow="Insights" title="Notes on property in Rwanda" crumbs={[{ name: 'Insights', href: '/insights' }]} />
      <section className="container-x pb-24">
        {posts.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <Link key={p.id} href={`/insights/${p.slug}`} className="group card">
                <div className="relative aspect-[16/10]">
                  <MediaImage media={asMedia(p.cover)} sizes="(min-width: 1024px) 33vw, 100vw" />
                </div>
                <div className="p-6">
                  <p className="text-xs text-muted">{formatDate(p.publishedAt)}</p>
                  <h2 className="mt-2 text-2xl group-hover:text-gold-600">{p.title}</h2>
                  {p.excerpt && <p className="mt-2 text-muted">{p.excerpt}</p>}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState title="First articles coming soon">Guides on buying, building and investing in Rwanda.</EmptyState>
        )}
      </section>
    </>
  )
}
