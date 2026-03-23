import { useState, useEffect } from 'react'
import './MovieCarousel.css'
import Movie1 from '../assets/img1.jpg'
import Movie2 from '../assets/pinterest_2.jpg'
const slides = [
  {
    id: 1,
    title: "Ishqa'n De Lekhe",
    genres: "Romance, Drama",
    poster: Movie1,
  },
  {
    id: 2,
    title: "God Father",
    rating: "UA",
    genres: "Action, Thriller",
    poster: Movie2,
  },
    {
    id: 3,
    title: "Flow",
    rating: "UA13+",
    genres: "Romance, Drama",
    poster: Movie1,
  }
]

export default function MovieCarousel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [current])

  const slide = slides[current]

  return (
    <div className="carousel-wrap">
      <div className="carousel-blur" style={{ backgroundImage: `url(${slide.poster})` }} />
      <div className="carousel-overlay" />
      <div className="carousel-content">
        <div>
          <h1>{slide.title}</h1>
          <p>{slide.rating} | {slide.genres}</p>
          <button>Book now</button>
        </div>
        <img src={slide.poster} alt={slide.title} />
      </div>
    </div>
  )
}