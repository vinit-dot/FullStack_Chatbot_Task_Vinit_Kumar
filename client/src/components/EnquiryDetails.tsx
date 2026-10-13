import { useEffect } from 'react'
import StatusBadge from './StatusBadge'
import { STATUSES } from '../types'
import type { Enquiry, EnquiryStatus } from '../types'

interface Props {
  enquiry: Enquiry
  busy: boolean
  onStatus: (status: EnquiryStatus) => void
  onClose: () => void
}

const fmt = (iso: string) => new Date(iso).toLocaleString()

export default function EnquiryDetails({ enquiry, busy, onStatus, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="overlay" onClick={onClose}>
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="details-title" onClick={(e) => e.stopPropagation()}>
        <h2 id="details-title" style={{ fontSize: '1.8rem' }}>Enquiry details</h2>
        {/* React escapes all text below, so user content can never run as HTML. */}
        <dl>
          <dt>Name</dt><dd>{enquiry.name}</dd>
          <dt>Email</dt><dd>{enquiry.email}</dd>
          <dt>Phone</dt><dd>{enquiry.phone}</dd>
          <dt>User type</dt><dd>{enquiry.userType}</dd>
          <dt>Interest</dt><dd>{enquiry.interest}</dd>
          <dt>Message</dt><dd>{enquiry.message}</dd>
          <dt>Status</dt><dd><StatusBadge status={enquiry.status} /></dd>
          <dt>Received</dt><dd>{fmt(enquiry.createdAt)}</dd>
          <dt>Updated</dt><dd>{fmt(enquiry.updatedAt)}</dd>
        </dl>
        <div className="field" style={{ marginBottom: '1rem' }}>
          <label htmlFor="details-status">Change status</label>
          <select id="details-status" value={enquiry.status} disabled={busy} onChange={(e) => onStatus(e.target.value as EnquiryStatus)}>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="dialog-actions">
          <button className="btn btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
