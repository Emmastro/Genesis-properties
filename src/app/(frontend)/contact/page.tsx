import type { Metadata } from 'next'

import { Icon, WhatsAppIcon } from '@/components/Icon'
import { InquiryForm } from '@/components/InquiryForm'
import { PageHero } from '@/components/ui'
import { getSettings } from '@/lib/data'
import { telLink, whatsappLink } from '@/lib/format'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Contact a property consultant',
  description: 'Talk to a Genesis Properties consultant about buying, renting, a plot or a design project in Rwanda.',
  alternates: { canonical: '/contact' },
}

export default async function ContactPage() {
  const settings = await getSettings()
  const wa = whatsappLink(settings.whatsapp, 'Hello Genesis, I would like to talk to a consultant.')
  const channels = [
    wa && { icon: <WhatsAppIcon className="size-5" />, label: 'WhatsApp', value: settings.whatsapp, href: wa },
    settings.phone && { icon: <Icon name="phone" />, label: 'Phone', value: settings.phone, href: telLink(settings.phone) },
    settings.email && { icon: <Icon name="mail" />, label: 'Email', value: settings.email, href: `mailto:${settings.email}` },
    settings.address && { icon: <Icon name="pin" />, label: 'Office', value: settings.address },
    settings.hours && { icon: <Icon name="clock" />, label: 'Hours', value: settings.hours },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string; href?: string | null }[]

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to a consultant"
        intro="Buying, renting, building or designing — tell us where you are and what you need. We reply personally."
        crumbs={[{ name: 'Contact', href: '/contact' }]}
      />
      <section className="container-x grid gap-12 pb-24 lg:grid-cols-[1fr_1.2fr]">
        <ul className="grid content-start gap-3">
          {channels.map((c) => {
            const inner = (
              <>
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gold-100 text-gold-600">{c.icon}</span>
                <span>
                  <span className="block text-xs uppercase tracking-wider text-muted">{c.label}</span>
                  <span className="block text-lg font-semibold">{c.value}</span>
                </span>
              </>
            )
            return (
              <li key={c.label}>
                {c.href ? (
                  <a href={c.href} className="flex items-center gap-4 rounded-2xl bg-white p-5 transition hover:ring-2 hover:ring-gold/40" target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                    {inner}
                  </a>
                ) : (
                  <div className="flex items-center gap-4 rounded-2xl bg-white p-5">{inner}</div>
                )}
              </li>
            )
          })}
        </ul>
        <div className="card p-6 sm:p-9">
          <h2 className="text-3xl">Send us a message</h2>
          <div className="mt-6">
            <InquiryForm chooseType whatsapp={settings.whatsapp} whatsappText="Hello Genesis, I would like to talk to a consultant." />
          </div>
        </div>
      </section>
    </>
  )
}
