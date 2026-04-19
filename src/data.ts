export type Category = 'State' | 'Testing' | 'Web3' | 'Architecture' | 'Drills'

export type QuestionCard = {
  id: string
  type: 'qa'
  category: Exclude<Category, 'Drills'>
  difficulty: 1 | 2 | 3
  minutes: number
  question: string
  shortAnswer: string
  deepAnswer: string
  bullets?: string[]
  sampleCode?: string
  takeaway?: string
}

export type DrillCard = {
  id: string
  type: 'drill'
  category: 'Drills'
  difficulty: 1 | 2 | 3
  minutes: number
  prompt: string
  hint1: string
  hint2: string
  answer: string
  takeaway?: string
}

export type StudyCard = QuestionCard | DrillCard

export const CATEGORIES: Category[] = ['State', 'Testing', 'Web3', 'Architecture', 'Drills']

export const STUDY_CARDS: StudyCard[] = [
  {
    id: 'state-mental-model',
    type: 'qa',
    category: 'State',
    difficulty: 2,
    minutes: 3,
    question: 'How do you think about state management in a frontend app?',
    shortAnswer:
      'I separate state into three buckets: local UI state, server state, and truly shared client state. Keep state local by default, treat backend data as server state, and only introduce shared stores when multiple parts genuinely need coordinated client-owned state.',
    deepAnswer:
      'Teams often shove everything into one solution and create unnecessary complexity. Local UI state should stay local because only one component cares. Server state behaves differently — the backend owns truth, so caching, refetching, and stale data matter more than reducers. Shared client state is the smallest bucket but most overused — only use it when multiple places need the same client-owned value at once.',
    bullets: [
      'Local UI: modals, tabs, form inputs, wizard steps',
      'Server: users, bets, messages, leaderboard data',
      'Shared client: auth, theme, wallet/session, workspace context',
    ],
    sampleCode: `// local UI state
const [isModalOpen, setIsModalOpen] = useState(false)

// server state
const { data, isLoading } = useQuery({
  queryKey: ['leaderboard'],
  queryFn: fetchLeaderboard,
})

// shared app state
const { currentWorkspace } = useWorkspaceContext()`,
    takeaway: 'Classify state before picking a tool.',
  },
  {
    id: 'state-tool-choice',
    type: 'qa',
    category: 'State',
    difficulty: 2,
    minutes: 3,
    question: 'Context vs Zustand vs Redux — when?',
    shortAnswer:
      'Context for relatively stable shared state (auth, theme, workspace). Zustand for interactive shared client state. Redux when the state model is large, heavily shared, and benefits from strict structure.',
    deepAnswer:
      'Context re-renders every consumer when its value changes — fine for stable values, painful for thrashy ones. Zustand gives selective subscriptions with less ceremony. Redux shines with large shared state models where conventions help the team. Default: start local, move up only when coordination is real.',
    sampleCode: `// Context: stable values
const WorkspaceContext = createContext({ workspaceId: null })

// Zustand: interactive shared state
const useMarketStore = create((set) => ({
  selectedMarket: null,
  setSelectedMarket: (m) => set({ selectedMarket: m }),
}))`,
    takeaway: 'Context is easy to overuse. Ask: how shared AND how change-heavy?',
  },
  {
    id: 'state-common-mistake',
    type: 'qa',
    category: 'State',
    difficulty: 1,
    minutes: 2,
    question: 'Common mistake teams make with state?',
    shortAnswer:
      'Making too much state global too early. Keep state as close as possible to where it is used; only lift it when there is a real coordination problem.',
    deepAnswer:
      'Global state feels "professional" but spreads logic out. Once global, every feature is tempted to depend on it, debugging gets noisier. Another mistake: using one solution for everything, mixing server data and client state together.',
    takeaway: 'Global state is a cost. Pay it only when the coordination win is worth it.',
  },
  {
    id: 'testing-honest',
    type: 'qa',
    category: 'Testing',
    difficulty: 2,
    minutes: 2,
    question: 'What testing have you done at past companies?',
    shortAnswer:
      'Some places had lighter testing culture than I would prefer, so quality came through manual QA, product review, and careful iteration. If I set the bar, I would want E2E coverage on critical flows plus targeted integration/unit where logic is easy to break.',
    deepAnswer:
      'Be honest without sounding anti-testing. Lighter formal coverage taught me where apps actually break — async state, permissions, important workflows. If improving the story, start by protecting the flows that matter most to users and business, not testing everything equally.',
    takeaway: 'Honest + improvement-oriented beats pretending every place had perfect coverage.',
  },
  {
    id: 'testing-priority',
    type: 'qa',
    category: 'Testing',
    difficulty: 2,
    minutes: 3,
    question: 'What testing would you add first to an app with no coverage?',
    shortAnswer:
      'Start with E2E on the most important user flows — best confidence per effort. Then integration tests around tricky component/data behavior. Unit tests for pure logic where they provide real value.',
    deepAnswer:
      'E2E protects what users actually do — if checkout or placing a bet breaks, 40 passing unit tests do not matter. Then integration for brittle UI + async. Unit surgically for pure logic, not as a first answer to every testing question.',
    sampleCode: `// Priority order
// 1. E2E: can a user complete the main workflow?
// 2. Integration: does this component + data interaction work?
// 3. Unit: does this pure helper hold up?`,
    takeaway: 'Interviewers want prioritization, not "we should test everything."',
  },
  {
    id: 'testing-levels',
    type: 'qa',
    category: 'Testing',
    difficulty: 1,
    minutes: 2,
    question: 'Unit vs integration vs E2E — explain.',
    shortAnswer:
      'Unit: isolated logic. Integration: components or systems working together. E2E: critical user flows in the real app. Use the level that matches the risk.',
    deepAnswer:
      'Unit: small, deterministic, easy to isolate (formatter, helper). Integration: bug risk from pieces interacting (UI + async + state). E2E: "can the user complete the workflow?" A healthy strategy uses all three, unevenly — depth should reflect the failure mode.',
    takeaway: 'The right test level depends on the bug you are preventing.',
  },
  {
    id: 'wagmi-viem-ethers',
    type: 'qa',
    category: 'Web3',
    difficulty: 3,
    minutes: 4,
    question: 'ethers.js vs wagmi vs viem?',
    shortAnswer:
      'Different layers. viem: low-level TypeScript-first EVM client. wagmi: React hooks for wallet/app-level onchain UX, built on viem. ethers: older general-purpose library, still widely used. Modern React today: wagmi + viem unless the existing codebase pushes toward ethers.',
    deepAnswer:
      'Understand the layering, not just names. viem for strongly typed reads/writes/utilities in modern TS. wagmi higher up — wallet connection, hooks, chain/account state, common onchain UX. ethers older and widely adopted, still valid especially in existing codebases. Show you understand where each sits and why.',
    sampleCode: `// viem: low-level read
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
})

// wagmi: React hooks
const { address, isConnected } = useAccount()
const { data } = useReadContract({
  address, abi, functionName: 'balanceOf',
  args: [userAddress],
})`,
    takeaway: 'Web3 tooling questions are usually about layers and tradeoffs.',
  },
  {
    id: 'viem-over-ethers',
    type: 'qa',
    category: 'Web3',
    difficulty: 2,
    minutes: 2,
    question: 'Why pick viem over ethers?',
    shortAnswer:
      'viem feels modern and TypeScript-native — better typing and ergonomics in new apps. ethers has massive ecosystem adoption, so not a dogmatic choice in existing codebases.',
    deepAnswer:
      'viem is designed for modern TS — typing is better, client model clearer, works nicely with wagmi. ethers has enormous adoption, good docs, ecosystem inertia. Frame as "default for greenfield" vs "reasonable in ethers-heavy codebases," not "ethers bad."',
    takeaway: 'Balanced tradeoff language beats dogmatic tool takes.',
  },
  {
    id: 'web3-wallet-client',
    type: 'qa',
    category: 'Web3',
    difficulty: 2,
    minutes: 2,
    question: 'Public client vs wallet client?',
    shortAnswer:
      'Public client: chain reads and general RPC. Wallet client: represents a connected wallet, used for signing or sending user-authorized transactions.',
    deepAnswer:
      'Not every interaction should involve the user wallet. Reads and contract queries go through a public client (no signing). A wallet client is tied to a user-controlled account — signing messages, sending transactions. Shows you understand read-only vs user-authorized actions.',
    sampleCode: `// public client = reads
const publicClient = createPublicClient({
  chain, transport: http()
})

// wallet client = user-authorized writes
const walletClient = createWalletClient({
  chain, transport: custom(window.ethereum)
})`,
    takeaway: 'Public for chain data. Wallet for user-authorized actions.',
  },
  {
    id: 'ai-philosophy',
    type: 'qa',
    category: 'Architecture',
    difficulty: 1,
    minutes: 2,
    question: 'How do you think about AI-assisted engineering?',
    shortAnswer:
      'Heavy use for exploration, scaffolding, implementation speed, pattern comparison. Still treat architecture, debugging, product judgment, and final quality as human-owned. Leverage is real, but only if someone strong is steering.',
    deepAnswer:
      'Strongest answer: "I know where it helps and where I still need judgment." AI is great for compressing iteration, scaffolding, first drafts, repetitive work. Dangerous when it makes architecture/product/quality decisions without strong review. Pro-AI, not outsourcing taste.',
    takeaway: 'AI gives leverage, but judgment still matters.',
  },
  {
    id: 'frontend-arch',
    type: 'qa',
    category: 'Architecture',
    difficulty: 3,
    minutes: 3,
    question: 'What makes a frontend architecture hold up?',
    shortAnswer:
      'Clear boundaries, shared patterns, simplest abstractions that let the team move fast. Predictable data flow, reusable UI primitives, no pile of one-off solutions.',
    deepAnswer:
      'Architecture holds up when it helps the team move consistently, not when it looks clever. Clear boundaries prevent every feature from inventing patterns. Shared primitives keep product quality and speed aligned. Predictable data flow keeps state bugs from multiplying. Better architecture often removes accidental complexity, not adds layers.',
    takeaway: 'Good architecture helps the team stay coherent as the product grows.',
  },
  {
    id: 'drill-tictactoe',
    type: 'drill',
    category: 'Drills',
    difficulty: 2,
    minutes: 5,
    prompt: 'Implement getWinner(board) for Tic-Tac-Toe. board is a 9-item array of X, O, or null.',
    hint1: 'There are only 8 winning lines. Hardcode them instead of deriving live.',
    hint2: 'Loop index triplets and check board[a] && board[a] === board[b] && board[a] === board[c].',
    answer: `const WINNING_LINES = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6],
]

function getWinner(board) {
  for (const [a, b, c] of WINNING_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]
    }
  }
  return null
}`,
    takeaway: 'Under pressure, simplify. Represent 8 lines explicitly and move on.',
  },
  {
    id: 'drill-debounce',
    type: 'drill',
    category: 'Drills',
    difficulty: 2,
    minutes: 5,
    prompt: 'Implement debounce(fn, delay).',
    hint1: 'You need a timer variable living in a closure.',
    hint2: 'Clear the old timeout before scheduling a new one. Use function(...args) so `this` can be forwarded.',
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
    takeaway: 'Most debounce bugs are closure issues + forgetting args/this.',
  },
  {
    id: 'drill-state-classify',
    type: 'drill',
    category: 'Drills',
    difficulty: 1,
    minutes: 3,
    prompt:
      'Classify: modal open, current user, list of bets from API, active tab, wallet connection, leaderboard data, selected sportsbook filter used across pages.',
    hint1: 'Comes from backend? → probably server state.',
    hint2: 'Multiple parts of the app need the client-owned value? → probably shared app state.',
    answer: `Local UI state:
  • modal open
  • active tab

Server state:
  • list of bets from API
  • leaderboard data

Shared app state:
  • current user/session context
  • wallet connection
  • selected sportsbook filter`,
    takeaway: 'Local / server / shared client — a clean default heuristic.',
  },
  {
    id: 'drill-testing-strategy',
    type: 'drill',
    category: 'Drills',
    difficulty: 2,
    minutes: 4,
    prompt:
      'A company asks how you would improve testing in a frontend app with almost no coverage. Give a phased plan.',
    hint1: 'Do not say "test everything." Start with highest-risk workflows.',
    hint2: 'E2E first for core flows → integration for brittle UI/data → unit for isolated logic.',
    answer: `Phase 1: Identify 3-5 most important user journeys; add E2E coverage.
Phase 2: Add integration tests around tricky component behavior and async/data.
Phase 3: Add unit tests for pure logic where they protect real complexity.
Phase 4: Make testing part of the normal shipping path, not an afterthought.`,
    takeaway: 'Interviewers want sensible prioritization, not "test everything."',
  },
  {
    id: 'react-controlled-vs-uncontrolled',
    type: 'qa',
    category: 'State',
    difficulty: 1,
    minutes: 2,
    question: 'Controlled vs uncontrolled inputs?',
    shortAnswer:
      'Controlled inputs keep the source of truth in React state. Uncontrolled inputs let the DOM hold the current value and you read it through refs or form submission. I default to controlled inputs when the UI depends on the value while typing, and uncontrolled when I want simpler wiring and do not need constant React-driven updates.',
    deepAnswer:
      'Controlled inputs are great when validation, formatting, conditional UI, or derived state depends on the value changing in real time. The tradeoff is more state wiring and more rerenders. Uncontrolled inputs can be simpler and cheaper when React does not need to react to every keystroke, especially in basic forms or when using native form submission patterns. The real question is whether React needs to own the value continuously or only at specific moments.',
    sampleCode: `// controlled
const [email, setEmail] = useState('')
<input value={email} onChange={(e) => setEmail(e.target.value)} />

// uncontrolled
const inputRef = useRef<HTMLInputElement>(null)
<input ref={inputRef} defaultValue="" />`,
    takeaway: 'Use controlled when UI logic depends on the value. Use uncontrolled when React does not need to care on every keystroke.',
  },
  {
    id: 'react-derived-state',
    type: 'qa',
    category: 'State',
    difficulty: 2,
    minutes: 3,
    question: 'What is derived state and when should you avoid storing it?',
    shortAnswer:
      'Derived state is data you can compute from existing state or props. I usually avoid storing it separately because duplicated state gets out of sync. If a value can be calculated from the current inputs, I would rather compute it than maintain a second source of truth.',
    deepAnswer:
      'A common frontend bug pattern is storing both the source data and some calculated version of it, then forgetting to update one when the other changes. That creates synchronization bugs fast. Derived values like filtered lists, totals, display labels, or validation state are often better computed on render or memoized if they are expensive. I only store derived state when recomputing it is truly costly or when I need to snapshot it intentionally for workflow reasons.',
    sampleCode: `const filteredItems = useMemo(() => {
  return items.filter((item) => item.name.includes(search))
}, [items, search])`,
    takeaway: 'If it can be computed from current state or props, it usually should not be its own stored state.',
  },
  {
    id: 'react-custom-hooks',
    type: 'qa',
    category: 'Architecture',
    difficulty: 2,
    minutes: 3,
    question: 'When would you make a custom hook?',
    shortAnswer:
      'I make a custom hook when I want to reuse stateful logic or side-effect logic across components, or when I want to simplify a component by extracting non-visual logic into a clearer abstraction.',
    deepAnswer:
      'A custom hook is useful when the same logic appears in multiple places, or when a component is getting noisy because it is mixing rendering with data fetching, event wiring, subscriptions, or state transitions. The important thing is that a custom hook should represent a real conceptual boundary, not just hide lines of code. If the abstraction makes the calling component easier to understand and the hook has a clear responsibility, it is usually worth it. If it just buries complexity without clarifying anything, it is probably premature.',
    sampleCode: `function useDebouncedValue<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])

  return debounced
}`,
    takeaway: 'Custom hooks should create a clearer boundary, not just move code around.',
  },
  {
    id: 'react-usememo-usecallback',
    type: 'qa',
    category: 'Architecture',
    difficulty: 2,
    minutes: 3,
    question: 'When do you use useMemo and useCallback?',
    shortAnswer:
      'I use them when referential stability actually matters or when a calculation is expensive enough to justify memoization. I do not add them everywhere by default because they also add complexity.',
    deepAnswer:
      'Memoization is useful when there is a measurable problem to solve. useMemo helps avoid recalculating expensive derived values on every render. useCallback is useful when function identity matters, like when passing callbacks into memoized children or effect dependencies. But a lot of apps get worse when people memoize everything out of habit, because it makes the code harder to reason about without real performance benefit. My default is clarity first, then memoize the hot paths or identity-sensitive edges.',
    sampleCode: `const expensiveResult = useMemo(() => {
  return computeLargeDataset(items)
}, [items])

const handleSelect = useCallback((id: string) => {
  setSelectedId(id)
}, [])`,
    takeaway: 'Memoization is for real performance or identity problems, not default style.',
  },
  {
    id: 'frontend-ssr-csr-isr',
    type: 'qa',
    category: 'Architecture',
    difficulty: 2,
    minutes: 4,
    question: 'How do you think about SSR vs CSR vs SSG vs ISR?',
    shortAnswer:
      'I choose based on freshness needs, SEO needs, and interaction needs. SSR helps when content must be fresh at request time and SEO matters. CSR is fine for highly interactive app surfaces where the shell can load client-side. SSG is great for mostly static content. ISR is useful when content can be stale briefly but should refresh over time without full rebuilds.',
    deepAnswer:
      'This is really about matching the rendering model to the product requirement. If the page is marketing or content-heavy and does not change often, static generation is usually ideal. If SEO matters and the data changes on request, SSR can make sense. If the surface is mostly an authenticated app where interaction matters more than initial crawlability, CSR is often fine. ISR sits in the middle for pages where freshness matters but full request-time rendering is unnecessary. A strong answer shows you are not dogmatic and that you care about tradeoffs like latency, caching, complexity, and SEO.',
    takeaway: 'Pick the rendering model based on freshness, SEO, and interaction needs, not fashion.',
  },
  {
    id: 'frontend-error-boundaries',
    type: 'qa',
    category: 'Architecture',
    difficulty: 1,
    minutes: 2,
    question: 'What are error boundaries and what do they not catch?',
    shortAnswer:
      'Error boundaries catch render-time errors in the component tree below them and let you render a fallback UI. They do not catch event-handler errors, async promise errors, or server-side errors automatically.',
    deepAnswer:
      'Error boundaries are useful because they stop one broken subtree from crashing the whole React app. They are best for isolating UI failures and giving the user some fallback instead of a blank page. But they are not a universal exception system. Errors in click handlers, async requests, or arbitrary business logic usually need their own handling path. Interviewers often want to know that you understand both their value and their limits.',
    takeaway: 'Error boundaries protect render trees, not every kind of runtime failure.',
  },
  {
    id: 'frontend-folder-structure',
    type: 'qa',
    category: 'Architecture',
    difficulty: 2,
    minutes: 3,
    question: 'How do you think about folder structure in a frontend app?',
    shortAnswer:
      'I want the structure to reflect how the team thinks about the product. Usually that means organizing around features or domains, not just dumping everything by file type. Shared primitives can live centrally, but product logic should usually stay near the feature that owns it.',
    deepAnswer:
      'Folder structure is really about navigability and ownership. Type-based structures like components/hooks/utils can work at small scale, but they often become dumping grounds as the app grows. Feature-oriented structure tends to hold up better because the code for a workflow lives near the workflow. I still keep shared UI primitives, design system pieces, and cross-cutting libraries in common places, but I want feature-level logic, tests, and hooks to stay near the area that owns them. Good structure helps new engineers answer “where would this live?” quickly.',
    takeaway: 'Structure should mirror the product and team ownership model, not just file types.',
  },
  {
    id: 'frontend-loading-empty-error',
    type: 'qa',
    category: 'Architecture',
    difficulty: 2,
    minutes: 2,
    question: 'How do you think about loading, empty, and error states?',
    shortAnswer:
      'They are part of the product, not polish. I want them designed intentionally and consistently because they shape how trustworthy the app feels under real conditions.',
    deepAnswer:
      'A lot of product quality comes from non-happy-path states. If loading feels inconsistent, users perceive the app as slow even when it is not. If empty states are vague, the UI feels broken instead of informative. If errors are generic, users lose trust fast. I usually want a consistent pattern library for loading, empty, error, retry, and partial-data states so teams do not reinvent them every time. That is both a product-quality and architecture decision.',
    takeaway: 'Real users spend more time in transitional states than designers often admit.',
  },
  {
    id: 'testing-rtl-vs-playwright',
    type: 'qa',
    category: 'Testing',
    difficulty: 2,
    minutes: 3,
    question: 'How do you think about React Testing Library vs Playwright?',
    shortAnswer:
      'They solve different levels of confidence. React Testing Library is good for component and interaction testing close to the UI layer. Playwright is better for high-confidence end-to-end user workflows in the real app.',
    deepAnswer:
      'React Testing Library is great when I want to test how a component behaves from the user perspective without booting the whole application. It is especially useful for forms, validation, conditional rendering, and interaction behavior. Playwright is more expensive but gives much stronger confidence for critical workflows because it exercises the real app in a browser. I usually do not treat them as substitutes. They complement each other. RTL helps me test UI behavior cheaply, while Playwright protects the workflows that matter most.',
    takeaway: 'RTL is for component-level confidence. Playwright is for workflow-level confidence.',
  },
  {
    id: 'testing-flaky-tests',
    type: 'qa',
    category: 'Testing',
    difficulty: 2,
    minutes: 2,
    question: 'What causes flaky tests and how do you reduce them?',
    shortAnswer:
      'Flaky tests usually come from timing assumptions, shared state leakage, nondeterministic data, network dependence, or tests relying on implementation details. I reduce them by making test setup deterministic, avoiding arbitrary waits, isolating state, and testing from the user perspective instead of brittle internals.',
    deepAnswer:
      'Flakiness is often a signal that the test is too coupled to unstable timing or environment details. Arbitrary sleep-based waits are a classic cause. So are tests that depend on previous test state, real network calls, or data that changes underneath them. I try to prefer explicit waiting on real conditions, stable fixtures, isolated setup/teardown, and user-facing assertions. Good testing culture is as much about reliability and trust as it is about raw coverage.',
    takeaway: 'A flaky test suite trains engineers to ignore signals, which defeats the point of having tests.',
  },
  {
    id: 'testing-what-not-to-test',
    type: 'qa',
    category: 'Testing',
    difficulty: 1,
    minutes: 2,
    question: 'What should you usually avoid testing heavily?',
    shortAnswer:
      'I avoid over-testing implementation details, trivial presentational components, or code paths that provide little value relative to maintenance cost. I care more about protecting meaningful behavior than maximizing test count.',
    deepAnswer:
      'The goal of testing is confidence, not test volume. If a component is purely presentational and easy to verify visually, heavy tests may not buy much. If a test asserts internal implementation details rather than user-visible behavior, it often becomes brittle during refactors. I would rather spend that energy on meaningful workflows, tricky logic, or interaction patterns that actually break in production. A smaller, trustworthy test suite is better than a giant noisy one.',
    takeaway: 'Test behavior and risk, not every line of code just because it exists.',
  },
  {
    id: 'drill-throttle',
    type: 'drill',
    category: 'Drills',
    difficulty: 2,
    minutes: 5,
    prompt: 'Implement throttle(fn, delay).',
    hint1: 'You need to remember whether execution is currently blocked.',
    hint2: 'Use a timer or timestamp guard so calls within the delay window are ignored or deferred depending on your version.',
    answer: `function throttle(fn, delay) {
  let waiting = false

  return function (...args) {
    if (waiting) return
    waiting = true
    fn.apply(this, args)

    setTimeout(() => {
      waiting = false
    }, delay)
  }
}`,
    takeaway: 'Throttle limits execution frequency. Debounce waits until calls stop.',
  },
  {
    id: 'drill-group-by',
    type: 'drill',
    category: 'Drills',
    difficulty: 2,
    minutes: 5,
    prompt: 'Implement groupBy(items, keyFn).',
    hint1: 'Reduce into an object or Map.',
    hint2: 'Initialize the array for a key before pushing into it.',
    answer: `function groupBy(items, keyFn) {
  return items.reduce((acc, item) => {
    const key = keyFn(item)
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})
}`,
    takeaway: 'Many array interview problems are careful accumulation plus good initialization.',
  },
  {
    id: 'drill-useeffect-cleanup',
    type: 'drill',
    category: 'Drills',
    difficulty: 2,
    minutes: 4,
    prompt: 'Write a useEffect that starts an interval and cleans it up correctly.',
    hint1: 'Return a cleanup function from useEffect.',
    hint2: 'If the effect depends on changing values, think about stale closures or dependencies.',
    answer: `useEffect(() => {
  const id = setInterval(() => {
    console.log('tick')
  }, 1000)

  return () => clearInterval(id)
}, [])`,
    takeaway: 'A lot of React bugs come from timers, listeners, or subscriptions that are never cleaned up.',
  },
  {
    id: 'drill-flatten-array',
    type: 'drill',
    category: 'Drills',
    difficulty: 1,
    minutes: 3,
    prompt: 'Flatten an array one level deep without using Array.prototype.flat.',
    hint1: 'Iterate and push into a new array.',
    hint2: 'If the current item is an array, spread or loop its contents into the output.',
    answer: `function flattenOneLevel(items) {
  const result = []

  for (const item of items) {
    if (Array.isArray(item)) {
      result.push(...item)
    } else {
      result.push(item)
    }
  }

  return result
}`,
    takeaway: 'Array interview questions usually reward clarity over cleverness.',
  },
  {
    id: 'web3-wallet-connection-flow',
    type: 'qa',
    category: 'Web3',
    difficulty: 2,
    minutes: 3,
    question: 'How do you think about wallet connection flow in a frontend app?',
    shortAnswer:
      'I think about it as a UX state machine: disconnected, connecting, connected, wrong network, signing, and error states. The goal is to make those states explicit and trustworthy instead of treating wallet connection like a single button click.',
    deepAnswer:
      'Wallet connection is not just “click connect.” It involves provider availability, user approval, account state, chain state, rejected requests, and sometimes mobile wallet quirks. A good frontend makes these states visible and predictable, because users are dealing with money and trust-sensitive actions. I want the UI to distinguish between disconnected, connected but wrong chain, signing, pending transaction, and failed/rejected states. If the app treats all of that as one vague connected state, users lose confidence fast.',
    takeaway: 'Wallet UX is really state management plus trust design.',
  },
  {
    id: 'web3-chain-switching',
    type: 'qa',
    category: 'Web3',
    difficulty: 2,
    minutes: 2,
    question: 'How do you handle chain switching in a web3 app?',
    shortAnswer:
      'I treat wrong-chain state explicitly in the UI and guide the user toward switching, rather than letting actions fail mysteriously. The app should know what chain it expects and surface that clearly before the user tries to transact.',
    deepAnswer:
      'Chain switching is both a technical and UX problem. Technically, the app needs to know the active chain and whether the wallet matches the expected environment. From a UX perspective, the app should not wait until a write fails to tell the user they are on the wrong chain. I prefer to surface wrong-network state early, provide a clear switch action when possible, and handle rejection/errors cleanly if the wallet refuses or the chain is not available. Interviewers usually want to hear that you think beyond the happy path.',
    takeaway: 'Wrong-network state should be first-class, not an afterthought.',
  },
  {
    id: 'web3-transaction-lifecycle',
    type: 'qa',
    category: 'Web3',
    difficulty: 3,
    minutes: 4,
    question: 'How do you think about transaction lifecycle in the frontend?',
    shortAnswer:
      'I treat it as multiple explicit states: preparing, awaiting signature, submitted, pending confirmation, confirmed, and failed. Users need to know exactly where they are in that flow.',
    deepAnswer:
      'A common mistake is collapsing the whole transaction lifecycle into “loading” and “done.” That hides what is actually happening and makes the app feel untrustworthy. The user needs to know whether they are being asked to sign, whether the transaction was submitted to the network, whether it is still pending, and whether final confirmation happened. Frontends should also distinguish rejection by the user from network failure or onchain failure. In a money or web3 product, transaction clarity is a core UX requirement, not polish.',
    sampleCode: `type TxState =
  | 'idle'
  | 'awaiting-signature'
  | 'submitted'
  | 'confirming'
  | 'confirmed'
  | 'failed'`,
    takeaway: 'Transaction UX should make the lifecycle explicit, not vague.',
  },
  {
    id: 'web3-optimistic-ui',
    type: 'qa',
    category: 'Web3',
    difficulty: 2,
    minutes: 3,
    question: 'Would you use optimistic UI in a web3 app?',
    shortAnswer:
      'Sometimes, but carefully. I would use optimism more for low-risk UI feedback than for pretending an onchain action is final before confirmation. In trust-sensitive flows, clarity beats fake speed.',
    deepAnswer:
      'Optimistic UI can make an app feel faster, but onchain actions are messy because submission is not the same as confirmation. I might optimistically reflect a local pending state, disable duplicate actions, or show the user that their intent has been captured. But I would not present a transaction as final just because the wallet call returned. In web3 and money-adjacent products, I care more about making pending state clear than making the UI look artificially fast.',
    takeaway: 'Optimism is fine for intent/pending state, not for pretending settlement already happened.',
  },
  {
    id: 'web3-rpc-failures',
    type: 'qa',
    category: 'Web3',
    difficulty: 2,
    minutes: 3,
    question: 'How do you handle RPC failures or unreliable chain reads?',
    shortAnswer:
      'I assume they will happen. The frontend should handle retries, stale data messaging, and degraded states cleanly instead of pretending the chain is always available.',
    deepAnswer:
      'RPC failures are normal enough that the UI should be designed around them. Reads can fail, lag, or disagree across providers, so I want clear loading and retry behavior, plus a good sense of when the displayed data was last updated. Depending on the product, I might want multiple providers, caching, or fallback reads. Most importantly, I do not want silent failure or confusing empty states that look like real data. The question is not whether failures happen, but whether the app handles them like an adult.',
    takeaway: 'Chain reliability is a product concern, not just an infra concern.',
  },
  {
    id: 'web3-indexer-vs-direct-read',
    type: 'qa',
    category: 'Web3',
    difficulty: 3,
    minutes: 4,
    question: 'When would you use an indexer vs direct onchain reads?',
    shortAnswer:
      'Direct reads are great for simple, current onchain data. Indexers make more sense when you need historical views, aggregation, search, richer queryability, or better performance across large datasets.',
    deepAnswer:
      'Direct reads are appealing because they are simple and close to the source of truth, but they do not scale well for complex history views, leaderboard-style queries, or anything requiring cross-entity aggregation. Indexers are valuable when the product needs richer query patterns, denormalized data, or fast historical exploration. The tradeoff is that indexers add infrastructure and potential lag behind chain truth. A strong answer shows you understand that this is a product/data-shape tradeoff, not just a technical preference.',
    takeaway: 'Use direct reads for simple live chain access. Use indexers when the product needs history, aggregation, or fast queryability.',
  },
  {
    id: 'web3-contract-hooks-architecture',
    type: 'qa',
    category: 'Web3',
    difficulty: 2,
    minutes: 3,
    question: 'How would you structure contract reads and writes in a React app?',
    shortAnswer:
      'I usually want a clean boundary between low-level contract interaction and UI components. Components should consume hooks or domain helpers rather than embedding raw contract logic everywhere.',
    deepAnswer:
      'If every component calls raw contract functions directly, the codebase gets repetitive and fragile quickly. I prefer a small contract/domain layer or custom hooks that standardize reads, writes, parameter formatting, error handling, and lifecycle state. Then UI components can focus on rendering and interaction instead of knowing every contract detail. That also makes future migrations, testing, and consistency much easier.',
    takeaway: 'Push raw contract details down into reusable hooks or domain utilities.',
  },
  {
    id: 'drill-format-transaction-state',
    type: 'drill',
    category: 'Drills',
    difficulty: 2,
    minutes: 4,
    prompt: 'Model a simple transaction state machine for a frontend and list the states you would track.',
    hint1: 'Think beyond loading/success/error.',
    hint2: 'Include user rejection and pending confirmation separately.',
    answer: `type TransactionState =
  | 'idle'
  | 'awaiting-signature'
  | 'rejected'
  | 'submitted'
  | 'confirming'
  | 'confirmed'
  | 'failed'`,
    takeaway: 'Money-adjacent UX gets much better when the lifecycle is explicit.',
  },
  {
    id: 'drill-group-transactions',
    type: 'drill',
    category: 'Drills',
    difficulty: 2,
    minutes: 5,
    prompt: 'Given an array of transactions, group them by status.',
    hint1: 'This is another reduce problem.',
    hint2: 'Initialize the array for a status before pushing into it.',
    answer: `function groupTransactionsByStatus(transactions) {
  return transactions.reduce((acc, tx) => {
    if (!acc[tx.status]) acc[tx.status] = []
    acc[tx.status].push(tx)
    return acc
  }, {})
}`,
    takeaway: 'A lot of interview coding questions repeat the same accumulation patterns in different clothes.',
  },
]
