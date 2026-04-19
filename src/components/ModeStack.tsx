import { useCallback, useEffect, useRef, useState } from 'react'
import type { StudyCard } from '../data'
import type { ProgressState } from '../progress'
import { CategoryBadge, CodeBlock, Difficulty, FollowUpList, Icon, ReviewCheck, Takeaway } from './primitives'

type Props = {
  cards: StudyCard[]
  idx: number
  setIdx: (updater: (i: number) => number) => void
  progress: ProgressState
  toggleReviewed: (id: string) => void
  rate: (quality: 1 | 2 | 3 | 4) => void
  showAnswerDefault: boolean
}

export function ModeStack({ cards, idx, setIdx, progress, toggleReviewed, rate, showAnswerDefault }: Props) {
  const [flipped, setFlipped] = useState(showAnswerDefault)
  const [hintLevel, setHintLevel] = useState(0)
  const [drag, setDrag] = useState({ x: 0, y: 0, active: false })
  const [exiting, setExiting] = useState<'left' | 'right' | null>(null)
  const startRef = useRef<{ x: number; y: number; t: number } | null>(null)

  const card = cards[idx]

  useEffect(() => {
    setFlipped(showAnswerDefault)
    setHintLevel(0)
    setExiting(null)
  }, [idx, showAnswerDefault])

  const next = useCallback(() => setIdx((i) => Math.min(cards.length - 1, i + 1)), [cards.length, setIdx])
  const prev = useCallback(() => setIdx((i) => Math.max(0, i - 1)), [setIdx])

  const commit = useCallback(
    (dir: 'left' | 'right') => {
      setExiting(dir)
      if (dir === 'right' && card && !progress.reviewed[card.id]) toggleReviewed(card.id)
      rate(dir === 'right' ? 3 : 1)
      setTimeout(() => {
        setExiting(null)
        setDrag({ x: 0, y: 0, active: false })
        next()
      }, 240)
    },
    [card, progress.reviewed, toggleReviewed, next, rate],
  )

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === ' ') {
        e.preventDefault()
        setFlipped((f) => !f)
      }
      if (e.key === 'j' || e.key === 'ArrowLeft') {
        e.preventDefault()
        commit('left')
      }
      if (e.key === 'k' || e.key === 'ArrowRight') {
        e.preventDefault()
        commit('right')
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setHintLevel((l) => Math.max(0, l - 1))
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setHintLevel((l) => Math.min(2, l + 1))
      }
      if (e.key === 'u') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [commit, prev])

  const onPointerDown = (e: React.PointerEvent) => {
    startRef.current = { x: e.clientX, y: e.clientY, t: Date.now() }
    setDrag({ x: 0, y: 0, active: true })
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!startRef.current) return
    setDrag({ x: e.clientX - startRef.current.x, y: e.clientY - startRef.current.y, active: true })
  }
  const onPointerUp = () => {
    if (!startRef.current) return
    const dx = drag.x
    const dy = drag.y
    const dt = Date.now() - startRef.current.t
    startRef.current = null

    const absX = Math.abs(dx)
    const absY = Math.abs(dy)
    const isTap = absX < 8 && absY < 8 && dt < 300

    if (isTap) {
      setFlipped((f) => !f)
      setDrag({ x: 0, y: 0, active: false })
      return
    }
    if (absX > absY && absX > 90) {
      commit(dx > 0 ? 'right' : 'left')
      return
    }
    if (absY > absX && absY > 60) {
      if (dy < 0) setHintLevel((l) => Math.min(2, l + 1))
      else setHintLevel((l) => Math.max(0, l - 1))
      setDrag({ x: 0, y: 0, active: false })
      return
    }
    setDrag({ x: 0, y: 0, active: false })
  }

  if (!card) {
    return (
      <div className="stack-view">
        <div className="stage" style={{ color: 'var(--fg-muted)' }}>No cards match your filter.</div>
      </div>
    )
  }

  const visible = cards.slice(idx, idx + 3)
  const rotate = drag.x * 0.06
  const opacity = 1 - Math.min(1, Math.abs(drag.x) / 400)
  const cardStyle: React.CSSProperties = exiting
    ? {
        transform: `translateX(${exiting === 'right' ? 800 : -800}px) rotate(${exiting === 'right' ? 20 : -20}deg)`,
        opacity: 0,
        transition: 'transform 240ms cubic-bezier(.3,.8,.3,1), opacity 240ms ease',
      }
    : drag.active
      ? {
          transform: `translate(${drag.x}px, ${drag.y * 0.3}px) rotate(${rotate}deg)`,
          opacity,
          transition: 'none',
        }
      : {}

  const leftGlow = Math.max(0, Math.min(1, -drag.x / 140))
  const rightGlow = Math.max(0, Math.min(1, drag.x / 140))

  const dotTrailWindow = 10
  const winStart = Math.max(0, Math.min(Math.max(0, cards.length - dotTrailWindow), idx - 4))
  const trail = cards.slice(winStart, winStart + dotTrailWindow)

  return (
    <div className="stack-view">
      <div className="stack-header">
        <div className="progress-pill">
          {String(idx + 1).padStart(2, '0')} / {String(cards.length).padStart(2, '0')}
        </div>
        <div className="dot-trail">
          {trail.map((c, i) => {
            const abs = winStart + i
            const done = progress.reviewed[c.id]
            const cur = abs === idx
            return <i key={c.id} className={`${done ? 'done' : ''} ${cur ? 'cur' : ''}`} />
          })}
        </div>
        <button className="icon-btn" onClick={() => toggleReviewed(card.id)} title="Mark reviewed">
          <Icon name="star" />
        </button>
      </div>

      <div className="stage">
        <div className="card-stack">
          {visible
            .slice()
            .reverse()
            .map((c, rIdx) => {
              const depth = visible.length - 1 - rIdx
              const isTop = depth === 0
              return (
                <div
                  key={c.id}
                  className={`flashcard ${isTop && flipped ? 'flipped' : ''}`}
                  data-cat={c.category}
                  data-depth={depth}
                  style={isTop ? cardStyle : undefined}
                  onPointerDown={isTop ? onPointerDown : undefined}
                  onPointerMove={isTop && drag.active ? onPointerMove : undefined}
                  onPointerUp={isTop ? onPointerUp : undefined}
                  onPointerCancel={isTop ? onPointerUp : undefined}
                >
                  {isTop && (
                    <>
                      <div className="swipe-label left" style={{ opacity: leftGlow }}>Skip</div>
                      <div className="swipe-label right" style={{ opacity: rightGlow }}>Got it</div>
                    </>
                  )}
                  <FlashFront card={c} reviewed={!!progress.reviewed[c.id]} />
                  <FlashBack card={c} hintLevel={hintLevel} />
                </div>
              )
            })}
        </div>
      </div>

      <div className="stack-actions">
        <button className="round-btn small" onClick={prev} title="Previous">
          <Icon name="undo" />
        </button>
        <button className="round-btn danger" onClick={() => commit('left')} title="Skip (J / ←)">
          <Icon name="x" size={22} />
        </button>
        <button className="round-btn primary" onClick={() => setFlipped((f) => !f)} title="Flip (Space)">
          <Icon name="flip" size={22} />
        </button>
        <button
          className="round-btn"
          style={{ color: 'var(--accent)' }}
          onClick={() => commit('right')}
          title="Got it (K / →)"
        >
          <Icon name="check" size={22} />
        </button>
      </div>

      <div className="stack-shortcuts">
        <span className="kbd">Space</span> flip &nbsp;
        <span className="kbd">J</span>
        <span className="kbd">K</span> skip / got it &nbsp;
        <span className="kbd">↑</span>
        <span className="kbd">↓</span> hints &nbsp;
        <span className="kbd">U</span> undo
      </div>
    </div>
  )
}

