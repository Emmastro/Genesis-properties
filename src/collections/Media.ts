import type { CollectionConfig } from 'payload'

import { anyone, loggedIn } from '../access'
import { revalidateHooks } from '../hooks/revalidate'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Photo / video', plural: 'Photos & videos' },
  admin: {
    group: 'Content',
    description:
      'Every photo, video, floor plan and brochure on the site. Upload here, or straight from a listing.',
    defaultColumns: ['filename', 'alt', 'mimeType', 'updatedAt'],
  },
  access: {
    read: anyone,
    create: loggedIn,
    update: loggedIn,
    delete: loggedIn,
  },
  hooks: revalidateHooks,
  fields: [
    {
      name: 'alt',
      label: 'Description (for search engines & screen readers)',
      type: 'text',
      required: true,
      admin: { description: 'e.g. "Living room of a 2-bedroom apartment at Redhill Residence"' },
    },
    { name: 'caption', type: 'text' },
  ],
  upload: {
    mimeTypes: ['image/*', 'video/mp4', 'video/webm', 'video/quicktime', 'application/pdf'],
    focalPoint: true,
    adminThumbnail: 'thumbnail',
    imageSizes: [
      { name: 'thumbnail', width: 480, height: 360, position: 'centre' },
      { name: 'card', width: 1000, withoutEnlargement: true },
    ],
  },
}
