import React from 'react'

const statusOptions = ['upcoming', 'completed', 'cancelled']

export default function BookingsTable({ bookings, onUpdateStatus }) {
  return (
    <div style={styles.tableWrapper}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>User</th>
            <th>Event</th>
            <th>Tickets</th>
            <th>Total</th>
            <th>Status</th>
            <th>Booking Date</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length === 0 ? (
            <tr>
              <td colSpan="6" style={styles.empty}>No bookings found</td>
            </tr>
          ) : (
            bookings.map((booking) => {
              const userName = booking.userName || booking.buyerName || 'Guest'
              const eventName = booking.eventName || booking.name || ''
              const totalAmount = booking.totalAmount ?? booking.total ?? 0
              const bookingDate = booking.bookingDate || booking.bookedAt || ''

              return (
                <tr key={booking.id}>
                  <td>{userName}</td>
                  <td>{eventName}</td>
                  <td>{booking.tickets}</td>
                  <td>${totalAmount}</td>
                  <td>
                    <select
                      value={booking.status}
                      onChange={(e) => onUpdateStatus(booking.id, e.target.value)}
                      style={styles.select}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{bookingDate}</td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}

const styles = {
  tableWrapper: {
    overflowX: 'auto',
    borderRadius: 20,
    background: '#fff',
    boxShadow: '0 20px 45px rgba(41, 53, 108, 0.08)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: 840,
  },
  empty: {
    padding: 24,
    textAlign: 'center',
    color: '#66708b',
  },
  select: {
    padding: '8px 10px',
    borderRadius: 10,
    border: '1px solid #d7dbe5',
    minWidth: 120,
  },
}
