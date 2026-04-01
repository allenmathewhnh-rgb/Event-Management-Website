import { useEffect, useState } from 'react'
import EventCard from '../components/EventCard'
import EventModal from '../components/EventModal'
import { getEvents } from '../utils/storage'

export default function Events({ isAuthenticated, onRequireLogin }) {
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    setEvents(getEvents())
  }, [])

  const handleOpen = (event) => {
    setSelectedEvent(event)
    setMessage('')
  }

  const handleClose = () => {
    setSelectedEvent(null)
  }

  const handleBooked = () => {
    setMessage('Booking confirmed and saved.')
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Events</h1>
          <p style={styles.subtitle}>Browse upcoming events and book your spot instantly.</p>
        </div>
        {message && <div style={styles.message}>{message}</div>}
      </div>
      <div style={styles.grid}>
        {events.map((event) => (
          <EventCard key={event.id} event={event} onSelect={handleOpen} />
        ))}
      </div>
      <EventModal
        event={selectedEvent}
        isOpen={Boolean(selectedEvent)}
        onClose={handleClose}
        onBooked={handleBooked}
        isAuthenticated={isAuthenticated}
        onRequireLogin={onRequireLogin}
      />
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    padding: 24,
    background: '#eef1fb',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginBottom: 24,
  },
  title: {
    margin: 0,
    fontSize: 32,
    color: '#1a2240',
  },
  subtitle: {
    margin: 0,
    color: '#66708b',
    fontSize: 16,
  },
  message: {
    marginTop: 12,
    padding: '14px 18px',
    borderRadius: 18,
    background: '#e7f5ff',
    color: '#1a5f9e',
    fontWeight: 600,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 24,
  },
}
