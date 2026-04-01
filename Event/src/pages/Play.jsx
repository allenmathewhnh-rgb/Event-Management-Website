import { useEffect, useMemo, useState } from 'react'
import QRCode from 'qrcode'
import Modal from '../components/Modal'
import { getBookings, saveBookings } from '../utils/storage'

export default function Play() {
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [bookings, setBookings] = useState(() => getBookings())
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    if (!selectedBooking) {
      setQrDataUrl('')
      return
    }

    QRCode.toDataURL(selectedBooking.ticketId, {
      margin: 1,
      width: 180,
      color: {
        dark: '#1e293b',
        light: '#ffffff',
      },
    })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(''))
  }, [selectedBooking])

  const cancelBooking = (bookingId) => {
    const updated = bookings.map((booking) =>
      booking.id === bookingId
        ? { ...booking, status: 'Cancelled' }
        : booking,
    )
    saveBookings(updated)
    setBookings(updated)
    if (selectedBooking?.id === bookingId) {
      setSelectedBooking(updated.find((booking) => booking.id === bookingId))
    }
    setStatusMessage('Booking status updated to Cancelled.')
  }

  const downloadTicket = async (booking) => {
    try {
      const qrData = await QRCode.toDataURL(booking.ticketId, {
        margin: 1,
        width: 180,
      })
      const qrImage = new Image()
      qrImage.src = qrData
      await qrImage.decode()

      const width = 860
      const height = 520
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')

      ctx.fillStyle = '#eef2ff'
      ctx.fillRect(0, 0, width, height)
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(0, 0, width, 120)

      ctx.fillStyle = '#fff'
      ctx.font = '700 28px sans-serif'
      ctx.fillText('Event Ticket', 32, 48)
      ctx.font = '500 14px sans-serif'
      ctx.fillText(`Booking ID: ${booking.ticketId}`, 32, 78)

      ctx.fillStyle = '#0f172a'
      ctx.font = '700 34px sans-serif'
      ctx.fillText(booking.eventName, 32, 160)
      ctx.font = '600 16px sans-serif'
      ctx.fillText(`${booking.date} · ${booking.time}`, 32, 200)
      ctx.fillText(`Venue: ${booking.venue}`, 32, 234)
      ctx.fillText(`Name: ${booking.buyerName}`, 32, 270)
      ctx.fillText(`Email: ${booking.buyerEmail}`, 32, 302)
      ctx.fillText(`Tickets: ${booking.tickets}   Total: ₹${booking.total}`, 32, 338)
      ctx.fillStyle = booking.status === 'Cancelled' ? '#ef4444' : '#16a34a'
      ctx.fillText(`Status: ${booking.status}`, 32, 374)

      ctx.drawImage(qrImage, width - 220, 32, 180, 180)
      ctx.fillStyle = '#475569'
      ctx.font = '500 13px sans-serif'
      ctx.fillText('Scan for booking reference', width - 220, 236)

      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/png')
      link.download = `${booking.eventName.replace(/\s+/g, '_')}_ticket.png`
      link.click()
    } catch (error) {
      console.error('Ticket download failed', error)
    }
  }

  const sortedBookings = useMemo(
    () => [...bookings].sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt)),
    [bookings],
  )

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Bookings</h1>
        <p style={styles.subtitle}>Review your confirmed reservations with QR access and ticket downloads.</p>
        {statusMessage && <div style={styles.statusMessage}>{statusMessage}</div>}
      </div>

      {sortedBookings.length === 0 ? (
        <div style={styles.emptyState}>
          <h2>No Bookings Yet</h2>
          <p>Once you complete a booking, it will appear here.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {sortedBookings.map((booking) => (
            <article key={booking.id} style={styles.card}>
              <div style={styles.cardTop}>
                <div>
                  <h3 style={styles.cardTitle}>{booking.eventName}</h3>
                  <p style={styles.cardMeta}>Booking ID: {booking.ticketId}</p>
                </div>
                <span style={{
                  ...styles.badge,
                  background: booking.status === 'Confirmed' ? '#16a34a' : '#f97316',
                }}>
                  {booking.status}
                </span>
              </div>

              <div style={styles.infoGrid}>
                <div style={styles.infoItem}>
                  <span style={styles.icon}>🗓️</span>
                  <span>{booking.date}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.icon}>⏰</span>
                  <span>{booking.time}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.icon}>📍</span>
                  <span>{booking.venue}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.icon}>👤</span>
                  <span>{booking.buyerName}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.icon}>✉️</span>
                  <span>{booking.buyerEmail}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.icon}>🎫</span>
                  <span>{booking.tickets} ticket(s)</span>
                </div>
              </div>

              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Total paid</span>
                <strong style={styles.summaryValue}>₹{booking.total}</strong>
              </div>

              <div style={styles.actionsRow}>
                <button style={styles.buttonPrimary} onClick={() => setSelectedBooking(booking)}>
                  View QR
                </button>
                <button style={styles.buttonSecondary} onClick={() => downloadTicket(booking)}>
                  Download Ticket
                </button>
                {booking.status !== 'Cancelled' && (
                  <button style={styles.buttonDanger} onClick={() => cancelBooking(booking.id)}>
                    Cancel Booking
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal isOpen={Boolean(selectedBooking)} onClose={() => setSelectedBooking(null)}>
        {selectedBooking && (
          <div style={styles.modalBody}>
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>{selectedBooking.eventName}</h2>
                <p style={styles.cardMeta}>{selectedBooking.date} · {selectedBooking.time}</p>
                <p style={styles.cardMeta}>{selectedBooking.venue}</p>
              </div>
              <span style={{
                ...styles.badge,
                background: selectedBooking.status === 'Confirmed' ? '#16a34a' : '#f97316',
              }}>
                {selectedBooking.status}
              </span>
            </div>

            <div style={styles.modalGrid}>
              <div style={styles.modalSection}>
                <div style={styles.infoItem}><span style={styles.icon}>👤</span><span>{selectedBooking.buyerName}</span></div>
                <div style={styles.infoItem}><span style={styles.icon}>✉️</span><span>{selectedBooking.buyerEmail}</span></div>
                <div style={styles.infoItem}><span style={styles.icon}>🎫</span><span>{selectedBooking.tickets} ticket(s)</span></div>
                <div style={styles.infoItem}><span style={styles.icon}>💰</span><span>Total: ₹{selectedBooking.total}</span></div>
                <div style={styles.infoItem}><span style={styles.icon}>🆔</span><span>{selectedBooking.ticketId}</span></div>
                <div style={styles.infoItem}><span style={styles.icon}>📅</span><span>Booked on {new Date(selectedBooking.bookedAt).toLocaleString()}</span></div>
              </div>
              <div style={styles.qrPanel}>
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Booking QR Code" style={styles.qrImage} />
                ) : (
                  <div style={styles.qrFallback}>QR code loading…</div>
                )}
                <p style={styles.qrCaption}>Scan this QR at the venue entrance.</p>
              </div>
            </div>

            <div style={styles.actionsRow}>
              <button style={styles.buttonPrimary} onClick={() => downloadTicket(selectedBooking)}>
                Download Ticket
              </button>
              {selectedBooking.status !== 'Cancelled' && (
                <button style={styles.buttonDanger} onClick={() => cancelBooking(selectedBooking.id)}>
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
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
    marginBottom: 24,
    display: 'grid',
    gap: 10,
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
  statusMessage: {
    padding: '14px 18px',
    borderRadius: 18,
    background: '#e0f2fe',
    color: '#0f172a',
    border: '1px solid #bae6fd',
  },
  emptyState: {
    padding: 28,
    borderRadius: 24,
    background: '#fff',
    border: '1px solid #d6d9e6',
    textAlign: 'center',
  },
  grid: {
    display: 'grid',
    gap: 20,
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  },
  card: {
    padding: 28,
    borderRadius: 30,
    background: 'linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)',
    boxShadow: '0 24px 60px rgba(15, 23, 42, 0.1)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    display: 'grid',
    gap: 20,
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 16,
    flexWrap: 'wrap',
    alignItems: 'start',
  },
  cardTitle: {
    margin: '0 0 6px',
    fontSize: 24,
    color: '#0f172a',
  },
  cardMeta: {
    margin: 0,
    color: '#64748b',
    fontSize: 14,
  },
  cardText: {
    margin: '10px 0 0',
    color: '#334155',
  },
  badge: {
    padding: '10px 18px',
    borderRadius: 999,
    color: '#fff',
    fontWeight: 700,
    fontSize: 12,
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
  },
  infoGrid: {
    display: 'grid',
    gap: 12,
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    borderRadius: 18,
    background: '#f8fafc',
    color: '#334155',
    fontSize: 14,
  },
  icon: {
    width: 34,
    height: 34,
    display: 'grid',
    placeItems: 'center',
    borderRadius: 12,
    background: '#e2e8f0',
    fontSize: 16,
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 20px',
    background: '#eef2ff',
    borderRadius: 18,
  },
  summaryLabel: {
    color: '#475569',
  },
  summaryValue: {
    fontSize: 20,
    color: '#0f172a',
  },
  actionsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
  },
  buttonPrimary: {
    padding: '12px 18px',
    borderRadius: 18,
    border: 'none',
    background: 'linear-gradient(135deg, #4f46e5, #2563eb)',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 700,
  },
  buttonSecondary: {
    padding: '12px 18px',
    borderRadius: 18,
    border: '1px solid rgba(79, 70, 229, 0.18)',
    background: '#fff',
    color: '#334155',
    cursor: 'pointer',
    fontWeight: 700,
  },
  buttonDanger: {
    padding: '12px 18px',
    borderRadius: 18,
    border: 'none',
    background: '#ef4444',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 700,
  },
  modalBody: {
    display: 'grid',
    gap: 24,
    minWidth: 320,
    maxWidth: 780,
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 18,
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  modalTitle: {
    margin: 0,
    fontSize: 28,
    color: '#0f172a',
  },
  modalGrid: {
    display: 'grid',
    gap: 24,
    gridTemplateColumns: '1fr 280px',
  },
  modalSection: {
    display: 'grid',
    gap: 12,
  },
  qrPanel: {
    padding: 22,
    borderRadius: 24,
    background: '#f8fafc',
    display: 'grid',
    alignItems: 'center',
    justifyItems: 'center',
    gap: 14,
  },
  qrImage: {
    width: 180,
    height: 180,
    borderRadius: 22,
    background: '#fff',
    padding: 10,
    boxShadow: '0 22px 50px rgba(15, 23, 42, 0.08)',
  },
  qrFallback: {
    width: 180,
    height: 180,
    borderRadius: 22,
    display: 'grid',
    placeItems: 'center',
    background: '#e2e8f0',
    color: '#475569',
  },
  qrCaption: {
    margin: 0,
    textAlign: 'center',
    color: '#64748b',
    fontSize: 14,
  },
}
