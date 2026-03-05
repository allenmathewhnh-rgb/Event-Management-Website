import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const links = [
    { name: 'Home', path: '/' },
    { name: 'For You', path: '/foryou' },
    { name: 'Events', path: '/events' },
    { name: 'Movies', path: '/movies' },
    { name: 'Activities', path: '/activities' },
    { name: 'Play', path: '/play' },
  ]

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-text">Event<span className="navbar-logo-accent">Flow</span></span>
        </Link>

        <ul className={menuOpen ? 'navbar-links open' : 'navbar-links'}>
          {links.map(function(link) {
            return (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={location.pathname === link.path ? 'active' : ''}
                  onClick={function() { setMenuOpen(false) }}
                >
                  {link.name}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="navbar-buttons">
          <button className="btn-ghost">Log in</button>
          <button className="btn-primary">Get Started</button>
        </div>

        <button className="hamburger" onClick={function() { setMenuOpen(!menuOpen) }}>
          ☰
        </button>
      </div>
    </nav>
  )
}

export default Navbar