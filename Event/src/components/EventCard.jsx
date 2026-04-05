import { useEffect, useState } from 'react'
import { FALLBACK_EVENT_IMAGE, resolveEventImageSrc } from '../utils/storage'

export default function EventCard({ event, onSelect }) {
  const [imgSrc, setImgSrc] = useState(() => resolveEventImageSrc(event))

  useEffect(() => {
    setImgSrc(resolveEventImageSrc(event))
  }, [event?.id, event?.image, event?.imageUrl])

  return (
    <article style={styles.card} onClick={() => onSelect?.(event)}>
      <img
        src={imgSrc}
        alt={event.name}
        style={styles.image}
        loading="lazy"
        decoding="async"
        onError={() => setImgSrc(FALLBACK_EVENT_IMAGE)}
      />
      <div style={styles.body}>
        <div>
          <h3 style={styles.title}>{event.name}</h3>
          <p style={styles.meta}>{event.date} • {event.location}</p>
        </div>
        <button type="button" style={styles.button} onClick={(e) => { e.stopPropagation(); onSelect?.(event) }}>
          View / Book
        </button>
      </div>
    </article>
  )
}

const styles = {
  card: {
    display: 'grid',
    gridTemplateRows: 'auto 1fr',
    borderRadius: 20,
    overflow: 'hidden',
    background: '#fff',
    boxShadow: '0 20px 45px rgba(41, 53, 108, 0.08)',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  },
  image: {
    width: '100%',
    height: 180,
    objectFit: 'cover',
    background: '#e8ecf4',
  },
  body: {
    padding: 18,
    display: 'grid',
    gap: 14,
  },
  title: {
    margin: 0,
    fontSize: 18,
    color: '#1a2240',
  },
  meta: {
    margin: 0,
    color: '#66708b',
    fontSize: 14,
  },
  button: {
    justifySelf: 'start',
    padding: '10px 16px',
    borderRadius: 14,
    border: 'none',
    background: '#4e73df',
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
  },
}
