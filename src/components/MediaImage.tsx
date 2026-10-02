import Image from 'next/image'

import type { Media } from '@/payload-types'

type Props = {
  media?: Media | null
  sizes: string
  className?: string
  priority?: boolean
  fill?: boolean
  alt?: string
}

/** next/image for a CMS photo, respecting the focal point set in the studio. */
export function MediaImage({ media, sizes, className = '', priority, fill = true, alt }: Props) {
  if (!media?.url) {
    return <div className={`bg-gradient-to-br from-stone to-gold-100 ${className}`} aria-hidden="true" />
  }
  const objectPosition =
    media.focalX != null && media.focalY != null ? `${media.focalX}% ${media.focalY}%` : undefined

  if (fill) {
    return (
      <Image
        src={media.url}
        alt={alt ?? media.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${className}`}
        style={objectPosition ? { objectPosition } : undefined}
      />
    )
  }
  return (
    <Image
      src={media.url}
      alt={alt ?? media.alt}
      width={media.width ?? 1600}
      height={media.height ?? 1000}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  )
}
