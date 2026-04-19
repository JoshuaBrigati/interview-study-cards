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
]
