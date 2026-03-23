import { useEffect, useState } from 'react'
import './EventCarousel.css'
import img1 from '../assets/img1.jpg'
import img2 from '../assets/img2.jpg'
import img3 from '../assets/img3.jpg'

const slides = [
  {
    id: 1,
    title: 'Live Concert Nights',
    category: 'Music Event',
    details: 'Arijit Singh, Ritviz and more artists performing this season',
    image: img1,
  },
  {
    id: 2,
    title: 'Adventure Weekenders',
    category: 'Outdoor Activity',
    details: 'Go karting, gaming zones and high-energy experiences nearby',
    image: img2,
  },
  {
    id: 3,
    title: 'Comedy And Culture',
    category: 'Stage Show',
    details: 'Stand-up nights, theatre and local performances across the city',
    image: img3,
  },
]

export default function EventCarousel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [])

  const slide = slides[current]

  return (
    <section className="event-carousel">
      <div
        className="event-carousel__blur"
        style={{ backgroundImage: `url(${slide.image})` }}
      />
      <div className="event-carousel__overlay" />

      <div className="event-carousel__content">
        <div className="event-carousel__text">
          <span className="event-carousel__tag">{slide.category}</span>
          <h1>{slide.title}</h1>
          <p>{slide.details}</p>
          <button type="button">Explore events</button>
        </div>

        <img src={slide.image} alt={slide.title} className="event-carousel__image" />
      </div>
    </section>
  )
}
