import { useEffect, useMemo, useState } from 'react'
import type { Category, StudyCard } from '../data'
import type { ProgressState } from '../progress'
import { CategoryBadge, CodeBlock, Difficulty, Takeaway } from './primitives'

type Props = {
  cards: StudyCard[]
  idx: number
  setIdx: (updater: (i: number) => number) => void
  progress: ProgressState
  toggleReviewed: (id: string) => void
  rate: (quality: 1 | 2 | 3 | 4) => void
  categories: Category[]
  showAnswerDefault: boolean
}

export function ModeArcade({
  cards,
  idx,
  setIdx,
  progress,
  toggleReviewed,
  rate,
  categories,
  showAnswerDefault,
}: Props) {
  const [revealed, setRevealed] = useState(showAnswerDefault)
  const [flash, setFlash] = useState<string | null>(null)

  const card = cards[idx]
  const { xp, streak, combo, maxCombo } = progress

  useEffect(() => {
    setRevealed(showAnswerDefault)
  }, [idx, showAnswerDefault])

  const doRate = (quality: 1 | 2 | 3 | 4) => {
    rate(quality)
    if (quality >= 3 && card && !progress.reviewed[card.id]) toggleReviewed(card.id)
    if (quality >= 3 && combo > 0 && (combo + 1) % 5 === 0) {
      setFlash(`COMBO ×${combo + 1}`)
      setTimeout(() => setFlash(null), 700)
    } else if (quality === 4) {
      setFlash('+20 XP')
      setTimeout(() => setFlash(null), 600)
    }
    setIdx((i) => Math.min(cards.length - 1, i + 1))
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return
      if (e.metaKey || e.ctrlKey) return
      if (e.key === ' ') {
        e.preventDefault()
        setRevealed((r) => !r)
      }
      if (e.key === '1') doRate(1)
      if (e.key === '2') doRate(2)
      if (e.key === '3') doRate(3)
      if (e.key === '4') doRate(4)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card, combo])

  const catStats = useMemo(() => {
    const s: Record<string, { total: number; done: number }> = {}
    for (const c of categories) s[c] = { total: 0, done: 0 }
    for (const c of cards) {
      if (!s[c.category]) s[c.category] = { total: 0, done: 0 }
      s[c.category].total++
      if (progress.reviewed[c.id]) s[c.category].done++
    }
    return s
  }, [cards, categories, progress.reviewed])

  const level = Math.floor(xp / 100) + 1
  const levelXp = xp % 100

  const reviewedTotal = Object.values(progress.reviewed).filter(Boolean).length

  const achievements = [
    { id: 'first', title: 'First blood', sub: 'Review your first card', icon: '★', unlocked: reviewedTotal >= 1 },
    { id: 'five', title: '5-card combo', sub: 'Streak of 5 correct', icon: '5', unlocked: combo >= 5 },
    {
      id: 'state',
      title: 'State specialist',
      sub: 'All State cards reviewed',
      icon: 'S',
      unlocked: !!catStats['State'] && catStats['State'].total > 0 && catStats['State'].done === catStats['State'].total,
    },
    {
      id: 'drill',
      title: 'Drill sergeant',
      sub: 'Finish all Drills',
      icon: 'D',
      unlocked: !!catStats['Drills'] && catStats['Drills'].total > 0 && catStats['Drills'].done === catStats['Drills'].total,
    },
  ]

  if (!card) {
    return (
      <div className="arcade-view">
        <div className="arena">No cards match your filter.</div>
      </div>
    )
  }

  const isQA = card.type === 'qa'

  return (
    <div className="arcade-view">
      <div className="hud">
        <div className="hud-tile accent">
          <div className="label">Level</div>
          <div className="value">{level}</div>
          <div className="mini-bar">
            <div className="mini-bar-fill" style={{ width: `${levelXp}%` }} />
          </div>
          <div className="sub" style={{ marginTop: 4 }}>{levelXp}/100 XP</div>
        </div>
        <div className="hud-tile">
          <div className="label">Streak</div>
          <div className="value">🔥 {streak}</div>
          <div className="sub">{streak > 0 ? 'Keep it going' : 'Review a card today'}</div>
        </div>
        <div className="hud-tile warn">
          <div className="label">Combo</div>
          <div className="value">×{combo}</div>
          <div className="sub">Max ×{Math.max(combo, maxCombo)}</div>
        </div>
        <div className="hud-tile">
          <div className="label">Reviewed</div>
          <div className="value">
            {reviewedTotal}
            <span style={{ color: 'var(--fg-dim)', fontWeight: 600 }}>/{cards.length}</span>
          </div>
          <div className="sub">Total progress</div>
        </div>
      </div>

      <div className="arcade-stage">
        <div className="arena" data-cat={card.category}>
          {flash && <div className="flash">{flash}</div>}

          <div className="arena-head">
            <div className="arena-meta">
              <CategoryBadge cat={card.category} />
              <Difficulty level={card.difficulty} cat={card.category} />
              <span className="minutes">~{card.minutes} min</span>
            </div>
            <div className="combo-wrap">
              <span className="combo-num">{combo}</span>
              <span className="combo-x">×</span>
            </div>
          </div>

          <h2 className="arena-question">{isQA ? card.question : card.prompt}</h2>

          {!revealed ? (
            <button className="btn-pixel reveal" onClick={() => setRevealed(true)}>
              Reveal answer <span className="kbd">SPACE</span>
            </button>
          ) : (
            <div className="arena-answer">
              {isQA ? (
                <>
                  <p>
                    <b className="section-label">Short</b>
                    {card.shortAnswer}
                  </p>
                  <p>
                    <b className="section-label">Deep</b>
                    {card.deepAnswer}
                  </p>
                  {card.sampleCode && <CodeBlock>{card.sampleCode}</CodeBlock>}
                </>
              ) : (
                <>
                  <p>
                    <b className="section-label">Hint 1</b>
                    {card.hint1}
                  </p>
                  <p>
                    <b className="section-label">Hint 2</b>
                    {card.hint2}
                  </p>
                  <CodeBlock>{card.answer}</CodeBlock>
                </>
              )}
              {card.takeaway && <Takeaway cat={card.category}>{card.takeaway}</Takeaway>}
            </div>
          )}

          {revealed && (
            <div className="arena-actions">
              <button className="btn-pixel rate-1" onClick={() => doRate(1)}>
                Again <span className="kbd">1</span>
              </button>
              <button className="btn-pixel rate-2" onClick={() => doRate(2)}>
                Hard <span className="kbd">2</span>
              </button>
              <button className="btn-pixel rate-3" onClick={() => doRate(3)}>
                Good <span className="kbd">3</span>
              </button>
              <button className="btn-pixel rate-4 primary" onClick={() => doRate(4)}>
                Easy <span className="kbd">4</span>
              </button>
            </div>
          )}
        </div>

        <div className="side">
          <div className="side-panel">
            <h4>Category mastery</h4>
            <div className="cat-bars">
              {categories.map((c) => {
                const s = catStats[c] || { total: 0, done: 0 }
                const pct = s.total ? (s.done / s.total) * 100 : 0
                return (
                  <div key={c} className="cat-bar" data-cat={c}>
                    <span className="name">{c}</span>
                    <div className="bar">
                      <div className="fill" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="num">{s.done}/{s.total}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="side-panel">
            <h4>Achievements</h4>
            <div className="achievements">
              {achievements.map((a) => (
                <div key={a.id} className={`ach ${a.unlocked ? '' : 'locked'}`}>
                  <div className="icon">{a.icon}</div>
                  <div>
                    <div className="ach-title">{a.title}</div>
                    <div className="ach-sub">{a.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
