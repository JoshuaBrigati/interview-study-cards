import { useEffect, useMemo, useState } from 'react'
import './App.css'

type StudyCategory =
  | 'State Management'
  | 'Testing'
  | 'Web3 & Tooling'
  | 'Architecture'
  | 'Coding Drills'

type QuestionCard = {
  id: string
  type: 'qa'
  category: Exclude<StudyCategory, 'Coding Drills'>
  question: string
  shortAnswer: string
  deepAnswer: string
  bullets?: string[]
  sampleCode?: string
  takeaway?: string
}

type DrillCard = {
  id: string
  type: 'drill'
  category: 'Coding Drills'
  prompt: string
  answer: string
  hint1: string
  hint2: string
  takeaway: string
  sampleCode?: string
}

type StudyCard = QuestionCard | DrillCard

type ProgressState = {
  reviewed: Record<string, boolean>
  shortExpanded: Record<string, boolean>
  deepExpanded: Record<string, boolean>
  codeExpanded: Record<string, boolean>
  hint1: Record<string, boolean>
  hint2: Record<string, boolean>
}

const STORAGE_KEY = 'interview-study-cards-progress-v2'

const cards: StudyCard[] = [
  {
    id: 'state-mental-model',
    type: 'qa',
    category: 'State Management',
    question: 'How do you think about state management in a frontend app?',
    shortAnswer:
      'I usually separate state into three buckets: local UI state, server state, and truly shared client state. I keep state local by default, treat backend data as server state, and only introduce shared stores when multiple parts of the app genuinely need coordinated client-owned state.',
    deepAnswer:
      'This mental model matters because teams often shove everything into one solution and create unnecessary complexity. Local UI state should stay local because only one component or screen cares about it, so globalizing it just makes code harder to follow. Server state behaves differently because the backend owns the truth, which means caching, refetching, stale data, and loading/error states matter more than reducer-style updates. Shared client state is the smaller bucket people usually overuse, and I only want a shared store when multiple parts of the app need the same client-owned value at the same time. If I can classify a piece of state correctly, the tool choice usually becomes much easier.',
    bullets: [
      'Local UI state: modals, tabs, form inputs, wizard steps',
      'Server state: users, bets, messages, leaderboard data',
      'Shared client state: auth, theme, wallet/session, workspace context',
    ],
    sampleCode: `// local UI state
const [isModalOpen, setIsModalOpen] = useState(false)

// server state
const { data: leaderboard, isLoading } = useQuery({
  queryKey: ['leaderboard'],
  queryFn: fetchLeaderboard,
})

// shared app state
const { currentWorkspace } = useWorkspaceContext()`,
    takeaway: 'Most apps become easier to reason about when you classify the state before you pick the tool.',
  },
  {
    id: 'state-tool-choice',
    type: 'qa',
    category: 'State Management',
    question: 'When would you use Context vs Zustand vs Redux?',
    shortAnswer:
      'Context is fine for relatively stable shared state like auth, theme, or workspace context. For more interactive shared client state, I usually prefer something lightweight like Zustand. Redux makes more sense when the state model is large, heavily shared, and benefits from strict structure, but many apps do not need that level of ceremony.',
    deepAnswer:
      'Context works well for relatively stable values because React re-renders every consumer when the context value changes. That is usually fine for auth, theme, or workspace context because those values do not thrash constantly. If I put all app state in one context, I end up with broad re-renders, unclear boundaries, and a giant object that becomes hard to reason about. Zustand is a nice step up when I need shared client state that changes more often or is used across many places, because it gives me a small store with selective subscriptions and less ceremony. Redux becomes more attractive when the app has a large, highly shared state model and the team benefits from explicit structure, conventions, and predictable patterns. My default is still to start local, then move to context or Zustand only when the coordination problem is real.',
    sampleCode: `// Context for stable shared values
const WorkspaceContext = createContext<{ workspaceId: string | null }>({
  workspaceId: null,
})

// Zustand for interactive shared state
const useMarketStore = create((set) => ({
  selectedMarket: null,
  setSelectedMarket: (market) => set({ selectedMarket: market }),
}))

// Redux is more appropriate when the state model is broad,
// heavily shared, and benefits from stricter structure.`,
    takeaway: 'Context is not “bad,” but it is easy to overuse. The question is how shared and how change-heavy the state really is.',
  },
  {
    id: 'state-common-mistake',
    type: 'qa',
    category: 'State Management',
    question: 'What is a common mistake teams make with state?',
    shortAnswer:
      'They make too much state global too early. That increases complexity fast. I try to keep state as close as possible to where it is used and only lift it when there is a real coordination problem to solve.',
    deepAnswer:
      'The common failure mode is assuming global state is more “professional,” when in reality it often spreads logic out and makes simple features harder to understand. Once state is global, more components can read and write it, debugging gets noisier, and every new feature is tempted to depend on it. Local state has natural boundaries, so I usually prefer that until the same value truly needs to be shared. Another mistake is using one state solution for everything, including server data, which mixes very different concerns together. I want the architecture to reflect how the data actually behaves.',
    takeaway: 'Global state is a cost. Pay it only when the coordination win is worth it.',
  },
  {
    id: 'testing-honest-answer',
    type: 'qa',
    category: 'Testing',
    question: 'What testing have you done at past companies?',
    shortAnswer:
      'At some companies I have been at, the testing culture was lighter than I would have preferred, so quality was often driven through manual QA, product review, and careful iteration. If I were setting the bar, I would want stronger coverage around critical flows, especially end-to-end tests for important user journeys, plus targeted integration or unit tests where the logic is easy to break.',
    deepAnswer:
      'The key is to answer honestly without sounding like you think testing does not matter. My background includes environments where formal test coverage was lighter than ideal, which meant a lot of quality came from manual QA, careful review, and fast product feedback loops. That experience still taught me where apps break most often, especially around async state, permissions, and important workflows. If I were improving the testing story in a team, I would start by protecting the flows that matter most to users and the business, rather than trying to test everything equally. That shows I am pragmatic, not anti-testing.',
    takeaway: 'Honest plus improvement-oriented is much stronger than pretending you had a perfect testing culture everywhere.',
  },
  {
    id: 'testing-priority',
    type: 'qa',
    category: 'Testing',
    question: 'What testing would you add first to a frontend app?',
    shortAnswer:
      'I would start with end-to-end coverage for the most important user flows because that usually gives the best confidence per amount of effort. Then I would add integration tests around tricky component behavior or data interactions, and unit tests for pure logic where they provide real value.',
    deepAnswer:
      'The reason I start with end-to-end tests is that they protect what users actually do in the product. If login, checkout, placing a bet, or submitting a workflow breaks, it does not matter that 40 tiny unit tests still pass. E2E tests give high leverage when a team has weak coverage because they protect the business-critical paths quickly. After that, integration tests are useful for brittle UI logic or async interactions where components and data flow work together. Unit tests are still good, but I use them surgically for pure logic rather than as the first answer to every testing question.',
    sampleCode: `// Example mental priority order
// 1. E2E: can a user complete the main workflow?
// 2. Integration: does this component + data interaction behave correctly?
// 3. Unit: does this pure helper/reducer/formatter hold up?`,
    takeaway: 'Interviewers usually want prioritization, not “we should test everything.”',
  },
  {
    id: 'testing-levels',
    type: 'qa',
    category: 'Testing',
    question: 'How do you explain unit vs integration vs E2E tests?',
    shortAnswer:
      'Unit tests cover isolated logic. Integration tests cover components or systems working together. E2E tests cover critical user flows in the real app. I do not think every component needs heavy coverage. I use the level of testing that matches the risk.',
    deepAnswer:
      'Unit tests are best when the thing you are testing is small, deterministic, and easy to isolate, like a formatter or helper function. Integration tests become more valuable when the bug risk comes from how pieces work together, for example UI state plus async data plus interactions. E2E tests matter most when the real question is “can the user complete the workflow?” A healthy strategy usually uses all three, but not evenly. I want the testing depth to reflect the risk and the failure mode I am trying to catch.',
    sampleCode: `// unit test target
function formatOdds(value: number) {
  return value > 0 ? "+" + value : String(value)
}

// integration test target
// A form that fetches data, renders validation, and updates UI state

// E2E target
// User logs in, selects a market, places a bet, sees confirmation`,
    takeaway: 'The right test level depends on what kind of bug you are trying to prevent.',
  },
  {
    id: 'wagmi-viem-ethers',
    type: 'qa',
    category: 'Web3 & Tooling',
    question: 'What is the difference between ethers.js, wagmi, and viem?',
    shortAnswer:
      'I think of them at different layers. viem is a lower-level TypeScript-first EVM client. wagmi is the React-oriented hooks layer for wallet and app-level onchain UX, usually built around viem. ethers is the older general-purpose library that a lot of projects still use. If I were starting a modern React app today, I would usually lean toward wagmi plus viem unless the existing codebase or ecosystem pushed me toward ethers.',
    deepAnswer:
      'The important part is not just memorizing three library names, but understanding the layering. viem is the lower-level client I would use when I want strongly typed reads, writes, or utility access in a modern TypeScript codebase. wagmi sits higher and helps with React concerns like wallet connection, hooks, chain/account state, and common onchain UX flows. ethers is the older, widely adopted general-purpose library and still totally valid, especially in existing codebases. If I am answering in an interview, I want to show I understand not only what each tool is, but where it sits in the app stack and why I would choose one combination over another.',
    sampleCode: `// viem: low-level read
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
})

const balance = await publicClient.readContract({
  address,
  abi,
  functionName: 'balanceOf',
  args: [userAddress],
})

// wagmi: React hooks layer
const { address, isConnected } = useAccount()
const { data } = useReadContract({
  address,
  abi,
  functionName: 'balanceOf',
  args: [userAddress],
})`,
    takeaway: 'A lot of web3 tooling questions are really asking whether you understand layers and tradeoffs.',
  },
  {
    id: 'viem-over-ethers',
    type: 'qa',
    category: 'Web3 & Tooling',
    question: 'Why might you choose viem over ethers?',
    shortAnswer:
      'viem feels more modern and TypeScript-native, and I like the ergonomics and typing better in newer apps. ethers still has huge ecosystem adoption, so I would not avoid it dogmatically, especially in an existing codebase.',
    deepAnswer:
      'The strongest case for viem is that it feels designed for modern TypeScript usage. The typing is better, the client model is clearer, and it works nicely with wagmi in React apps. That said, ethers still has enormous adoption, good docs, and a lot of ecosystem inertia, so I would not frame it as “ethers bad, viem good.” A better answer is that viem is often my default for greenfield modern work, while ethers remains a completely reasonable choice when the codebase or tooling stack already leans that direction.',
    takeaway: 'Balanced tradeoff language sounds much stronger than dogmatic tool takes.',
  },
  {
    id: 'web3-wallet-client',
    type: 'qa',
    category: 'Web3 & Tooling',
    question: 'What is the difference between a public client and a wallet client?',
    shortAnswer:
      'A public client is for chain reads and general RPC access. A wallet client represents a connected wallet and is used for signing or sending user-authorized transactions.',
    deepAnswer:
      'This distinction matters because not every blockchain interaction should involve the user wallet. Reads, public chain data, and contract queries usually go through a public client because they do not require signing. A wallet client is different because it is tied to a user-controlled account and is responsible for things like signing messages or sending transactions. In interviews, this is a good place to show that you understand the separation between read-only chain access and user-authorized actions.',
    sampleCode: `// public client = reads
const publicClient = createPublicClient({ chain, transport: http() })

// wallet client = user-authorized writes
const walletClient = createWalletClient({ chain, transport: custom(window.ethereum) })`,
    takeaway: 'Use public clients for chain data. Use wallet clients for actions that require user authority.',
  },
  {
    id: 'ai-philosophy',
    type: 'qa',
    category: 'Architecture',
    question: 'How do you think about AI-assisted engineering?',
    shortAnswer:
      'I use AI heavily for exploration, scaffolding, implementation speed, and pattern comparison, but I still treat architecture, debugging, product judgment, and final quality as human-owned. The leverage is real, but only if someone strong is steering it.',
    deepAnswer:
      'The strongest AI answer is usually not “I use it for everything,” but “I know where it helps and where I still need judgment.” AI is great for compressing the iteration loop, scaffolding code, exploring options, writing first drafts, and accelerating repetitive tasks. Where it gets dangerous is when people let it make architecture, product, or quality decisions without strong review. I try to be clear that I am pro-AI, but I am not outsourcing taste or responsibility to it.',
    takeaway: 'The interview-safe answer is “AI gives leverage, but judgment still matters.”',
  },
  {
    id: 'frontend-architecture',
    type: 'qa',
    category: 'Architecture',
    question: 'What makes a frontend architecture hold up over time?',
    shortAnswer:
      'Clear boundaries, shared patterns, and not overcomplicating state. I usually want predictable data flow, reusable UI primitives, and the simplest abstractions that let the team move fast without creating a pile of one-off solutions.',
    deepAnswer:
      'A frontend architecture holds up when it helps the team move consistently, not when it looks clever in a diagram. Clear boundaries matter because they prevent every feature from inventing its own patterns. Shared primitives matter because they keep product quality and implementation speed from drifting apart. Predictable data flow matters because state bugs multiply when the app gets larger. I also think teams overestimate how much architecture means “more layers.” Often the better architecture is the one that removes accidental complexity and keeps the core patterns obvious.',
    takeaway: 'A good architecture helps the team stay coherent as the product grows.',
  },
  {
    id: 'drill-tictactoe',
    type: 'drill',
    category: 'Coding Drills',
    prompt: 'Implement a getWinner(board) function for Tic-Tac-Toe. board is a 9-item array of X, O, or null.',
    hint1: 'There are only 8 winning lines. Hardcode them instead of trying to derive them live.',
    hint2:
      'Loop over winning index triplets and check board[a] && board[a] === board[b] && board[a] === board[c].',
    answer: `const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

function getWinner(board) {
  for (const [a, b, c] of WINNING_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]
    }
  }
  return null
}`,
    takeaway: 'When pressure spikes, simplify. Represent the 8 winning lines explicitly and move on.',
  },
  {
    id: 'drill-debounce',
    type: 'drill',
    category: 'Coding Drills',
    prompt: 'Implement debounce(fn, delay).',
    hint1: 'You need a timer variable living in a closure.',
    hint2: 'Clear the old timeout before scheduling a new one. Use function(...args) so this can be forwarded.',
    answer: `function debounce(fn, delay) {
  let timerId

  return function (...args) {
    const context = this
    clearTimeout(timerId)
    timerId = setTimeout(() => {
      fn.apply(context, args)
    }, delay)
  }
}`,
    takeaway: 'Most debounce bugs are just closure issues plus forgetting to preserve args/this.',
  },
  {
    id: 'drill-state-classification',
    type: 'drill',
    category: 'Coding Drills',
    prompt:
      'Classify these into local UI state, server state, or shared app state: modal open, current user, list of bets from API, active tab, wallet connection, leaderboard data, selected sportsbook filter used across pages.',
    hint1: 'Ask: does it come from the backend? If yes, it is probably server state.',
    hint2:
      'Ask: do multiple parts of the app need the client-owned value? If yes, it may be shared app state.',
    answer: `Local UI state:
- modal open
- active tab

Server state:
- list of bets from API
- leaderboard data

Shared app state:
- current user/session context
- wallet connection
- selected sportsbook filter used across pages`,
    takeaway:
      'Separating local, server, and shared client state gives you a clean default heuristic for many state-management questions.',
  },
  {
    id: 'drill-testing-strategy',
    type: 'drill',
    category: 'Coding Drills',
    prompt:
      'A company asks how you would improve testing in a frontend app with almost no coverage. Give a practical phased plan.',
    hint1: 'Do not say “test everything.” Start with the highest-risk workflows.',
    hint2:
      'Think E2E first for core flows, then integration around brittle UI/data behavior, then unit tests for isolated logic.',
    answer: `Phase 1: Identify the 3-5 most important user journeys and add E2E coverage.
Phase 2: Add integration tests around tricky component behavior and async/data interactions.
Phase 3: Add unit tests only for pure logic where they protect real complexity.
Phase 4: Make testing part of the normal shipping path instead of a separate afterthought.`,
    takeaway: 'Interviewers want sensible prioritization, not an unrealistic “test everything” answer.',
  },
]

