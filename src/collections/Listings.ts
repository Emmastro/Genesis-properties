import type { CollectionConfig } from 'payload'

import { loggedIn, publishedOrLoggedIn } from '../access'
import { slugField } from '../fields/slug'
import { videosField } from '../fields/videos'
import { revalidateHooks } from '../hooks/revalidate'
import {
  CATEGORY_OPTIONS,
  CURRENCY_OPTIONS,
  DISTRICT_OPTIONS,
  LISTING_STATUS_OPTIONS,
  PRICE_PERIOD_OPTIONS,
  PURPOSE_OPTIONS,
  ZONING_OPTIONS,
} from '../lib/options'

const isPlot = (data: Record<string, unknown> | undefined) => data?.category === 'plot'

export const Listings: CollectionConfig = {
  slug: 'listings',
  labels: { singular: 'Listing', plural: 'Listings' },
  admin: {
    group: 'Real estate',
    useAsTitle: 'title',
    description: 'Apartments, houses, villas, plots and commercial space — for sale, rent or short stay.',
    defaultColumns: ['title', 'category', 'purpose', 'price', 'availability', '_status'],
    listSearchableFields: ['title', 'neighbourhood', 'unitNumber'],
    preview: (doc) => (doc?.slug ? `/properties/${doc.slug}` : null),
  },
  access: {
    read: publishedOrLoggedIn,
    create: loggedIn,
    update: loggedIn,
    delete: loggedIn,
  },
  versions: { drafts: true, maxPerDoc: 20 },
  hooks: revalidateHooks,
  defaultSort: '-featured',
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Show on the homepage.' },
    },
    {
      name: 'availability',
      type: 'select',
      required: true,
      defaultValue: 'available',
      options: LISTING_STATUS_OPTIONS,
      admin: { position: 'sidebar' },
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      admin: { position: 'sidebar', description: 'If this unit belongs to a development.' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
      hooks: {
        beforeChange: [({ value, siblingData }) => value ?? (siblingData?._status === 'published' ? new Date() : value)],
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Details',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'category', type: 'select', required: true, options: CATEGORY_OPTIONS, admin: { width: '33%' } },
                { name: 'purpose', type: 'select', required: true, options: PURPOSE_OPTIONS, admin: { width: '33%' } },
                { name: 'unitNumber', label: 'Unit / reference', type: 'text', admin: { width: '33%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'price',
                  type: 'number',
                  min: 0,
                  admin: { width: '33%', description: 'Leave empty to show "Price on request".' },
                },
                {
                  name: 'currency',
                  type: 'select',
                  required: true,
                  defaultValue: 'USD',
                  options: CURRENCY_OPTIONS,
                  admin: { width: '33%' },
                },
                {
                  name: 'pricePeriod',
                  type: 'select',
                  required: true,
                  defaultValue: 'total',
                  options: PRICE_PERIOD_OPTIONS,
                  admin: { width: '33%' },
                },
              ],
            },
            {
              name: 'priceNote',
              type: 'text',
              admin: { description: 'Optional — e.g. "18-month payment plan" or "Negotiable".' },
            },
            {
              type: 'row',
              admin: { condition: (data) => !isPlot(data) },
              fields: [
                {
                  name: 'bedrooms',
                  type: 'number',
                  min: 0,
                  admin: { width: '25%', description: '0 = studio' },
                },
                { name: 'bathrooms', type: 'number', min: 0, admin: { width: '25%' } },
                { name: 'area', label: 'Floor area (m²)', type: 'number', min: 0, admin: { width: '25%' } },
                { name: 'parking', label: 'Parking spaces', type: 'number', min: 0, admin: { width: '25%' } },
              ],
            },
            {
              type: 'row',
              admin: { condition: (data) => isPlot(data) },
              fields: [
                { name: 'plotSize', label: 'Plot size (m²)', type: 'number', min: 0, admin: { width: '33%' } },
                { name: 'zoning', type: 'select', options: ZONING_OPTIONS, admin: { width: '33%' } },
                {
                  name: 'upi',
                  label: 'UPI (land parcel no.)',
                  type: 'text',
                  admin: { width: '33%', description: 'Kept private — never shown on the site.' },
                  access: { read: ({ req }) => Boolean(req.user) },
                },
              ],
            },
            {
              name: 'titleDeed',
              label: 'Land title available',
              type: 'checkbox',
              admin: { condition: (data) => isPlot(data) },
            },
            {
              name: 'summary',
              type: 'textarea',
              maxLength: 320,
              admin: { description: 'One or two sentences for cards and search results.' },
            },
            { name: 'description', type: 'richText' },
            {
              name: 'features',
              type: 'array',
              labels: { singular: 'Feature', plural: 'Features' },
              admin: { initCollapsed: true },
              fields: [{ name: 'feature', type: 'text', required: true }],
            },
          ],
        },
        {
          label: 'Photos & videos',
          fields: [
            {
              name: 'heroImage',
              label: 'Main photo',
              type: 'upload',
              relationTo: 'media',
              required: true,
              filterOptions: { mimeType: { contains: 'image' } },
            },
            {
              name: 'gallery',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              admin: { description: 'Drag to reorder. Photos and videos both work.' },
            },
            videosField,
            {
              name: 'floorPlans',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
            },
          ],
        },
        {
          label: 'Location',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'district',
                  type: 'select',
                  options: DISTRICT_OPTIONS,
                  admin: { width: '50%' },
                },
                {
                  name: 'neighbourhood',
                  type: 'text',
                  admin: { width: '50%', placeholder: 'e.g. Gacuriro, Kiyovu, Rebero' },
                },
              ],
            },
            {
              name: 'mapUrl',
              label: 'Google Maps link',
              type: 'text',
              admin: { description: 'Optional. Leave empty to keep the exact location private.' },
            },
          ],
        },
      ],
    },
  ],
}
