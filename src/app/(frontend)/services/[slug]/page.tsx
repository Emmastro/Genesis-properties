import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Icon, type IconName } from '@/components/Icon'
import { InquiryForm } from '@/components/InquiryForm'
import { JsonLd } from '@/components/JsonLd'
import { RichText } from '@/components/RichText'
import { PageHero } from '@/components/ui'
import { asMedia, getService, getServices, getSettings } from '@/lib/data'
import { absoluteUrl } from '@/lib/format'

export const revalidate = 3600

export async function generateStaticParams() {
  try {
    const services = await getServices()
    return services.map((s) => ({ slug: s.slug }))
  } catch {
    return []
  }
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getService((await params).slug)
  if (!service) return {}
  const image = asMedia(service.meta?.image) ?? asMedia(service.image)
  const title = service.meta?.title || `${service.title} in Kigali, Rwanda`
  const description = service.meta?.description || service.shortDescription
  return {
    title: { absolute: `${title} | Genesis Properties` },
    description,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: { title, description, images: image?.url ? [{ url: absoluteUrl(image.url)! }] : undefined },
  }
}

const VARIANT: Record<string, 'design' | 'plot-search' | 'advisory' | 'viewing' | 'booking'> = {
  exterior: 'design',
  interior: 'design',
  landscape: 'design',
  visualization: 'design',
  plot: 'plot-search',
  advisory: 'advisory',
  consultancy: 'viewing',
  booking: 'booking',
}

export default async function ServicePage({ params }: Props) {
  const service = await getService((await params).slug)
  if (!service) notFound()
  const [settings, all] = await Promise.all([getSettings(), getServices()])
  const others = all.filter((s) => s.id !== service.id && s.group === service.group)
  const groupLabel = service.group === 'architectural' ? 'Architectural services' : 'Real estate services'
  const browse =
    service.icon === 'plot'
      ? { href: '/plots', label: 'Browse plots' }
      : service.icon === 'booking'
        ? { href: '/apartments', label: 'Browse apartments' }
        : service.icon === 'consultancy'
          ? { href: '/properties', label: 'Browse properties' }
          : null

  return (
    <>
      <PageHero
        eyebrow={groupLabel}
        title={service.title}
        intro={service.shortDescription}
        image={asMedia(service.image)}
        crumbs={[
          { name: 'Services', href: '/services' },
          { name: service.title, href: `/services/${service.slug}` },
        ]}
      >
        {browse && (
          <Link href={browse.href} className="btn-gold mt-8">
            {browse.label} <Icon name="arrow" className="size-4" />
          </Link>
        )}
      </PageHero>

      <div className="container-x grid gap-14 py-16 lg:grid-cols-[1fr_400px] lg:gap-16">
        <div>
          <RichText data={service.body} />

          {service.deliverables && service.deliverables.length > 0 && (
            <section className="mt-14">
              <h2 className="text-3xl">What you get</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {service.deliverables.map((d) => (
                  <li key={d.id} className="flex items-start gap-3 rounded-2xl bg-white p-5">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-gold-100 text-gold-600">
                      <Icon name="check" className="size-3.5" />
                    </span>
                    {d.item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {service.process && service.process.length > 0 && (
            <section className="mt-14">
              <h2 className="text-3xl">How it works</h2>
              <ol className="mt-8 grid gap-4 sm:grid-cols-2">
                {service.process.map((p, i) => (
                  <li key={p.id} className="rounded-2xl border border-line p-6">
                    <span className="font-display text-4xl text-gold">{String(i + 1).padStart(2, '0')}</span>
                    <p className="mt-3 text-lg font-semibold">{p.step}</p>
                    {p.detail && <p className="mt-1 text-muted">{p.detail}</p>}
                  </li>
                ))}
              </ol>
            </section>
          )}

          {others.length > 0 && (
            <section className="mt-14">
              <h2 className="text-2xl">More {groupLabel.toLowerCase()}</h2>
              <div className="mt-5 flex flex-wrap gap-3">
                {others.map((s) => (
                  <Link key={s.id} href={`/services/${s.slug}`} className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-medium hover:bg-gold-100">
                    <Icon name={s.icon as IconName} className="size-4 text-gold-600" /> {s.title}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6 sm:p-7">
            <p className="font-display text-2xl">Start with a conversation</p>
            <p className="mt-2 text-sm text-muted">Tell us about your project. A consultant will reply with next steps.</p>
            <div className="mt-6">
              <InquiryForm
                variant={VARIANT[service.icon] ?? 'general'}
                serviceId={service.id}
                whatsapp={settings.whatsapp}
                whatsappText={`Hello Genesis, I would like to discuss ${service.title.toLowerCase()}.`}
              />
            </div>
          </div>
        </aside>
      </div>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: service.title,
          description: service.shortDescription,
          serviceType: service.title,
          url: absoluteUrl(`/services/${service.slug}`),
          areaServed: { '@type': 'Country', name: 'Rwanda' },
          provider: { '@id': `${absoluteUrl('/')}#organization` },
        }}
      />
    </>
  )
}
