import { useMemo, useState } from 'react'
import Sidebar from '../components/Sidebar'
import StatsCards from '../components/StatsCards'
import EventsTable from '../components/EventsTable'
import BookingsTable from '../components/BookingsTable'
import UsersTable from '../components/UsersTable'
import { getEvents, saveBookings, saveEvents, getBookings, getUsers, saveUsers } from '../utils/storage'

const initialEvents = [
  {
    id: 1,
    name: 'Summer Music Festival',
    date: '2026-07-12',
    time: '18:00',
    location: 'Grand Park',
    price: 45,
    seats: 220,
    description: 'Live bands and food trucks for a weekend of music.',
    image: 'https://via.placeholder.com/120',
  },
  {
    id: 2,
    name: 'Tech Meetup',
    date: '2026-05-05',
    time: '10:00',
    location: 'City Conference Hall',
    price: 15,
    seats: 120,
    description: 'Networking and talks for tech professionals.',
    image: 'https://via.placeholder.com/120',
  },
]

const initialBookings = [
  {
    id: 1,
    userName: 'Sofia Lee',
    eventName: 'Summer Music Festival',
    tickets: 2,
    totalAmount: 90,
    status: 'upcoming',
    bookingDate: '2026-04-12',
  },
  {
    id: 2,
    userName: 'Jason Park',
    eventName: 'Tech Meetup',
    tickets: 1,
    totalAmount: 15,
    status: 'completed',
    bookingDate: '2026-03-22',
  },
  {
    id: 3,
    userName: 'Mia Sanchez',
    eventName: 'Summer Music Festival',
    tickets: 4,
    totalAmount: 180,
    status: 'cancelled',
    bookingDate: '2026-03-27',
  },
]

const initialUsers = [
  { id: 1, name: 'Ethan Brown', email: 'ethan@example.com', phone: '+1 555 0102', role: 'Organizer', blocked: false },
  { id: 2, name: 'Lina Kim', email: 'lina@example.com', phone: '+1 555 0144', role: 'Customer', blocked: false },
  { id: 3, name: 'Noah Smith', email: 'noah@example.com', phone: '+1 555 0188', role: 'Customer', blocked: true },
]

