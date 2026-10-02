import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Gallery, type GalleryItem } from '@/components/Gallery'
import { Icon } from '@/components/Icon'
import { InquiryForm } from '@/components/InquiryForm'
import { JsonLd } from '@/components/JsonLd'
import { MediaImage } from '@/components/MediaImage'
import { RichText } from '@/components/RichText'
import { Videos } from '@/components/Videos'
import { Breadcrumbs } from '@/components/ui'
import type { Media } from '@/payload-types'
import { asMedia, asMediaList, getListings, getProject, getSettings } from '@/lib/data'
import { absoluteUrl, bedroomsLabel, formatMoneyShort, isVideo, listingPrice, mediaUrl, projectLocation } from '@/lib/format'
import { labelOf, LISTING_STATUS_OPTIONS, PROJECT_STATUS_OPTIONS } from '@/lib/options'

export const revalidate = 3600
export const generateStaticParams = async () => []

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject((await params).slug)
  if (!project) return {}
  const image = asMedia(project.meta?.image) ?? asMedia(project.heroImage)
  const title = project.meta?.title || `${project.title} — ${project.tagline ?? projectLocation(project)}`
  const description = project.meta?.description || project.summary || undefined
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { title, description, images: image?.url ? [{ url: absoluteUrl(image.url)! }] : undefined },
  }
}

const toItem = (m: Media): GalleryItem => ({
  url: m.url!,
  alt: m.alt,
  isVideo: isVideo(m),
  focal: m.focalX != null ? `${m.focalX}% ${m.focalY}%` : undefined,
})

