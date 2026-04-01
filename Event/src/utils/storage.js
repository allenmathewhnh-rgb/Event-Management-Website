const EVENTS_KEY = 'ems_events'
const BOOKINGS_KEY = 'ems_bookings'
const SELECTED_EVENT_KEY = 'ems_selected_event'
const USERS_KEY = 'ems_users'

const defaultEvents = [
  {
    id: 1,
    name: 'Summer Beats Festival',
    date: '2026-07-12',
    time: '18:00',
    location: 'Grand Park',
    venue: 'Lakeside Amphitheatre',
    venueDetails: 'Outdoor stage with premium lounges, food trucks, and lakeside seating.',
    price: 4500,
    seats: 220,
    description: 'A sunset music festival featuring live bands, DJs, and immersive light shows.',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    name: 'Future Tech Expo',
    date: '2026-05-05',
    time: '10:00',
    location: 'City Conference Centre',
    venue: 'Expo Hall A',
    venueDetails: 'Modern conference space with networking lounges and demo zones.',
    price: 1500,
    seats: 120,
    description: 'A one-day event with startup showcases, keynote sessions, and product demos.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    name: 'Riverside Food Fair',
    date: '2026-06-18',
    time: '12:00',
    location: 'Riverside Park',
    venue: 'Meadow Pavilion',
    venueDetails: 'Family-friendly grounds with shaded seating and live culinary demos.',
    price: 2500,
    seats: 180,
    description: 'Sample street food from 25 vendors, enjoy live music, and explore craft drinks.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80',
  },
]

const defaultBookings = []

function parseStorage(key, fallback) {
  const value = localStorage.getItem(key)
  if (!value) return fallback
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

export function getEvents() {
  return parseStorage(EVENTS_KEY, defaultEvents)
}

export function saveEvents(events) {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events))
}

export function getBookings() {
  return parseStorage(BOOKINGS_KEY, defaultBookings)
}

export function saveBookings(bookings) {
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings))
}

const defaultUsers = []

export function getUsers() {
  const saved = parseStorage(USERS_KEY, null)
  if (saved) return saved
  const legacy = parseStorage('user', null)
  return legacy ? [legacy] : defaultUsers
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function addUser(user) {
  const users = getUsers()
  const nextUser = {
    id: Date.now(),
    ...user,
  }
  const updated = [...users, nextUser]
  saveUsers(updated)
  return nextUser
}

function generateTicketId() {
  return `TCKT-${Math.random().toString(36).slice(2, 10).toUpperCase()}`
}

export function addBooking(booking) {
  const bookings = getBookings()
  const nextBooking = {
    ...booking,
    id: Date.now(),
    ticketId: booking.ticketId || generateTicketId(),
    bookedAt: booking.bookedAt || new Date().toISOString(),
    bookingDate: booking.bookingDate || booking.bookedAt || new Date().toISOString(),
    totalAmount: booking.totalAmount || booking.total || 0,
    username: booking.username || booking.userName || booking.buyerName || '',
    userName: booking.userName || booking.buyerName || '',
    eventName: booking.eventName || booking.name || '',
    status: booking.status || 'upcoming',
  }
  const updated = [...bookings, nextBooking]
  saveBookings(updated)
  return nextBooking
}

export function getSelectedEvent() {
  return parseStorage(SELECTED_EVENT_KEY, null)
}

export function saveSelectedEvent(event) {
  localStorage.setItem(SELECTED_EVENT_KEY, JSON.stringify(event))
}

export function clearSelectedEvent() {
  localStorage.removeItem(SELECTED_EVENT_KEY)
}
