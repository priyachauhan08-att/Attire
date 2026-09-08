import { useEffect, useState } from 'react'
import OutfitCard from './OutfitCard.jsx'

export default function TrendingSection({ title, endpoint, limit = 3 }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products/${endpoint}?limit=${limit}`)
      .then(res => res.json())
      .then(data => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
  }, [endpoint, limit])

  if (items.length === 0) return null

  return (
    <section className="outfit-grid-wrap" style={{ marginTop: 64 }}>
      <div className="section-head">
        <div>
          <span className="eyebrow">Trending</span>
          <h2>{title}</h2>
        </div>
      </div>
      <div className="more-grid">
        {items.map((o) => (
          <OutfitCard key={o._id} outfit={o} small showSeason={false} />
        ))}
      </div>
    </section>
  )
}