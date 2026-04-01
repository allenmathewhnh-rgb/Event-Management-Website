import React from 'react'

export default function EventsTable({ events, onEdit, onDelete }) {
  return (
    <div style={styles.tableWrapper}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Location</th>
            <th>Price</th>
            <th>Seats</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.length === 0 ? (
            <tr>
              <td colSpan="8" style={styles.empty}>No events available</td>
            </tr>
          ) : (
            events.map((event) => (
              <tr key={event.id}>
                <td>{event.name}</td>
                <td>{event.date}</td>
                <td>{event.time}</td>
                <td>{event.location}</td>
                <td>${event.price}</td>
                <td>{event.seats}</td>
                <td>{event.description}</td>
                <td>
                  <button style={styles.button} onClick={() => onEdit(event)}>
                    Edit
                  </button>
                  <button style={{ ...styles.button, ...styles.delete }} onClick={() => onDelete(event.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

const styles = {
  tableWrapper: {
    overflowX: 'auto',
    borderRadius: 20,
    background: '#fff',
    boxShadow: '0 20px 45px rgba(41, 53, 108, 0.08)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: 900,
  },
  empty: {
    padding: 24,
    textAlign: 'center',
    color: '#66708b',
  },
  button: {
    marginRight: 8,
    marginBottom: 6,
    padding: '8px 12px',
    border: 'none',
    borderRadius: 12,
    background: '#4e73df',
    color: '#fff',
    cursor: 'pointer',
  },
  delete: {
    background: '#bf2b38',
  },
}
