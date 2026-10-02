import type { Metadata, Viewport } from 'next'
import { Fraunces, Manrope } from 'next/font/google'
import type { ReactNode } from 'react'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { JsonLd } from '@/components/JsonLd'
import { WhatsAppFab } from '@/components/WhatsAppFab'
import { asMedia, getServices, getSettings } from '@/lib/data'
import { absoluteUrl, mediaUrl } from '@/lib/format'
import { getServerSideURL } from '@/lib/url'

import './globals.css'

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap', axes: ['opsz'] })
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' })

export const viewport: Viewport = { themeColor: '#0f1f35' }

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const image = absoluteUrl(mediaUrl(asMedia(settings.shareImage)))
  const title = `${settings.legalName} — ${settings.tagline ?? 'Architecture & real estate in Rwanda'}`
  return {
    metadataBase: new URL(getServerSideURL()),
    title: { default: title, template: `%s | ${settings.legalName}` },
    description: settings.defaultDescription ?? undefined,
    applicationName: settings.legalName,
    alternates: { canonical: '/' },
    icons: { icon: '/icon.svg', apple: '/apple-touch-icon.png' },
    openGraph: {
      type: 'website',
      siteName: settings.legalName,
      locale: 'en_RW',
      title,
      description: settings.defaultDescription ?? undefined,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: { card: 'summary_large_image' },
  }
}

export default async function FrontendLayout({ children }: { children: ReactNode }) {
  const [settings, services] = await Promise.all([getSettings(), getServices()])
  const base = getServerSideURL()
  const sameAs = Object.values(settings.social ?? {}).filter((v): v is string => typeof v === 'string' && !!v)

  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2">
          Skip to content
        </a>
        <Header siteName={settings.siteName} services={services.map((s) => ({ title: s.title, slug: s.slug ?? '', group: s.group }))} />
        <main id="main">{children}</main>
        <Footer settings={settings} services={services} />
        <WhatsAppFab number={settings.whatsapp} />
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': ['RealEstateAgent', 'LocalBusiness'],
            '@id': `${base}/#organization`,
            name: settings.legalName,
            alternateName: settings.siteName,
            url: base,
            logo: `${base}/icon.svg`,
            image: absoluteUrl(mediaUrl(asMedia(settings.shareImage))),
            description: settings.defaultDescription,
            email: settings.email || undefined,
            telephone: settings.phone || undefined,
            address: { '@type': 'PostalAddress', addressLocality: 'Kigali', addressCountry: 'RW' },
            areaServed: { '@type': 'Country', name: 'Rwanda' },
            sameAs: sameAs.length ? sameAs : undefined,
          }}
        />
      </body>
    </html>
  )
}
