import { useCallback, useEffect, useMemo, useState } from 'react'
import './styles.css'
import { CATEGORIES, STUDY_CARDS, type Category, type StudyCard } from './data'
import { defaultProgress, loadProgress, STORE_KEY } from './progress'
import { Icon } from './components/primitives'
import { CommandPalette } from './components/CommandPalette'
import { ModeStack } from './components/ModeStack'
import { ModeFeed } from './components/ModeFeed'
import { ModeArcade } from './components/ModeArcade'
import { ModeMock } from './components/ModeMock'

type Mode = 'stack' | 'feed' | 'arcade' | 'mock'
type Theme = 'dark' | 'paper'
type Sort = 'default' | 'shuffle' | 'difficulty'

function initialTheme(): Theme {
  try {
    const saved = localStorage.getItem('study-cards-theme') as Theme | null
    if (saved === 'dark' || saved === 'paper') return saved
  } catch {
    /* ignore */
  }
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: light)').matches) {
    return 'paper'
  }
  return 'dark'
}

function App() {
  const [mode, setMode] = useState<Mode>('stack')
  const [theme, setTheme] = useState<Theme>(initialTheme)
  const [sort, setSort] = useState<Sort>('default')
  const [filter, setFilter] = useState<Category | 'All'>('All')
  const [cmdkOpen, setCmdkOpen] = useState(false)
  const [idx, setIdx] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('study-cards-idx') || 0) || 0
    } catch {
      return 0
    }
  })
  const [progress, setProgress] = useState(loadProgress)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'paper' ? '#f3efe6' : '#0a0b10')
    try {
      localStorage.setItem('study-cards-theme', theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(progress))
    } catch {
      /* ignore */
    }
  }, [progress])

  useEffect(() => {
    try {
      localStorage.setItem('study-cards-idx', String(idx))
    } catch {
      /* ignore */
    }
  }, [idx])

  const filteredCards = useMemo<StudyCard[]>(() => {
    let list = STUDY_CARDS.slice()
    if (filter !== 'All') list = list.filter((c) => c.category === filter)
    if (sort === 'shuffle') {
      const seed = filter + STUDY_CARDS.length
      let h = 0
      for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) | 0
      list = list
        .map((c) => ({ c, k: Math.sin(h++ + c.id.length) }))
        .sort((a, b) => a.k - b.k)
        .map((o) => o.c)
    } else if (sort === 'difficulty') {
      list = list.sort((a, b) => a.difficulty - b.difficulty)
    }
    return list
  }, [filter, sort])

  useEffect(() => {
    if (idx >= filteredCards.length) setIdx(0)
  }, [filteredCards.length, idx])

  const toggleReviewed = useCallback((id: string) => {
    setProgress((p) => {
      const wasReviewed = !!p.reviewed[id]
      const nowReviewed = !wasReviewed
      return {
        ...p,
        reviewed: { ...p.reviewed, [id]: nowReviewed },
        xp: Math.max(0, p.xp + (nowReviewed ? 10 : -10)),
      }
    })
  }, [])

  const rate = useCallback((quality: 1 | 2 | 3 | 4) => {
    setProgress((p) => {
      const gains = { 1: 0, 2: 5, 3: 10, 4: 20 }[quality]
      const newCombo = quality >= 3 ? p.combo + 1 : 0
      return {
        ...p,
        xp: p.xp + gains,
        combo: newCombo,
        maxCombo: Math.max(p.maxCombo, newCombo),
      }
    })
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCmdkOpen(true)
      }
      if (e.key === '/') {
        e.preventDefault()
        setCmdkOpen(true)
      }
      if (e.key === 's' && !e.metaKey && !e.ctrlKey) {
        setSort((s) => (s === 'shuffle' ? 'default' : 'shuffle'))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const pickFromSearch = (card: StudyCard) => {
    let list = filteredCards
    let i = list.findIndex((c) => c.id === card.id)
    if (i === -1) {
      setFilter('All')
      list = STUDY_CARDS
      i = list.findIndex((c) => c.id === card.id)
    }
    if (i >= 0) setIdx(i)
  }

  const resetProgress = () => {
    if (!window.confirm('Reset all progress?')) return
    setProgress(defaultProgress)
    setIdx(0)
  }

  const level = Math.floor(progress.xp / 100) + 1
  const levelPct = progress.xp % 100

  return (
    <div className="app">
      <div className="topbar">
        <div className="brand">
          <div className="brand-dot">FE</div>
          <span>Study Cards</span>
        </div>

        <div className="streak-chip" title="Study streak">
          <span className="flame">🔥</span>
          <span>{progress.streak}</span>
        </div>

        <div className="xp-bar-wrap">
          <span>L{level}</span>
          <div className="xp-bar">
            <div className="xp-bar-fill" style={{ width: `${levelPct}%` }} />
          </div>
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>{progress.xp}</span>
        </div>

        <button className="icon-btn" onClick={() => setCmdkOpen(true)} title="Search (⌘K)">
          <Icon name="search" />
        </button>
        <button
          className="icon-btn"
          onClick={() => setSort((s) => (s === 'shuffle' ? 'default' : 'shuffle'))}
          title={`Shuffle ${sort === 'shuffle' ? 'on' : 'off'} (S)`}
          style={sort === 'shuffle' ? { borderColor: 'var(--accent)', color: 'var(--accent)' } : undefined}
        >
          <Icon name="shuffle" />
        </button>
        <button
          className="icon-btn"
          onClick={() => setTheme((t) => (t === 'dark' ? 'paper' : 'dark'))}
          title={theme === 'dark' ? 'Switch to paper' : 'Switch to dark'}
        >
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
        </button>
        <button className="icon-btn" onClick={resetProgress} title="Reset progress">
          <Icon name="undo" />
        </button>

        <div className="mode-switch">
          <button className={mode === 'stack' ? 'active' : ''} onClick={() => setMode('stack')}>
            Stack
          </button>
          <button className={mode === 'feed' ? 'active' : ''} onClick={() => setMode('feed')}>
            Feed
          </button>
          <button className={mode === 'arcade' ? 'active' : ''} onClick={() => setMode('arcade')}>
            Arcade
          </button>
          <button className={mode === 'mock' ? 'active' : ''} onClick={() => setMode('mock')}>
            Mock
          </button>
        </div>
      </div>

      <div className="main">
        {mode === 'stack' && (
          <ModeStack
            cards={filteredCards}
            idx={idx}
            setIdx={setIdx}
            progress={progress}
            toggleReviewed={toggleReviewed}
            rate={rate}
            showAnswerDefault={false}
          />
        )}
        {mode === 'feed' && (
          <ModeFeed
            cards={filteredCards}
            progress={progress}
            toggleReviewed={toggleReviewed}
            filter={filter}
            setFilter={setFilter}
            categories={CATEGORIES}
          />
        )}
        {mode === 'arcade' && (
          <ModeArcade
            cards={filteredCards}
            idx={idx}
            setIdx={setIdx}
            progress={progress}
            toggleReviewed={toggleReviewed}
            rate={rate}
            categories={CATEGORIES}
            showAnswerDefault={false}
          />
        )}
        {mode === 'mock' && (
          <ModeMock
            cards={filteredCards}
            idx={idx}
            setIdx={setIdx}
            progress={progress}
            toggleReviewed={toggleReviewed}
            rate={rate}
            categories={CATEGORIES}
          />
        )}
      </div>

      <div className="bottom-tabs">
        <button className={`tab ${filter === 'All' ? 'active' : ''}`} onClick={() => setFilter('All')}>
          <span className="tab-icon">
            <Icon name="grid" size={18} />
          </span>
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`tab ${filter === c ? 'active' : ''}`}
            data-cat={c}
            onClick={() => setFilter(c)}
          >
            <span className="tab-icon" style={{ color: 'var(--cat)' }}>
              {c === 'State' && <Icon name="bolt" size={18} />}
              {c === 'Testing' && <Icon name="target" size={18} />}
              {c === 'Web3' && <Icon name="star" size={18} />}
              {c === 'Architecture' && <Icon name="book" size={18} />}
              {c === 'Drills' && <Icon name="flip" size={18} />}
            </span>
            {c}
          </button>
        ))}
      </div>

      <CommandPalette open={cmdkOpen} onClose={() => setCmdkOpen(false)} cards={STUDY_CARDS} onPick={pickFromSearch} />
    </div>
  )
}

export default App
