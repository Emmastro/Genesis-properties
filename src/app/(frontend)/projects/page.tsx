import type { Metadata } from 'next'

import { ProjectCard } from '@/components/ProjectCard'
import { EmptyState, PageHero } from '@/components/ui'
import { getListings, getProjects } from '@/lib/data'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Apartment developments in Kigali',
  description:
    'Off-plan and completed apartment developments in Kigali — prices, payment plans, floor plans and construction progress.',
  alternates: { canonical: '/projects' },
}

export default async function ProjectsPage() {
  const projects = await getProjects()
  const units = await Promise.all(
    projects.map(async (p) => {
      const { docs, total } = await getListings({ project: p.id, sort: 'price-asc' }, 1)
      return { total, from: docs[0]?.price ?? null }
    }),
  )
  return (
    <>
      <PageHero
        eyebrow="Developments"
        title="New buildings, real progress"
        intro="We represent apartment developments in Kigali. Each one comes with its prices, payment plan and photos from site — so you can follow your future home being built."
        crumbs={[{ name: 'Developments', href: '/projects' }]}
      />
      <section className="container-x pb-24">
        {projects.length ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {projects.map((p, i) => (
              <ProjectCard key={p.id} project={p} large fromPrice={units[i]?.from} unitsAvailable={units[i]?.total} />
            ))}
          </div>
        ) : (
          <EmptyState title="New developments coming soon" />
        )}
      </section>
    </>
  )
}
