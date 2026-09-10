import { useEffect, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { LuHeart, LuShare2 } from 'react-icons/lu'
import OutfitCard from '../components/OutfitCard.jsx'
import CloudinaryImage from '../components/CloudinaryImage.jsx'

const money = (n) => `₹${n.toFixed(2)}`

const LIKED_KEY = 'attire_liked_looks'

function getLikedIds() {
  try {
    const raw = localStorage.getItem(LIKED_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function setLikedIds(ids) {
  try {
    localStorage.setItem(LIKED_KEY, JSON.stringify(ids))
  } catch {
    // localStorage unavailable (private browsing etc.) — fail silently
  }
}

export default function Product() {
  const { lookId } = useParams()
  const [outfit, setOutfit] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [moreLooks, setMoreLooks] = useState([])
  const [liked, setLiked] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products/${lookId}`)
      .then(res => {
        if (!res.ok) throw new Error('not found')
        return res.json()
      })
      .then(data => {
        setOutfit(data)
        document.title = `${data.name} — Attire`

        // Check if this look was already liked on this device
        setLiked(getLikedIds().includes(lookId))

        fetch(`${import.meta.env.VITE_API_URL}/api/products/${lookId}/view`, {
          method: 'PATCH',
        }).catch(() => { })

        fetch(`${import.meta.env.VITE_API_URL}/api/products`)
          .then(res => res.json())
          .then(all => {
            const sameCategory = all.filter(
              o => o._id !== lookId && o.category === data.category
            )
            setMoreLooks(sameCategory.slice(0, 3))
          })
      })
      .catch(() => setNotFound(true))
  }, [lookId])

  if (notFound) return <Navigate to="/" replace />
  if (!outfit) return <p>Loading…</p>

  const total = outfit.items.reduce((sum, i) => sum + i.price, 0)

  const trackClick = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products/${outfit._id}/click`, {
      method: 'PATCH',
    }).catch(() => { })
  }

  const toggleLike = () => {
    const ids = getLikedIds()
    const isLiked = ids.includes(lookId)

    const updated = isLiked
      ? ids.filter(id => id !== lookId)
      : [...ids, lookId]

    setLikedIds(updated)
    setLiked(!isLiked)
  }

  const handleShare = async () => {
    const shareData = {
      title: outfit.name,
      text: outfit.description,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        // user cancelled — do nothing
      }
    } else {
      await navigator.clipboard.writeText(window.location.href)
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2000)
    }
  }

  return (
    <main className="wrap product-section">
      <Link className="back-link" to="/">← All looks</Link>

      <div className="product-layout">
        <div className="product-img-wrap">
          <CloudinaryImage src={outfit.mainImage} alt={outfit.name} width={1000} style={{ width: '100%', height: '100%' }} />
        </div>
        <div className="product-info">
          {outfit.category && <p id="product-season">{outfit.category}</p>}
          <h1>{outfit.name}</h1>

          <div className="blurb-row">
            <p id="product-blurb">{outfit.description}</p>

            <div className="blurb-actions">
              <button
                className={`icon-btn ${liked ? 'liked' : ''}`}
                onClick={toggleLike}
                aria-label={liked ? 'Unlike' : 'Like'}
                title={liked ? 'Unlike' : 'Like'}
              >
                <LuHeart size={18} fill={liked ? 'currentColor' : 'none'} />
              </button>

              <button
                className="icon-btn"
                onClick={handleShare}
                aria-label="Share"
                title="Share"
              >
                <LuShare2 size={18} />
              </button>

              {shareCopied && <span className="share-toast">Link copied</span>}
            </div>
          </div>

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
                  target="_blank" rel="sponsored noopener noreferrer"
                  onClick={trackClick}>
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

      {moreLooks.length > 0 && (
        <section className="more-looks">
          <div className="section-head">
            <div><span className="eyebrow">Keep browsing</span><h2>You may like this</h2></div>
          </div>
          <div className="more-grid">
            {moreLooks.map((o) => (
              <OutfitCard key={o._id} outfit={o} small showSeason={false} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}