export default async function ProjectPage({ params }: Props) {
  const project = await getProject((await params).slug)
  if (!project) notFound()

  const [settings, units] = await Promise.all([
    getSettings(),
    getListings({ project: project.id, sort: 'price-asc', includeUnavailable: true }, 200),
  ])
  const available = units.docs.filter((u) => u.availability === 'available')
  const fromPrice = project.priceFrom ?? available[0]?.price
  const hero = asMedia(project.heroImage)
  const gallery = asMediaList(project.gallery)
  const progress = asMediaList(project.progressPhotos)
  const plans = asMediaList(project.floorPlans)
  const brochure = asMedia(project.brochure)
  const waText = `Hello Genesis, I am interested in ${project.title} (${absoluteUrl(`/projects/${project.slug}`)}).`

  return (
    <>
      <section className="relative isolate flex min-h-[88svh] flex-col justify-end overflow-hidden bg-ink pb-14 pt-36 text-white">
        <MediaImage media={hero} sizes="100vw" priority className="-z-10" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/40 to-ink/40" />
        <div className="container-x">
          <Breadcrumbs light items={[{ name: 'Developments', href: '/projects' }, { name: project.title, href: `/projects/${project.slug}` }]} />
          <div className="mt-8 flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-full bg-white/90 px-3 py-1 text-ink">{labelOf(PROJECT_STATUS_OPTIONS, project.stage)}</span>
            {project.completion && <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur">{project.completion}</span>}
            {available.length > 0 && (
              <span className="rounded-full bg-gold px-3 py-1 text-ink">
                {available.length} unit{available.length === 1 ? '' : 's'} available
              </span>
            )}
          </div>
          <h1 className="mt-4 text-5xl leading-[1.02] sm:text-7xl">{project.title}</h1>
          <p className="mt-3 flex items-center gap-2 text-lg text-white/80">
            <Icon name="pin" className="size-5 text-gold" /> {projectLocation(project)}
          </p>
          {project.tagline && <p className="mt-4 max-w-2xl text-xl text-white/85">{project.tagline}</p>}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href="#units" className="btn-gold">
              See available units <Icon name="arrow" className="size-4" />
            </a>
            {fromPrice ? (
              <p className="text-white/75">
                From <span className="font-display text-3xl text-white">{formatMoneyShort(fromPrice)}</span>
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {project.highlights && project.highlights.length > 0 && (
        <section className="border-b border-line bg-white">
          <div className="container-x grid gap-8 py-10 sm:grid-cols-3">
            {project.highlights.map((h) => (
              <div key={h.id} className="border-l border-gold/50 pl-5">
                <p className="font-display text-4xl sm:text-5xl">{h.value}</p>
                <p className="mt-1 text-sm text-muted">{h.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="container-x grid gap-14 py-16 lg:grid-cols-[1fr_380px] lg:gap-16">
        <div>
          {project.summary && <p className="text-2xl leading-10 text-ink/90">{project.summary}</p>}
          <RichText data={project.description} className="mt-8" />

          {project.amenities && project.amenities.length > 0 && (
            <section className="mt-14">
              <h2 className="text-3xl">In the building</h2>
              <ul className="mt-6 flex flex-wrap gap-2.5">
                {project.amenities.map((a) => (
                  <li key={a.id} className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm">
                    <Icon name="check" className="size-4 text-gold-600" /> {a.amenity}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section id="units" className="mt-14 scroll-mt-28">
            <h2 className="text-3xl">Units</h2>
            {units.docs.length > 0 ? (
              <div className="mt-6 overflow-hidden rounded-3xl bg-white ring-1 ring-line">
                <table className="w-full text-left text-sm">
                  <thead className="bg-sand text-xs uppercase tracking-wider text-muted">
                    <tr>
                      <th className="px-5 py-3.5 font-semibold">Unit</th>
                      <th className="px-5 py-3.5 font-semibold">Type</th>
                      <th className="hidden px-5 py-3.5 font-semibold sm:table-cell">Area</th>
                      <th className="px-5 py-3.5 font-semibold">Price</th>
                      <th className="hidden px-5 py-3.5 font-semibold sm:table-cell">Status</th>
                      <th className="px-5 py-3.5" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {units.docs.map((u) => (
                      <tr key={u.id} className={u.availability === 'available' ? '' : 'text-muted'}>
                        <td className="px-5 py-4 font-semibold">{u.unitNumber ?? '—'}</td>
                        <td className="px-5 py-4">{bedroomsLabel(u.bedrooms) || '—'}</td>
                        <td className="hidden px-5 py-4 sm:table-cell">{u.area ? `${u.area} m²` : '—'}</td>
                        <td className="px-5 py-4 font-display text-base">{listingPrice(u)}</td>
                        <td className="hidden px-5 py-4 sm:table-cell">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              u.availability === 'available' ? 'bg-emerald-50 text-emerald-700' : 'bg-stone text-ink/70'
                            }`}
                          >
                            {labelOf(LISTING_STATUS_OPTIONS, u.availability)}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <Link href={`/properties/${u.slug}`} className="inline-flex items-center gap-1 font-semibold text-gold-600 hover:underline">
                            View <Icon name="arrow" className="size-4" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-4 text-muted">Ask us for the current availability.</p>
            )}
          </section>

          {project.paymentPlan && project.paymentPlan.length > 0 && (
            <section className="mt-14">
              <h2 className="text-3xl">Payment plan</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {project.paymentPlan.map((p) => (
                  <div key={p.id} className="rounded-2xl bg-white p-5">
                    <p className="font-display text-3xl text-gold-600">{p.share}</p>
                    <p className="mt-1 text-sm text-ink/80">{p.when}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {project.timeline && project.timeline.length > 0 && (
            <section className="mt-14">
              <h2 className="text-3xl">Construction timeline</h2>
              <ol className="relative mt-8 space-y-6 border-l border-gold/40 pl-8">
                {project.timeline.map((t) => (
                  <li key={t.id} className="relative">
                    <span
                      className={`absolute -left-[41px] top-0.5 grid size-5 place-items-center rounded-full ring-4 ring-sand ${
                        t.done ? 'bg-gold text-ink' : 'bg-white ring-offset-0'
                      }`}
                    >
                      {t.done && <Icon name="check" className="size-3" />}
                    </span>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gold-600">{t.period}</p>
                    <p className="mt-1 text-ink/85">{t.milestone}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {gallery.length > 0 && (
            <section className="mt-14">
              <h2 className="text-3xl">Gallery</h2>
              <div className="mt-6">
                <Gallery items={gallery.map(toItem)} layout="grid" />
              </div>
            </section>
          )}

          {progress.length > 0 && (
            <section className="mt-14">
              <h2 className="text-3xl">On site</h2>
              <p className="mt-2 text-muted">Recent photos from the construction site.</p>
              <div className="mt-6">
                <Gallery items={progress.map(toItem)} layout="grid" />
              </div>
            </section>
          )}

          {project.videos && project.videos.length > 0 && (
            <section className="mt-14">
              <h2 className="text-3xl">Videos</h2>
              <div className="mt-6">
                <Videos videos={project.videos} />
              </div>
            </section>
          )}

          {plans.length > 0 && (
            <section className="mt-14">
              <h2 className="text-3xl">Floor plans</h2>
              <div className="mt-6">
                <Gallery items={plans.map(toItem)} layout="grid" />
              </div>
            </section>
          )}

          {project.nearby && project.nearby.length > 0 && (
            <section className="mt-14">
              <h2 className="text-3xl">Nearby</h2>
              <ul className="mt-6 flex flex-wrap gap-2.5">
                {project.nearby.map((n) => (
                  <li key={n.id} className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm">
                    <Icon name="pin" className="size-4 text-gold-600" /> {n.place}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6 sm:p-7">
            <p className="font-display text-2xl">Interested in {project.title}?</p>
            <p className="mt-2 text-sm text-muted">Ask for a viewing, the price list or the payment schedule.</p>
            <div className="mt-6">
              <InquiryForm variant="viewing" projectId={project.id} whatsapp={settings.whatsapp} whatsappText={waText} defaultMessage={`I would like more information about ${project.title}.`} />
            </div>
            {brochure?.url && (
              <a href={brochure.url} target="_blank" rel="noopener noreferrer" className="btn-ghost mt-4 w-full text-ink">
                Download brochure (PDF)
              </a>
            )}
          </div>
        </aside>
      </div>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ApartmentComplex',
          name: project.title,
          description: project.summary ?? undefined,
          url: absoluteUrl(`/projects/${project.slug}`),
          image: [hero, ...gallery].filter((m): m is Media => Boolean(m?.url) && !isVideo(m)).map((m) => absoluteUrl(mediaUrl(m))),
          address: {
            '@type': 'PostalAddress',
            addressLocality: project.neighbourhood ?? 'Kigali',
            addressRegion: project.district ?? undefined,
            addressCountry: 'RW',
          },
          amenityFeature: project.amenities?.map((a) => ({ '@type': 'LocationFeatureSpecification', name: a.amenity, value: true })),
        }}
      />
    </>
  )
}
