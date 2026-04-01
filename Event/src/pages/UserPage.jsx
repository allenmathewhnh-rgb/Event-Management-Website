import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getBookings, getUsers } from '../utils/storage'
import './DashboardPage.css'

const userTags = ['My Tickets', 'Wishlist', 'Recommendations', 'Offers', 'Settings']

export default function UserPage({ currentUsername }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    const storedUsername = currentUsername || localStorage.getItem('username') || ''
    if (!storedUsername) {
      setCurrentUser(null)
      setBookings([])
      return
    }

    const users = getUsers()
    const matchedUser = users.find(
      (user) => user.username === storedUsername || user.email === storedUsername,
    )

    const user = matchedUser || {
      username: storedUsername || 'guest',
      name: storedUsername || 'Guest User',
      email: '',
      phone: '',
      role: 'Customer',
      id: Date.now(),
    }

    const allBookings = getBookings()
    const userName = (user.name || user.username || '').toLowerCase()
    const userEmail = (user.email || '').toLowerCase()
    const loginUsername = storedUsername.toLowerCase()

    const filteredBookings = allBookings.filter((booking) => {
      const bookingUsername = (booking.username || '').toLowerCase()
      const bookingName = (booking.userName || booking.buyerName || '').toLowerCase()
      const bookingEmail = (booking.buyerEmail || '').toLowerCase()

      if (bookingUsername) {
        return bookingUsername === loginUsername
      }

      return bookingName === userName || bookingEmail === userEmail
    })

    setCurrentUser(user)
    setBookings(filteredBookings)
  }, [currentUsername])

  const sortedBookings = useMemo(
    () =>
      [...bookings].sort(
        (a, b) =>
          new Date(b.bookedAt || b.bookingDate || Date.now()) -
          new Date(a.bookedAt || a.bookingDate || Date.now()),
      ),
    [bookings],
  )

  const upcomingCount = bookings.filter((booking) => booking.status !== 'Cancelled').length
  const upcomingTickets = bookings.reduce(
    (sum, booking) =>
      sum + (booking.status !== 'Cancelled' ? Number(booking.tickets || 1) : 0),
    0,
  )
  const cancelledCount = bookings.filter((booking) => booking.status === 'Cancelled').length
  const totalTickets = bookings.reduce(
    (sum, booking) => sum + Number(booking.tickets || 1),
    0,
  )
  const totalSpent = bookings.reduce(
    (sum, booking) => sum + Number(booking.total || booking.totalAmount || 0),
    0,
  )
  const memberSince =
    currentUser?.memberSince ||
    (currentUser?.id ? new Date(currentUser.id).toLocaleDateString() : '—')

  return (
    <section className="dashboard-page user-page profile-page">
      <div className="dashboard-shell">
        <div className="dashboard-hero">
          <article className="dashboard-card profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                {(currentUser?.name?.charAt(0) || 'U').toUpperCase()}
              </div>
              <div className="profile-primary">
                <span className="dashboard-badge">User profile</span>
                <h1>{currentUser?.name || 'Guest User'}</h1>
                <p>{currentUser?.role || 'Customer'}</p>
              </div>
            </div>

            <div className="profile-details">
              <div className="profile-field">
                <span>Email</span>
                <strong>{currentUser?.email || 'No email added'}</strong>
              </div>
              <div className="profile-field">
                <span>Phone</span>
                <strong>{currentUser?.phone || 'Not provided'}</strong>
              </div>
              <div className="profile-field">
                <span>Member since</span>
                <strong>{memberSince}</strong>
              </div>
              <div className="profile-field">
                <span>Total spent</span>
                <strong>₹{totalSpent}</strong>
              </div>
            </div>

            <div className="profile-actions">
              <Link className="dashboard-primary-action" to="/my-bookings">
                My Bookings
              </Link>
              <Link className="dashboard-secondary-action" to="/events">
                Explore events
              </Link>
            </div>
          </article>

          <aside className="dashboard-card dashboard-highlight">
            <div>
              <span className="dashboard-badge">Welcome back</span>
              <h2>Track your bookings and upcoming events.</h2>
              <p>Your personal dashboard keeps all your tickets, status, and event details in one place.</p>
            </div>

            <div className="dashboard-progress">
              <span>
                <strong>Active tickets</strong>
                <strong>{upcomingTickets}</strong>
              </span>
              <div className="dashboard-progress-track">
                <div
                  className="dashboard-progress-bar"
                  style={{ width: `${Math.min(100, upcomingTickets * 10)}%` }}
                />
              </div>
            </div>
          </aside>
        </div>

        <div className="dashboard-stats">
          <article className="dashboard-card stat-card">
            <h3>Upcoming events</h3>
            <strong>{upcomingCount}</strong>
            <p>Events that are still confirmed and ready to attend.</p>
          </article>
          <article className="dashboard-card stat-card">
            <h3>Booked tickets</h3>
            <strong>{totalTickets}</strong>
            <p>Number of tickets you have reserved across bookings.</p>
          </article>
          <article className="dashboard-card stat-card">
            <h3>Total spent</h3>
            <strong>₹{totalSpent}</strong>
            <p>Amount spent on confirmed bookings.</p>
          </article>
        </div>

        <div className="dashboard-sections profile-sections">
          <article className="dashboard-card panel-card">
            <div className="section-headline">
              <h2>Recent Bookings</h2>
              <p>See your latest ticket activity and booking details.</p>
            </div>
            {sortedBookings.length === 0 ? (
              <div className="empty-state-card">
                <h3>No bookings yet</h3>
                <p>Once you complete a booking, it will appear here.</p>
              </div>
            ) : (
              <div className="profile-bookings-grid">
                {sortedBookings.map((booking) => (
                  <article key={booking.id} className="profile-booking-card">
                    <div className="booking-card-top">
                      <div>
                        <h3>{booking.eventName || 'Untitled event'}</h3>
                        <p>{formatDate(booking.date)} · {booking.time || 'TBA'}</p>
                      </div>
                      <span className={`booking-badge ${booking.status === 'Cancelled' ? 'badge-cancelled' : 'badge-confirmed'}`}>
                        {booking.status || 'Confirmed'}
                      </span>
                    </div>
                    <div className="booking-row">
                      <span>Booking ID</span>
                      <strong>{booking.ticketId || 'N/A'}</strong>
                    </div>
                    <div className="booking-row">
                      <span>Email</span>
                      <strong>{booking.buyerEmail || 'Unknown'}</strong>
                    </div>
                    <div className="booking-row">
                      <span>Tickets</span>
                      <strong>{booking.tickets || 1}</strong>
                    </div>
                    <div className="booking-row">
                      <span>Amount</span>
                      <strong>₹{booking.total || booking.totalAmount || 0}</strong>
                    </div>
                    <div className="booking-row">
                      <span>Booked on</span>
                      <strong>{formatDate(booking.bookedAt || booking.bookingDate)}</strong>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </article>

          <article className="dashboard-card panel-card">
            <h2>Quick access</h2>
            <p>Navigate your profile, saved plans, and booking shortcuts.</p>
            <div className="dashboard-tags">
              {userTags.map((tag) => (
                <span key={tag} className="dashboard-tag">
                  {tag}
                </span>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  )

  function formatDate(value) {
    if (!value) return 'TBA'
    const date = new Date(value)
    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  }
}
