import type { GlobalConfig } from 'payload'

import { anyone, loggedIn } from '../access'
import { revalidateGlobal } from '../hooks/revalidate'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Homepage',
  admin: { group: 'Content' },
  access: { read: anyone, update: loggedIn },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            { name: 'eyebrow', type: 'text', defaultValue: 'Kigali · Rwanda' },
            { name: 'heading', type: 'text', required: true, defaultValue: 'Find the home. Design the space.' },
            {
              name: 'subheading',
              type: 'textarea',
              defaultValue:
                'Apartments, homes and plots across Rwanda — with architects and property consultants who stay with you from the first viewing to the keys.',
            },
            {
              name: 'heroImages',
              label: 'Hero images',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              admin: { description: 'One or more. They cross-fade slowly.' },
            },
            {
              name: 'heroVideo',
              type: 'upload',
              relationTo: 'media',
              filterOptions: { mimeType: { contains: 'video' } },
              admin: { description: 'Optional. A short silent loop replaces the images.' },
            },
          ],
        },
        {
          label: 'Numbers',
          fields: [
            {
              name: 'stats',
              type: 'array',
              maxRows: 4,
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'value', type: 'text', required: true, admin: { width: '40%' } },
                    { name: 'label', type: 'text', required: true, admin: { width: '60%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'About',
          fields: [
            { name: 'aboutHeading', type: 'text', defaultValue: 'One team from plot to keys' },
            { name: 'aboutBody', type: 'textarea' },
            { name: 'aboutImage', type: 'upload', relationTo: 'media' },
          ],
        },
        {
          label: 'Call to action',
          fields: [
            { name: 'ctaHeading', type: 'text', defaultValue: 'Tell us what you are looking for.' },
            {
              name: 'ctaBody',
              type: 'textarea',
              defaultValue:
                'A home to live in, a unit to rent out, a plot to build on — share your budget and area, and a consultant will come back to you with options.',
            },
            { name: 'ctaImage', type: 'upload', relationTo: 'media' },
          ],
        },
      ],
    },
  ],
}
