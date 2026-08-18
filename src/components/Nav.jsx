import { NavLink } from 'react-router-dom'

export default function Nav() {
  return (
    <nav className="site-nav">
      <div className="wrap">
        <NavLink className="logo" to="/">Att<em>i</em>re</NavLink>
        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
            Lookbook
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>
            About / Contact
          </NavLink>
        </div>
      </div>
    </nav>
  )
}
