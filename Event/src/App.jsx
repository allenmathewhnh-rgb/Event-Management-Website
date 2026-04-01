
import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Carousel from './components/carousel'
import EventCards from './components/EventCards'
import ForYou from './pages/ForYou'
import Events from './pages/Events'
import Movies from './pages/Movies'
import Activities from './pages/Activities'
import Play from './pages/Play'
import ConfirmBooking from './pages/ConfirmBooking'
import Payment from './pages/Payment'
import AdminDashboard from './pages/AdminDashboard'
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
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [redirectPath, setRedirectPath] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const storedStatus = localStorage.getItem('isLoggedIn') === 'true'
    const storedUsername = localStorage.getItem('username') || ''
    setIsLoggedIn(storedStatus)
    setUsername(storedUsername)
  }, [])

  const openLogin = (path) => {
    setShowRegister(false)
    setShowLogin(true)
    if (path) setRedirectPath(path)
  }
  const openRegister = () => { setShowLogin(false); setShowRegister(true) }
  const closeAll = () => { setShowLogin(false); setShowRegister(false); setRedirectPath(null) }
  const handleLoginSuccess = (username) => {
    setIsLoggedIn(true)
    setUsername(username)
    localStorage.setItem('isLoggedIn', 'true')
    if (username) localStorage.setItem('username', username)
    setShowLogin(false)
    setShowRegister(false)
    if (redirectPath) {
      const path = redirectPath
      setRedirectPath(null)
      navigate(path)
    }
  }
  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername('')
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('username')
    localStorage.removeItem('ems_selected_event')
    navigate('/')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#dcdce8' }}>
      <Navbar
        onLoginClick={openLogin}
        onRegisterClick={openRegister}
        onLogout={handleLogout}
        isAuthenticated={isLoggedIn}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/foryou" element={<ForYou />} />
        <Route path="/events" element={<Events isAuthenticated={isLoggedIn} onRequireLogin={openLogin} />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/activities" element={<Activities />} />
        <Route
          path="/confirm"
          element={isLoggedIn ? <ConfirmBooking /> : <Navigate to="/" />}
        />
        <Route
          path="/payment"
          element={isLoggedIn ? <Payment /> : <Navigate to="/" />}
        />
        <Route
          path="/my-bookings"
          element={isLoggedIn ? <Play /> : <Navigate to="/" />}
        />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/user" element={<UserPage currentUsername={username} />} />
      </Routes>

      <Footer />

      {showLogin && (
        <div className="overlay" onClick={closeAll}>
          <div onClick={(e) => e.stopPropagation()}>
            <Login
              onSwitchToRegister={openRegister}
              onClose={closeAll}
              onLoginSuccess={handleLoginSuccess}
            />
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
