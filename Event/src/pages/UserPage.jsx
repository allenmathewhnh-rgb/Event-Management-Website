import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getBookingsForUser, getUsers, LOGGED_IN_USER_KEY } from '../utils/storage'
import { apiUrl } from '../utils/api'
import './DashboardPage.css'

const userTags = ['My Tickets', 'Wishlist', 'Recommendations', 'Offers', 'Settings']

function sanitizeStoredUsername(value) {
  if (typeof value !== 'string') return ''
  const t = value.trim()
  if (!t || t === '[object Object]') return ''
  return t
}

export default function UserPage({ currentUsername }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch(apiUrl("/accounts/me/"), {
          credentials: "include"
        })

        if (!res.ok) {
          window.location.href = "/"
          return
        }

        const data = await res.json()
        const apiUser = data.user || {}
        const users = getUsers()
        const storedUser = users.find(
          (user) =>
            user.username === apiUser.username ||
            ((user.email || '').toLowerCase() === (apiUser.email || '').toLowerCase()),
        )

        const mergedUser = {
          ...storedUser,
          ...apiUser,
          name:
            apiUser.name ||
            `${apiUser.first_name || ''} ${apiUser.last_name || ''}`.trim() ||
            storedUser?.name ||
            apiUser.username,
          role: 'Customer',
          memberSince: apiUser.date_joined,
        }

        const bookingKey =
          (localStorage.getItem(LOGGED_IN_USER_KEY) || '').trim() ||
          mergedUser.email ||
          mergedUser.username ||
          sanitizeStoredUsername(currentUsername)

        setCurrentUser(mergedUser)
        setBookings(getBookingsForUser(bookingKey))
      } catch (err) {
        console.error(err)
      }
    }

    loadUser()
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
  const memberSince = currentUser?.memberSince ? formatDate(currentUser.memberSince) : '—'

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
                <span>Username</span>
                <strong>{currentUser?.username || '—'}</strong>
              </div>
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
            <h3>Cancelled bookings</h3>
            <strong>{cancelledCount}</strong>
            <p>Bookings you cancelled or that are no longer active.</p>
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
                      <strong>{booking.buyerEmail || currentUser?.email || 'Unknown'}</strong>
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
