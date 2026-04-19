import { useEffect, useMemo, useRef, useState } from 'react'
import type { StudyCard } from '../data'

type Props = {
  open: boolean
  onClose: () => void
  cards: StudyCard[]
  onPick: (card: StudyCard) => void
}

export function CommandPalette({ open, onClose, cards, onPick }: Props) {
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setQ('')
      setSel(0)
      setTimeout(() => inputRef.current?.focus(), 30)
    }
  }, [open])

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return cards.slice(0, 10)
    return cards
      .filter((c) => {
        const hay = [
          c.category,
          c.type === 'qa' ? c.question : c.prompt,
          c.type === 'qa' ? c.shortAnswer : c.answer,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        return hay.includes(needle)
      })
      .slice(0, 20)
  }, [q, cards])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSel((s) => Math.min(s + 1, results.length - 1))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSel((s) => Math.max(s - 1, 0))
      }
      if (e.key === 'Enter' && results[sel]) {
        e.preventDefault()
        onPick(results[sel])
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, results, sel, onClose, onPick])

  if (!open) return null
  return (
    <div className="cmdk-overlay" onClick={onClose}>
      <div className="cmdk" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          className="cmdk-input"
          placeholder="Search questions, code, concepts…"
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            setSel(0)
          }}
        />
        <div className="cmdk-list">
          {results.length === 0 && (
            <div className="cmdk-item" style={{ color: 'var(--fg-dim)' }}>No matches</div>
          )}
          {results.map((c, i) => (
            <div
              key={c.id}
              className="cmdk-item"
              data-selected={i === sel}
              data-cat={c.category}
              onMouseEnter={() => setSel(i)}
              onClick={() => {
                onPick(c)
                onClose()
              }}
            >
              <span className="cat-dot" />
              <span className="item-label">{c.type === 'qa' ? c.question : c.prompt}</span>
              <span className="item-cat">{c.category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
