import { useState, type ReactNode } from 'react'
import type { Category } from '../data'

type IconName =
  | 'search'
  | 'shuffle'
  | 'undo'
  | 'check'
  | 'x'
  | 'star'
  | 'chevron'
  | 'flip'
  | 'bolt'
  | 'book'
  | 'grid'
  | 'target'
  | 'sun'
  | 'moon'
  | 'spark'

export function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    search: <path d="M11 4a7 7 0 1 0 4.2 12.6l3.6 3.6 1.4-1.4-3.6-3.6A7 7 0 0 0 11 4Zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z" />,
    shuffle: <path d="M16 3h5v5M4 20l17-17M21 16v5h-5M15 15l6 6M4 4l5 5" />,
    undo: <path d="M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3" />,
    check: <path d="m4 12 5 5L20 6" />,
    x: <path d="M6 6l12 12M18 6 6 18" />,
    star: <path d="M12 3l2.5 6 6.5.5-5 4.5 1.5 6.5L12 17l-5.5 3.5L8 14 3 9.5 9.5 9Z" />,
    chevron: <path d="M6 9l6 6 6-6" />,
    flip: <path d="M4 4h8a6 6 0 0 1 0 12H8M8 12l-4 4 4 4M20 20h-8a6 6 0 0 1 0-12h4M16 12l4-4-4-4" />,
    bolt: <path d="M13 2 3 14h7l-1 8 10-12h-7z" />,
    book: <path d="M4 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H4ZM20 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7Z" />,
    grid: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />,
    target: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </>
    ),
    moon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />,
    spark: <path d="M12 2l1.7 4.8L18.5 8l-4.8 1.2L12 14l-1.7-4.8L5.5 8l4.8-1.2L12 2Zm7 12 1 2.8L23 18l-3 1-1 3-1-3-3-1 3-1.2L19 14ZM5 15l.8 2.2L8 18l-2.2.8L5 21l-.8-2.2L2 18l2.2-.8L5 15Z" />,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  )
}

export function CategoryBadge({ cat }: { cat: Category }) {
  return <span className="cat-badge" data-cat={cat}>{cat}</span>
}

export function Difficulty({ level, cat }: { level: number; cat: Category }) {
  return (
    <span className="diff" data-cat={cat} title={`Difficulty ${level}/3`}>
      {[1, 2, 3].map((i) => (
        <i key={i} className={i <= level ? 'on' : ''} />
      ))}
    </span>
  )
}

export function ReviewCheck({ on, onToggle, title }: { on: boolean; onToggle: () => void; title?: string }) {
  return (
    <button
      className={`reviewed-check ${on ? 'on' : ''}`}
      onClick={(e) => {
        e.stopPropagation()
        onToggle()
      }}
      title={title || (on ? 'Reviewed' : 'Mark reviewed')}
      aria-pressed={on}
    >
      <Icon name="check" size={12} />
    </button>
  )
}

export function CodeBlock({ children }: { children: ReactNode }) {
  return <pre className="code">{children}</pre>
}

export function Takeaway({ children, cat }: { children: ReactNode; cat: Category }) {
  return (
    <div className="takeaway" data-cat={cat}>
      <b>Takeaway</b>
      {children}
    </div>
  )
}

export function FollowUpList({
  items,
  cat,
  compact = false,
}: {
  items?: { question: string; answer: string }[]
  cat: Category
  compact?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [openQuestion, setOpenQuestion] = useState<string | null>(null)

  if (!items?.length) return null

  return (
    <div className={`followups ${open ? 'open' : ''} ${compact ? 'compact' : ''}`} data-cat={cat}>
      <button className="followups-toggle" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span className="followups-label">
          <Icon name="spark" size={14} />
          Follow-ups
          <span className="followups-count">{items.length}</span>
        </span>
        <span className={`followups-chevron ${open ? 'open' : ''}`}>
          <Icon name="chevron" size={14} />
        </span>
      </button>
      {open && (
        <div className="followups-list">
          {items.map((item) => {
            const expanded = openQuestion === item.question
            return (
              <div key={item.question} className={`followup-item ${expanded ? 'open' : ''}`}>
                <button
                  className="followup-question"
                  onClick={() => setOpenQuestion((cur) => (cur === item.question ? null : item.question))}
                  aria-expanded={expanded}
                >
                  <span>{item.question}</span>
                  <span className={`followups-chevron ${expanded ? 'open' : ''}`}>
                    <Icon name="chevron" size={14} />
                  </span>
                </button>
                {expanded && <div className="followup-answer">{item.answer}</div>}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
