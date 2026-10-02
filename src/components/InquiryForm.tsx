'use client'

import { useActionState } from 'react'

import { submitInquiry, type InquiryState } from '@/app/(frontend)/actions'
import { whatsappLink } from '@/lib/format'

import { Icon, WhatsAppIcon } from './Icon'

type Variant = 'viewing' | 'booking' | 'plot-search' | 'design' | 'advisory' | 'general' | 'list-property'

type Props = {
  variant?: Variant
  listingId?: number
  projectId?: number
  serviceId?: number
  defaultMessage?: string
  whatsapp?: string | null
  whatsappText?: string
  submitLabel?: string
  dark?: boolean
  /** Let the visitor pick what they need (general contact form). */
  chooseType?: boolean
}

const SUBMIT: Record<Variant, string> = {
  viewing: 'Request a viewing',
  booking: 'Request booking',
  'plot-search': 'Start my plot search',
  design: 'Discuss my project',
  advisory: 'Book a consultation',
  general: 'Send message',
  'list-property': 'List my property',
}

export function InquiryForm({
  variant = 'general',
  listingId,
  projectId,
  serviceId,
  defaultMessage,
  whatsapp,
  whatsappText,
  submitLabel,
  dark,
  chooseType,
}: Props) {
  const [state, action, pending] = useActionState<InquiryState, FormData>(submitInquiry, null)
  const wa = whatsappLink(whatsapp, whatsappText ?? defaultMessage)
  const fieldClass = `field ${dark ? 'border-white/15 bg-white/[0.07] text-white placeholder:text-white/40' : ''}`
  const labelClass = `label ${dark ? 'text-white/60!' : ''}`
  const v = (k: string) => state?.values?.[k]
  const err = (k: string) =>
    state?.errors?.[k] ? <p className="mt-1 text-xs text-red-500">{state.errors[k]}</p> : null

  if (state?.ok) {
    return (
      <div className={`rounded-3xl p-8 text-center ${dark ? 'bg-white/[0.06] text-white' : 'bg-white'}`} role="status">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-gold text-ink">
          <Icon name="check" className="size-7" />
        </span>
        <p className="mt-4 font-display text-2xl">{state.message}</p>
        {wa && (
          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn mt-6 bg-[#25D366] text-white">
            <WhatsAppIcon /> Continue on WhatsApp
          </a>
        )}
      </div>
    )
  }

  return (
    <form action={action} className="grid gap-4" noValidate>
      {listingId && <input type="hidden" name="listing" value={listingId} />}
      {projectId && <input type="hidden" name="project" value={projectId} />}
      {serviceId && <input type="hidden" name="service" value={serviceId} />}
      {!chooseType && <input type="hidden" name="type" value={variant} />}
      <div className="hidden" aria-hidden="true">
        <label>
          Company <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {chooseType && (
        <div>
          <label className={labelClass} htmlFor="inq-type">
            I am looking for
          </label>
          <select id="inq-type" name="type" className={fieldClass} defaultValue={v('type') || variant}>
            <option value="general">General question</option>
            <option value="viewing">A property to buy or rent</option>
            <option value="booking">An apartment to book</option>
            <option value="plot-search">A plot</option>
            <option value="design">Architectural or interior design</option>
            <option value="advisory">Property advice</option>
            <option value="list-property">To sell or list my property</option>
          </select>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="inq-name">
            Full name
          </label>
          <input id="inq-name" name="name" defaultValue={v('name')} className={fieldClass} autoComplete="name" required />
          {err('name')}
        </div>
        <div>
          <label className={labelClass} htmlFor="inq-phone">
            Phone / WhatsApp
          </label>
          <input id="inq-phone" name="phone" defaultValue={v('phone')} type="tel" className={fieldClass} autoComplete="tel" placeholder="+250 …" />
          {err('phone')}
        </div>
        <div>
          <label className={labelClass} htmlFor="inq-email">
            Email
          </label>
          <input id="inq-email" name="email" defaultValue={v('email')} type="email" className={fieldClass} autoComplete="email" />
          {err('email')}
        </div>
      </div>

      {variant === 'booking' && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelClass} htmlFor="inq-in">
              Check-in
            </label>
            <input id="inq-in" name="checkIn" defaultValue={v('checkIn')} type="date" className={fieldClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="inq-out">
              Check-out
            </label>
            <input id="inq-out" name="checkOut" defaultValue={v('checkOut')} type="date" className={fieldClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="inq-guests">
              Guests
            </label>
            <input id="inq-guests" name="guests" defaultValue={v('guests')} type="number" min={1} max={20} className={fieldClass} />
          </div>
        </div>
      )}

      {(variant === 'plot-search' || variant === 'advisory' || variant === 'design' || chooseType) && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelClass} htmlFor="inq-loc">
              Area / district
            </label>
            <input id="inq-loc" name="preferredLocation" defaultValue={v('preferredLocation')} className={fieldClass} placeholder="e.g. Kicukiro" />
          </div>
          <div>
            <label className={labelClass} htmlFor="inq-size">
              Size
            </label>
            <input id="inq-size" name="size" defaultValue={v('size')} className={fieldClass} placeholder={variant === 'plot-search' ? 'e.g. 600 m²' : 'e.g. 3 bedrooms'} />
          </div>
          <div>
            <label className={labelClass} htmlFor="inq-budget">
              Budget
            </label>
            <input id="inq-budget" name="budget" defaultValue={v('budget')} className={fieldClass} placeholder="e.g. RWF 25M" />
          </div>
        </div>
      )}

      <div>
        <label className={labelClass} htmlFor="inq-msg">
          Message
        </label>
        <textarea id="inq-msg" name="message" rows={4} className={fieldClass} defaultValue={v('message') ?? defaultMessage} />
      </div>

      {state && !state.ok && <p className="text-sm text-red-500">{state.message}</p>}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="submit" className="btn-gold flex-1" disabled={pending}>
          {pending ? 'Sending…' : (submitLabel ?? SUBMIT[variant])}
          {!pending && <Icon name="arrow" className="size-4" />}
        </button>
        {wa && (
          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn flex-1 bg-[#25D366] text-white hover:brightness-95">
            <WhatsAppIcon /> WhatsApp
          </a>
        )}
      </div>
      <p className={`text-xs ${dark ? 'text-white/45' : 'text-muted'}`}>
        We only use your details to reply to this request.
      </p>
    </form>
  )
}
