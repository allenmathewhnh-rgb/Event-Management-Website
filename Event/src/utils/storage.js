const EVENTS_KEY = 'ems_events'

/** Exposed so UI can listen for cross-tab updates (same key as localStorage). */
export const EVENTS_STORAGE_KEY = EVENTS_KEY

/** Used when an event has no image or the URL fails to load. */
export const FALLBACK_EVENT_IMAGE =
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=70'

/** Trim and allow protocol-relative URLs (//cdn.example.com/... → https:). */
export function normalizeStoredEventImageUrl(value) {
  const s = (value == null ? '' : String(value)).trim()
  if (!s) return ''
  if (s.startsWith('//')) return `https:${s}`
  return s
}

/** Resolved src for <img>; supports `image` or legacy `imageUrl`. */
export function resolveEventImageSrc(event) {
  if (!event) return FALLBACK_EVENT_IMAGE
  const url =
    normalizeStoredEventImageUrl(event.image) ||
    normalizeStoredEventImageUrl(event.imageUrl)
  return url || FALLBACK_EVENT_IMAGE
}
const BOOKINGS_KEY = 'ems_bookings'
const SELECTED_EVENT_KEY = 'ems_selected_event'
const USERS_KEY = 'ems_users'

/** localStorage key for the active account (email preferred, else username). Used as bookings map key. */
export const LOGGED_IN_USER_KEY = 'loggedInUser'

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

const defaultBookingsMap = {}

function parseStorage(key, fallback) {
  const value = localStorage.getItem(key)
  if (!value) return fallback
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

function accountStorageKey(raw) {
  const s = (raw || '').toString().trim()
  return s ? s.toLowerCase() : ''
}

function resolveMapBucketKey(map, userKey) {
  const normalized = accountStorageKey(userKey)
  if (!normalized) return ''
  if (Array.isArray(map[userKey])) return userKey
  if (Array.isArray(map[normalized])) return normalized
  const found = Object.keys(map).find((k) => k.toLowerCase() === normalized)
  return found || normalized
}

export function getEvents() {
  return parseStorage(EVENTS_KEY, defaultEvents)
}

export function saveEvents(events) {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events))
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ems-events-changed'))
  }
}

function migrateLegacyBookingsArray(flat) {
  const migrated = {}
  for (const b of flat) {
    const key = (
      b.buyerEmail ||
      b.username ||
      b.userName ||
      '__unknown__'
    )
      .toString()
      .trim() || '__unknown__'
    const normalizedKey = key.toLowerCase()
    if (!migrated[normalizedKey]) migrated[normalizedKey] = []
    migrated[normalizedKey].push(b)
  }
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(migrated))
  return migrated
}

/** @returns {Record<string, Array>} email (or user key) -> bookings[] */
export function getBookingsMap() {
  const raw = parseStorage(BOOKINGS_KEY, null)
  if (raw === null) return { ...defaultBookingsMap }
  if (Array.isArray(raw)) return migrateLegacyBookingsArray(raw)
  if (typeof raw === 'object') return { ...raw }
  return { ...defaultBookingsMap }
}

export function saveBookingsMap(map) {
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(map))
}

export function getBookingsForUser(userKey) {
  if (!userKey) return []
  const map = getBookingsMap()
  const normalized = userKey.toString().trim().toLowerCase()
  const direct = map[userKey] || map[normalized]
  if (Array.isArray(direct)) return direct
  const matchKey = Object.keys(map).find((k) => k.toLowerCase() === normalized)
  return matchKey && Array.isArray(map[matchKey]) ? map[matchKey] : []
}

/** Flatten all users' bookings (e.g. admin). */
export function getAllBookingsFlat() {
  const map = getBookingsMap()
  const out = []
  for (const [, list] of Object.entries(map)) {
    if (!Array.isArray(list)) continue
    out.push(...list)
  }
  return out
}

export function saveBookingsForUser(userKey, bookingsArray) {
  if (!userKey) return
  const map = getBookingsMap()
  const bucketKey = resolveMapBucketKey(map, userKey)
  if (!bucketKey) return
  saveBookingsMap({ ...map, [bucketKey]: bookingsArray })
}

export function patchBookingById(bookingId, patch) {
  const map = getBookingsMap()
  for (const email of Object.keys(map)) {
    const list = map[email]
    if (!Array.isArray(list)) continue
    const idx = list.findIndex((b) => b.id === bookingId)
    if (idx === -1) continue
    const nextList = [...list]
    nextList[idx] = { ...nextList[idx], ...patch }
    saveBookingsMap({ ...map, [email]: nextList })
    return nextList[idx]
  }
  return null
}

/** @deprecated Use getBookingsForUser / getAllBookingsFlat */
export function getBookings() {
  return getAllBookingsFlat()
}

/** @deprecated Does not preserve per-user buckets; use saveBookingsForUser or patchBookingById */
export function saveBookings(bookings) {
  if (!Array.isArray(bookings)) {
    saveBookingsMap(bookings)
    return
  }
  const map = {}
  for (const b of bookings) {
    const key = (
      b.ownerKey ||
      b.buyerEmail ||
      b.username ||
      '__unknown__'
    )
      .toString()
      .trim()
      .toLowerCase() || '__unknown__'
    if (!map[key]) map[key] = []
    map[key].push(b)
  }
  saveBookingsMap(map)
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
  const map = getBookingsMap()
  const fromSession = accountStorageKey(localStorage.getItem(LOGGED_IN_USER_KEY))
  const fromPayload = accountStorageKey(booking.buyerEmail || booking.username)
  const userKey = fromSession || fromPayload || '__guest__'
  const bucketKey = resolveMapBucketKey(map, userKey)

  const list = Array.isArray(map[bucketKey]) ? [...map[bucketKey]] : []

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
    ownerKey: bucketKey,
    event: booking.event || booking.eventName || booking.name || '',
  }
  list.push(nextBooking)
  saveBookingsMap({ ...map, [bucketKey]: list })
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
