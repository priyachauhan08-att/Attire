import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

export default function Nav() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  const handleLookbookClick = () => {
    closeMenu()
    navigate('/')

    setTimeout(() => {
      document.getElementById('lookbook')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 100)
  }

  return (
    <nav className="site-nav">
      <div className="wrap">
        <NavLink className="logo" to="/" onClick={closeMenu}>
          Att<em>i</em>re
        </NavLink>

        <button
          className={`menu-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <button
            onClick={handleLookbookClick}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', margin: 0, font: 'inherit', color: 'inherit' }}
          >
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
              Lookbook
            </NavLink>
          </button>

          <button
            onClick={closeMenu}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', margin: 0, font: 'inherit', color: 'inherit' }}
          >
            <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>
              About / Contact
            </NavLink>
          </button>
        </div>
      </div>
    </nav>
  )
}