import Link from 'next/link'

import { Icon } from '@/components/Icon'

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[70vh] flex-col items-start justify-center pb-20 pt-36">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-5xl sm:text-6xl">This page has moved or sold.</h1>
      <p className="mt-4 max-w-lg text-lg text-muted">The listing may no longer be available. Have a look at what is on the market now.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/properties" className="btn-ink">
          Browse properties <Icon name="arrow" className="size-4" />
        </Link>
        <Link href="/" className="btn-ghost text-ink">
          Home
        </Link>
      </div>
    </section>
  )
}
