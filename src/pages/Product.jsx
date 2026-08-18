import { useEffect } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { OUTFITS, money, outfitTotal } from '../data.js'
import Tag from '../components/Tag.jsx'
import OutfitCard from '../components/OutfitCard.jsx'

export default function Product() {
  const { lookId } = useParams()
  const outfit = OUTFITS.find((o) => o.id === lookId)

  useEffect(() => {
    if (outfit) document.title = `${outfit.title} — Attire`
  }, [outfit])

  if (!outfit) return <Navigate to="/" replace />

  const total = outfitTotal(outfit)
  const moreLooks = OUTFITS.filter((o) => o.id !== outfit.id).slice(0, 3)

  return (
    <main className="wrap product-section">
      <Link className="back-link" to="/">← All looks</Link>

      <div className="product-layout">
        <div className="product-img-wrap">
          <img src={outfit.coverImage} alt={outfit.title} />
          <Tag look={outfit.look} price={total} />
        </div>

        <div className="product-info">
          <p id="product-season">{outfit.season}</p>
          <h1>{outfit.title}</h1>
          <p id="product-blurb">{outfit.blurb}</p>

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
                <a className="btn solid item-buy" href={item.buyUrl} target="_blank" rel="noopener noreferrer">
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
            <a className="btn pin" href={outfit.pinUrl} target="_blank" rel="noopener noreferrer">
              See it on Pinterest
            </a>
            <Link className="btn" to="/">More looks like this</Link>
          </div>
        </div>
      </div>

      <section className="more-looks">
        <div className="section-head">
          <div>
            <span className="eyebrow">Keep browsing</span>
            <h2>Other looks</h2>
          </div>
        </div>
        <div className="more-grid">
          {moreLooks.map((o) => (
            <OutfitCard key={o.id} outfit={o} small showSeason={false} />
          ))}
        </div>
      </section>
    </main>
  )
}
