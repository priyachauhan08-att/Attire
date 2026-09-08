import { money } from '../data.js'

export default function Tag({ look, price, className = '' }) {
  return (
    <span className={`tag ${className}`}>
      <span className="dot"></span>
      LOOK {look}
      {price != null && <> · <b>{money(price)}</b></>}
    </span>
  )
}
