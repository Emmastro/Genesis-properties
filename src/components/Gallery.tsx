'use client'

import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

import { Icon } from './Icon'

export type GalleryItem = {
  url: string
  alt: string
  isVideo?: boolean
  focal?: string
}

/** Photo mosaic + full-screen viewer. Works for photos and uploaded videos. */
export function Gallery({ items, layout = 'mosaic' }: { items: GalleryItem[]; layout?: 'mosaic' | 'grid' }) {
  const [index, setIndex] = useState<number | null>(null)
  const close = useCallback(() => setIndex(null), [])
  const step = useCallback(
    (d: number) => setIndex((i) => (i === null ? i : (i + d + items.length) % items.length)),
    [items.length],
  )

  useEffect(() => {
    if (index === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [index, close, step])

  if (!items.length) return null

  const tile = (item: GalleryItem, i: number, className: string, sizes: string) => (
    <button
      key={`${item.url}-${i}`}
      type="button"
      onClick={() => setIndex(i)}
      className={`group relative overflow-hidden rounded-2xl bg-stone ${className}`}
      aria-label={`Open ${item.isVideo ? 'video' : 'photo'}: ${item.alt}`}
    >
      {item.isVideo ? (
        <>
          <video src={item.url} muted playsInline preload="metadata" className="absolute inset-0 size-full object-cover" />
          <span className="absolute inset-0 grid place-items-center bg-ink/25">
            <span className="grid size-14 place-items-center rounded-full bg-white/90 text-ink">
              <Icon name="play" className="size-6" />
            </span>
          </span>
        </>
      ) : (
        <Image
          src={item.url}
          alt={item.alt}
          fill
          sizes={sizes}
          className="object-cover transition duration-700 group-hover:scale-[1.04]"
          style={item.focal ? { objectPosition: item.focal } : undefined}
        />
      )}
    </button>
  )

  return (
    <>
      {layout === 'mosaic' ? (
        <div className="relative grid h-[52vh] min-h-[340px] grid-cols-4 grid-rows-2 gap-2 sm:gap-3 lg:h-[64vh]">
          {tile(items[0], 0, 'col-span-4 row-span-2 sm:col-span-2', '(min-width: 640px) 50vw, 100vw')}
          {items.slice(1, 5).map((item, i) =>
            tile(item, i + 1, 'hidden sm:block col-span-1 row-span-1', '25vw'),
          )}
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => setIndex(0)}
              className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink shadow-lg"
            >
              <Icon name="grid" className="size-4" /> All {items.length} photos & videos
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((item, i) => tile(item, i, 'aspect-[4/3]', '(min-width: 640px) 33vw, 50vw'))}
        </div>
      )}

      {index !== null && (
        <div
          className="fixed inset-0 z-[70] flex flex-col bg-ink/95 backdrop-blur"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={close}
        >
          <div className="flex items-center justify-between p-4 text-white/80">
            <span className="text-sm">
              {index + 1} / {items.length}
            </span>
            <button type="button" onClick={close} className="grid size-11 place-items-center rounded-full hover:bg-white/10" aria-label="Close">
              <Icon name="close" className="size-6" />
            </button>
          </div>
          <div className="relative flex-1" onClick={(e) => e.stopPropagation()}>
            {items[index].isVideo ? (
              <video key={items[index].url} src={items[index].url} controls autoPlay playsInline className="absolute inset-0 m-auto max-h-full max-w-full" />
            ) : (
              <Image key={items[index].url} src={items[index].url} alt={items[index].alt} fill sizes="100vw" className="object-contain" />
            )}
            {items.length > 1 && (
              <>
                <button type="button" onClick={() => step(-1)} className="absolute left-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Previous">
                  <Icon name="arrowLeft" className="size-5" />
                </button>
                <button type="button" onClick={() => step(1)} className="absolute right-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Next">
                  <Icon name="arrow" className="size-5" />
                </button>
              </>
            )}
          </div>
          <p className="p-4 text-center text-sm text-white/70">{items[index].alt}</p>
        </div>
      )}
    </>
  )
}
