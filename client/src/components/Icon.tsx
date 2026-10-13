import type { ServiceItem } from '../types'

// Simple inline SVG icons (no external image files needed).
export default function Icon({ name }: { name: ServiceItem['icon'] }) {
  const common = { className: 'service-icon', viewBox: '0 0 48 48', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }
  switch (name) {
    case 'camera':
      return <svg {...common}><rect x="6" y="14" width="36" height="24" rx="4" /><circle cx="24" cy="26" r="7" /><path d="M17 14l2-4h10l2 4" /></svg>
    case 'map':
      return <svg {...common}><path d="M6 12l12-4 12 4 12-4v28l-12 4-12-4-12 4z" /><path d="M18 8v28M30 12v28" /></svg>
    case 'leaf':
      return <svg {...common}><path d="M10 38C10 20 20 10 40 8c0 20-10 30-28 30z" /><path d="M10 38L28 20" /></svg>
    case 'inspect':
      return <svg {...common}><circle cx="21" cy="21" r="11" /><path d="M29 29l12 12" /><path d="M16 21h10M21 16v10" /></svg>
    case 'event':
      return <svg {...common}><rect x="7" y="10" width="34" height="30" rx="4" /><path d="M7 20h34M16 6v8M32 6v8" /></svg>
    case 'cap':
      return <svg {...common}><path d="M4 18l20-10 20 10-20 10z" /><path d="M12 23v10c4 4 20 4 24 0V23" /></svg>
  }
}
