import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminField, loggedIn } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Studio user', plural: 'Studio users' },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Settings',
  },
  auth: true,
  access: {
    read: loggedIn,
    create: isAdmin,
    delete: isAdmin,
    update: ({ req, id }) => req.user?.role === 'admin' || req.user?.id === id,
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      saveToJWT: true,
      access: { update: isAdminField },
      options: [
        { label: 'Admin — everything, including users', value: 'admin' },
        { label: 'Editor — listings, projects, media, inquiries', value: 'editor' },
      ],
    },
  ],
}
