import type { Access, FieldAccess } from 'payload'

export const anyone: Access = () => true

export const loggedIn: Access = ({ req }) => Boolean(req.user)

export const isAdmin: Access = ({ req }) => req.user?.role === 'admin'

export const isAdminField: FieldAccess = ({ req }) => req.user?.role === 'admin'

/** Logged-in editors see drafts; the public only sees published documents. */
export const publishedOrLoggedIn: Access = ({ req }) => {
  if (req.user) return true
  return { _status: { equals: 'published' } }
}
