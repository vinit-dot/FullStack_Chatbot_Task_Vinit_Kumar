import { Link } from 'react-router-dom'
import DroneArt from '../components/DroneArt'
import ServiceCard from '../components/ServiceCard'
import CourseCard from '../components/CourseCard'
import Notice from '../components/Notice'
import { COURSES, SERVICES } from '../data/content'

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <h1>Ask about drones. Get a real person to reply.</h1>
            <p className="lead">
              Explore sample drone services and training programmes, chat with our assistant, and leave an enquiry
              that the team can follow up on.
            </p>
            <div className="hero-actions">
              <Link to="/assistant" className="btn btn-primary">Chat with the assistant</Link>
              <Link to="/contact" className="btn btn-ghost">Send an enquiry</Link>
            </div>
          </div>
          <div className="hero-art"><DroneArt /></div>
        </div>
      </section>

      <section className="section" id="services">
        <div className="container">
          <Notice />
          <div className="section-head">
            <h2>What we can help with</h2>
            <p>Sample drone services for businesses, creators and farmers.</p>
          </div>
          <div className="grid">
            {SERVICES.slice(0, 3).map((s) => <ServiceCard key={s.id} service={s} />)}
          </div>
          <p style={{ marginTop: '1.5rem' }}><Link to="/services">See all services</Link></p>
        </div>
      </section>

      <section className="section band" id="courses">
        <div className="container">
          <div className="section-head">
            <h2>Learn to fly with structure</h2>
            <p>Sample training programmes, from first flight to field work.</p>
          </div>
          <div className="grid">
            {COURSES.slice(0, 2).map((c) => <CourseCard key={c.id} course={c} />)}
          </div>
          <p style={{ marginTop: '1.5rem' }}><Link to="/courses" style={{ color: '#9fd0f0' }}>See all courses</Link></p>
        </div>
      </section>

      <section className="section">
        <div className="container cta-row">
          <div>
            <h2>Not sure where to start?</h2>
            <p style={{ color: 'var(--mute)', marginBottom: 0 }}>Ask the assistant. It answers common questions and takes your details.</p>
          </div>
          <Link to="/assistant" className="btn btn-primary">Open the assistant</Link>
        </div>
      </section>
    </>
  )
}
