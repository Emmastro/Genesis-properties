import { whatsappLink } from '@/lib/format'

import { WhatsAppIcon } from './Icon'

export function WhatsAppFab({ number }: { number?: string | null }) {
  const href = whatsappLink(number, 'Hello Genesis, I found you on your website and would like some help.')
  if (!href) return null
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition hover:scale-105"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  )
}
