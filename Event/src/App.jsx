
import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Carousel from './components/carousel'
import EventCards from './components/EventCards'
import ForYou from './pages/ForYou'
import Events from './pages/Events'
import Movies from './pages/Movies'
import Activities from './pages/Activities'
import Play from './pages/Play'
import AdminPage from './pages/AdminPage'
import UserPage from './pages/UserPage'
import Footer from './components/Footer'
import Login from './components/Login'
import Register from './components/Register'

function Home() {
  return (
    <>
      <Carousel />
      <EventCards />
    </>
  )
}

function App() {
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  const openLogin = () => { setShowRegister(false); setShowLogin(true) }
  const openRegister = () => { setShowLogin(false); setShowRegister(true) }
  const closeAll = () => { setShowLogin(false); setShowRegister(false) }

  return (
    <div style={{ minHeight: '100vh', background: '#dcdce8' }}>
      <Navbar onLoginClick={openLogin} onRegisterClick={openRegister} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/foryou" element={<ForYou />} />
        <Route path="/events" element={<Events />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/my-bookings" element={<Play />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/user" element={<UserPage />} />
      </Routes>

      <Footer />

      {showLogin && (
        <div className="overlay" onClick={closeAll}>
          <div onClick={(e) => e.stopPropagation()}>
            <Login onSwitchToRegister={openRegister} onClose={closeAll} />
          </div>
        </div>
      )}

      {showRegister && (
        <div className="overlay" onClick={closeAll}>
          <div onClick={(e) => e.stopPropagation()}>
            <Register onSwitchToLogin={openLogin} onClose={closeAll} />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
