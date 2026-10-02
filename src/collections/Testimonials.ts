import type { CollectionConfig } from 'payload'

import { anyone, loggedIn } from '../access'
import { revalidateHooks } from '../hooks/revalidate'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Client review', plural: 'Client reviews' },
  admin: {
    group: 'Content',
    useAsTitle: 'name',
    description: 'Real client words only. The homepage section stays hidden until there is at least one.',
  },
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  hooks: revalidateHooks,
  fields: [
    { name: 'quote', type: 'textarea', required: true },
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'context', type: 'text', admin: { width: '50%', placeholder: 'e.g. Bought at Tamarind Court' } },
      ],
    },
    { name: 'photo', type: 'upload', relationTo: 'media' },
  ],
}
