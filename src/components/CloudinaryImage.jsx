import { useState } from 'react'

/**
 * Inserts a Cloudinary transformation string into an existing
 * Cloudinary URL, right after "/upload/".
 * If the URL isn't a Cloudinary URL, it's returned unchanged (safe fallback).
 */
function withTransform(src, transform) {
  if (!src || !src.includes('/upload/')) return src
  return src.replace('/upload/', `/upload/${transform}/`)
}

/**
 * Drop-in replacement for <img src={cloudinaryUrl} />.
 *
 * - Shows a tiny blurred version instantly (loads in a few KB)
 * - Crossfades into the full, optimized version once it's loaded
 * - Auto-picks best format (WebP/AVIF) and compression via f_auto,q_auto
 *
 * Usage:
 *   <CloudinaryImage src={outfit.mainImage} alt={outfit.name} width={800} />
 *
 * Wrap it in a container that already has a fixed aspect-ratio / size
 * (like your .look-card-img or .product-img-wrap divs) — this component
 * fills that container with object-fit: cover.
 */
export default function CloudinaryImage({
  src,
  alt = '',
  width = 800,
  className = '',
  style = {},
  imgProps = {},
}) {
  const [loaded, setLoaded] = useState(false)

  const placeholderSrc = withTransform(src, 'e_blur:1000,q_1,w_50')
  const fullSrc = withTransform(src, `f_auto,q_auto,w_${width}`)

  return (
    <div
      className={`cld-img-wrap ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Blurred placeholder — shows instantly */}
      <img
        src={placeholderSrc}
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'blur(8px)',
          transform: 'scale(1.1)', // hides blur edge artifacts
          opacity: loaded ? 0 : 1,
          transition: 'opacity 400ms ease',
        }}
      />

      {/* Full quality image — fades in once loaded */}
      <img
        src={fullSrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 400ms ease',
        }}
        {...imgProps}
      />
    </div>
  )
}