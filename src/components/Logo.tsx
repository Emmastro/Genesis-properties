import Link from 'next/link'

export function LogoMark({ className = 'size-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect width="48" height="48" rx="11" fill="#0f1f35" />
      <path d="M14 33V19l10-7 10 7v14" fill="none" stroke="#c9a45c" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M30 26h-6v7" fill="none" stroke="#f6f1e8" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

export function Logo({ light = false, name = 'Genesis' }: { light?: boolean; name?: string }) {
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label={`${name} — home`}>
      <LogoMark />
      <span className="leading-none">
        <span className={`block font-display text-[1.35rem] tracking-[0.06em] ${light ? 'text-white' : 'text-ink'}`}>
          {name.toUpperCase()}
        </span>
        <span className={`block text-[0.58rem] font-semibold tracking-[0.42em] ${light ? 'text-gold' : 'text-gold-600'}`}>
          PROPERTIES
        </span>
      </span>
    </Link>
  )
}
