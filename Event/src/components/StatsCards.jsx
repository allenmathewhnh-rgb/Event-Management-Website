import React from 'react'

export default function StatsCards({ stats }) {
  return (
    <div style={styles.grid}>
      {stats.map((item) => (
        <div key={item.label} style={styles.card}>
          <p style={styles.label}>{item.label}</p>
          <strong style={styles.value}>{item.value}</strong>
          {item.note && <p style={styles.note}>{item.note}</p>}
        </div>
      ))}
    </div>
  )
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: 18,
  },
  card: {
    padding: 22,
    borderRadius: 22,
    background: '#fff',
    boxShadow: '0 20px 45px rgba(41, 53, 108, 0.08)',
  },
  label: {
    margin: 0,
    color: '#66708b',
    fontSize: 0.95,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  value: {
    marginTop: 12,
    fontSize: 32,
    color: '#1a2240',
  },
  note: {
    marginTop: 10,
    color: '#5a6483',
    fontSize: 0.95,
  },
}
