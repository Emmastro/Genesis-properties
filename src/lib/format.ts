import type { Listing, Media, Project } from '@/payload-types'

import { CATEGORY_OPTIONS, districtLabel, labelOf, PURPOSE_OPTIONS } from './options'
import { getServerSideURL } from './url'

export const formatMoney = (amount: number, currency: string = 'USD') => {
  if (currency === 'RWF') return `RWF ${Math.round(amount).toLocaleString('en-US')}`
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
}

/** "$80k" style, for tight spaces. */
export const formatMoneyShort = (amount: number, currency: string = 'USD') => {
  const sym = currency === 'USD' ? '$' : `${currency} `
  if (amount >= 1_000_000) return `${sym}${(amount / 1_000_000).toFixed(amount % 1_000_000 ? 1 : 0)}M`
  if (amount >= 1_000) return `${sym}${Math.round(amount / 1_000)}k`
  return `${sym}${amount}`
}

export const listingPrice = (l: Pick<Listing, 'price' | 'currency' | 'pricePeriod'>) => {
  if (l.price == null) return 'Price on request'
  const base = formatMoney(l.price, l.currency)
  if (l.pricePeriod === 'month') return `${base} / month`
  if (l.pricePeriod === 'night') return `${base} / night`
  return base
}

export const bedroomsLabel = (n?: number | null) => {
  if (n == null) return ''
  if (n === 0) return 'Studio'
  return `${n} bed${n === 1 ? '' : 's'}`
}

export const listingLocation = (l: Pick<Listing, 'neighbourhood' | 'district'>) =>
  [l.neighbourhood, districtLabel(l.district)].filter(Boolean).join(', ') || 'Kigali'

export const projectLocation = (p: Pick<Project, 'neighbourhood' | 'district'>) =>
  [p.neighbourhood, districtLabel(p.district)].filter(Boolean).join(', ') || 'Kigali'

export const categoryLabel = (v?: string | null) => labelOf(CATEGORY_OPTIONS, v)
export const purposeLabel = (v?: string | null) => labelOf(PURPOSE_OPTIONS, v)

export const absoluteUrl = (path?: string | null) => {
  if (!path) return undefined
  if (/^https?:\/\//.test(path)) return path
  return `${getServerSideURL()}${path.startsWith('/') ? '' : '/'}${path}`
}

export const mediaUrl = (m?: Media | null, size?: 'thumbnail' | 'card') => {
  if (!m) return undefined
  const sized = size ? m.sizes?.[size]?.url : undefined
  return sized || m.url || undefined
}

export const isVideo = (m?: Media | null) => Boolean(m?.mimeType?.startsWith('video'))
export const isImage = (m?: Media | null) => Boolean(m?.mimeType?.startsWith('image'))

export const whatsappLink = (number?: string | null, text?: string) => {
  const digits = (number ?? '').replace(/[^\d]/g, '')
  if (!digits) return null
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ''}`
}

export const telLink = (number?: string | null) => (number ? `tel:${number.replace(/[^\d+]/g, '')}` : null)

/** Turn a YouTube / Vimeo / TikTok link into an embeddable URL. */
export const embedUrl = (url?: string | null) => {
  if (!url) return null
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\.|^m\./, '')
    if (host === 'youtu.be') return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}`
    if (host.endsWith('youtube.com')) {
      const id = u.searchParams.get('v') || u.pathname.match(/\/(shorts|embed|live)\/([^/?]+)/)?.[2]
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
    }
    if (host === 'vimeo.com') {
      const id = u.pathname.match(/\/(\d+)/)?.[1]
      return id ? `https://player.vimeo.com/video/${id}` : null
    }
    if (host.endsWith('tiktok.com')) {
      const id = u.pathname.match(/\/video\/(\d+)/)?.[1]
      return id ? `https://www.tiktok.com/embed/v2/${id}` : null
    }
    if (host.endsWith('instagram.com')) {
      const m = u.pathname.match(/\/(p|reel)\/([^/?]+)/)
      return m ? `https://www.instagram.com/${m[1]}/${m[2]}/embed` : null
    }
  } catch {
    return null
  }
  return null
}

export const formatDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''
