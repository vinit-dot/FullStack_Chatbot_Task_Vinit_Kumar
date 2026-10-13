import { Link } from 'react-router-dom'
import ServiceCard from '../components/ServiceCard'
import Notice from '../components/Notice'
import { SERVICES } from '../data/content'

export default function ServicesPage() {
  return (
    <div className="container section">
      <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)' }}>Services</h1>
      <Notice />
      <div className="grid">{SERVICES.map((s) => <ServiceCard key={s.id} service={s} />)}</div>
      <p style={{ marginTop: '2rem' }}><Link className="btn btn-primary" to="/contact">Ask about a service</Link></p>
    </div>
  )
}
