/** Hero slides for the home page — venues, conferences, and live experiences (event-management tone). */
const SLIDES = [
  {
    src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1920&q=85',
    alt: 'Audience at a large indoor event and conference',
  },
  {
    src: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1920&q=85',
    alt: 'Professional conference and seminar seating',
  },
  {
    src: 'https://images.unsplash.com/photo-1470229722913-7c0a75b90108?auto=format&fit=crop&w=1920&q=85',
    alt: 'Live stage lighting at a concert or showcase event',
  },
]

function Carousel() {
  return (
    <div id="carouselExampleInterval" className="carousel slide" data-bs-ride="carousel" style={{ marginTop: '0px' }}>
      <div className="carousel-inner">

        <div className="carousel-item active" data-bs-interval="3000">
          <img src={SLIDES[0].src} className="d-block w-100" alt={SLIDES[0].alt} style={{ height: '50vh', objectFit: 'cover' }} />
        </div>

        <div className="carousel-item" data-bs-interval="3000">
          <img src={SLIDES[1].src} className="d-block w-100" alt={SLIDES[1].alt} style={{ height: '50vh', objectFit: 'cover' }} />
        </div>

        <div className="carousel-item" data-bs-interval="3000">
          <img src={SLIDES[2].src} className="d-block w-100" alt={SLIDES[2].alt} style={{ height: '50vh', objectFit: 'cover' }} />
        </div>

      </div>

      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
        <span className="carousel-control-prev-icon"></span>
        <span className="visually-hidden">Previous</span>
      </button>

      <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
        <span className="carousel-control-next-icon"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  )
}

export default Carousel
