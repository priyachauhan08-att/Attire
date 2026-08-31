import { useEffect, useRef, useState } from 'react'

function getDominantColor(img) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  // downscale for speed — we don't need full resolution to sample color
  const size = 50
  canvas.width = size
  canvas.height = size
  ctx.drawImage(img, 0, 0, size, size)

  const { data } = ctx.getImageData(0, 0, size, size)

  let r = 0, g = 0, b = 0, count = 0

  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3]
    if (alpha < 200) continue // skip transparent pixels

    r += data[i]
    g += data[i + 1]
    b += data[i + 2]
    count++
  }

  r = Math.round(r / count)
  g = Math.round(g / count)
  b = Math.round(b / count)

  return `rgb(${r}, ${g}, ${b})`
}

export default function SmartBgImage({ src, alt, style }) {
  const imgRef = useRef(null)
  const [bgColor, setBgColor] = useState('var(--bone)') // fallback while loading

  useEffect(() => {
    const img = imgRef.current
    if (!img) return

    const handleLoad = () => {
      try {
        const color = getDominantColor(img)
        setBgColor(color)
      } catch (err) {
        // canvas can throw a security error if the image is cross-origin
        // without proper CORS headers — falls back to default bg
        console.warn('Could not sample image color:', err)
      }
    }

    if (img.complete) {
      handleLoad()
    } else {
      img.addEventListener('load', handleLoad)
      return () => img.removeEventListener('load', handleLoad)
    }
  }, [src])

  return (
    <div style={{ ...style, backgroundColor: bgColor, transition: 'background-color 0.3s ease' }}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        crossOrigin="anonymous"
        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        loading="lazy"
      />
    </div>
  )
}