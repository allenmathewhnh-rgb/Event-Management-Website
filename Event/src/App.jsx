
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Carousel from './components/carousel'
import EventCards from './components/EventCards'
import ForYou from './pages/ForYou'
import Events from './pages/Events'
import Movies from './pages/Movies'
import Activities from './pages/Activities'
import Play from './pages/Play'

function Home() {
  return (
    <>
      <Carousel />
      <EventCards />
    </>
  )
}

function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#dcdce8' }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/foryou" element={<ForYou />} />
        <Route path="/events" element={<Events />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/play" element={<Play />} />
      </Routes>
    </div>
  )
}

export default App