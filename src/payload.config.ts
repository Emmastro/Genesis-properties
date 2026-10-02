import { postgresAdapter } from '@payloadcms/db-postgres'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Inquiries } from './collections/Inquiries'
import { Listings } from './collections/Listings'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Projects } from './collections/Projects'
import { Services } from './collections/Services'
import { Team } from './collections/Team'
import { Testimonials } from './collections/Testimonials'
import { Users } from './collections/Users'
import { Homepage } from './globals/Homepage'
import { SiteSettings } from './globals/SiteSettings'
import { getServerSideURL } from './lib/url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const docUrl = (collection: string, slug?: string | null) => {
  const base = getServerSideURL()
  if (!slug) return base
  const prefix = { listings: 'properties', projects: 'projects', services: 'services', posts: 'insights' }[
    collection
  ]
  return prefix ? `${base}/${prefix}/${slug}` : base
}

export default buildConfig({
  admin: {
    user: Users.slug,
    avatar: 'default',
    meta: {
      titleSuffix: ' · Genesis Studio',
      icons: [{ rel: 'icon', type: 'image/svg+xml', url: '/icon.svg' }],
    },
    components: {
      graphics: {
        Logo: '/components/admin/Logo',
        Icon: '/components/admin/Icon',
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Listings, Projects, Media, Services, Posts, Team, Testimonials, Inquiries, Users],
  globals: [Homepage, SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL || '' },
    migrationDir: path.resolve(dirname, 'migrations'),
    // Schema changes go through migrations in every environment (see README).
    push: false,
  }),
  sharp,
  plugins: [
    seoPlugin({
      collections: ['listings', 'projects', 'services', 'posts'],
      uploadsCollection: 'media',
      tabbedUI: true,
      generateTitle: ({ doc }) => (doc?.title ? `${doc.title} | Genesis Properties` : 'Genesis Properties'),
      generateDescription: ({ doc }) => doc?.summary || doc?.excerpt || doc?.shortDescription || '',
      generateImage: ({ doc }) => doc?.heroImage || doc?.cover || doc?.image,
      generateURL: ({ doc, collectionSlug }) => docUrl(collectionSlug ?? '', doc?.slug),
    }),
    // Uploads go to Vercel Blob in production (set BLOB_READ_WRITE_TOKEN).
    // Without a token, files are stored on local disk in /media.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      alwaysInsertFields: true,
      collections: { media: { disablePayloadAccessControl: true } },
      token: process.env.BLOB_READ_WRITE_TOKEN,
      // Upload straight from the browser so large videos skip Vercel's 4.5 MB request limit.
      clientUploads: true,
    }),
  ],
})
