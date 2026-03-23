
import './Footer.css'
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-section">
          <h3>Eventure</h3>
          <p>Your gateway to amazing events and experiences.</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li>Home</li>
            <li>Events</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Follow Us</h4>
          <p>Instagram</p>
          <p>Facebook</p>
          <p>Twitter</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 Eventure. All rights reserved.</p>
      </div>

    </footer>
  );
}

export default Footer;