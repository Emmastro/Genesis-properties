import type { Media } from '@/payload-types'
import { embedUrl } from '@/lib/format'

type VideoEntry = { title?: string | null; file?: number | Media | null; url?: string | null; id?: string | null }

export function Videos({ videos }: { videos?: VideoEntry[] | null }) {
  const items = (videos ?? [])
    .map((v) => {
      const file = v.file && typeof v.file === 'object' ? v.file : null
      if (file?.url) return { key: v.id ?? file.url, title: v.title, src: file.url, kind: 'file' as const }
      const embed = embedUrl(v.url)
      if (embed) return { key: v.id ?? embed, title: v.title, src: embed, kind: 'embed' as const, vertical: /tiktok|instagram/.test(embed) }
      if (v.url) return { key: v.id ?? v.url, title: v.title, src: v.url, kind: 'link' as const }
      return null
    })
    .filter(Boolean) as { key: string; title?: string | null; src: string; kind: 'file' | 'embed' | 'link'; vertical?: boolean }[]

  if (!items.length) return null

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {items.map((v) => (
        <figure key={v.key} className="overflow-hidden rounded-2xl bg-ink">
          {v.kind === 'file' && <video src={v.src} controls playsInline preload="metadata" className="aspect-video w-full" />}
          {v.kind === 'embed' && (
            <iframe
              src={v.src}
              title={v.title ?? 'Video'}
              className={`w-full ${v.vertical ? 'aspect-[9/16] max-h-[640px]' : 'aspect-video'}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          )}
          {v.kind === 'link' && (
            <a href={v.src} target="_blank" rel="noopener noreferrer" className="flex aspect-video items-center justify-center text-gold underline">
              Watch the video
            </a>
          )}
          {v.title && <figcaption className="bg-white px-4 py-3 text-sm text-ink">{v.title}</figcaption>}
        </figure>
      ))}
    </div>
  )
}
