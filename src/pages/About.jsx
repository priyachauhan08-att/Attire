import { BRAND } from '../data.js'

export default function About() {
  return (
    <>
      <header className="about-hero">
        <div className="wrap">
          <span className="eyebrow">About Attire</span>
          <h1>We save the outfits. You skip the searching.</h1>
        </div>
      </header>

      <main className="wrap about-layout">
        <div className="about-copy">
          <p>
            Attire started as a Pinterest board that got out of hand. Every outfit we pinned
            came with the same follow-up question — <em>okay, but where is that actually
            from</em> — so we started answering it, item by item, and this is where those
            answers live.
          </p>
          <p>
            Every look on this site is pulled from our own boards, then broken down piece by
            piece: the coat, the boots, the bag, the exact shade of everything. Click through
            and you land on the real product page, not a guess.
          </p>

          <h3>How it works</h3>
          <p>
            Browse the lookbook, open a look you like, and shop each item directly — or follow
            along on Pinterest to see outfits before they make it onto the site.
          </p>

          <h3>Get in touch</h3>
          <p>
            Have a brand you'd like featured, a broken link to report, or an outfit request?
            Email us or send a pin our way.
          </p>
        </div>

        <aside className="contact-card">
          <h3>Say hello</h3>
          <p>Fastest way to reach us is Pinterest — that's where new looks show up first.</p>
          <a className="btn pin" href={BRAND.pinterestUrl} target="_blank" rel="noopener noreferrer">
            Follow us on Pinterest
          </a>
          <a className="btn outline" href={`mailto:${BRAND.contactEmail}`}>
            Email us
          </a>
          <div className="contact-meta">
            <div>Email — {BRAND.contactEmail}</div>
            <div>Response time — 2–3 business days</div>
          </div>
        </aside>
      </main>
    </>
  )
}
