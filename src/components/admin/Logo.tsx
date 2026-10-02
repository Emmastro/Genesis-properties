import React from 'react'

// Studio login screen logo.
export default function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <svg width="44" height="44" viewBox="0 0 48 48" aria-hidden="true">
        <rect width="48" height="48" rx="10" fill="#0f1f35" />
        <path d="M14 33V19l10-7 10 7v14" fill="none" stroke="#c9a45c" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M30 26h-6v7" fill="none" stroke="#f4efe6" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
      <div style={{ lineHeight: 1.1 }}>
        <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '0.04em' }}>GENESIS</div>
        <div style={{ fontSize: 12, letterSpacing: '0.3em', opacity: 0.6 }}>STUDIO</div>
      </div>
    </div>
  )
}
