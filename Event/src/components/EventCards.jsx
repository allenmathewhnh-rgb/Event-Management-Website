import './EventCards.css'
import img1 from '../assets/img1.jpg'
import img2 from '../assets/img2.jpg'

function EventCards() {
  const events = [
    { id: 1, title: 'City Lights Concert', location: 'Harbor View Arena', price: '₹1,250 onwards', time: 'Fri, 7:30 PM', offer: 'Early Bird: 20% off', img: img1 },
    { id: 2, title: 'Midnight Jazz Night', location: 'Blue Note Club', price: '₹899 onwards', time: 'Sat, 9:00 PM', offer: '2-for-1 on standard seats', img: img2 },
    { id: 3, title: 'Foodie Fiesta', location: 'Garden Square', price: '₹499 onwards', time: 'Sun, 12:00 PM', offer: 'Free dessert with VIP pass', img: img1 },
    { id: 4, title: 'Comedy Gala', location: 'Laughter Lounge', price: '₹699 onwards', time: 'Sat, 8:00 PM', offer: 'Student discount available', img: img2 },
    { id: 5, title: 'Fashion & Music Expo', location: 'Metro Convention Centre', price: '₹1,799 onwards', time: 'Apr 12, 2026', offer: 'Limited early access', img: img1 },
  ]

  const artists = [
    { id: 1, name: 'Arijit Singh', genre: 'Bollywood Live', price: '₹1500 onwards', date: 'April 20, 2026', img: img1 },
    { id: 2, name: 'Nucleya', genre: 'Electronic / Bass', price: '₹799 onwards', date: 'May 5, 2026', img: img2 },
    { id: 3, name: 'Prateek Kuhad', genre: 'Indie Folk', price: '₹999 onwards', date: 'May 18, 2026', img: img1 },
    { id: 4, name: 'When Chai Met Toast', genre: 'Indie Pop', price: '₹599 onwards', date: 'June 1, 2026', img: img1 },
    { id: 5, name: 'Ritviz', genre: 'Electronic / Pop', price: '₹699 onwards', date: 'June 15, 2026', img: img1 },
  ]

  const artist = [
    { id: 1, name: 'Arijit Singh', genre: 'Bollywood Live', price: '₹1500 onwards', date: 'April 20, 2026', img: img1 },
    { id: 2, name: 'Nucleya', genre: 'Electronic / Bass', price: '₹799 onwards', date: 'May 5, 2026', img: img1 },
    { id: 3, name: 'Prateek Kuhad', genre: 'Indie Folk', price: '₹999 onwards', date: 'May 18, 2026', img: img1 },
    { id: 4, name: 'When Chai Met Toast', genre: 'Indie Pop', price: '₹599 onwards', date: 'June 1, 2026', img: img1 },
    { id: 5, name: 'Ritviz', genre: 'Electronic / Pop', price: '₹699 onwards', date: 'June 15, 2026', img: img1 },
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