# Attire — React

A shoppable outfit lookbook: browse curated looks, click into a look, and
buy each item directly. Built with React + React Router + Vite.

## Run it

```bash
npm install
npm run dev
```

Open the printed local URL. `npm run build` produces a static `dist/`
folder you can host anywhere (Netlify, Vercel, GitHub Pages, etc.).

## Project structure

```
src/
  data.js              <- EDIT THIS: your outfits, items, and brand info
  index.css            <- design system (colors, type, layout)
  App.jsx              <- routes
  main.jsx             <- app entry point
  components/
    Nav.jsx
    Footer.jsx
    Tag.jsx            <- the swing-tag signature element
    OutfitCard.jsx
  pages/
    Home.jsx            /            — hero + outfit grid
    Product.jsx          /look/:id    — outfit detail + shop links
    About.jsx             /about       — brand story + contact
```

## The only file you need to edit: `src/data.js`

Each outfit needs:

- `coverImage` / `pinUrl` — right-click a Pin on Pinterest → "Copy image
  address" for the image, and the pin's own URL for `pinUrl`.
- `items[]` — one entry per product: `name`, `brand`, `price`, `image`,
  and `buyUrl` (use your affiliate link if you have one — ShopStyle, LTK,
  Amazon Associates, etc.).

Add or remove outfits freely — the home grid, product pages, and "more
looks" strip all rebuild themselves from this array automatically.

Update the `BRAND` object at the bottom of the same file with your real
Pinterest URL and contact email — it feeds the nav, footer, hero, and
about page everywhere at once.

## Note on Pinterest

Pinterest doesn't offer a public feed for pulling an arbitrary account's
pins automatically — their API requires OAuth per user. So this site
displays your pins beautifully and links out to Pinterest/shops, but you
add the pin/image URLs into `data.js` yourself rather than the site
scraping your board live. Placeholder images (picsum.photos) are in
place so the app runs out of the box — swap them for your real pins.
