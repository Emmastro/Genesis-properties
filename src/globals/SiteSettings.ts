import type { GlobalConfig } from 'payload'

import { anyone, loggedIn } from '../access'
import { revalidateGlobal } from '../hooks/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: { group: 'Settings' },
  access: { read: anyone, update: loggedIn },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contact',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'siteName', type: 'text', required: true, defaultValue: 'Genesis', admin: { width: '50%' } },
                {
                  name: 'legalName',
                  type: 'text',
                  required: true,
                  defaultValue: 'Genesis Properties',
                  admin: { width: '50%' },
                },
              ],
            },
            { name: 'tagline', type: 'text', defaultValue: 'Architecture & real estate consultancy in Rwanda' },
            {
              type: 'row',
              fields: [
                {
                  name: 'phone',
                  type: 'text',
                  admin: { width: '33%', placeholder: '+250 7XX XXX XXX' },
                },
                {
                  name: 'whatsapp',
                  label: 'WhatsApp number',
                  type: 'text',
                  admin: {
                    width: '33%',
                    placeholder: '+250 7XX XXX XXX',
                    description: 'Powers every "Chat on WhatsApp" button.',
                  },
                },
                { name: 'email', type: 'email', defaultValue: 'hello@genesis.rw', admin: { width: '33%' } },
              ],
            },
            { name: 'address', type: 'text', defaultValue: 'Kigali, Rwanda' },
            { name: 'hours', label: 'Opening hours', type: 'text', defaultValue: 'Mon – Sat, 8:00 – 18:00' },
          ],
        },
        {
          label: 'Social',
          fields: [
            {
              name: 'social',
              type: 'group',
              fields: [
                { name: 'instagram', type: 'text' },
                { name: 'tiktok', type: 'text' },
                { name: 'facebook', type: 'text' },
                { name: 'linkedin', type: 'text' },
                { name: 'youtube', type: 'text' },
                { name: 'x', label: 'X (Twitter)', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'Search & sharing',
          fields: [
            {
              name: 'defaultDescription',
              type: 'textarea',
              defaultValue:
                'Genesis Properties — apartments, homes and plots in Kigali and across Rwanda, with architectural design and property consultancy under one roof.',
            },
            {
              name: 'shareImage',
              label: 'Default share image',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Shown when a page is shared on WhatsApp, Facebook or X. 1200×630 works best.' },
            },
          ],
        },
      ],
    },
  ],
}
