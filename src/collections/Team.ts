import type { CollectionConfig } from 'payload'

import { loggedIn } from '../access'
import { revalidateHooks } from '../hooks/revalidate'

export const Team: CollectionConfig = {
  slug: 'team',
  labels: { singular: 'Consultant', plural: 'Team' },
  admin: {
    group: 'Content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'showOnSite', 'order'],
  },
  access: {
    read: ({ req }) => (req.user ? true : { showOnSite: { equals: true } }),
    create: loggedIn,
    update: loggedIn,
    delete: loggedIn,
  },
  hooks: revalidateHooks,
  defaultSort: 'order',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'role', type: 'text', required: true, admin: { width: '50%' } },
      ],
    },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'bio', type: 'textarea' },
    {
      type: 'row',
      fields: [
        { name: 'phone', type: 'text', admin: { width: '33%' } },
        { name: 'whatsapp', type: 'text', admin: { width: '33%' } },
        { name: 'email', type: 'email', admin: { width: '33%' } },
      ],
    },
    { name: 'order', type: 'number', defaultValue: 10, admin: { position: 'sidebar' } },
    {
      name: 'showOnSite',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Tick once the photo and details are ready.' },
    },
  ],
}
