import { useEffect, useMemo, useState } from 'react'
import QRCode from 'qrcode'
import {
  getBookingsForUser,
  saveBookingsForUser,
  LOGGED_IN_USER_KEY,
} from '../utils/storage'

function currentAccountKey() {
  return (localStorage.getItem(LOGGED_IN_USER_KEY) || '').trim()
}


function TicketQr({ ticketId }) {
  const [dataUrl, setDataUrl] = useState('')

  useEffect(() => {
    if (!ticketId) {
      setDataUrl('')
      return
    }
    let cancelled = false
    QRCode.toDataURL(ticketId, {
      margin: 1,
      width: 132,
      color: {
        dark: '#3d4f63',
        light: '#ffffff',
      },
    })
      .then((url) => {
        if (!cancelled) setDataUrl(url)
      })
      .catch(() => {
        if (!cancelled) setDataUrl('')
      })
    return () => {
      cancelled = true
    }
  }, [ticketId])

  if (!dataUrl) {
    return <div style={styles.qrPlaceholder}>Generating code…</div>
  }
  return (
    <img
      src={dataUrl}
      alt={`QR code for booking ${ticketId}`}
      style={styles.qrOnTicket}
    />
  )
}

export default function Play() {
  const [bookings, setBookings] = useState(() =>
    getBookingsForUser(currentAccountKey()),
  )
  const [statusMessage, setStatusMessage] = useState('')

  const cancelBooking = (bookingId) => {
    const updated = bookings.map((booking) =>
      booking.id === bookingId
        ? { ...booking, status: 'Cancelled' }
        : booking,
    )
    saveBookingsForUser(currentAccountKey(), updated)
    setBookings(updated)
    setStatusMessage('Booking status updated to Cancelled.')
  }

  const downloadTicket = async (booking) => {
    try {
      const qrData = await QRCode.toDataURL(booking.ticketId, {
        margin: 1,
        width: 200,
        color: { dark: '#3d4f63', light: '#ffffff' },
      })
      const qrImage = new Image()
      qrImage.src = qrData
      await qrImage.decode()

      const width = 880
      const height = 540
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')

      ctx.fillStyle = '#f0f4fa'
      ctx.fillRect(0, 0, width, height)
      ctx.fillStyle = '#4a6fa5'
      ctx.fillRect(0, 0, width, 112)

      ctx.fillStyle = '#f8fafc'
      ctx.font = '700 26px sans-serif'
      ctx.fillText('Digital ticket', 36, 52)
      ctx.font = '500 13px sans-serif'
      ctx.fillStyle = 'rgba(248, 250, 252, 0.92)'
      ctx.fillText(`Reference: ${booking.ticketId}`, 36, 82)

      ctx.fillStyle = '#2c3e50'
      ctx.font = '700 30px sans-serif'
      ctx.fillText(booking.eventName, 36, 168)
      ctx.font = '500 15px sans-serif'
      ctx.fillStyle = '#5a6d7e'
      ctx.fillText(`${booking.date} · ${booking.time || 'TBA'}`, 36, 204)
      ctx.fillText(`Venue: ${booking.venue || '—'}`, 36, 232)
      ctx.fillText(`Guest: ${booking.buyerName || '—'}`, 36, 268)
      ctx.fillText(`Email: ${booking.buyerEmail || '—'}`, 36, 296)
      ctx.fillText(
        `Tickets: ${booking.tickets}    Total: ₹${booking.total ?? 0}`,
        36,
        332,
      )
      ctx.fillStyle = booking.status === 'Cancelled' ? '#c45c5c' : '#3d8b6e'
      ctx.font = '600 14px sans-serif'
      ctx.fillText(`Status: ${booking.status}`, 36, 372)

      ctx.drawImage(qrImage, width - 236, 36, 200, 200)
      ctx.fillStyle = '#6b7c8c'
      ctx.font = '500 12px sans-serif'
      ctx.fillText('Scan for check-in', width - 236, 252)

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
        <p style={styles.subtitle}>
          Each ticket shows a QR code for venue check-in. Download a copy if you need it offline.
        </p>
        {statusMessage && <div style={styles.statusMessage}>{statusMessage}</div>}
      </div>

      {sortedBookings.length === 0 ? (
        <div style={styles.emptyState}>
          <h2 style={styles.emptyTitle}>No bookings yet</h2>
          <p style={styles.emptyText}>
            Once you complete a booking, your ticket will show up here with a QR code.
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {sortedBookings.map((booking) => (
            <article key={booking.id} style={styles.ticket}>
              <div style={styles.ticketAccent} aria-hidden />
              <div style={styles.ticketBody}>
                <div style={styles.ticketMain}>
                  <div style={styles.ticketHeaderRow}>
                    <span style={styles.ticketEyebrow}>Admission</span>
                    <span
                      style={{
                        ...styles.badge,
                        background:
                          booking.status === 'Confirmed'
                            ? 'rgba(61, 139, 110, 0.18)'
                            : 'rgba(196, 92, 92, 0.16)',
                        color:
                          booking.status === 'Confirmed' ? '#2d6b52' : '#a34444',
                      }}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <h3 style={styles.eventTitle}>{booking.eventName}</h3>
                  <p style={styles.refLine}>Ref. {booking.ticketId}</p>

                  <dl style={styles.detailList}>
                    <div style={styles.detailRow}>
                      <dt style={styles.detailLabel}>Date</dt>
                      <dd style={styles.detailValue}>{booking.date}</dd>
                    </div>
                    <div style={styles.detailRow}>
                      <dt style={styles.detailLabel}>Time</dt>
                      <dd style={styles.detailValue}>{booking.time || 'TBA'}</dd>
                    </div>
                    <div style={styles.detailRow}>
                      <dt style={styles.detailLabel}>Venue</dt>
                      <dd style={styles.detailValue}>{booking.venue || '—'}</dd>
                    </div>
                    <div style={styles.detailRow}>
                      <dt style={styles.detailLabel}>Guest</dt>
                      <dd style={styles.detailValue}>{booking.buyerName || '—'}</dd>
                    </div>
                    <div style={styles.detailRow}>
                      <dt style={styles.detailLabel}>Email</dt>
                      <dd style={styles.detailValue}>{booking.buyerEmail || '—'}</dd>
                    </div>
                    <div style={styles.detailRow}>
                      <dt style={styles.detailLabel}>Tickets</dt>
                      <dd style={styles.detailValue}>{booking.tickets}</dd>
                    </div>
                  </dl>

                  <div style={styles.totalBar}>
                    <span style={styles.totalLabel}>Total paid</span>
                    <span style={styles.totalAmount}>₹{booking.total ?? 0}</span>
                  </div>
                </div>

                <aside style={styles.qrColumn}>
                  <TicketQr ticketId={booking.ticketId} />
                  <p style={styles.qrHint}>Show this code at the entrance.</p>
                </aside>
              </div>

              <div style={styles.ticketDivider} aria-hidden />

              <div style={styles.actionsRow}>
                <button
                  type="button"
                  style={styles.buttonSecondary}
                  onClick={() => downloadTicket(booking)}
                >
                  Download ticket
                </button>
                {booking.status !== 'Cancelled' && (
                  <button
                    type="button"
                    style={styles.buttonDanger}
                    onClick={() => cancelBooking(booking.id)}
                  >
                    Cancel booking
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    padding: 24,
    background: 'linear-gradient(165deg, #e8edf5 0%, #eef1fb 45%, #e5eaf4 100%)',
  },
  header: {
    marginBottom: 28,
    display: 'grid',
    gap: 10,
    maxWidth: 720,
  },
  title: {
    margin: 0,
    fontSize: 32,
    fontWeight: 700,
    color: '#2a3f5c',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    margin: 0,
    color: '#6b7c8c',
    fontSize: 16,
    lineHeight: 1.5,
  },
  statusMessage: {
    padding: '14px 18px',
    borderRadius: 14,
    background: 'rgba(74, 111, 165, 0.12)',
    color: '#3d5580',
    border: '1px solid rgba(74, 111, 165, 0.22)',
    fontSize: 14,
  },
  emptyState: {
    padding: 40,
    borderRadius: 24,
    background: '#fff',
    border: '1px solid rgba(100, 116, 139, 0.15)',
    textAlign: 'center',
    maxWidth: 480,
    margin: '0 auto',
  },
  emptyTitle: {
    margin: '0 0 10px',
    fontSize: 22,
    fontWeight: 600,
    color: '#3d4f63',
  },
  emptyText: {
    margin: 0,
    color: '#6b7c8c',
    fontSize: 15,
    lineHeight: 1.55,
  },
  grid: {
    display: 'grid',
    gap: 24,
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 380px), 1fr))',
  },
  ticket: {
    borderRadius: 20,
    background: '#fff',
    boxShadow: '0 20px 50px rgba(42, 63, 92, 0.08)',
    border: '1px solid rgba(100, 116, 139, 0.12)',
    overflow: 'hidden',
    display: 'grid',
  },
  ticketAccent: {
    height: 6,
    background: 'linear-gradient(90deg, #5c7cba, #7b9fd4, #5c7cba)',
    opacity: 0.95,
  },
  ticketBody: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 20,
    padding: '22px 22px 18px',
    alignItems: 'flex-start',
  },
  ticketMain: {
    flex: '1 1 220px',
    minWidth: 0,
    display: 'grid',
    gap: 14,
  },
  ticketHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  ticketEyebrow: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#7d8ea3',
  },
  eventTitle: {
    margin: 0,
    fontSize: 21,
    fontWeight: 700,
    color: '#34495e',
    lineHeight: 1.3,
  },
  refLine: {
    margin: 0,
    fontSize: 13,
    color: '#7d8ea3',
    fontFamily: 'ui-monospace, monospace',
  },
  detailList: {
    margin: 0,
    display: 'grid',
    gap: 8,
  },
  detailRow: {
    display: 'grid',
    gridTemplateColumns: '88px 1fr',
    gap: 10,
    alignItems: 'baseline',
    fontSize: 14,
  },
  detailLabel: {
    margin: 0,
    color: '#8b9bab',
    fontWeight: 600,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  detailValue: {
    margin: 0,
    color: '#4a5f73',
    lineHeight: 1.4,
    wordBreak: 'break-word',
  },
  totalBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 14px',
    borderRadius: 12,
    background: 'linear-gradient(135deg, rgba(92, 124, 186, 0.1), rgba(123, 159, 212, 0.08))',
    border: '1px solid rgba(92, 124, 186, 0.15)',
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: '#6b7c8c',
  },
  totalAmount: {
    fontSize: 19,
    fontWeight: 700,
    color: '#3d5580',
  },
  qrColumn: {
    display: 'grid',
    justifyItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 14,
    background: 'linear-gradient(180deg, #f6f8fc 0%, #eef2f8 100%)',
    border: '1px dashed rgba(100, 116, 139, 0.28)',
    minWidth: 156,
    flex: '0 0 auto',
    marginLeft: 'auto',
  },
  qrOnTicket: {
    width: 132,
    height: 132,
    display: 'block',
    borderRadius: 10,
    background: '#fff',
    padding: 8,
    boxSizing: 'content-box',
    boxShadow: '0 8px 24px rgba(42, 63, 92, 0.06)',
  },
  qrPlaceholder: {
    width: 132,
    height: 132,
    display: 'grid',
    placeItems: 'center',
    borderRadius: 10,
    background: '#e8edf4',
    color: '#7d8ea3',
    fontSize: 12,
    textAlign: 'center',
    padding: 8,
    boxSizing: 'border-box',
  },
  qrHint: {
    margin: 0,
    fontSize: 11,
    color: '#7d8ea3',
    textAlign: 'center',
    lineHeight: 1.35,
    maxWidth: 140,
  },
  ticketDivider: {
    margin: '0 22px',
    borderTop: '1px dashed rgba(100, 116, 139, 0.28)',
  },
  badge: {
    padding: '6px 12px',
    borderRadius: 999,
    fontWeight: 700,
    fontSize: 11,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  actionsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    padding: '16px 22px 22px',
  },
  buttonSecondary: {
    padding: '11px 18px',
    borderRadius: 12,
    border: '1px solid rgba(92, 124, 186, 0.35)',
    background: '#fff',
    color: '#4a6fa5',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 14,
  },
  buttonDanger: {
    padding: '11px 18px',
    borderRadius: 12,
    border: 'none',
    background: 'rgba(196, 92, 92, 0.14)',
    color: '#a34444',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 14,
  },
}
