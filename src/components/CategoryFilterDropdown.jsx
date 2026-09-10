import { useState, useRef, useEffect } from 'react'

export default function CategoryFilterDropdown({ categories, selectedCategory, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (cat) => {
    onChange(cat)
    setOpen(false)
  }

  return (
    <div className={`filter-dropdown ${open ? 'open' : ''}`} ref={ref}>
      <button
        type="button"
        className="filter-dropdown-trigger"
        onClick={() => setOpen(prev => !prev)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span>{selectedCategory === 'All' ? 'All categories' : selectedCategory}</span>
        <svg className="filter-dropdown-chevron" width="12" height="8" viewBox="0 0 12 8" fill="none">
          <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <ul className={`filter-dropdown-menu ${open ? 'open' : ''}`} role="listbox">
        <li role="option" aria-selected={selectedCategory === 'All'}>
          <button
            type="button"
            className={`filter-dropdown-item ${selectedCategory === 'All' ? 'selected' : ''}`}
            onClick={() => handleSelect('All')}
          >
            All categories
            {selectedCategory === 'All' && <CheckIcon />}
          </button>
        </li>

        {categories.map((cat) => (
          <li role="option" aria-selected={selectedCategory === cat} key={cat}>
            <button
              type="button"
              className={`filter-dropdown-item ${selectedCategory === cat ? 'selected' : ''}`}
              onClick={() => handleSelect(cat)}
            >
              {cat}
              {selectedCategory === cat && <CheckIcon />}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2.5 7.5l3 3 6-6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}