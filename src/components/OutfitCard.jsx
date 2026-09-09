import { Link } from 'react-router-dom'

export default function OutfitCard({ outfit, small = false, showSeason = true }) {
  const total = outfit.items.reduce((sum, item) => sum + item.price, 0)

  return (
    <Link target="_self" className={`look-card${small ? ' small' : ''}`} to={`/look/${outfit._id}`}>
      <div className="look-card-img" style={{ aspectRatio: small ? '1 / 1' : '3 / 4', borderRadius: small ? 3 : 8 }}>
        <img src={outfit.mainImage} alt={`${outfit.name} — full outfit`} loading="lazy" />
      </div>
      <div className="look-card-meta">
        <h3>{outfit.name}</h3>
        {showSeason && outfit.category && <p className="eyebrow">{outfit.category}</p>}
      </div>
    </Link>
  )
}