const emptyEvent = {
  name: '',
  date: '',
  time: '',
  location: '',
  price: '',
  seats: '',
  description: '',
  image: '',
}

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [events, setEvents] = useState(() => getEvents())
  const [bookings, setBookings] = useState(() => {
    const stored = getBookings()
    return stored.length ? stored : initialBookings
  })
  const [users, setUsers] = useState(() => {
    const stored = getUsers()
    return stored.length ? stored : initialUsers
  })
  const [form, setForm] = useState(emptyEvent)
  const [editingId, setEditingId] = useState(null)

  const totalRevenue = useMemo(
    () => bookings.reduce((sum, item) => sum + (item.totalAmount ?? item.total ?? 0), 0),
    [bookings]
  )

  const upcomingEvents = useMemo(
    () => events.filter((event) => new Date(event.date) > new Date()),
    [events]
  )

  const recentBookings = useMemo(
    () => [...bookings]
      .map((booking) => ({
        ...booking,
        userName: booking.userName || booking.buyerName || 'Guest',
        eventName: booking.eventName || booking.name || '',
        bookingDate: booking.bookingDate || booking.bookedAt || new Date().toISOString(),
      }))
      .sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate))
      .slice(0, 5),
    [bookings]
  )

  const stats = [
    { label: 'Active Events', value: upcomingEvents.length },
    { label: 'Total Bookings', value: bookings.length },
    { label: 'Total Users', value: users.length },
    { label: 'Total Revenue', value: `$${totalRevenue}` },
  ]

  const handleFormChange = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleSaveEvent = (event) => {
    event.preventDefault()
    const nextEvent = {
      ...form,
      id: editingId || Date.now(),
      price: Number(form.price),
      seats: Number(form.seats),
      image: form.image || 'https://via.placeholder.com/120',
    }

    if (editingId) {
      setEvents((current) => {
        const updated = current.map((item) => (item.id === editingId ? nextEvent : item))
        saveEvents(updated)
        return updated
      })
    } else {
      setEvents((current) => {
        const updated = [nextEvent, ...current]
        saveEvents(updated)
        return updated
      })
    }

    setEditingId(null)
    setForm(emptyEvent)
  }

  const handleEditEvent = (event) => {
    setEditingId(event.id)
    setForm({
      name: event.name,
      date: event.date,
      time: event.time,
      location: event.location,
      price: event.price,
      seats: event.seats,
      description: event.description,
      image: event.image,
    })
    setActiveSection('events')
  }

  const handleDeleteEvent = (id) => {
    setEvents((current) => {
      const updated = current.filter((item) => item.id !== id)
      saveEvents(updated)
      return updated
    })
  }

  const handleUpdateBookingStatus = (id, status) => {
    setBookings((current) => {
      const updated = current.map((booking) => (booking.id === id ? { ...booking, status } : booking))
      saveBookings(updated)
      return updated
    })
  }

  const handleDeleteUser = (id) => {
    setUsers((current) => {
      const updated = current.filter((user) => user.id !== id)
      saveUsers(updated)
      return updated
    })
  }

  const handleToggleBlock = (id) => {
    setUsers((current) => {
      const updated = current.map((user) => (user.id === id ? { ...user, blocked: !user.blocked } : user))
      saveUsers(updated)
      return updated
    })
  }

  return (
    <div style={styles.page}>
      <Sidebar activeSection={activeSection} onChange={setActiveSection} />
      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Admin Dashboard</h1>
            <p style={styles.description}>A minimal event management admin interface built with React.</p>
          </div>
        </header>

        {activeSection === 'dashboard' && (
          <section style={styles.section}>
            <StatsCards stats={stats} />
            <div style={styles.gridTwo}> 
              <div style={styles.card}>
                <h2>Upcoming Events</h2>
                <ul style={styles.list}>
                  {upcomingEvents.length ? (
                    upcomingEvents.map((item) => (
                      <li key={item.id} style={styles.listItem}>
                        <strong>{item.name}</strong> • {item.date} • {item.location}
                      </li>
                    ))
                  ) : (
                    <li style={styles.listItem}>No upcoming events</li>
                  )}
                </ul>
              </div>
              <div style={styles.card}>
                <h2>Newly Booked</h2>
                <ul style={styles.list}>
                  {recentBookings.length ? (
                    recentBookings.map((booking) => (
                      <li key={booking.id} style={styles.listItem}>
                        <strong>{booking.userName}</strong> booked <strong>{booking.eventName}</strong> ({booking.tickets} ticket(s))
                      </li>
                    ))
                  ) : (
                    <li style={styles.listItem}>No recent bookings</li>
                  )}
                </ul>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'events' && (
          <section style={styles.section}>
            <div style={styles.subHeader}>
              <h2>Events Management</h2>
              <p>Add, edit, or remove events from the system.</p>
            </div>
            <form style={styles.form} onSubmit={handleSaveEvent}>
              <div style={styles.formRow}>
                <input
                  style={styles.input}
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  required
                />
                <input
                  style={styles.input}
                  type="date"
                  value={form.date}
                  onChange={(e) => handleFormChange('date', e.target.value)}
                  required
                />
                <input
                  style={styles.input}
                  type="time"
                  value={form.time}
                  onChange={(e) => handleFormChange('time', e.target.value)}
                  required
                />
              </div>
              <div style={styles.formRow}>
                <input
                  style={styles.input}
                  placeholder="Location"
                  value={form.location}
                  onChange={(e) => handleFormChange('location', e.target.value)}
                  required
                />
                <input
                  style={styles.input}
                  placeholder="Price"
                  type="number"
                  value={form.price}
                  onChange={(e) => handleFormChange('price', e.target.value)}
                  required
                />
                <input
                  style={styles.input}
                  placeholder="Seats"
                  type="number"
                  value={form.seats}
                  onChange={(e) => handleFormChange('seats', e.target.value)}
                  required
                />
              </div>
              <textarea
                style={styles.textarea}
                placeholder="Description"
                value={form.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                required
              />
              <input
                style={styles.input}
                placeholder="Image URL"
                value={form.image}
                onChange={(e) => handleFormChange('image', e.target.value)}
              />
              <button type="submit" style={styles.submitButton}>
                {editingId ? 'Save Changes' : 'Add Event'}
              </button>
            </form>
            <div style={styles.tableSection}>
              <EventsTable events={events} onEdit={handleEditEvent} onDelete={handleDeleteEvent} />
            </div>
          </section>
        )}

        {activeSection === 'bookings' && (
          <section style={styles.section}>
            <div style={styles.subHeader}>
              <h2>Bookings Management</h2>
              <p>Update booking status and review all orders.</p>
            </div>
            <BookingsTable bookings={bookings} onUpdateStatus={handleUpdateBookingStatus} />
          </section>
        )}

        {activeSection === 'users' && (
          <section style={styles.section}>
            <div style={styles.subHeader}>
              <h2>Users Management</h2>
              <p>View customers and organizers, block or remove accounts.</p>
            </div>
            <UsersTable users={users} onDelete={handleDeleteUser} onToggleBlock={handleToggleBlock} />
          </section>
        )}
      </main>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'grid',
    gridTemplateColumns: '280px 1fr',
    gap: 24,
    padding: 24,
    background: '#eef1fb',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  header: {
    padding: 24,
    borderRadius: 24,
    background: '#fff',
    boxShadow: '0 20px 45px rgba(41, 53, 108, 0.08)',
  },
  title: {
    margin: 0,
    fontSize: 32,
    color: '#1a2240',
  },
  description: {
    marginTop: 8,
    color: '#66708b',
    fontSize: 16,
  },
  section: {
    display: 'grid',
    gap: 24,
  },
  card: {
    padding: 22,
    borderRadius: 24,
    background: '#fff',
    boxShadow: '0 20px 45px rgba(41, 53, 108, 0.08)',
  },
  gridTwo: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 18,
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: '18px 0 0',
    display: 'grid',
    gap: 12,
  },
  listItem: {
    padding: 16,
    borderRadius: 14,
    background: '#f8f9ff',
    color: '#32416a',
  },
  subHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  form: {
    display: 'grid',
    gap: 16,
    padding: 24,
    borderRadius: 24,
    background: '#fff',
    boxShadow: '0 20px 45px rgba(41, 53, 108, 0.08)',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: 16,
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 14,
    border: '1px solid #d7dbe5',
    fontSize: 15,
    color: '#f1f2f4',
  },
  textarea: {
    width: '100%',
    minHeight: 100,
    padding: '14px 16px',
    borderRadius: 14,
    border: '1px solid #d7dbe5',
    fontSize: 15,
    color: '#1a2240',
  },
  submitButton: {
    width: 180,
    padding: '14px 16px',
    borderRadius: 16,
    border: 'none',
    background: '#4e73df',
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
  },
  tableSection: {
    display: 'grid',
    gap: 18,
  },
}
