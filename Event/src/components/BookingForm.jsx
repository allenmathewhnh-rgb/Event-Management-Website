import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveSelectedEvent } from '../utils/storage'

export default function BookingForm({ event, isAuthenticated, onRequireLogin }) {
  const [buyerName, setBuyerName] = useState('')
  const [buyerEmail, setBuyerEmail] = useState('')
  const [buyerPhone, setBuyerPhone] = useState('')
  const [tickets, setTickets] = useState(1)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const totalAmount = useMemo(
    () => Number(event.price) * Number(tickets || 0),
    [event.price, tickets],
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      setError('Please login to book this event.')
      if (typeof onRequireLogin === 'function') {
        onRequireLogin()
      }
      return
    }
    if (!buyerName.trim() || !buyerEmail.trim() || !buyerPhone.trim()) {
      setError('Please provide name, email, and phone number.')
      return
    }
    if (tickets < 1) {
      setError('Please choose at least one ticket.')
      return
    }

    saveSelectedEvent({
      id: event.id,
      name: event.name,
      date: event.date,
      time: event.time,
      venue: event.venue || event.location,
      venueDetails: event.venueDetails || '',
      description: event.description || '',
      price: event.price,
      tickets: Number(tickets),
      buyerName: buyerName.trim(),
      buyerEmail: buyerEmail.trim(),
      buyerPhone: buyerPhone.trim(),
    })
    setError('')
    navigate('/confirm')
  }

  return (
    <div style={styles.card}>
      <h3 style={styles.heading}>Book Event</h3>
      <p style={styles.subheading}>Choose quantity and proceed to confirm.</p>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Name
          <input
            style={styles.input}
            type="text"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            placeholder="Your full name"
          />
        </label>
        <label style={styles.label}>
          Email
          <input
            style={styles.input}
            type="email"
            value={buyerEmail}
            onChange={(e) => setBuyerEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </label>
        <label style={styles.label}>
          Phone Number
          <input
            style={styles.input}
            type="tel"
            value={buyerPhone}
            onChange={(e) => setBuyerPhone(e.target.value)}
            placeholder="+91 98765 43210"
          />
        </label>
        <label style={styles.label}>
          Tickets
          <input
            style={styles.input}
            type="number"
            min="1"
            value={tickets}
            onChange={(e) => setTickets(Number(e.target.value))}
          />
        </label>
        <div style={styles.totalRow}>
          <span>Total</span>
          <strong>₹{totalAmount}</strong>
        </div>
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.button}>
          {isAuthenticated ? `Pay ₹${totalAmount} Securely` : 'Login to Book'}
        </button>
      </form>
    </div>
  )
}

const styles = {
  card: {
    display: 'grid',
    gap: 18,
    padding: 22,
    background: '#fff',
    borderRadius: 24,
    boxShadow: '0 20px 45px rgba(41, 53, 108, 0.08)',
  },
  heading: {
    margin: 0,
    fontSize: 24,
    color: '#1a2240',
  },
  subheading: {
    margin: 0,
    color: '#66708b',
  },
  form: {
    display: 'grid',
    gap: 16,
  },
  label: {
    display: 'grid',
    gap: 8,
    fontWeight: 600,
    color: '#32416a',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 14,
    border: '1px solid #d7dbe5',
    fontSize: 15,
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '14px 18px',
    borderRadius: 16,
    background: '#f4f7ff',
    fontWeight: 700,
  },
  button: {
    padding: '14px 18px',
    borderRadius: 16,
    border: 'none',
    background: '#4e73df',
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
  },
  error: {
    margin: 0,
    color: '#bf2b38',
  },
  success: {
    margin: 0,
    color: '#107a49',
  },
}
