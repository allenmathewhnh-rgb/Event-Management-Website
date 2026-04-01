import React from 'react'

export default function UsersTable({ users, onDelete, onToggleBlock }) {
  return (
    <div style={styles.tableWrapper}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="6" style={styles.empty}>No users available</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.username || user.name || 'Unknown'}</td>
                <td>{user.name || user.username || 'Unknown'}</td>
                <td>{user.email}</td>
                <td>{user.phone || 'N/A'}</td>
                <td>{user.role}</td>
                <td>{user.blocked ? 'Blocked' : 'Active'}</td>
                <td>
                  <button style={styles.button} onClick={() => onToggleBlock(user.id)}>
                    {user.blocked ? 'Unblock' : 'Block'}
                  </button>
                  <button style={{ ...styles.button, ...styles.delete }} onClick={() => onDelete(user.id)}>
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
    minWidth: 840,
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
