import type { CollectionConfig } from 'payload'

import { loggedIn, publishedOrLoggedIn } from '../access'
import { slugField } from '../fields/slug'
import { videosField } from '../fields/videos'
import { revalidateHooks } from '../hooks/revalidate'
import { DISTRICT_OPTIONS, PROJECT_STATUS_OPTIONS } from '../lib/options'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Development', plural: 'Developments' },
  admin: {
    group: 'Real estate',
    useAsTitle: 'title',
    description: 'Apartment developments we represent. Units are added as Listings linked to the development.',
    defaultColumns: ['title', 'stage', 'neighbourhood', '_status'],
    preview: (doc) => (doc?.slug ? `/projects/${doc.slug}` : null),
  },
  access: {
    read: publishedOrLoggedIn,
    create: loggedIn,
    update: loggedIn,
    delete: loggedIn,
  },
  versions: { drafts: true, maxPerDoc: 20 },
  hooks: revalidateHooks,
  defaultSort: 'order',
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      name: 'order',
      type: 'number',
      defaultValue: 10,
      admin: { position: 'sidebar', description: 'Lower numbers show first.' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar', description: 'Show on the homepage.' },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Overview',
          fields: [
            { name: 'tagline', type: 'text' },
            {
              type: 'row',
              fields: [
                {
                  name: 'stage',
                  type: 'select',
                  required: true,
                  options: PROJECT_STATUS_OPTIONS,
                  admin: { width: '33%' },
                },
                {
                  name: 'completion',
                  type: 'text',
                  admin: { width: '33%', placeholder: 'e.g. Occupation 2028' },
                },
                {
                  name: 'priceFrom',
                  label: 'Prices from (USD)',
                  type: 'number',
                  admin: { width: '33%', description: 'Leave empty to use the cheapest available unit.' },
                },
              ],
            },
            { name: 'summary', type: 'textarea', maxLength: 320 },
            { name: 'description', type: 'richText' },
            {
              name: 'highlights',
              type: 'array',
              labels: { singular: 'Key figure', plural: 'Key figures' },
              admin: { description: 'Short facts shown as large numbers, e.g. "30" / "apartments".' },
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
            {
              name: 'amenities',
              type: 'array',
              admin: { initCollapsed: true },
              fields: [{ name: 'amenity', type: 'text', required: true }],
            },
            {
              name: 'paymentPlan',
              type: 'array',
              labels: { singular: 'Payment step', plural: 'Payment plan' },
              admin: { initCollapsed: true },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'share', type: 'text', required: true, admin: { width: '30%', placeholder: '20%' } },
                    { name: 'when', type: 'text', required: true, admin: { width: '70%' } },
                  ],
                },
              ],
            },
            {
              name: 'timeline',
              type: 'array',
              labels: { singular: 'Milestone', plural: 'Construction timeline' },
              admin: { initCollapsed: true },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'period', type: 'text', required: true, admin: { width: '30%' } },
                    { name: 'milestone', type: 'text', required: true, admin: { width: '55%' } },
                    { name: 'done', type: 'checkbox', admin: { width: '15%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Photos & videos',
          fields: [
            {
              name: 'heroImage',
              label: 'Main image',
              type: 'upload',
              relationTo: 'media',
              required: true,
              filterOptions: { mimeType: { contains: 'image' } },
            },
            { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true },
            {
              name: 'progressPhotos',
              label: 'Construction progress photos',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
            },
            videosField,
            { name: 'floorPlans', type: 'upload', relationTo: 'media', hasMany: true },
            {
              name: 'brochure',
              type: 'upload',
              relationTo: 'media',
              filterOptions: { mimeType: { equals: 'application/pdf' } },
            },
          ],
        },
        {
          label: 'Location & team',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'district', type: 'select', options: DISTRICT_OPTIONS, admin: { width: '50%' } },
                { name: 'neighbourhood', type: 'text', admin: { width: '50%' } },
              ],
            },
            { name: 'mapUrl', label: 'Google Maps link', type: 'text' },
            {
              name: 'nearby',
              type: 'array',
              labels: { singular: 'Nearby place', plural: 'Nearby' },
              fields: [{ name: 'place', type: 'text', required: true }],
            },
            {
              name: 'developer',
              type: 'text',
              admin: { description: 'Optional — leave empty to keep the developer private.' },
            },
            { name: 'architect', type: 'text' },
          ],
        },
      ],
    },
  ],
}
