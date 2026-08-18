import { money } from '../data.js'

/** The garment swing-tag — Attire's recurring signature element. */
export default function Tag({ look, price, className = '' }) {
  return (
    <span className={`tag ${className}`}>
      <span className="dot"></span>
      LOOK {look}
      {price != null && <> · <b>{money(price)}</b></>}
    </span>
  )
}
