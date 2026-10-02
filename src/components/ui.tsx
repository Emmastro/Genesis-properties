import Link from 'next/link'
import type { ReactNode } from 'react'

import type { Media } from '@/payload-types'
import { absoluteUrl } from '@/lib/format'

import { Icon } from './Icon'
import { JsonLd } from './JsonLd'
import { MediaImage } from './MediaImage'

export function SectionHeading({
  eyebrow,
  title,
  intro,
  action,
  light,
  center,
}: {
  eyebrow?: string
  title: ReactNode
  intro?: ReactNode
  action?: { href: string; label: string }
  light?: boolean
  center?: boolean
}) {
  return (
    <div
      className={`flex flex-col gap-6 ${center ? 'items-center text-center' : 'sm:flex-row sm:items-end sm:justify-between'}`}
    >
      <div className={center ? 'max-w-2xl' : 'max-w-2xl'}>
        {eyebrow && <p className={`eyebrow ${light ? 'text-gold!' : ''}`}>{eyebrow}</p>}
        <h2 className={`mt-3 text-[2rem] leading-[1.1] sm:text-[2.6rem] ${light ? 'text-white' : 'text-ink'}`}>{title}</h2>
        {intro && <p className={`mt-4 text-[1.05rem] leading-8 ${light ? 'text-white/70' : 'text-muted'}`}>{intro}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className={`group inline-flex shrink-0 items-center gap-2 text-sm font-semibold ${light ? 'text-gold' : 'text-ink'}`}
        >
          {action.label}
          <span className="grid size-9 place-items-center rounded-full bg-gold text-ink transition group-hover:translate-x-1">
            <Icon name="arrow" className="size-4" />
          </span>
        </Link>
      )}
    </div>
  )
}

export type Crumb = { name: string; href: string }

export function Breadcrumbs({ items, light }: { items: Crumb[]; light?: boolean }) {
  const all = [{ name: 'Home', href: '/' }, ...items]
  return (
    <>
      <nav aria-label="Breadcrumb" className={`text-sm ${light ? 'text-white/70' : 'text-muted'}`}>
        <ol className="flex flex-wrap items-center gap-1.5">
          {all.map((c, i) => (
            <li key={c.href} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden="true">/</span>}
              {i < all.length - 1 ? (
                <Link href={c.href} className={light ? 'hover:text-white' : 'hover:text-ink'}>
                  {c.name}
                </Link>
              ) : (
                <span aria-current="page" className={light ? 'text-white' : 'text-ink'}>
                  {c.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: all.map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: c.name,
            item: absoluteUrl(c.href),
          })),
        }}
      />
    </>
  )
}

/** Header band for inner pages. With an image it becomes a full-bleed photo hero. */
export function PageHero({
  eyebrow,
  title,
  intro,
  crumbs,
  image,
  children,
}: {
  eyebrow?: string
  title: ReactNode
  intro?: ReactNode
  crumbs: Crumb[]
  image?: Media | null
  children?: ReactNode
}) {
  if (image?.url) {
    return (
      <section className="relative isolate overflow-hidden bg-ink pb-16 pt-36 text-white sm:pb-20 sm:pt-44">
        <MediaImage media={image} sizes="100vw" priority className="-z-10 opacity-55" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/50 to-ink/30" />
        <div className="container-x">
          <Breadcrumbs items={crumbs} light />
          {eyebrow && <p className="eyebrow mt-8 text-gold!">{eyebrow}</p>}
          <h1 className="mt-3 max-w-3xl text-4xl leading-[1.05] sm:text-6xl">{title}</h1>
          {intro && <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">{intro}</p>}
          {children}
        </div>
      </section>
    )
  }
  return (
    <section className="bg-sand pb-10 pt-32 sm:pb-14 sm:pt-40">
      <div className="container-x">
        <Breadcrumbs items={crumbs} />
        {eyebrow && <p className="eyebrow mt-8">{eyebrow}</p>}
        <h1 className="mt-3 max-w-3xl text-4xl leading-[1.05] text-ink sm:text-6xl">{title}</h1>
        {intro && <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{intro}</p>}
        {children}
      </div>
    </section>
  )
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-3xl border border-dashed border-gold/50 bg-white/60 p-10 text-center">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-gold-100 text-gold-600">
        <Icon name="search" className="size-6" />
      </span>
      <h3 className="mt-4 text-2xl">{title}</h3>
      {children && <div className="mx-auto mt-3 max-w-lg text-muted">{children}</div>}
    </div>
  )
}
