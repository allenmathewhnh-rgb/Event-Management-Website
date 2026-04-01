import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addBooking, clearSelectedEvent, getSelectedEvent } from '../utils/storage'

export default function Payment() {
  const [selected, setSelected] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const stored = getSelectedEvent()
    if (!stored) {
      navigate('/events')
      return
    }
    setSelected(stored)
  }, [navigate])

  const handlePayment = () => {
    if (!selected) return

    addBooking({
      eventName: selected.name,
      date: selected.date,
      venue: selected.venue,
      tickets: selected.tickets,
      total: selected.tickets * selected.price,
      buyerName: selected.buyerName,
      buyerEmail: selected.buyerEmail,
      buyerPhone: selected.buyerPhone,
      username: localStorage.getItem('username') || '',
      status: 'Confirmed',
    })
    clearSelectedEvent()
    navigate('/my-bookings')
  }

  if (!selected) {
    return null
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Secure Payment</h1>
        <p style={styles.subtitle}>Complete your payment details to finalize booking.</p>

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
            <span>{selected.tickets}</span>
          </div>
          <div style={styles.rowFull}>
            <strong>Contact</strong>
            <span>{selected.buyerName} • {selected.buyerEmail} • {selected.buyerPhone}</span>
          </div>
          <div style={styles.row}>
            <strong>Total</strong>
            <span>₹{selected.tickets * selected.price}</span>
          </div>
        </div>

        <button style={styles.button} onClick={handlePayment}>
          Complete Secure Payment
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
