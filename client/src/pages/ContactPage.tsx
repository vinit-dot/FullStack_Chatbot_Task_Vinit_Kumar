import EnquiryForm from '../components/EnquiryForm'

export default function ContactPage() {
  return (
    <div className="container section">
      <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)' }}>Send an enquiry</h1>
      <p style={{ color: 'var(--mute)', maxWidth: '60ch' }}>
        Tell us what you need and the team will get back to you. For official DroneTV contact details, visit{' '}
        <a href="https://dronetv.in" target="_blank" rel="noopener noreferrer">dronetv.in</a>.
      </p>
      <div className="card form-card">
        <EnquiryForm idPrefix="contact" />
      </div>
    </div>
  )
}
