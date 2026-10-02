import Link from 'next/link'

import type { Project } from '@/payload-types'
import { asMedia } from '@/lib/data'
import { formatMoneyShort, projectLocation } from '@/lib/format'
import { labelOf, PROJECT_STATUS_OPTIONS } from '@/lib/options'

import { Icon } from './Icon'
import { MediaImage } from './MediaImage'

export function ProjectCard({
  project,
  fromPrice,
  unitsAvailable,
  large,
}: {
  project: Project
  fromPrice?: number | null
  unitsAvailable?: number
  large?: boolean
}) {
  const price = project.priceFrom ?? fromPrice
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`group relative block overflow-hidden rounded-[2rem] bg-ink ${large ? 'aspect-[4/5] sm:aspect-[16/11]' : 'aspect-[4/5]'}`}
    >
      <MediaImage
        media={asMedia(project.heroImage)}
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="transition duration-[1.2s] group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" />
      <div className="absolute left-5 top-5 flex flex-wrap gap-2 sm:left-7 sm:top-7">
        <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink">
          {labelOf(PROJECT_STATUS_OPTIONS, project.stage)}
        </span>
        {unitsAvailable ? (
          <span className="rounded-full bg-gold px-3 py-1 text-xs font-semibold text-ink">
            {unitsAvailable} unit{unitsAvailable === 1 ? '' : 's'} available
          </span>
        ) : null}
      </div>
      <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
        <p className="flex items-center gap-1.5 text-sm text-white/75">
          <Icon name="pin" className="size-4 text-gold" /> {projectLocation(project)}
        </p>
        <h3 className="mt-2 text-3xl sm:text-4xl">{project.title}</h3>
        {project.tagline && <p className="mt-2 max-w-md text-white/80">{project.tagline}</p>}
        <div className="mt-5 flex items-center justify-between gap-4">
          {price ? (
            <p className="text-sm text-white/75">
              From <span className="font-display text-2xl text-white">{formatMoneyShort(price)}</span>
            </p>
          ) : (
            <span />
          )}
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur transition group-hover:bg-gold group-hover:text-ink">
            View development <Icon name="arrow" className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}
