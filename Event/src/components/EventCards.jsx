import './EventCards.css'

/** Card imagery for the home page — venues, stages, festivals, and gatherings (fits an event-management product). */
const IMG = {
  arena: 'https://images.unsplash.com/photo-1470229722913-7c0a75b90108?auto=format&fit=crop&w=900&q=82',
  club: 'https://images.unsplash.com/photo-1429962714451-bb289ec87bdf?auto=format&fit=crop&w=900&q=82',
  outdoor: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=82',
  theatre: 'https://images.unsplash.com/photo-1515169067860-29f206909fb2?auto=format&fit=crop&w=900&q=82',
  expo: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=82',
  crowd: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=82',
}

function EventCards() {
  const events = [
    { id: 1, title: 'City Lights Concert', location: 'Harbor View Arena', price: '₹1,250 onwards', time: 'Fri, 7:30 PM', offer: 'Early Bird: 20% off', img: IMG.arena },
    { id: 2, title: 'Midnight Jazz Night', location: 'Blue Note Club', price: '₹899 onwards', time: 'Sat, 9:00 PM', offer: '2-for-1 on standard seats', img: IMG.club },
    { id: 3, title: 'Foodie Fiesta', location: 'Garden Square', price: '₹499 onwards', time: 'Sun, 12:00 PM', offer: 'Free dessert with VIP pass', img: IMG.outdoor },
    { id: 4, title: 'Comedy Gala', location: 'Laughter Lounge', price: '₹699 onwards', time: 'Sat, 8:00 PM', offer: 'Student discount available', img: IMG.theatre },
    { id: 5, title: 'Fashion & Music Expo', location: 'Metro Convention Centre', price: '₹1,799 onwards', time: 'Apr 12, 2026', offer: 'Limited early access', img: IMG.expo },
  ]

  const artists = [
    { id: 1, name: 'Arijit Singh', genre: 'Bollywood Live', price: '₹1500 onwards', date: 'April 20, 2026', img: IMG.crowd },
    { id: 2, name: 'Nucleya', genre: 'Electronic / Bass', price: '₹799 onwards', date: 'May 5, 2026', img: IMG.arena },
    { id: 3, name: 'Prateek Kuhad', genre: 'Indie Folk', price: '₹999 onwards', date: 'May 18, 2026', img: IMG.club },
    { id: 4, name: 'When Chai Met Toast', genre: 'Indie Pop', price: '₹599 onwards', date: 'June 1, 2026', img: IMG.outdoor },
    { id: 5, name: 'Ritviz', genre: 'Electronic / Pop', price: '₹699 onwards', date: 'June 15, 2026', img: IMG.expo },
  ]

  const artist = [
    { id: 1, name: 'Arijit Singh', genre: 'Bollywood Live', price: '₹1500 onwards', date: 'April 20, 2026', img: IMG.arena },
    { id: 2, name: 'Nucleya', genre: 'Electronic / Bass', price: '₹799 onwards', date: 'May 5, 2026', img: IMG.arena },
    { id: 3, name: 'Prateek Kuhad', genre: 'Indie Folk', price: '₹999 onwards', date: 'May 18, 2026', img: IMG.arena },
    { id: 4, name: 'When Chai Met Toast', genre: 'Indie Pop', price: '₹599 onwards', date: 'June 1, 2026', img: IMG.arena },
    { id: 5, name: 'Ritviz', genre: 'Electronic / Pop', price: '₹699 onwards', date: 'June 15, 2026', img: IMG.arena },
  ]

  return (
    <div className="sections-wrapper">

      {/* EVENTS SECTION */}
      <div className="section">
        <h2 className="section-title">Crowd favourite activities</h2>
        <div className="cards-scroll">
          {events.map(function(event) {
            return (
              <div className="card" key={event.id}>
                <div className="card-img-wrapper">
                  <img src={event.img} alt={event.title} className="card-img" />
                  <div className="card-offer">🎟 {event.offer}</div>
                </div>
                <div className="card-body">
                  <p className="card-time">{event.time}</p>
                  <h3 className="card-title">{event.title}</h3>
                  <p className="card-location">{event.location}</p>
                  <p className="card-price">{event.price}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ARTISTS SECTION */}
      <div className="section">
        <h2 className="section-title">Top Artists Near You</h2>
        <div className="cards-scroll">
          {artists.map(function(artist) {
            return (
              <div className="card" key={artist.id}>
                <div className="card-img-wrapper">
                  <img src={artist.img} alt={artist.name} className="card-img" />
                  <div className="card-offer">🎤 Live Performance</div>
                </div>
                <div className="card-body">
                  <p className="card-time">{artist.genre}</p>
                  <h3 className="card-title">{artist.name}</h3>
                  <p className="card-location">{artist.date}</p>
                  <p className="card-price">{artist.price}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="section" style={{ position: 'relative' }}>
        <h2 className="section-title">Artists in your District</h2>
        <div className="cards-scroll">
          {artists.map(function(artist) {
            return (
              <div key={artist.id} className="artist-card">
                <img src={artist.img} alt={artist.name} className="artist-img" />
                <p className="artist-name">{artist.name}</p>
              </div>
            )
          })}
          
        </div>
        <button className="arrow-btn">›</button>
      </div>

    </div>
  )
}

export default EventCards