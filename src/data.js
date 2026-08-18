/* ============================================================
   ATTIRE — outfit data
   ------------------------------------------------------------
   This is the ONLY file you need to edit to run your own site.

   1. coverImage / pinUrl  -> right-click a Pin on Pinterest,
      "Copy image address" for coverImage, and the Pin's own
      URL (pinterest.com/pin/xxxxxxx) for pinUrl.
   2. items[]              -> one entry per product in the outfit.
      buyUrl is the direct product page (use your affiliate link
      if you have one, e.g. via ShopStyle, LTK, Amazon Associates).
   3. Add as many outfits as you like — the home page grid and
      product pages build themselves from this array.

   Placeholder images below are stand-ins so the site works out
   of the box — swap coverImage/itemImage for your real pins.
   ============================================================ */

export const OUTFITS = [
  {
    id: "amber-thread",
    look: "01",
    title: "Amber Thread",
    season: "Transitional / early autumn",
    blurb: "A rust knit layered over a slip dress, grounded by worn leather boots — built for the first cold morning of the season.",
    coverImage: "https://picsum.photos/seed/attire-amber/1200/1500",
    pinUrl: "https://www.pinterest.com/pin/000000000000000001/",
    items: [
      { name: "Ribbed Rust Cardigan", brand: "Néra Studio", price: 118, image: "https://picsum.photos/seed/attire-amber-1/400/500", buyUrl: "https://example.com/product/ribbed-rust-cardigan" },
      { name: "Bias-Cut Slip Dress", brand: "Maison Loam", price: 96, image: "https://picsum.photos/seed/attire-amber-2/400/500", buyUrl: "https://example.com/product/bias-slip-dress" },
      { name: "Worn Leather Ankle Boot", brand: "Fen & Rowe", price: 210, image: "https://picsum.photos/seed/attire-amber-3/400/500", buyUrl: "https://example.com/product/leather-ankle-boot" },
      { name: "Brushed Gold Hoop", brand: "Studio Vell", price: 42, image: "https://picsum.photos/seed/attire-amber-4/400/500", buyUrl: "https://example.com/product/brushed-gold-hoop" }
    ]
  },
  {
    id: "concrete-linen",
    look: "02",
    title: "Concrete & Linen",
    season: "High summer",
    blurb: "Oversized linen in a single tone, cut wide to move with the heat. One good sandal, one good bag, nothing else competing.",
    coverImage: "https://picsum.photos/seed/attire-concrete/1200/1500",
    pinUrl: "https://www.pinterest.com/pin/000000000000000002/",
    items: [
      { name: "Wide-Leg Linen Trouser", brand: "Casa Ovest", price: 132, image: "https://picsum.photos/seed/attire-concrete-1/400/500", buyUrl: "https://example.com/product/wide-leg-linen-trouser" },
      { name: "Boxy Linen Shirt", brand: "Casa Ovest", price: 88, image: "https://picsum.photos/seed/attire-concrete-2/400/500", buyUrl: "https://example.com/product/boxy-linen-shirt" },
      { name: "Woven Slide Sandal", brand: "Terra Piede", price: 74, image: "https://picsum.photos/seed/attire-concrete-3/400/500", buyUrl: "https://example.com/product/woven-slide-sandal" },
      { name: "Raffia Tote", brand: "Sur Market", price: 64, image: "https://picsum.photos/seed/attire-concrete-4/400/500", buyUrl: "https://example.com/product/raffia-tote" }
    ]
  },
  {
    id: "night-lacquer",
    look: "03",
    title: "Night Lacquer",
    season: "Evening",
    blurb: "A satin slip with sharp tailoring on top — the kind of outfit that reads dressed-up without trying to.",
    coverImage: "https://picsum.photos/seed/attire-lacquer/1200/1500",
    pinUrl: "https://www.pinterest.com/pin/000000000000000003/",
    items: [
      { name: "Satin Cowl Slip", brand: "Vesper Noir", price: 104, image: "https://picsum.photos/seed/attire-lacquer-1/400/500", buyUrl: "https://example.com/product/satin-cowl-slip" },
      { name: "Sharp-Shoulder Blazer", brand: "Fen & Rowe", price: 168, image: "https://picsum.photos/seed/attire-lacquer-2/400/500", buyUrl: "https://example.com/product/sharp-shoulder-blazer" },
      { name: "Point-Toe Mule", brand: "Studio Vell", price: 148, image: "https://picsum.photos/seed/attire-lacquer-3/400/500", buyUrl: "https://example.com/product/point-toe-mule" }
    ]
  },
  {
    id: "field-notes",
    look: "04",
    title: "Field Notes",
    season: "Weekend / daytime",
    blurb: "Workwear cotton, stacked layers, one utility bag. Built to survive errands and still look considered in photos.",
    coverImage: "https://picsum.photos/seed/attire-field/1200/1500",
    pinUrl: "https://www.pinterest.com/pin/000000000000000004/",
    items: [
      { name: "Cotton Chore Jacket", brand: "Néra Studio", price: 142, image: "https://picsum.photos/seed/attire-field-1/400/500", buyUrl: "https://example.com/product/cotton-chore-jacket" },
      { name: "Straight Denim", brand: "Casa Ovest", price: 98, image: "https://picsum.photos/seed/attire-field-2/400/500", buyUrl: "https://example.com/product/straight-denim" },
      { name: "Ribbed Tank", brand: "Maison Loam", price: 34, image: "https://picsum.photos/seed/attire-field-3/400/500", buyUrl: "https://example.com/product/ribbed-tank" },
      { name: "Canvas Field Bag", brand: "Sur Market", price: 86, image: "https://picsum.photos/seed/attire-field-4/400/500", buyUrl: "https://example.com/product/canvas-field-bag" }
    ]
  },
  {
    id: "cold-clay",
    look: "05",
    title: "Cold Clay",
    season: "Deep winter",
    blurb: "A terracotta coat as the whole outfit's reason for being — everything underneath is quiet on purpose.",
    coverImage: "https://picsum.photos/seed/attire-clay/1200/1500",
    pinUrl: "https://www.pinterest.com/pin/000000000000000005/",
    items: [
      { name: "Wool Overcoat, Clay", brand: "Vesper Noir", price: 320, image: "https://picsum.photos/seed/attire-clay-1/400/500", buyUrl: "https://example.com/product/wool-overcoat-clay" },
      { name: "Turtleneck, Charcoal", brand: "Maison Loam", price: 58, image: "https://picsum.photos/seed/attire-clay-2/400/500", buyUrl: "https://example.com/product/turtleneck-charcoal" },
      { name: "Tapered Wool Trouser", brand: "Fen & Rowe", price: 128, image: "https://picsum.photos/seed/attire-clay-3/400/500", buyUrl: "https://example.com/product/tapered-wool-trouser" },
      { name: "Leather Chelsea Boot", brand: "Terra Piede", price: 236, image: "https://picsum.photos/seed/attire-clay-4/400/500", buyUrl: "https://example.com/product/leather-chelsea-boot" }
    ]
  },
  {
    id: "salt-air",
    look: "06",
    title: "Salt Air",
    season: "Resort",
    blurb: "A crochet set that works from beach to lunch without a costume change. Barely-there jewelry, one strong bag.",
    coverImage: "https://picsum.photos/seed/attire-salt/1200/1500",
    pinUrl: "https://www.pinterest.com/pin/000000000000000006/",
    items: [
      { name: "Crochet Halter", brand: "Sur Market", price: 68, image: "https://picsum.photos/seed/attire-salt-1/400/500", buyUrl: "https://example.com/product/crochet-halter" },
      { name: "Crochet Maxi Skirt", brand: "Sur Market", price: 92, image: "https://picsum.photos/seed/attire-salt-2/400/500", buyUrl: "https://example.com/product/crochet-maxi-skirt" },
      { name: "Woven Flat Sandal", brand: "Terra Piede", price: 66, image: "https://picsum.photos/seed/attire-salt-3/400/500", buyUrl: "https://example.com/product/woven-flat-sandal" }
    ]
  }
];

/* ---------- brand / contact config ---------- */
export const BRAND = {
  pinterestUrl: "https://www.pinterest.com/yourusername/",
  instagramUrl: "",
  contactEmail: "hello@yourattire.com"
};

export const outfitTotal = (outfit) =>
  outfit.items.reduce((sum, i) => sum + i.price, 0);

export const money = (n) => "$" + n.toFixed(0);
