import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/services', label: 'Services' },
  { to: '/courses', label: 'Courses' },
  { to: '/assistant', label: 'Assistant' },
  { to: '/contact', label: 'Contact' },
  { to: '/admin', label: 'Admin' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="site-header">
      <nav className="container nav" aria-label="Main navigation">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <img src="/favicon.svg" alt="" width="32" height="32" />
          DroneTV Assistant
        </Link>
        <button className="nav-toggle" aria-expanded={open} aria-controls="nav-menu" onClick={() => setOpen((o) => !o)}>
          {open ? 'Close' : 'Menu'}
        </button>
        <ul id="nav-menu" className={`nav-links ${open ? 'open' : ''}`}>
          {LINKS.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.end} className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => setOpen(false)}>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
