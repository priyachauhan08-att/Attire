import { Link } from 'react-router-dom'
import { OUTFITS, BRAND } from '../data.js'
import Tag from '../components/Tag.jsx'
import OutfitCard from '../components/OutfitCard.jsx'
import HeroCarousel from '../components/HeroCarousel.jsx'

export default function Home() {
  const hero = OUTFITS[0]

  return (
    <>
      <header className="hero">
        <div className="wrap">
          <div className="hero-copy">
            <span className="eyebrow">Curated from our Pinterest boards</span>
            <h1>Outfit inspo, <em>one tap</em> from your cart.</h1>
            <p>Every look on this page is real, shoppable, and priced out item by item — no guessing where the boots are from.</p>
            <div className="hero-cta">
              <Link className="btn solid" to={`/look/${hero.id}`}>View this look</Link>
              <a className="btn pin" href={BRAND.pinterestUrl} target="_blank" rel="noopener noreferrer">
                Follow on Pinterest
              </a>
            </div>
          </div>
          <div className="hero-img-wrap">
            <HeroCarousel />
            <Tag look={hero.look} price={hero.items.reduce((s, i) => s + i.price, 0)} />
          </div>
        </div>
      </header>

      <main className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">Currently pinning</span>
            <h2>The lookbook</h2>
          </div>
          <span className="count">{OUTFITS.length} looks</span>
        </div>

        <section className="outfit-grid">
          {OUTFITS.map((outfit) => (
            <OutfitCard key={outfit.id} outfit={outfit} />
          ))}
        </section>
      </main>
    </>
  )
}
