'use server'

import { headers } from 'next/headers'

import { getPayloadClient } from '@/lib/data'
import { INQUIRY_TYPE_OPTIONS } from '@/lib/options'

export type InquiryState = {
  ok: boolean
  message: string
  errors?: Record<string, string>
  /** Echoed back so the form keeps what the visitor typed after a validation error. */
  values?: Record<string, string>
} | null

const str = (fd: FormData, key: string, max = 2000) => {
  const v = fd.get(key)
  return typeof v === 'string' ? v.trim().slice(0, max) : ''
}

const id = (fd: FormData, key: string) => {
  const n = Number(str(fd, key, 20))
  return Number.isInteger(n) && n > 0 ? n : undefined
}

const date = (fd: FormData, key: string) => {
  const v = str(fd, key, 20)
  return /^\d{4}-\d{2}-\d{2}$/.test(v) ? new Date(`${v}T12:00:00Z`).toISOString() : undefined
}

export async function submitInquiry(_prev: InquiryState, fd: FormData): Promise<InquiryState> {
  // Honeypot: real visitors never see or fill this field.
  if (str(fd, 'company')) return { ok: true, message: 'Thank you — we will be in touch shortly.' }

  const name = str(fd, 'name', 120)
  const phone = str(fd, 'phone', 40)
  const email = str(fd, 'email', 160)
  const type = str(fd, 'type', 40)

  const errors: Record<string, string> = {}
  if (name.length < 2) errors.name = 'Please tell us your name.'
  if (!phone && !email) errors.phone = 'Leave a phone/WhatsApp number or an email so we can reply.'
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'That email address looks incomplete.'
  const values = Object.fromEntries(
    ['type', 'name', 'phone', 'email', 'message', 'budget', 'preferredLocation', 'size', 'checkIn', 'checkOut', 'guests'].map(
      (k) => [k, str(fd, k)],
    ),
  )
  if (Object.keys(errors).length) return { ok: false, message: 'Please check the highlighted fields.', errors, values }

  const checkIn = date(fd, 'checkIn')
  const checkOut = date(fd, 'checkOut')
  const guests = Number(str(fd, 'guests', 4)) || undefined
  const referer = (await headers()).get('referer') ?? undefined

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'inquiries',
      overrideAccess: true,
      data: {
        name,
        phone,
        email: email || undefined,
        type: (INQUIRY_TYPE_OPTIONS.some((o) => o.value === type) ? type : 'general') as 'general',
        message: str(fd, 'message', 4000),
        budget: str(fd, 'budget', 120),
        preferredLocation: str(fd, 'preferredLocation', 120),
        size: str(fd, 'size', 120),
        checkIn,
        checkOut,
        guests,
        listing: id(fd, 'listing'),
        project: id(fd, 'project'),
        service: id(fd, 'service'),
        pageUrl: referer?.slice(0, 500),
        state: 'new',
      },
    })
  } catch (err) {
    console.error('Inquiry failed', err)
    return { ok: false, message: 'Something went wrong on our side. Please try again or message us on WhatsApp.', values }
  }

  return { ok: true, message: `Thank you, ${name.split(' ')[0]} — a consultant will get back to you shortly.` }
}
