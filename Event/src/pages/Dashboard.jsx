import { useState, useEffect } from 'react'

function ProfileHeader() {
  return (
    <div className="profile-header dashboard-card">
      <div>
        <span className="dashboard-badge">Admin Booking Overview</span>
        <h2>Booking activity</h2>
        <p>Monitor recent orders, filter by status, and inspect booking details for the admin dashboard.</p>
      </div>
      <div className="profile-summary">
        <strong>Admin</strong>
        <p>All bookings</p>
      </div>
    </div>
  )
}

function StatsRow({ bookings }) {
  const total = bookings.length
  const upcoming = bookings.filter((b) => b.status === 'upcoming').length
  const completed = bookings.filter((b) => b.status === 'completed').length
  const cancelled = bookings.filter((b) => b.status === 'cancelled' || b.status === 'canceled').length

  return (
    <div className="stats-row">
      <div className="stat-pill">
        <p>Total bookings</p>
        <strong>{total}</strong>
      </div>
      <div className="stat-pill">
        <p>Upcoming</p>
        <strong>{upcoming}</strong>
      </div>
      <div className="stat-pill">
        <p>Completed</p>
        <strong>{completed}</strong>
      </div>
      <div className="stat-pill">
        <p>Cancelled</p>
        <strong>{cancelled}</strong>
      </div>
    </div>
  )
}

function TabBar({ active, onChange }) {
  const tabs = [
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
  ]

  return (
    <div className="tab-bar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`tab-button ${active === tab.id ? 'active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

function BookingCard({ booking }) {
  return (
    <article className="booking-card">
      <div className="booking-card-header">
        <div>
          <h3>{booking.event || booking.title || 'Booking item'}</h3>
          <p>{booking.customer || booking.user || 'Anonymous user'}</p>
        </div>
        <span className={`booking-status ${booking.status}`}>{booking.status}</span>
      </div>

      <div className="booking-meta">
        <span>{booking.date || booking.event_date || 'No date'}</span>
        <span>{booking.seat || booking.category || 'General admission'}</span>
        <span>{booking.price ? `$${booking.price}` : booking.amount ? `$${booking.amount}` : 'Price unavailable'}</span>
      </div>
      <p>{booking.notes || booking.description || 'No additional details available.'}</p>
    </article>
  )
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('upcoming')
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch('/api/bookings/', {
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    })
      .then(async (res) => {
        const contentType = res.headers.get('content-type') || ''
        if (!res.ok) {
          const text = await res.text()
          throw new Error(`Unable to load bookings (${res.status}): ${text.slice(0, 120)}`)
        }
        if (!contentType.includes('application/json')) {
          const text = await res.text()
          throw new Error(
            `Expected JSON but received ${contentType || 'unknown'}: ${text.slice(0, 120)}`
          )
        }
        return res.json()
      })
      .then((data) => setBookings(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = bookings.filter((b) => b.status === activeTab)

  return (
    <section className="dashboard-booking-panel">
      <ProfileHeader />
      <StatsRow bookings={bookings} />
      <TabBar active={activeTab} onChange={setActiveTab} />

      {loading && <p className="dashboard-info">Loading bookings...</p>}
      {error && <p className="dashboard-error">{error}</p>}
      {!loading && !error && filtered.length === 0 && (
        <p className="dashboard-info">No {activeTab} bookings available.</p>
      )}

      <div className="booking-cards">
        {filtered.map((booking) => (
          <BookingCard key={booking.id || booking._id || `${booking.event}-${booking.date}`} booking={booking} />
        ))}
      </div>
    </section>
  )
}
