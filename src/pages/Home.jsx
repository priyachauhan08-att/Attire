import { useState, useEffect } from 'react'
import { OUTFITS, BRAND } from '../data.js'
import OutfitCard from '../components/OutfitCard.jsx'
import HeroCarousel from '../components/HeroCarousel.jsx'
import TrendingSection from '../components/TrendingSection.jsx'
import CategoryFilterDropdown from '../components/CategoryFilterDropdown.jsx'
import Skeleton from '@mui/material/Skeleton'

export default function Home() {

  const [currentHero, setCurrentHero] = useState(OUTFITS[0])
  const [outfits, setOutfits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const apiUrl = import.meta.env.VITE_API_URL;
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')


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

  useEffect(() => {
    fetch(`${apiUrl}/api/products/categories`)
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]))
  }, [])

  const filteredOutfits = selectedCategory === 'All'
    ? outfits
    : outfits.filter(o => o.category === selectedCategory)

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

          <span className="count">{filteredOutfits.length} looks</span>
        </div>

        <div className="filter-chips">
          <button
            className={`filter-chip ${selectedCategory === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('All')}
          >
            All
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="filter-select-wrap">
          <CategoryFilterDropdown
            categories={categories}
            selectedCategory={selectedCategory}
            onChange={setSelectedCategory}
          />
        </div>

        <section className="outfit-grid">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div className="look-card" key={`skeleton-${i}`}>
                <Skeleton
                  variant="rounded"
                  animation="wave"
                  className="look-card-img"
                  sx={{ aspectRatio: '3 / 4', borderRadius: '8px', width: '100%' }}
                />
                <div className="look-card-meta">
                  <Skeleton animation="wave" width="60%" height={22} sx={{ mt: 1 }} />
                  <Skeleton animation="wave" width="35%" height={16} />
                </div>
              </div>
            ))
          ) : error ? (
            <p>Couldn't load looks: {error}</p>
          ) : filteredOutfits.length === 0 ? (
            <p>No looks in this category yet.</p>
          ) : (
            filteredOutfits.map((outfit) => (
              <OutfitCard key={outfit._id} outfit={outfit} />
            ))
          )}
        </section>

        <TrendingSection title="Most Viewed Looks" endpoint="trending/viewed" limit={3} />
      </main>
    </>
  )
}