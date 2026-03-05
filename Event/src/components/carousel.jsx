import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import img1 from '../assets/img1.jpg'
import img2 from '../assets/img2.jpg'
import img3 from '../assets/img3.jpg'

function Carousel() {
  return (
    <div id="carouselExampleInterval" className="carousel slide" data-bs-ride="carousel" style={{ marginTop: '0px' }}>
      <div className="carousel-inner">

        <div className="carousel-item active" data-bs-interval="3000">
          <img src={img1} className="d-block w-100" alt="slide1" style={{ height: '90vh', objectFit: 'cover' }} />
        </div>

        <div className="carousel-item" data-bs-interval="3000">
          <img src={img2} className="d-block w-100" alt="slide2" style={{ height: '90vh', objectFit: 'cover' }} />
        </div>

        <div className="carousel-item" data-bs-interval="3000">
          <img src={img3} className="d-block w-100" alt="slide3" style={{ height: '90vh', objectFit: 'cover' }} />
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