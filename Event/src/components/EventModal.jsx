import Modal from './Modal'
import BookingForm from './BookingForm'

export default function EventModal({ event, isOpen, onClose, onBooked, isAuthenticated, onRequireLogin }) {
  if (!event) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div style={styles.container}>
        <div style={styles.left}>
          <img src={event.image} alt={event.name} style={styles.image} />
          <div style={styles.details}>
            <h2 style={styles.title}>{event.name}</h2>
            <p style={styles.description}>{event.description}</p>
            <div style={styles.metaRow}>
              <div>
                <strong>Date</strong>
                <p>{event.date}</p>
              </div>
              <div>
                <strong>Time</strong>
                <p>{event.time}</p>
              </div>
            </div>
            <div style={styles.metaRow}>
              <div>
                <strong>Venue</strong>
                <p>{event.venue || event.location}</p>
              </div>
              <div>
                <strong>Seats</strong>
                <p>{event.seats}</p>
              </div>
            </div>
            <div style={styles.priceRow}>
              <span style={styles.priceLabel}>Price</span>
              <strong style={styles.priceValue}>₹{event.price}</strong>
            </div>
            {event.venueDetails && (
              <p style={styles.venueDetails}>{event.venueDetails}</p>
            )}
          </div>
        </div>
        <div style={styles.right}>
          <BookingForm
            event={event}
            onBooked={onBooked}
            isAuthenticated={isAuthenticated}
            onRequireLogin={onRequireLogin}
          />
        </div>
      </div>
    </Modal>
  )
}

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: '1.4fr 1fr',
    gap: 24,
    background: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    minWidth: 320,
    maxWidth: 1000,
  },
  left: {
    display: 'grid',
    gap: 18,
    padding: 24,
  },
  image: {
    width: '100%',
    height: 360,
    objectFit: 'cover',
    borderRadius: 20,
  },
  details: {
    display: 'grid',
    gap: 14,
  },
  title: {
    margin: 0,
    fontSize: 28,
    color: '#1a2240',
  },
  description: {
    margin: 0,
    color: '#4f5f7f',
    lineHeight: 1.75,
  },
  metaRow: {
    display: 'grid',
    gap: 12,
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 20px',
    borderRadius: 18,
    background: '#f4f7ff',
  },
  priceLabel: {
    fontSize: 14,
    color: '#66708b',
  },
  priceValue: {
    fontSize: 26,
    color: '#1a2240',
  },
  right: {
    padding: 24,
    background: '#f8f9ff',
    display: 'grid',
    alignContent: 'start',
  },
}
