import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

function Navbar({onLoginClick,onRegisterClick,onLogout,isAuthenticated}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const links = [
    { name: 'Home', path: '/' },
    { name: 'For You', path: '/foryou' },
    { name: 'Events', path: '/events' },
    { name: 'Movies', path: '/movies' },
    { name: 'Activities', path: '/activities' },
    { name: 'My Bookings', path: '/my-bookings' },
    { name: 'Admin', path: '/admin' },
    { name: 'User', path: '/user' },
  ]

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-text">Eventure<span className="navbar-logo-accent"></span></span>
        </Link>

        <ul className={menuOpen ? 'navbar-links open' : 'navbar-links'}>
          {links.map(function(link) {
            return (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={location.pathname === link.path ? 'active' : ''}
                  onClick={function(event) {
                    setMenuOpen(false)
                    if (link.path === '/my-bookings' && !isAuthenticated) {
                      event.preventDefault()
                      onLoginClick('/my-bookings')
                    }
                  }}
                >
                  {link.name}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="navbar-buttons">
          {isAuthenticated ? (
            <button className="btn-ghost" onClick={onLogout}>Logout</button>
          ) : (
            <>
              <button className="btn-ghost" onClick={onLoginClick}>Log in</button>
              <button className="btn-primary" onClick={onRegisterClick}>Register</button>
            </>
          )}
        </div>

        <button className="hamburger" onClick={function() { setMenuOpen(!menuOpen) }}>
          ☰
        </button>
      </div>
    </nav>
  )
}

export default Navbar
