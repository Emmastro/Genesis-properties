import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { JsonLd } from '@/components/JsonLd'
import { MediaImage } from '@/components/MediaImage'
import { RichText } from '@/components/RichText'
import { Breadcrumbs } from '@/components/ui'
import { asMedia, getPost, getSettings } from '@/lib/data'
import { absoluteUrl, formatDate, mediaUrl } from '@/lib/format'

export const revalidate = 3600
export const generateStaticParams = async () => []

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).slug)
  if (!post) return {}
  const image = asMedia(post.meta?.image) ?? asMedia(post.cover)
  const title = post.meta?.title || post.title
  const description = post.meta?.description || post.excerpt || undefined
  return {
    title,
    description,
    alternates: { canonical: `/insights/${post.slug}` },
    openGraph: { type: 'article', title, description, publishedTime: post.publishedAt ?? undefined, images: image?.url ? [{ url: absoluteUrl(image.url)! }] : undefined },
  }
}

export default async function PostPage({ params }: Props) {
  const post = await getPost((await params).slug)
  if (!post) notFound()
  const settings = await getSettings()
  const cover = asMedia(post.cover)
  return (
    <article className="pb-24 pt-32 sm:pt-40">
      <div className="container-x max-w-3xl!">
        <Breadcrumbs items={[{ name: 'Insights', href: '/insights' }, { name: post.title, href: `/insights/${post.slug}` }]} />
        <p className="mt-8 text-sm text-muted">{formatDate(post.publishedAt)}</p>
        <h1 className="mt-2 text-4xl leading-tight sm:text-6xl">{post.title}</h1>
        {post.excerpt && <p className="mt-5 text-xl leading-9 text-muted">{post.excerpt}</p>}
      </div>
      {cover && (
        <div className="container-x mt-10">
          <div className="relative aspect-[16/8] overflow-hidden rounded-[2rem]">
            <MediaImage media={cover} sizes="100vw" priority />
          </div>
        </div>
      )}
      <div className="container-x mt-12 max-w-3xl!">
        <RichText data={post.content} />
      </div>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.excerpt ?? undefined,
          datePublished: post.publishedAt ?? post.createdAt,
          dateModified: post.updatedAt,
          image: cover ? absoluteUrl(mediaUrl(cover)) : undefined,
          mainEntityOfPage: absoluteUrl(`/insights/${post.slug}`),
          publisher: { '@type': 'Organization', name: settings.legalName },
        }}
      />
    </article>
  )
}