function FlashFront({ card, reviewed }: { card: StudyCard; reviewed: boolean }) {
  const title = card.type === 'qa' ? card.question : card.prompt
  return (
    <div className="face front">
      <div className="face-header">
        <CategoryBadge cat={card.category} />
        <ReviewCheck on={reviewed} onToggle={() => {}} />
      </div>
      <h2 className="flashcard-question">{title}</h2>
      <div className="face-meta" style={{ marginTop: 'auto' }}>
        <Difficulty level={card.difficulty} cat={card.category} />
        <span className="minutes">~{card.minutes} min</span>
        <span style={{ flex: 1 }} />
        <div className="flip-hint">
          <Icon name="flip" size={12} />
          tap to flip <span className="kbd">space</span>
        </div>
      </div>
    </div>
  )
}

function FlashBack({ card, hintLevel }: { card: StudyCard; hintLevel: number }) {
  return (
    <div className="face back" data-cat={card.category}>
      <div className="face-header">
        <CategoryBadge cat={card.category} />
        <span className="minutes">{card.type === 'qa' ? 'Answer' : 'Solution'}</span>
      </div>
      <div className="scroll">
        {card.type === 'qa' ? (
          <>
            <div>
              <h3>Short answer</h3>
              <p>{card.shortAnswer}</p>
              {card.bullets && (
                <ul>
                  {card.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h3>Going deeper</h3>
              <p>{card.deepAnswer}</p>
            </div>
            {card.sampleCode && <CodeBlock>{card.sampleCode}</CodeBlock>}
            {card.takeaway && <Takeaway cat={card.category}>{card.takeaway}</Takeaway>}
            <FollowUpList items={card.followUps} cat={card.category} compact />
          </>
        ) : (
          <>
            <div>
              <h3>Hints {hintLevel > 0 ? `· ${hintLevel}/2 revealed` : '· swipe ↓ to reveal'}</h3>
              <div className="hint-levels">
                <div className={`lvl ${hintLevel >= 1 ? 'on' : ''}`} />
                <div className={`lvl ${hintLevel >= 2 ? 'on' : ''}`} />
              </div>
              {hintLevel >= 1 && (
                <p style={{ marginTop: 10 }}>
                  <b>1.</b> {card.hint1}
                </p>
              )}
              {hintLevel >= 2 && (
                <p>
                  <b>2.</b> {card.hint2}
                </p>
              )}
            </div>
            <div>
              <h3>Solution</h3>
              <CodeBlock>{card.answer}</CodeBlock>
            </div>
            {card.takeaway && <Takeaway cat={card.category}>{card.takeaway}</Takeaway>}
            <FollowUpList items={card.followUps} cat={card.category} compact />
          </>
        )}
      </div>
    </div>
  )
}