const categories: StudyCategory[] = [
  'State Management',
  'Testing',
  'Web3 & Tooling',
  'Architecture',
  'Coding Drills',
]

const defaultProgress: ProgressState = {
  reviewed: {},
  shortExpanded: {},
  deepExpanded: {},
  codeExpanded: {},
  hint1: {},
  hint2: {},
}

function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultProgress
    return { ...defaultProgress, ...JSON.parse(raw) }
  } catch {
    return defaultProgress
  }
}

function App() {
  const [selectedCategory, setSelectedCategory] = useState<StudyCategory | 'All'>('All')
  const [query, setQuery] = useState('')
  const [showReviewedOnly, setShowReviewedOnly] = useState(false)
  const [progress, setProgress] = useState<ProgressState>(defaultProgress)

  useEffect(() => {
    setProgress(loadProgress())
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const matchesCategory = selectedCategory === 'All' || card.category === selectedCategory
      const haystack = card.type === 'qa'
        ? `${card.question} ${card.shortAnswer} ${card.deepAnswer} ${(card.bullets ?? []).join(' ')} ${card.sampleCode ?? ''} ${card.takeaway ?? ''}`.toLowerCase()
        : `${card.prompt} ${card.answer} ${card.hint1} ${card.hint2} ${card.takeaway} ${card.sampleCode ?? ''}`.toLowerCase()
      const matchesQuery = !query.trim() || haystack.includes(query.trim().toLowerCase())
      const matchesReviewed = !showReviewedOnly || Boolean(progress.reviewed[card.id])
      return matchesCategory && matchesQuery && matchesReviewed
    })
  }, [progress.reviewed, query, selectedCategory, showReviewedOnly])

  const reviewedCount = Object.values(progress.reviewed).filter(Boolean).length

  const toggleMapValue = (mapName: keyof ProgressState, id: string) => {
    setProgress((current) => ({
      ...current,
      [mapName]: {
        ...current[mapName],
        [id]: !current[mapName][id],
      },
    }))
  }

  const resetProgress = () => {
    setProgress(defaultProgress)
  }

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="hero-copy-wrap">
          <p className="eyebrow">Interview Study Cards</p>
          <h1>Study answers like a killer, not a victim.</h1>
          <p className="hero-copy">
            Mobile-friendly interview prep with short answers, deep explanations, code samples, and coding drills with hints. Built for repetition when you only have a few spare minutes.
          </p>
        </div>
        <div className="stats-card">
          <div>
            <span className="stat-label">Cards</span>
            <strong>{cards.length}</strong>
          </div>
          <div>
            <span className="stat-label">Reviewed</span>
            <strong>{reviewedCount}</strong>
          </div>
          <button className="ghost-button" onClick={resetProgress}>Reset progress</button>
        </div>
      </section>

      <section className="toolbar">
        <input
          className="search-input"
          type="text"
          placeholder="Search questions, concepts, tools, or code…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="filter-row">
          <button
            className={selectedCategory === 'All' ? 'filter-chip active' : 'filter-chip'}
            onClick={() => setSelectedCategory('All')}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={selectedCategory === category ? 'filter-chip active' : 'filter-chip'}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <label className="review-toggle">
          <input
            type="checkbox"
            checked={showReviewedOnly}
            onChange={() => setShowReviewedOnly((value) => !value)}
          />
          Reviewed only
        </label>
      </section>

      <section className="card-grid">
        {filteredCards.map((card) => {
          const reviewed = Boolean(progress.reviewed[card.id])

          return (
            <article key={card.id} className={reviewed ? 'study-card reviewed' : 'study-card'}>
              <div className="card-header">
                <span className="badge">{card.category}</span>
                <button
                  className={reviewed ? 'review-button reviewed' : 'review-button'}
                  onClick={() => toggleMapValue('reviewed', card.id)}
                >
                  {reviewed ? 'Reviewed' : 'Mark reviewed'}
                </button>
              </div>

              {card.type === 'qa' ? (
                <>
                  <p className="card-type">Interview question</p>
                  <h2>{card.question}</h2>

                  <div className="qa-actions">
                    <button className="answer-toggle" onClick={() => toggleMapValue('shortExpanded', card.id)}>
                      {progress.shortExpanded[card.id] ? 'Hide short answer' : 'Show short answer'}
                    </button>
                    <button className="deep-toggle" onClick={() => toggleMapValue('deepExpanded', card.id)}>
                      {progress.deepExpanded[card.id] ? 'Hide deeper answer' : 'Show deeper answer'}
                    </button>
                    {card.sampleCode && (
                      <button className="hint-button" onClick={() => toggleMapValue('codeExpanded', card.id)}>
                        {progress.codeExpanded[card.id] ? 'Hide code sample' : 'Show code sample'}
                      </button>
                    )}
                  </div>

                  {progress.shortExpanded[card.id] && (
                    <div className="answer-panel short-panel">
                      <p>{card.shortAnswer}</p>
                      {card.bullets && (
                        <ul>
                          {card.bullets.map((bullet) => (
                            <li key={bullet}>{bullet}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {progress.deepExpanded[card.id] && (
                    <div className="answer-panel deep-panel">
                      <p>{card.deepAnswer}</p>
                      {card.takeaway && <p className="takeaway"><strong>Takeaway:</strong> {card.takeaway}</p>}
                    </div>
                  )}

                  {card.sampleCode && progress.codeExpanded[card.id] && (
                    <div className="answer-panel code-panel">
                      <pre>{card.sampleCode}</pre>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <p className="card-type">Coding drill</p>
                  <h2>{card.prompt}</h2>
                  <div className="drill-actions">
                    <button className="hint-button" onClick={() => toggleMapValue('hint1', card.id)}>
                      {progress.hint1[card.id] ? 'Hide hint 1' : 'Show hint 1'}
                    </button>
                    <button className="hint-button" onClick={() => toggleMapValue('hint2', card.id)}>
                      {progress.hint2[card.id] ? 'Hide hint 2' : 'Show hint 2'}
                    </button>
                    <button className="answer-toggle" onClick={() => toggleMapValue('shortExpanded', card.id)}>
                      {progress.shortExpanded[card.id] ? 'Hide solution' : 'Show solution'}
                    </button>
                  </div>
                  {progress.hint1[card.id] && <div className="hint-panel"><strong>Hint 1:</strong> {card.hint1}</div>}
                  {progress.hint2[card.id] && <div className="hint-panel"><strong>Hint 2:</strong> {card.hint2}</div>}
                  {progress.shortExpanded[card.id] && (
                    <div className="answer-panel">
                      <pre>{card.answer}</pre>
                      <p className="takeaway"><strong>Takeaway:</strong> {card.takeaway}</p>
                    </div>
                  )}
                </>
              )}
            </article>
          )
        })}
      </section>
    </main>
  )
}

export default App
