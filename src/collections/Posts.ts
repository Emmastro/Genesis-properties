import type { CollectionConfig } from 'payload'

import { loggedIn, publishedOrLoggedIn } from '../access'
import { slugField } from '../fields/slug'
import { revalidateHooks } from '../hooks/revalidate'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Insight', plural: 'Insights' },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    description: 'Articles and market notes. Good for Google: each one is a page people can find.',
    defaultColumns: ['title', 'publishedAt', '_status'],
    preview: (doc) => (doc?.slug ? `/insights/${doc.slug}` : null),
  },
  access: { read: publishedOrLoggedIn, create: loggedIn, update: loggedIn, delete: loggedIn },
  versions: { drafts: true, maxPerDoc: 20 },
  hooks: revalidateHooks,
  defaultSort: '-publishedAt',
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
      hooks: {
        beforeChange: [({ value, siblingData }) => value ?? (siblingData?._status === 'published' ? new Date() : value)],
      },
    },
    { name: 'excerpt', type: 'textarea', maxLength: 280 },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    { name: 'content', type: 'richText', required: true },
  ],
}
