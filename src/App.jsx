import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Product from './pages/Product.jsx'
import About from './pages/About.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'

export default function App() {
  return (
    <>
      <Nav />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/look/:lookId" element={<Product />} />
        <Route path="/about" element={<About />} />
        <Route path="/adminLog" element={<AdminLogin />} />
        <Route path="/adminDash" element={<AdminDashboard />} />
      </Routes>
      <Footer />
    </>
  )
}
