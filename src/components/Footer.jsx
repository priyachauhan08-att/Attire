import { Link } from 'react-router-dom'
import { BRAND } from '../data.js'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div>
          <Link className="logo" to="/">Att<em>i</em>re</Link>
          <p style={{ color: '#8a8578', fontSize: 13, marginTop: 10, maxWidth: '32ch' }}>
            Outfit ideas, sourced and shoppable. Updated whenever a new pin earns its place.
          </p>
        </div>
        <div className="footer-links">
          <Link to="/">Lookbook</Link>
          <Link to="/about">About</Link>
          <a href={BRAND.pinterestUrl} target="_blank" rel="noopener noreferrer">Pinterest</a>
          <a href={`mailto:${BRAND.contactEmail}`}>Contact</a>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="wrap">
          <span>© 2026 Attire</span>
          <span>Site built for curation, not for scale</span>
        </div>
      </div>
    </footer>
  )
}
