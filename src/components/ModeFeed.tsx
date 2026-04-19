import { useState } from 'react'
import type { Category, DrillCard, StudyCard } from '../data'
import type { ProgressState } from '../progress'
import { CategoryBadge, CodeBlock, Difficulty, FollowUpList, Icon, ReviewCheck, Takeaway } from './primitives'

type Props = {
  cards: StudyCard[]
  progress: ProgressState
  toggleReviewed: (id: string) => void
  filter: Category | 'All'
  setFilter: (v: Category | 'All') => void
  categories: Category[]
}

type Section = 'short' | 'deep' | 'code'

export function ModeFeed({ cards, progress, toggleReviewed, filter, setFilter, categories }: Props) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [section, setSection] = useState<Record<string, Section>>({})

  const reviewedCount = cards.filter((c) => progress.reviewed[c.id]).length

  return (
    <div className="feed-view">
      <div className="feed-hero">
        <div>
          <div className="hero-num">FE/01 · FRONTEND ENGINEER</div>
          <h1>Study like you mean it.</h1>
          <p className="subtitle">
            Interview prep for a frontend engineer. Short answers, deep explanations, code, and drills — all searchable and built for repetition.
          </p>
        </div>
        <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
          <div className="hero-num">REVIEWED</div>
          <div className="stat-num">
            {reviewedCount}
            <span style={{ color: 'var(--fg-dim)', fontWeight: 600 }}>/{cards.length}</span>
          </div>
        </div>
      </div>

      <div className="filter-bar">
        <button className={`chip ${filter === 'All' ? 'active' : ''}`} onClick={() => setFilter('All')}>
          All
        </button>
        {categories.map((c) => (
          <button
            key={c}
            data-cat={c}
            className={`chip ${filter === c ? 'active' : ''}`}
            onClick={() => setFilter(c)}
          >
            {c}
          </button>
        ))}
        <span className="spacer" />
        <span className="count">{cards.length} cards</span>
      </div>

      {cards.map((c) => {
        const open = openId === c.id
        const reviewed = !!progress.reviewed[c.id]
        const isQA = c.type === 'qa'
        const activeSection: Section = section[c.id] || 'short'

        return (
          <article
            key={c.id}
            className={`feed-item ${open ? 'open' : ''} ${reviewed ? 'reviewed' : ''}`}
            data-cat={c.category}
          >
            <div className="feed-head" onClick={() => setOpenId(open ? null : c.id)}>
              <div className="meta-col">
                <CategoryBadge cat={c.category} />
                <Difficulty level={c.difficulty} cat={c.category} />
              </div>
              <div className="title-col">
                <h3>{isQA ? c.question : c.prompt}</h3>
                <div className="subline">
                  <span className="minutes">~{c.minutes} min</span>
                  <span>·</span>
                  <span>{isQA ? 'Q & A' : 'Coding drill'}</span>
                </div>
              </div>
              <div className="head-right">
                <ReviewCheck on={reviewed} onToggle={() => toggleReviewed(c.id)} />
                <span className="chevron">
                  <Icon name="chevron" />
                </span>
              </div>
            </div>

            {open && (
              <div className="feed-body">
                {isQA ? (
                  <>
                    <div className="answer-section">
                      <div className="section-tabs">
                        <button
                          className={activeSection === 'short' ? 'active' : ''}
                          onClick={() => setSection((s) => ({ ...s, [c.id]: 'short' }))}
                        >
                          Short
                        </button>
                        <button
                          className={activeSection === 'deep' ? 'active' : ''}
                          onClick={() => setSection((s) => ({ ...s, [c.id]: 'deep' }))}
                        >
                          Deeper
                        </button>
                        {c.sampleCode && (
                          <button
                            className={activeSection === 'code' ? 'active' : ''}
                            onClick={() => setSection((s) => ({ ...s, [c.id]: 'code' }))}
                          >
                            Code
                          </button>
                        )}
                      </div>
                      {activeSection === 'short' && (
                        <div>
                          <p>{c.shortAnswer}</p>
                          {c.bullets && (
                            <ul>
                              {c.bullets.map((b) => (
                                <li key={b}>{b}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                      {activeSection === 'deep' && <p>{c.deepAnswer}</p>}
                      {activeSection === 'code' && c.sampleCode && <CodeBlock>{c.sampleCode}</CodeBlock>}
                    </div>
                    {c.takeaway && <Takeaway cat={c.category}>{c.takeaway}</Takeaway>}
                    <FollowUpList items={c.followUps} cat={c.category} />
                  </>
                ) : (
                  <DrillBody card={c} />
                )}
              </div>
            )}
          </article>
        )
      })}
    </div>
  )
}

function DrillBody({ card }: { card: DrillCard }) {
  const [level, setLevel] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  return (
    <>
      <div className="answer-section">
        <h4>Hints</h4>
        <div className="drill-actions">
          <button className={`chip ${level >= 1 ? 'on' : ''}`} onClick={() => setLevel(1)}>
            Hint 1
          </button>
          <button className={`chip ${level >= 2 ? 'on' : ''}`} onClick={() => setLevel(2)}>
            Hint 2
          </button>
          <button
            className={`chip ${showAnswer ? 'primary' : ''}`}
            onClick={() => setShowAnswer((s) => !s)}
          >
            {showAnswer ? 'Hide solution' : 'Show solution'}
          </button>
        </div>
        {level >= 1 && (
          <p className="drill-hint" style={{ marginTop: 10 }}>
            <b>Hint 1 ·</b> {card.hint1}
          </p>
        )}
        {level >= 2 && (
          <p className="drill-hint">
            <b>Hint 2 ·</b> {card.hint2}
          </p>
        )}
      </div>
      {showAnswer && <CodeBlock>{card.answer}</CodeBlock>}
      {card.takeaway && <Takeaway cat={card.category}>{card.takeaway}</Takeaway>}
    </>
  )
}
