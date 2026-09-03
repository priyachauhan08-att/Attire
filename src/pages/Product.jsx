import { useEffect, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import Tag from '../components/Tag.jsx'
import OutfitCard from '../components/OutfitCard.jsx'
import SmartBgImage from '../components/SmartBgImage.jsx'

const money = (n) => `₹${n.toFixed(2)}`

export default function Product() {
  const { lookId } = useParams()
  const [outfit, setOutfit] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [moreLooks, setMoreLooks] = useState([])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products/${lookId}`)
      .then(res => {
        if (!res.ok) throw new Error('not found')
        return res.json()
      })
      .then(data => {
        setOutfit(data)
        document.title = `${data.name} — Attire`
      })
      .catch(() => setNotFound(true))

    fetch(`${import.meta.env.VITE_API_URL}/products`)
      .then(res => res.json())
      .then(all => setMoreLooks(all.filter(o => o._id !== lookId).slice(0, 3)))
  }, [lookId])

  if (notFound) return <Navigate to="/" replace />
  if (!outfit) return <p>Loading…</p>

  const total = outfit.items.reduce((sum, i) => sum + i.price, 0)

  return (
    <main className="wrap product-section">
      <Link className="back-link" to="/Attire">← All looks</Link>

      <div className="product-layout">
        <div className="product-img-wrap">
          <SmartBgImage src={outfit.mainImage} alt={outfit.name} style={{ width: '100%', height: '100%' }} />
        </div>
        <div className="product-info">
          {outfit.category && <p id="product-season">{outfit.category}</p>}
          <h1>{outfit.name}</h1>
          <p id="product-blurb">{outfit.description}</p>

          <div className="shop-head">
            <span>Shop this look</span>
            <span>{outfit.items.length} items</span>
          </div>

          <ul className="item-list">
            {outfit.items.map((item, i) => (
              <li className="item-row" key={i}>
                <img src={item.image} alt={item.name} loading="lazy" />
                <div className="item-info">
                  <p className="item-brand eyebrow">{item.brand}</p>
                  <p className="item-name">{item.name}</p>
                </div>
                <div className="item-price">{money(item.price)}</div>
                <a className="btn solid item-buy" href={item.buyUrl}
                  target="_blank" rel="sponsored noopener noreferrer">
                  Shop item →
                </a>
              </li>
            ))}
          </ul>

          <div className="product-total-row">
            <span>Full look, total</span>
            <b>{money(total)}</b>
          </div>

          <div className="pin-cta">
            <Link className="btn" to="/">More looks like this</Link>
          </div>
        </div>
      </div>

      <section className="more-looks">
        <div className="section-head">
          <div><span className="eyebrow">Keep browsing</span><h2>Other looks</h2></div>
        </div>
        <div className="more-grid">
          {moreLooks.map((o) => (
            <OutfitCard key={o._id} outfit={o} small showSeason={false} />
          ))}
        </div>
      </section>
    </main>
  )
}