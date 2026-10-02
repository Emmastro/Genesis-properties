import type { CollectionConfig } from 'payload'

import { isAdmin, loggedIn } from '../access'
import { INQUIRY_TYPE_OPTIONS } from '../lib/options'

// Every form on the site lands here. Only the website's server action creates
// inquiries (with overrideAccess), so public create access stays closed.
export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  labels: { singular: 'Inquiry', plural: 'Inquiries' },
  admin: {
    group: 'Clients',
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'phone', 'state', 'createdAt'],
    description: 'Viewing requests, bookings, plot searches and messages from the website.',
  },
  access: {
    read: loggedIn,
    create: loggedIn,
    update: loggedIn,
    delete: isAdmin,
  },
  defaultSort: '-createdAt',
  fields: [
    {
      name: 'state',
      label: 'Follow-up',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Viewing booked', value: 'viewing' },
        { label: 'Closed — won', value: 'won' },
        { label: 'Closed — lost', value: 'lost' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'notes', label: 'Internal notes', type: 'textarea', admin: { position: 'sidebar' } },
    { name: 'type', type: 'select', required: true, defaultValue: 'general', options: INQUIRY_TYPE_OPTIONS },
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '33%' } },
        { name: 'phone', label: 'Phone / WhatsApp', type: 'text', admin: { width: '33%' } },
        { name: 'email', type: 'email', admin: { width: '33%' } },
      ],
    },
    { name: 'message', type: 'textarea' },
    {
      type: 'row',
      fields: [
        { name: 'budget', type: 'text', admin: { width: '33%' } },
        { name: 'preferredLocation', type: 'text', admin: { width: '33%' } },
        { name: 'size', label: 'Size wanted', type: 'text', admin: { width: '33%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'checkIn', type: 'date', admin: { width: '33%', date: { pickerAppearance: 'dayOnly' } } },
        { name: 'checkOut', type: 'date', admin: { width: '33%', date: { pickerAppearance: 'dayOnly' } } },
        { name: 'guests', type: 'number', admin: { width: '33%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'listing', type: 'relationship', relationTo: 'listings', admin: { width: '33%' } },
        { name: 'project', type: 'relationship', relationTo: 'projects', admin: { width: '33%' } },
        { name: 'service', type: 'relationship', relationTo: 'services', admin: { width: '33%' } },
      ],
    },
    { name: 'pageUrl', label: 'Sent from page', type: 'text', admin: { readOnly: true } },
  ],
}
