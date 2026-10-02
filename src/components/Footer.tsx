import Link from 'next/link'

import type { Service, SiteSetting } from '@/payload-types'
import { telLink, whatsappLink } from '@/lib/format'

import { Icon, SocialIcon, WhatsAppIcon } from './Icon'
import { Logo } from './Logo'

export function Footer({ settings, services }: { settings: SiteSetting; services: Service[] }) {
  const social = Object.entries(settings.social ?? {}).filter(
    (entry): entry is [string, string] => typeof entry[1] === 'string' && entry[1].length > 0,
  )
  const wa = whatsappLink(settings.whatsapp)
  const groups = [
    { key: 'architectural', label: 'Architectural services' },
    { key: 'real-estate', label: 'Real estate services' },
  ]

  return (
    <footer className="bg-ink text-white/75">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
        <div>
          <Logo light name={settings.siteName} />
          <p className="mt-5 max-w-xs text-[0.95rem] leading-7">{settings.tagline}</p>
          {social.length > 0 && (
            <div className="mt-6 flex gap-2">
              {social.map(([name, url]) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="grid size-10 place-items-center rounded-full border border-white/15 text-white/80 transition hover:border-gold hover:text-gold"
                >
                  <SocialIcon name={name} className="size-[18px]" />
                </a>
              ))}
            </div>
          )}
        </div>

        {groups.map((g) => (
          <div key={g.key}>
            <p className="eyebrow text-gold!">{g.label}</p>
            <ul className="mt-4 space-y-2.5 text-[0.95rem]">
              {services
                .filter((s) => s.group === g.key)
                .map((s) => (
                  <li key={s.id}>
                    <Link href={`/services/${s.slug}`} className="hover:text-white">
                      {s.title}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}

        <div>
          <p className="eyebrow text-gold!">Contact</p>
          <ul className="mt-4 space-y-3 text-[0.95rem]">
            {settings.phone && (
              <li>
                <a href={telLink(settings.phone) ?? '#'} className="flex items-center gap-3 hover:text-white">
                  <Icon name="phone" className="size-4 text-gold" /> {settings.phone}
                </a>
              </li>
            )}
            {wa && (
              <li>
                <a href={wa} className="flex items-center gap-3 hover:text-white" target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="size-4 text-gold" /> WhatsApp
                </a>
              </li>
            )}
            {settings.email && (
              <li>
                <a href={`mailto:${settings.email}`} className="flex items-center gap-3 hover:text-white">
                  <Icon name="mail" className="size-4 text-gold" /> {settings.email}
                </a>
              </li>
            )}
            {settings.address && (
              <li className="flex items-center gap-3">
                <Icon name="pin" className="size-4 text-gold" /> {settings.address}
              </li>
            )}
            {settings.hours && (
              <li className="flex items-center gap-3">
                <Icon name="clock" className="size-4 text-gold" /> {settings.hours}
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-3 py-6 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {settings.legalName}. All rights reserved.
          </p>
          <nav className="flex flex-wrap gap-5" aria-label="Footer">
            <Link href="/apartments" className="hover:text-white">
              Apartments
            </Link>
            <Link href="/plots" className="hover:text-white">
              Plots
            </Link>
            <Link href="/insights" className="hover:text-white">
              Insights
            </Link>
            <Link href="/contact" className="hover:text-white">
              Contact
            </Link>
            <Link href="/admin" className="hover:text-white" prefetch={false}>
              Studio
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
