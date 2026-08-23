import { Link } from 'react-router-dom'
import Tag from './Tag.jsx'
import { outfitTotal } from '../data.js'

export default function OutfitCard({ outfit, small = false, showSeason = true }) {
  return (
    <Link target="_self" className={`look-card${small ? ' small' : ''}`} to={`/look/${outfit.id}`}>
      <div className="look-card-img" style={{ aspectRatio: small ? '1 / 1' : '3 / 4', borderRadius: small ? 3 : 8 }}>
        <img src={outfit.coverImage} alt={`${outfit.title} — full outfit`} loading="lazy" />
        <Tag
          className="card-tag"
          look={outfit.look}
          price={small ? undefined : outfitTotal(outfit)}
        />
      </div>
      <div className="look-card-meta">
        <h3>{outfit.title}</h3>
        {showSeason && <p className="eyebrow">{outfit.season}</p>}
      </div>
    </Link>
  )
}
