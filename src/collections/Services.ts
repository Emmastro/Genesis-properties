import type { CollectionConfig } from 'payload'

import { anyone, loggedIn } from '../access'
import { slugField } from '../fields/slug'
import { revalidateHooks } from '../hooks/revalidate'
import { SERVICE_GROUP_OPTIONS } from '../lib/options'

export const SERVICE_ICONS = [
  'exterior',
  'interior',
  'landscape',
  'visualization',
  'plot',
  'advisory',
  'consultancy',
  'booking',
] as const

export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: 'Service', plural: 'Services' },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'group', 'order'],
    preview: (doc) => (doc?.slug ? `/services/${doc.slug}` : null),
  },
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  hooks: revalidateHooks,
  defaultSort: 'order',
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      name: 'order',
      type: 'number',
      defaultValue: 10,
      admin: { position: 'sidebar' },
    },
    {
      type: 'row',
      fields: [
        { name: 'group', type: 'select', required: true, options: SERVICE_GROUP_OPTIONS, admin: { width: '50%' } },
        {
          name: 'icon',
          type: 'select',
          required: true,
          options: SERVICE_ICONS.map((v) => ({ label: v, value: v })),
          admin: { width: '50%' },
        },
      ],
    },
    { name: 'shortDescription', type: 'textarea', required: true, maxLength: 220 },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'body', type: 'richText' },
    {
      name: 'deliverables',
      label: 'What you get',
      type: 'array',
      fields: [{ name: 'item', type: 'text', required: true }],
    },
    {
      name: 'process',
      label: 'How it works',
      type: 'array',
      fields: [
        { name: 'step', type: 'text', required: true },
        { name: 'detail', type: 'textarea' },
      ],
    },
  ],
}
