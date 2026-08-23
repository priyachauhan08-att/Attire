import { useEffect, useRef, useState } from 'react'

const CHECKS = [
  { id: 'AUTH_SERVICE', detail: 'token issuer reachable' },
  { id: 'DATABASE', detail: 'primary replica synced' },
  { id: 'CACHE', detail: 'hit rate nominal' },
  { id: 'QUEUE', detail: 'consumer lag 0s' },
  { id: 'CDN_EDGE', detail: 'all regions responding' },
  { id: 'WEBHOOKS', detail: 'delivery queue clear' },
  { id: 'RATE_LIMITER', detail: 'thresholds within range' },
  { id: 'BACKUP_JOB', detail: 'last run completed' },
]

function timestamp() {
  return new Date().toTimeString().slice(0, 8)
}

function makeLine(i) {
  const check = CHECKS[i % CHECKS.length]
  const ms = (8 + Math.random() * 40).toFixed(0)
  return {
    key: `${check.id}-${Date.now()}-${i}`,
    time: timestamp(),
    id: check.id,
    detail: check.detail,
    ms,
  }
}

export default function StatusFeed() {
  const [lines, setLines] = useState(() => [0, 1, 2, 3].map(makeLine))
  const counter = useRef(4)
  const feedRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setLines((prev) => {
        const next = [...prev, makeLine(counter.current)]
        counter.current += 1
        return next.length > 40 ? next.slice(next.length - 40) : next
      })
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const el = feedRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines])

  return (
    <div className="status-feed" ref={feedRef} aria-hidden="true">
      {lines.map((line) => (
        <div className="status-line" key={line.key}>
          <span className="status-time">{line.time}</span>
          <span className="status-id">{line.id}</span>
          <span className="status-detail">{line.detail}</span>
          <span className="status-ok">OK · {line.ms}ms</span>
        </div>
      ))}
      <div className="status-cursor-row">
        <span className="status-cursor">▌</span>
      </div>
    </div>
  )
}
