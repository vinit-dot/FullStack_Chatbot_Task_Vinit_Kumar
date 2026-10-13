import type { EnquiryStatus } from '../types'

export default function StatusBadge({ status }: { status: EnquiryStatus }) {
  return <span className={`status status-${status.replace(' ', '-')}`}>{status}</span>
}
