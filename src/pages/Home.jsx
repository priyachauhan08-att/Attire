import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { OUTFITS, BRAND } from '../data.js'
import Tag from '../components/Tag.jsx'
import OutfitCard from '../components/OutfitCard.jsx'
import HeroCarousel from '../components/HeroCarousel.jsx'


export default function Home() {

  const [currentHero, setCurrentHero] = useState(OUTFITS[0])
  const [outfits, setOutfits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/api/products`)
      .then(res => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`)
        return res.json()
      })
      .then(data => setOutfits(Array.isArray(data) ? data : []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleImageChange = (image) => {
    const outfit = OUTFITS.find(
      (outfit) => outfit.id === image.id
    )

    if (outfit) {
      setCurrentHero(outfit)
    }
  }

  return (
    <>
      <header className="hero">
        <div className="wrap">

          <div className="hero-copy">

            <span className="eyebrow">
              Curated from our Pinterest boards
            </span>

            <h1>
              Outfit inspo, <em>one tap</em> from your cart.
            </h1>

            <p>
              Every look on this page is real, shoppable,
              and priced out item by item — no guessing
              where the boots are from.
            </p>

            <div className="hero-cta">

              <Link
                className="btn solid"
                to={`/look/${currentHero.id}`}
              >
                View this look
              </Link>

              <a
                className="btn pin"
                href={BRAND.pinterestUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Follow on Pinterest
              </a>

            </div>

          </div>

          <div className="hero-img-wrap">

            <HeroCarousel
              onImageChange={handleImageChange}
            />

            <Tag
              look={currentHero.look}
              price={currentHero.items.reduce(
                (sum, item) => sum + item.price,
                0
              )}
            />

          </div>

        </div>
      </header>

      <main className="wrap" id="lookbook" style={{ scrollMarginTop: 100 }}>

        <div className="section-head">
          <div>
            <span className="eyebrow">
              Currently pinning
            </span>

            <h2>The lookbook</h2>
          </div>

          <span className="count">{outfits.length} looks</span>
        </div>

        <section className="outfit-grid">
          {loading ? <p>Loading looks…</p> : error ? <p>Couldn't load looks: {error}</p> : outfits.map((outfit) => (
            <OutfitCard key={outfit._id} outfit={outfit} />
          ))}
        </section>
      </main>
    </>
  )
}