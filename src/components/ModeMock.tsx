import { useEffect, useMemo, useState } from 'react'
import type { Category, StudyCard } from '../data'
import type { ProgressState } from '../progress'
import { CategoryBadge, CodeBlock, Difficulty, FollowUpList, ReviewCheck, Takeaway } from './primitives'

type Stage = 'prompt' | 'short' | 'deep' | 'code' | 'followups'

type Props = {
  cards: StudyCard[]
  idx: number
  setIdx: (updater: (i: number) => number) => void
  progress: ProgressState
  toggleReviewed: (id: string) => void
  rate: (quality: 1 | 2 | 3 | 4) => void
  categories: Category[]
}

const STAGES: Stage[] = ['prompt', 'short', 'deep', 'code', 'followups']

export function ModeMock({ cards, idx, setIdx, progress, toggleReviewed, rate, categories }: Props) {
  const [stage, setStage] = useState<Stage>('prompt')
  const [thinking, setThinking] = useState(false)

  const card = cards[idx]
  const reviewedTotal = Object.values(progress.reviewed).filter(Boolean).length

  useEffect(() => {
    setStage('prompt')
    setThinking(false)
  }, [idx])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return
      if (e.metaKey || e.ctrlKey || e.altKey) return

      if (e.key === ' ') {
        e.preventDefault()
        advance(card)
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setIdx((i) => Math.max(0, i - 1))
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        setIdx((i) => Math.min(cards.length - 1, i + 1))
      }
      if (['1', '2', '3', '4'].includes(e.key)) {
        e.preventDefault()
        const quality = Number(e.key) as 1 | 2 | 3 | 4
        submitRating(quality)
      }
      if (e.key === 't') {
        e.preventDefault()
        setThinking((v) => !v)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const stageIndex = STAGES.indexOf(stage)
  const stageProgress = ((stageIndex + 1) / STAGES.length) * 100

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const category of categories) counts[category] = 0
    for (const c of cards) counts[c.category] = (counts[c.category] || 0) + 1
    return counts
  }, [cards, categories])

  if (!card) {
    return <div className="mock-view"><div className="mock-shell">No cards match your filter.</div></div>
  }

  const isQA = card.type === 'qa'
  const canShowCode = isQA ? !!card.sampleCode : true
  const canShowFollowups = (card.followUps?.length || 0) > 0

  function advance(current?: StudyCard) {
    if (!current) return

    if (stage === 'prompt') {
      setStage('short')
      return
    }
    if (stage === 'short') {
      setStage('deep')
      return
    }
    if (stage === 'deep') {
      if (canShowCode) {
        setStage('code')
      } else if (canShowFollowups) {
        setStage('followups')
      }
      return
    }
    if (stage === 'code') {
      if (canShowFollowups) setStage('followups')
      return
    }
  }

  function submitRating(quality: 1 | 2 | 3 | 4) {
    rate(quality)
    if (quality >= 3 && !progress.reviewed[card.id]) toggleReviewed(card.id)
    setIdx((i) => Math.min(cards.length - 1, i + 1))
  }

  return (
    <div className="mock-view">
      <div className="mock-topbar">
        <div>
          <div className="mock-kicker">MOCK INTERVIEW</div>
          <h1>Speak first, reveal later.</h1>
          <p>
            Practice answering before you look. Reveal the short answer, go deeper, then pressure test yourself with follow-ups.
          </p>
        </div>
        <div className="mock-summary">
          <div className="mock-summary-value">{reviewedTotal}/{cards.length}</div>
          <div className="mock-summary-label">reviewed</div>
        </div>
      </div>

      <div className="mock-shell" data-cat={card.category}>
        <div className="mock-header">
          <div className="mock-meta">
            <CategoryBadge cat={card.category} />
            <Difficulty level={card.difficulty} cat={card.category} />
            <span className="minutes">~{card.minutes} min</span>
            <span className="mock-card-count">{idx + 1} / {cards.length}</span>
          </div>
          <ReviewCheck on={!!progress.reviewed[card.id]} onToggle={() => toggleReviewed(card.id)} />
        </div>

        <div className="mock-progress">
          <div className="mock-progress-fill" style={{ width: `${stageProgress}%` }} />
        </div>

        <section className="mock-question-block">
          <div className="mock-stage-label">Question</div>
          <h2>{isQA ? card.question : card.prompt}</h2>
          <div className="mock-actions-row">
            <button className={`mock-chip ${thinking ? 'active' : ''}`} onClick={() => setThinking((v) => !v)}>
              {thinking ? 'Thinking…' : 'Start thinking'} <span className="kbd">T</span>
            </button>
            <button className="mock-chip primary" onClick={() => advance(card)}>
              {stage === 'prompt' ? 'Reveal short answer' : 'Reveal next'} <span className="kbd">Space</span>
            </button>
          </div>
        </section>

        <div className="mock-panels">
          {stage !== 'prompt' && (
            <section className="mock-panel">
              <div className="mock-stage-label">Short answer</div>
              {isQA ? (
                <>
                  <p>{card.shortAnswer}</p>
                  {card.bullets && (
                    <ul>
                      {card.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <p>{card.hint1}</p>
              )}
            </section>
          )}

          {(stage === 'deep' || stage === 'code' || stage === 'followups') && (
            <section className="mock-panel">
              <div className="mock-stage-label">Deeper</div>
              {isQA ? <p>{card.deepAnswer}</p> : <p>{card.hint2}</p>}
            </section>
          )}

          {(stage === 'code' || stage === 'followups') && canShowCode && (
            <section className="mock-panel code-panel">
              <div className="mock-stage-label">{isQA ? 'Code example' : 'Solution'}</div>
              <CodeBlock>{isQA ? card.sampleCode : card.answer}</CodeBlock>
            </section>
          )}

          {stage === 'followups' && canShowFollowups && (
            <section className="mock-panel">
              <div className="mock-stage-label">Follow-ups</div>
              <FollowUpList items={card.followUps} cat={card.category} />
            </section>
          )}
        </div>

        {card.takeaway && stage !== 'prompt' && <Takeaway cat={card.category}>{card.takeaway}</Takeaway>}

        <div className="mock-footer">
          <div className="mock-footer-left">
            <button className="mock-nav" onClick={() => setIdx((i) => Math.max(0, i - 1))}>Previous</button>
            <button className="mock-nav" onClick={() => setIdx((i) => Math.min(cards.length - 1, i + 1))}>Skip</button>
          </div>
          <div className="mock-rating">
            <button onClick={() => submitRating(1)}>Again <span className="kbd">1</span></button>
            <button onClick={() => submitRating(2)}>Hard <span className="kbd">2</span></button>
            <button onClick={() => submitRating(3)}>Good <span className="kbd">3</span></button>
            <button className="primary" onClick={() => submitRating(4)}>Easy <span className="kbd">4</span></button>
          </div>
        </div>
      </div>

      <div className="mock-legend">
        {categories.map((category) => (
          <span key={category} className="mock-legend-chip" data-cat={category}>
            {category} · {categoryCounts[category] || 0}
          </span>
        ))}
      </div>
    </div>
  )
}
