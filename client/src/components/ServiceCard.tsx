import Icon from './Icon'
import type { ServiceItem } from '../types'

export default function ServiceCard({ service }: { service: ServiceItem }) {
  return (
    <article className="card">
      <Icon name={service.icon} />
      <h3>{service.title}</h3>
      <p>{service.summary}</p>
    </article>
  )
}
