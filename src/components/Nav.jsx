import { NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

export default function Nav() {

  const navigate = useNavigate()

  const handleLookbookClick = () => {
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
        <NavLink className="logo" to="/">Att<em>i</em>re</NavLink>
        <div className="nav-links">
            <button onClick={handleLookbookClick} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", margin: 0, font: "inherit", color: "inherit" }}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'active' : ''
            }
          >
              Lookbook
              </NavLink>
            </button>
                        <button style={{ background: "none", border: "none", padding: 0, cursor: "pointer", margin: 0, font: "inherit", color: "inherit" }}>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>
            About / Contact
          </NavLink>
            </button>
        </div>
      </div>
    </nav>
  )
}
