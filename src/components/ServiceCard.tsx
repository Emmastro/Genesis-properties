import Link from 'next/link'

import type { Service } from '@/payload-types'

import { Icon, type IconName } from './Icon'

export function ServiceCard({ service, dark }: { service: Service; dark?: boolean }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className={`group flex h-full flex-col rounded-3xl p-6 transition duration-300 sm:p-7 ${
        dark
          ? 'bg-white/[0.06] text-white ring-1 ring-white/10 hover:bg-white/[0.1]'
          : 'bg-white text-ink ring-1 ring-line hover:-translate-y-1 hover:shadow-[0_24px_40px_-28px_rgba(15,31,53,0.4)]'
      }`}
    >
      <span
        className={`grid size-12 place-items-center rounded-2xl ${dark ? 'bg-gold/15 text-gold' : 'bg-gold-100 text-gold-600'}`}
      >
        <Icon name={service.icon as IconName} className="size-6" />
      </span>
      <h3 className="mt-5 text-xl">{service.title}</h3>
      <p className={`mt-2 text-[0.95rem] leading-7 ${dark ? 'text-white/70' : 'text-muted'}`}>
        {service.shortDescription}
      </p>
      <span
        className={`mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold ${dark ? 'text-gold' : 'text-gold-600'}`}
      >
        Learn more <Icon name="arrow" className="size-4 transition group-hover:translate-x-1" />
      </span>
    </Link>
  )
}
