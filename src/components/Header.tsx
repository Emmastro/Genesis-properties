'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Icon } from './Icon'
import { Logo } from './Logo'

type ServiceLink = { title: string; slug: string; group: string }

const NAV = [
  { href: '/apartments', label: 'Apartments' },
  { href: '/properties', label: 'Properties' },
  { href: '/plots', label: 'Plots' },
  { href: '/projects', label: 'Developments' },
]

export function Header({ services, siteName }: { services: ServiceLink[]; siteName: string }) {
  const pathname = usePathname()
  const overHero = pathname === '/'
  const [scrolled, setScrolled] = useState(false)
  // The menu remembers the page it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null)
  const open = openOn === pathname

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  const solid = !overHero || scrolled || open
  const groups = [
    { key: 'architectural', label: 'Architectural services' },
    { key: 'real-estate', label: 'Real estate services' },
  ]
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid ? 'bg-sand/92 shadow-[0_1px_0_rgba(15,31,53,0.08)] backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="container-x flex h-[72px] items-center justify-between gap-6">
        <Logo light={!solid} name={siteName} />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-3.5 py-2 text-[0.92rem] font-medium transition ${
                solid ? 'text-ink/80 hover:text-ink' : 'text-white/85 hover:text-white'
              } ${isActive(item.href) ? (solid ? 'text-ink! bg-stone/70' : 'bg-white/15 text-white!') : ''}`}
            >
              {item.label}
            </Link>
          ))}
          <div className="group relative">
            <Link
              href="/services"
              className={`flex items-center gap-1 rounded-full px-3.5 py-2 text-[0.92rem] font-medium transition ${
                solid ? 'text-ink/80 hover:text-ink' : 'text-white/85 hover:text-white'
              } ${isActive('/services') ? (solid ? 'text-ink! bg-stone/70' : 'bg-white/15 text-white!') : ''}`}
            >
              Services
              <svg viewBox="0 0 20 20" className="size-4 opacity-70" fill="currentColor" aria-hidden="true">
                <path d="M5.5 7.5 10 12l4.5-4.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            </Link>
            <div className="invisible absolute left-1/2 top-full w-[560px] -translate-x-1/2 pt-3 opacity-0 transition duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
              <div className="card grid grid-cols-2 gap-6 p-6">
                {groups.map((g) => (
                  <div key={g.key}>
                    <p className="eyebrow mb-3">{g.label}</p>
                    <ul className="space-y-1">
                      {services
                        .filter((s) => s.group === g.key)
                        .map((s) => (
                          <li key={s.slug}>
                            <Link
                              href={`/services/${s.slug}`}
                              className="block rounded-lg px-2 py-1.5 text-[0.93rem] text-ink/80 hover:bg-sand hover:text-ink"
                            >
                              {s.title}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Link
            href="/about"
            className={`rounded-full px-3.5 py-2 text-[0.92rem] font-medium transition ${
              solid ? 'text-ink/80 hover:text-ink' : 'text-white/85 hover:text-white'
            }`}
          >
            About
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/contact" className="btn-gold hidden px-5 py-2.5 sm:inline-flex">
            Talk to a consultant
          </Link>
          <button
            type="button"
            className={`grid size-11 place-items-center rounded-full lg:hidden ${solid ? 'text-ink' : 'text-white'}`}
            onClick={() => setOpenOn(open ? null : pathname)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <Icon name={open ? 'close' : 'menu'} className="size-6" />
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`fixed inset-x-0 top-[72px] bottom-0 overflow-y-auto bg-sand transition duration-300 lg:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <nav className="container-x flex flex-col gap-1 py-6" aria-label="Mobile">
          {[...NAV, { href: '/services', label: 'Services' }, { href: '/about', label: 'About' }, { href: '/contact', label: 'Contact' }].map(
            (item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between border-b border-line py-4 font-display text-2xl text-ink"
              >
                {item.label}
                <Icon name="arrow" className="size-5 text-gold-600" />
              </Link>
            ),
          )}
          {groups.map((g) => (
            <div key={g.key} className="mt-6">
              <p className="eyebrow mb-2">{g.label}</p>
              <div className="flex flex-wrap gap-2">
                {services
                  .filter((s) => s.group === g.key)
                  .map((s) => (
                    <Link key={s.slug} href={`/services/${s.slug}`} className="rounded-full bg-white px-4 py-2 text-sm">
                      {s.title}
                    </Link>
                  ))}
              </div>
            </div>
          ))}
          <Link href="/contact" className="btn-gold mt-8 w-full">
            Talk to a consultant
          </Link>
        </nav>
      </div>
    </header>
  )
}
