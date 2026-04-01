import React from 'react'

const navItems = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'events', label: 'Events' },
  { id: 'bookings', label: 'Bookings' },
  { id: 'users', label: 'Users' },
]

export default function Sidebar({ activeSection, onChange }) {
  return (
    <aside style={styles.sidebar}>
      <div>
        <div style={styles.brand}>Event Admin</div>
        <p style={styles.subtitle}>Manage events, bookings, and users</p>
      </div>
      <nav style={styles.nav}>
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            style={activeSection === item.id ? { ...styles.link, ...styles.active } : styles.link}
            onClick={() => onChange(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}

const styles = {
  sidebar: {
    width: 240,
    padding: 24,
    borderRadius: 24,
    background: '#fff',
    boxShadow: '0 20px 45px rgba(41, 53, 108, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: 28,
    minHeight: 'fit-content',
  },
  brand: {
    fontSize: 22,
    fontWeight: 700,
    color: '#1a2240',
  },
  subtitle: {
    marginTop: 8,
    color: '#66708b',
    fontSize: 0.95,
    lineHeight: 1.5,
  },
  nav: {
    display: 'grid',
    gap: 12,
  },
  link: {
    width: '100%',
    textAlign: 'left',
    padding: '12px 16px',
    borderRadius: 14,
    border: 'none',
    background: 'transparent',
    color: '#2a3b86',
    fontWeight: 600,
    cursor: 'pointer',
  },
  active: {
    background: '#4e73df',
    color: '#fff',
  },
}
