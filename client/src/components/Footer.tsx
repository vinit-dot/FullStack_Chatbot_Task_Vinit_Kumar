import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <h3>DroneTV Assistant</h3>
          <p>
            An independent demo project built for a full-stack internship assignment. It is not the official DroneTV website.
            Visit <a href="https://dronetv.in" target="_blank" rel="noopener noreferrer">dronetv.in</a> for official information.
          </p>
        </div>
        <div>
          <h3>Pages</h3>
          <ul>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/courses">Courses</Link></li>
            <li><Link to="/assistant">Chat assistant</Link></li>
            <li><Link to="/contact">Send an enquiry</Link></li>
          </ul>
        </div>
        <div>
          <h3>Team</h3>
          <ul>
            <li><Link to="/admin">Admin dashboard</Link></li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">Built with React, TypeScript, Express and MongoDB.</div>
    </footer>
  )
}
