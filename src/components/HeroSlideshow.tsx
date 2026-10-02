'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

type Slide = { url: string; alt: string; focal?: string }

export function HeroSlideshow({ slides, video }: { slides: Slide[]; video?: string | null }) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (slides.length < 2 || video) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setActive((i) => (i + 1) % slides.length), 6500)
    return () => clearInterval(t)
  }, [slides.length, video])

  if (video) {
    return (
      <video
        className="absolute inset-0 size-full object-cover"
        src={video}
        poster={slides[0]?.url}
        autoPlay
        muted
        loop
        playsInline
      />
    )
  }

  return (
    <>
      {slides.map((s, i) => (
        <div
          key={s.url}
          className={`absolute inset-0 transition-[opacity,transform] duration-[2400ms] ease-out ${
            i === active ? 'scale-100 opacity-100' : 'scale-[1.06] opacity-0'
          }`}
          aria-hidden={i !== active}
        >
          <Image
            src={s.url}
            alt={s.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
            style={s.focal ? { objectPosition: s.focal } : undefined}
          />
        </div>
      ))}
    </>
  )
}
