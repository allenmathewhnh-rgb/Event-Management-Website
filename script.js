function getLocalStorageJson(key, fallback) {
  const raw = localStorage.getItem(key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw)
  } catch (error) {
    return fallback
  }
}

function formatDate(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value || '-'
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function renderProfile() {
  const username = localStorage.getItem('username') || 'Guest'
  const email = localStorage.getItem('email') || 'no-email@example.com'
  const role = localStorage.getItem('role') || 'User'
  let memberSince = localStorage.getItem('memberSince')

  if (!memberSince) {
    memberSince = new Date().toISOString()
    localStorage.setItem('memberSince', memberSince)
  }

  document.getElementById('avatar').textContent = username.charAt(0).toUpperCase()
  document.getElementById('username').textContent = username
  document.getElementById('email').textContent = email
  document.getElementById('role').textContent = role
  document.getElementById('memberSince').textContent = formatDate(memberSince)
}

function createBookingCard(booking) {
  const status = booking.status ? booking.status : 'Confirmed'
  const card = document.createElement('article')
  card.className = 'booking-card'

  const bookingId = booking.bookingId || booking.ticketId || booking.id || 'N/A'
  const eventName = booking.eventName || booking.name || 'Untitled Event'
  const userName = booking.userName || booking.username || localStorage.getItem('username') || 'Guest'
  const venue = booking.venue || booking.location || 'Unknown Venue'

  card.innerHTML = `
    <div class="booking-top">
      <div>
        <h2 class="booking-title">${eventName}</h2>
        <p style="margin: 8px 0 0; color: #64748b;">Booking ID: ${bookingId}</p>
      </div>
      <span class="booking-status">${status}</span>
    </div>

    <div class="booking-meta">
      <div class="meta-item"><span>Date</span><strong>${booking.date || '-'}</strong></div>
      <div class="meta-item"><span>Time</span><strong>${booking.time || '-'}</strong></div>
      <div class="meta-item"><span>Venue</span><strong>${venue}</strong></div>
      <div class="meta-item"><span>User Name</span><strong>${userName}</strong></div>
      <div class="meta-item"><span>Tickets</span><strong>${booking.tickets || 1}</strong></div>
      <div class="meta-item"><span>Total Price</span><strong>₹${booking.total || booking.totalAmount || 0}</strong></div>
    </div>

    <div class="booking-actions">
      <button class="button-primary" data-action="qr" data-id="${bookingId}">View QR</button>
      <button class="button-secondary" data-action="details" data-id="${bookingId}">View Details</button>
    </div>
  `

  card.querySelector('[data-action="qr"]').addEventListener('click', () => showModal('qr', booking))
  card.querySelector('[data-action="details"]').addEventListener('click', () => showModal('details', booking))

  return card
}

function renderBookings() {
  const container = document.getElementById('bookingsContainer')
  const bookings = getLocalStorageJson('bookings', [])

  container.innerHTML = ''

  if (!Array.isArray(bookings) || bookings.length === 0) {
    const empty = document.createElement('div')
    empty.className = 'empty-state'
    empty.textContent = 'No Bookings Yet'
    container.appendChild(empty)
    return
  }

  bookings.forEach((booking) => {
    container.appendChild(createBookingCard(booking))
  })
}

function buildQrImage(bookingId) {
  const encoded = encodeURIComponent(bookingId)
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encoded}`
}

function showModal(type, booking) {
  const modal = document.getElementById('modal')
  const content = document.getElementById('modalContent')
  const bookingId = booking.bookingId || booking.ticketId || booking.id || 'N/A'
  const eventName = booking.eventName || booking.name || 'Untitled Event'
  const venue = booking.venue || booking.location || 'Unknown Venue'
  const userName = booking.userName || booking.username || localStorage.getItem('username') || 'Guest'
  const total = booking.total || booking.totalAmount || 0
  const status = booking.status || 'Confirmed'

  if (type === 'qr') {
    content.innerHTML = `
      <div class="modal-content">
        <h2>QR Code</h2>
        <p>Booking ID: ${bookingId}</p>
        <div class="modal-qr">
          <img src="${buildQrImage(bookingId)}" alt="QR Code" />
        </div>
      </div>
    `
  } else {
    content.innerHTML = `
      <div class="modal-content">
        <h2>Booking Details</h2>
        <p><strong>Event:</strong> ${eventName}</p>
        <p><strong>Booking ID:</strong> ${bookingId}</p>
        <p><strong>Date:</strong> ${booking.date || '-'}</p>
        <p><strong>Time:</strong> ${booking.time || '-'}</p>
        <p><strong>Venue:</strong> ${venue}</p>
        <p><strong>User:</strong> ${userName}</p>
        <p><strong>Tickets:</strong> ${booking.tickets || 1}</p>
        <p><strong>Total Price:</strong> ₹${total}</p>
        <p><strong>Status:</strong> ${status}</p>
      </div>
    `
  }

  modal.classList.remove('hidden')
}

function hideModal() {
  document.getElementById('modal').classList.add('hidden')
}

function setupHandlers() {
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('username')
    localStorage.removeItem('email')
    localStorage.removeItem('role')
    localStorage.removeItem('memberSince')
    hideModal()
    window.location.reload()
  })

  document.getElementById('modalClose').addEventListener('click', hideModal)
  document.getElementById('modal').addEventListener('click', (event) => {
    if (event.target.id === 'modal') hideModal()
  })
}

function initProfilePage() {
  renderProfile()
  renderBookings()
  setupHandlers()
}

window.addEventListener('DOMContentLoaded', initProfilePage)
