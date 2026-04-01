import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSelectedEvent, saveSelectedEvent } from '../utils/storage'

export default function ConfirmBooking() {
  const [selected, setSelected] = useState(null)
  const [tickets, setTickets] = useState(1)
  const navigate = useNavigate()

  useEffect(() => {
    const stored = getSelectedEvent()
    if (!stored) {
      navigate('/events')
      return
    }
    setSelected(stored)
    setTickets(stored.tickets || 1)
  }, [navigate])

  useEffect(() => {
    if (!selected) return
    saveSelectedEvent({ ...selected, tickets })
  }, [selected, tickets])

  if (!selected) {
    return null
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div>
          <h1 style={styles.title}>Confirm Booking</h1>
          <p style={styles.subtitle}>Review your selected event and proceed to secure payment.</p>
        </div>

        <div style={styles.summary}>
          <div style={styles.row}>
            <strong>Event</strong>
            <span>{selected.name}</span>
          </div>
          <div style={styles.row}>
            <strong>Date</strong>
            <span>{selected.date}</span>
          </div>
          <div style={styles.row}>
            <strong>Time</strong>
            <span>{selected.time}</span>
          </div>
          <div style={styles.row}>
            <strong>Venue</strong>
            <span>{selected.venue}</span>
          </div>
          {selected.venueDetails && (
            <div style={styles.rowFull}>
              <strong>Venue Details</strong>
              <span>{selected.venueDetails}</span>
            </div>
          )}
          <div style={styles.row}>
            <strong>Tickets</strong>
            <input
              type="number"
              min="1"
              value={tickets}
              onChange={(e) => setTickets(Number(e.target.value) || 1)}
              style={styles.input}
            />
          </div>
          <div style={styles.row}>
            <strong>Total</strong>
            <span>₹{tickets * selected.price}</span>
          </div>
          <div style={styles.rowFull}>
            <strong>Attendee</strong>
            <span>{selected.buyerName} • {selected.buyerEmail} • {selected.buyerPhone}</span>
          </div>
        </div>

        <button style={styles.button} onClick={() => navigate('/payment')}>
          Pay ₹{tickets * selected.price} Securely
        </button>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    padding: 24,
    background: '#eef1fb',
  },
  card: {
    maxWidth: 720,
    margin: '0 auto',
    padding: 28,
    borderRadius: 24,
    background: '#fff',
    boxShadow: '0 25px 70px rgba(15, 23, 42, 0.08)',
    display: 'grid',
    gap: 22,
  },
  title: {
    margin: 0,
    fontSize: 32,
    color: '#1a2240',
  },
  subtitle: {
    margin: '10px 0 0',
    color: '#66708b',
    fontSize: 16,
  },
  summary: {
    display: 'grid',
    gap: 16,
    padding: 24,
    borderRadius: 20,
    background: '#f8f9ff',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 24,
    color: '#32416a',
  },
  rowFull: {
    display: 'grid',
    gap: 8,
    color: '#32416a',
  },
  input: {
    width: 96,
    padding: '10px 14px',
    borderRadius: 14,
    border: '1px solid #d7dbe5',
    textAlign: 'center',
    fontSize: 16,
  },
  button: {
    padding: '16px 22px',
    borderRadius: 18,
    border: 'none',
    background: '#4e73df',
    color: '#fff',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
  },
}
