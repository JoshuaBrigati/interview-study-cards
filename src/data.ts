export type Category = 'Behavioral' | 'React' | 'DOM & CSS' | 'Architecture' | 'Drills'

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
  followUps?: { question: string; answer: string }[]
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
  followUps?: { question: string; answer: string }[]
}

export type StudyCard = QuestionCard | DrillCard

export const CATEGORIES: Category[] = ['Behavioral', 'React', 'DOM & CSS', 'Architecture', 'Drills']

export const STUDY_CARDS: StudyCard[] = [
  {
    id: 'behavioral-staying-curious',
    type: 'qa',
    category: 'Behavioral',
    difficulty: 2,
    minutes: 3,
    question: 'Tell me about a time you stayed curious and learned something deeply to solve a problem.',
    shortAnswer:
      'A strong answer shows you did not stop at the first explanation. Walk through how you investigated, what signals you gathered, what you ruled out, and how that curiosity led to a better solution.',
    deepAnswer:
      'For Apple, curiosity should sound practical, not academic. A great story here is the Wishish MetaMask SES issue: something looked like a generic Supabase bug, but the real problem was an interaction caused by the extension environment. The important part is showing how you narrowed the problem space, challenged assumptions, and changed implementation based on what you learned. Curiosity at senior level is disciplined investigation, not just enthusiasm.',
    bullets: [
      'Start with the symptom, not your conclusion',
      'Explain what you tested and what you ruled out',
      'End with the technical fix plus the lesson learned',
    ],
    takeaway: 'Apple will like curiosity that improves product quality, not curiosity as a personality trait alone.',
    followUps: [
      {
        question: 'How do you know when to keep digging versus move on?',
        answer:
          'I keep digging while the uncertainty meaningfully changes the solution or risk. If extra investigation no longer changes the decision, I stop and ship the simplest sound path.',
      },
      {
        question: 'How do you avoid curiosity turning into over-engineering?',
        answer:
          'By tying the investigation to a concrete question. I am not exploring for its own sake, I am reducing the uncertainty that affects user experience, reliability, or delivery risk.',
      },
    ],
  },
  {
    id: 'behavioral-new-relationships',
    type: 'qa',
    category: 'Behavioral',
    difficulty: 2,
    minutes: 3,
    question: 'Tell me about building a new relationship with a cross-functional partner.',
    shortAnswer:
      'Focus on trust-building through reliability, clarity, and shared goals. Show how you learned what that person cared about and adapted your communication so you could make progress together.',
    deepAnswer:
      'This is likely one of the Apple themes directly. Your best angle is design engineer translation work: partnering with PMs, designers, and engineers, especially on ambiguous or quality-sensitive flows. The answer should not just be “we had meetings.” It should show that you understood another function’s incentives, translated your world into theirs, and created enough trust that decisions got easier over time.',
    bullets: [
      'Understand what success means to them',
      'Bring concrete artifacts: mocks, prototypes, tradeoffs',
      'Follow through consistently so trust compounds',
    ],
    takeaway: 'Apple wants someone who works well with experts, not someone who wins arguments.',
  },
  {
    id: 'behavioral-learning-new-tech',
    type: 'qa',
    category: 'Behavioral',
    difficulty: 2,
    minutes: 3,
    question: 'Tell me about learning a new technology quickly to deliver something important.',
    shortAnswer:
      'Pick an example where the new technology mattered to the outcome, explain your learning strategy, and show that you balanced speed with judgment instead of pretending you became an expert overnight.',
    deepAnswer:
      'For this role, Apple probably cares less about collecting buzzwords and more about whether you can learn fast without thrashing quality. Good examples could be ramping into blockchain auth flows at Burnt XION, new design-system infrastructure, or figuring out unfamiliar tooling to ship under pressure. Structure it around: what was new, how you reduced the learning surface, how you validated your understanding, and what shipped because of it.',
    takeaway: 'Make learning sound methodical and outcome-driven.',
  },
  {
    id: 'behavioral-difficult-decision',
    type: 'qa',
    category: 'Behavioral',
    difficulty: 3,
    minutes: 4,
    question: 'Tell me about a difficult decision where there was no perfect answer.',
    shortAnswer:
      'Explain the tradeoff clearly, say what you optimized for, and show that you considered second-order effects instead of framing it like an obvious choice.',
    deepAnswer:
      'Apple will care a lot about judgment here. A senior answer names the competing values: speed versus maintainability, polish versus scope, technical purity versus real-world delivery. Then explain the decision criteria, the risks you accepted, how you communicated it, and whether you would make the same call again. The best answers sound thoughtful and a little uncomfortable, because real tradeoffs are not clean.',
    takeaway: 'The bar is not “always right.” The bar is “good judgment under ambiguity.”',
    followUps: [
      {
        question: 'What if your stakeholders disagreed with the decision?',
        answer:
          'I would make the tradeoff explicit, show the cost of each path, and try to align on what we are actually optimizing for. If a call still needs to be made, I prefer a documented decision over vague disagreement.',
      },
    ],
  },
  {
    id: 'behavioral-why-apple',
    type: 'qa',
    category: 'Behavioral',
    difficulty: 1,
    minutes: 2,
    question: 'Why Apple, and why this in-store applications role?',
    shortAnswer:
      'Because the role sits at the intersection of frontend engineering, design quality, and direct customer impact. Apple has an unusually high bar for detail, and this role shapes how people understand and purchase products in physical retail.',
    deepAnswer:
      'A strong answer connects your strengths to the team rather than just complimenting the brand. You care about product quality, translating design into production UI, and building experiences that feel clear and trustworthy. This team is specifically about customer-facing retail software, which is a nice fit because the frontend work is not abstract infrastructure. It influences real decisions in real stores. That is a much stronger answer than “Apple is prestigious.”',
    takeaway: 'Tie your taste and product instincts directly to the role’s customer surface.',
  },
  {
    id: 'behavioral-feedback',
    type: 'qa',
    category: 'Behavioral',
    difficulty: 2,
    minutes: 3,
    question: 'Tell me about a time you received hard feedback.',
    shortAnswer:
      'Pick real feedback, not fake humblebrag feedback. Show that you understood it, adjusted your behavior, and got better outcomes because of it.',
    deepAnswer:
      'The wrong answer is performative self-awareness. The right answer shows you can hear feedback without becoming defensive and that you can turn it into a behavior change. This could be around over-building, communicating tradeoffs sooner, or testing in the real browser earlier. Apple tends to value people who can debate strongly but still absorb reality when the evidence says they should.',
    takeaway: 'Show growth without sounding fragile or rehearsed.',
  },

  {
    id: 'react-controlled-vs-uncontrolled',
    type: 'qa',
    category: 'React',
    difficulty: 1,
    minutes: 2,
    question: 'Controlled vs uncontrolled inputs?',
    shortAnswer:
      'Controlled inputs keep the value in React state. Uncontrolled inputs let the DOM own the value. I use controlled inputs when the UI depends on the value while typing, and uncontrolled inputs when simpler wiring is enough.',
    deepAnswer:
      'Controlled inputs are ideal when validation, conditional UI, formatting, or derived state needs to react on every change. Uncontrolled inputs can be simpler for straightforward forms where React does not need to own every keystroke. The deeper point is not memorizing definitions. It is knowing whether the product actually needs React to own the value continuously or only at submission time.',
    sampleCode: `const [query, setQuery] = useState('')
<input value={query} onChange={(e) => setQuery(e.target.value)} />

const inputRef = useRef<HTMLInputElement>(null)
<input ref={inputRef} defaultValue="" />`,
    takeaway: 'Pick the source of truth based on what the UI needs, not habit.',
  },
  {
    id: 'react-derived-state',
    type: 'qa',
    category: 'React',
    difficulty: 2,
    minutes: 3,
    question: 'What is derived state, and why is storing it often a mistake?',
    shortAnswer:
      'Derived state is data you can compute from props or existing state. Storing it separately often creates synchronization bugs because you now have two sources of truth.',
    deepAnswer:
      'A lot of React bugs come from storing both the raw data and some computed version of it, then forgetting to update one when the other changes. If the value can be computed from current inputs, I prefer computing it directly or memoizing it if it is expensive. I only store derived state when I intentionally need a snapshot or when the workflow truly demands a separate copy.',
    sampleCode: `const filteredItems = useMemo(() => {
  return items.filter((item) => item.name.includes(search))
}, [items, search])`,
    takeaway: 'If it can be calculated reliably from current state, it usually should not be stored separately.',
  },
  {
    id: 'react-useeffect',
    type: 'qa',
    category: 'React',
    difficulty: 2,
    minutes: 3,
    question: 'How do you think about useEffect?',
    shortAnswer:
      'I treat useEffect as a synchronization tool for side effects, not as a catch-all place for app logic. If something can happen during render or be derived directly, I prefer that over an effect.',
    deepAnswer:
      'Many React problems come from reaching for useEffect too quickly. Effects are for syncing with external systems: subscriptions, timers, DOM APIs, network requests, imperative libraries. They are not the right answer for every state transition or derived value. When I use an effect, I want the dependency list to tell a clear story about what external thing I am synchronizing with and why.',
    takeaway: 'The cleanest React often has fewer effects, not more.',
    followUps: [
      {
        question: 'What is a smell that useEffect is being misused?',
        answer:
          'If it is mostly moving values from one state variable into another or patching over render logic, it is usually a sign the state model wants simplification rather than another effect.',
      },
    ],
  },
  {
    id: 'react-stale-closure',
    type: 'qa',
    category: 'React',
    difficulty: 3,
    minutes: 3,
    question: 'What is a stale closure bug in React?',
    shortAnswer:
      'It happens when a function captures an old value from a previous render and later uses that outdated value. This commonly shows up with timers, subscriptions, and async callbacks.',
    deepAnswer:
      'React functions close over the values from the render where they were created. That is usually fine until a callback runs later and you expect it to see fresh state. Then you get behavior that feels inconsistent or “laggy.” Fixes depend on the case: use functional state updates, correct dependencies, refs for mutable current values, or move the logic so it no longer depends on stale captured data.',
    sampleCode: `setCount((current) => current + 1)`,
    takeaway: 'A stale closure is usually not a React mystery. It is normal JavaScript closure behavior showing up in a render-driven system.',
  },
  {
    id: 'react-keys',
    type: 'qa',
    category: 'React',
    difficulty: 1,
    minutes: 2,
    question: 'Why do keys matter in React lists?',
    shortAnswer:
      'Keys tell React which item is which across renders so it can reconcile correctly. Bad keys lead to incorrect state preservation, weird UI bugs, and unnecessary remounting.',
    deepAnswer:
      'Keys are identity, not just warning suppression. If list items can move, be inserted, or be removed, unstable keys like array indexes can make React attach the wrong state to the wrong row. That is why keyed identity matters most when components are stateful or reorder frequently. Stable unique IDs are the best default whenever the data has them.',
    takeaway: 'Keys are about identity and state continuity, not just performance.',
  },
  {
    id: 'react-usememo-usecallback',
    type: 'qa',
    category: 'React',
    difficulty: 2,
    minutes: 3,
    question: 'When do you use useMemo and useCallback?',
    shortAnswer:
      'Only when memoization solves a real problem like expensive recalculation or referential stability. I do not add them everywhere by default because they add complexity too.',
    deepAnswer:
      'A lot of frontend codebases get noisier because people memoize everything “just in case.” I prefer clarity first, then memoize hot paths or identity-sensitive edges. useMemo helps when recomputation is expensive or a stable derived value matters. useCallback matters when function identity affects memoized children, effect dependencies, or similar performance-sensitive boundaries.',
    takeaway: 'Memoization is a tool, not a coding style.',
  },
  {
    id: 'react-context-vs-redux',
    type: 'qa',
    category: 'React',
    difficulty: 2,
    minutes: 3,
    question: 'Context vs Zustand vs Redux — when?',
    shortAnswer:
      'Context for relatively stable shared state like auth or theme. Zustand for interactive shared client state with lighter ceremony. Redux when the state model is large enough that stricter structure helps the team.',
    deepAnswer:
      'The more important answer is the decision process. Start local by default. Only lift state when multiple parts of the app really need coordinated access. Then ask how change-heavy it is and how much structure the team needs. Context is easy to overuse because it feels built in and simple, but it is not always the right fit for fast-changing shared state.',
    takeaway: 'Tool choice should follow the shape of the state, not the popularity of the library.',
  },
  {
    id: 'react-custom-hooks',
    type: 'qa',
    category: 'React',
    difficulty: 2,
    minutes: 3,
    question: 'When do you create a custom hook?',
    shortAnswer:
      'When it creates a real conceptual boundary or lets multiple components share stateful logic cleanly. Not just to hide lines of code.',
    deepAnswer:
      'A custom hook is useful when the abstraction makes the calling component easier to understand. Typical cases are subscriptions, async state coordination, repeated form behavior, or domain-specific UI logic. The mistake is creating vague hooks that just bury complexity. Good hooks usually have a clear responsibility and a name that maps to a real idea in the product.',
    takeaway: 'Hooks should clarify behavior, not just relocate it.',
  },
  {
    id: 'react-strict-mode',
    type: 'qa',
    category: 'React',
    difficulty: 2,
    minutes: 2,
    question: 'Why does React Strict Mode sometimes run things twice in development?',
    shortAnswer:
      'Strict Mode intentionally re-invokes some logic in development to expose unsafe side effects and cleanup bugs. It is a development-only pressure test, not production behavior.',
    deepAnswer:
      'The practical answer is that Strict Mode helps you discover code that is not resilient to remounting or repeated effects. If an effect leaks subscriptions, a component mutates state during render, or imperative setup assumes it only runs once, Strict Mode makes that pain visible earlier. The right response is usually not to fight Strict Mode but to make the code more idempotent and cleanup-safe.',
    takeaway: 'If Strict Mode reveals a bug, it usually found a real fragility.',
  },

  {
    id: 'dom-flex-vs-grid',
    type: 'qa',
    category: 'DOM & CSS',
    difficulty: 1,
    minutes: 2,
    question: 'Flexbox vs Grid — when?',
    shortAnswer:
      'Flexbox is best for one-dimensional layout. Grid is best for two-dimensional layout. I use the one that matches the mental model of the UI instead of forcing one system everywhere.',
    deepAnswer:
      'Flexbox is great when the main problem is distributing items along one axis, like navs, button groups, or aligning content in a row or column. Grid is stronger when rows and columns both matter, like dashboards, card walls, or named layout regions. The best answer is not just definitions. It is showing that you pick layout tools based on structure, not habit.',
    takeaway: 'Choose the layout model that matches the problem’s geometry.',
  },
  {
    id: 'dom-event-bubbling',
    type: 'qa',
    category: 'DOM & CSS',
    difficulty: 2,
    minutes: 3,
    question: 'Explain event bubbling, capturing, and delegation.',
    shortAnswer:
      'Events travel down during capture and back up during bubble. Delegation attaches one handler higher in the tree and uses event.target or closest() to handle many child interactions efficiently.',
    deepAnswer:
      'Bubbling is usually the part frontend interviews care about because it explains why parent handlers fire after child handlers. Capturing is the earlier phase on the way down. Delegation is useful when you have many interactive children or dynamic content, because a single handler on an ancestor can manage them. In practical frontend work, this matters for performance, dynamic lists, and debugging unexpected interaction behavior.',
    sampleCode: `container.addEventListener('click', (event) => {
  const button = (event.target as HTMLElement).closest('[data-action]')
  if (!button) return
  doSomething(button.getAttribute('data-action'))
})`,
    takeaway: 'Know the model and at least one real use case like delegation.',
  },
  {
    id: 'dom-positioning-zindex',
    type: 'qa',
    category: 'DOM & CSS',
    difficulty: 2,
    minutes: 3,
    question: 'Why does z-index sometimes “not work”?',
    shortAnswer:
      'Because z-index only works within stacking contexts, and new stacking contexts can be created by positioning, opacity, transforms, filters, and other properties.',
    deepAnswer:
      'People often think z-index is global, but it is scoped by stacking context. If two elements live in different stacking contexts, a huge z-index on one may still sit below another element higher in its own context. When debugging, I usually inspect ancestors for position, transform, opacity, isolation, or other properties that create new stacking contexts. That is usually where the real issue is.',
    takeaway: 'When z-index seems broken, look for stacking context boundaries first.',
  },
  {
    id: 'dom-specificity',
    type: 'qa',
    category: 'DOM & CSS',
    difficulty: 1,
    minutes: 2,
    question: 'How do you think about CSS specificity?',
    shortAnswer:
      'Specificity is the priority system CSS uses when multiple rules match the same element. I try to keep specificity low and predictable so styling stays easy to override without resorting to !important.',
    deepAnswer:
      'This is less about memorizing exact scoring and more about keeping a sane system. Deep selectors, IDs, and !important often make a codebase brittle because every future change has to fight the old specificity. Whether I am using CSS modules, Tailwind, or another system, I still want predictable layering so component styles do not become a contest of escalating selector weight.',
    takeaway: 'Low, predictable specificity makes teams faster.',
  },
  {
    id: 'dom-accessibility',
    type: 'qa',
    category: 'DOM & CSS',
    difficulty: 2,
    minutes: 3,
    question: 'What accessibility basics do you keep in mind when building interactive UI?',
    shortAnswer:
      'Use semantic elements first, make everything keyboard reachable, preserve focus visibility, ensure labels are meaningful, and use ARIA only when native HTML is not enough.',
    deepAnswer:
      'A strong frontend answer here is practical: buttons should be buttons, not clickable divs. Focus states should not disappear. Modals should manage focus intentionally. Form fields need proper labels. Keyboard users should be able to operate the UI without guessing. ARIA can help, but the first move is usually better HTML, not more attributes. Apple is very likely to care about this because it aligns with product quality, not just compliance.',
    takeaway: 'Accessibility is usually better HTML plus thoughtful interaction states.',
  },
  {
    id: 'dom-reflow-repaint',
    type: 'qa',
    category: 'DOM & CSS',
    difficulty: 3,
    minutes: 3,
    question: 'What is the difference between reflow and repaint, and when do you care?',
    shortAnswer:
      'Reflow happens when layout must be recalculated. Repaint updates visual styling without changing layout. I care when UI is janky or when repeated DOM reads and writes are causing performance problems.',
    deepAnswer:
      'You do not need a browser-engine lecture here. The practical answer is that layout-affecting changes are more expensive because the browser may need to recalculate geometry. Then if you mix layout reads and writes in the wrong order, you can cause layout thrashing. In UI work this matters most for animations, scroll-linked interactions, big lists, and anything that feels visibly sluggish.',
    takeaway: 'Frontend performance questions usually want practical debugging instincts, not browser trivia.',
  },
  {
    id: 'dom-box-model',
    type: 'qa',
    category: 'DOM & CSS',
    difficulty: 1,
    minutes: 2,
    question: 'Explain the CSS box model.',
    shortAnswer:
      'An element’s box is content, padding, border, and margin. By default width and height apply to the content box, but with box-sizing: border-box they include padding and border too.',
    deepAnswer:
      'This matters because layout bugs often come from forgetting what is included in width calculations. Most teams sensibly set box-sizing: border-box globally because it makes components easier to size predictably. The interview answer should be crisp and grounded in real layout behavior, not overlong.',
    takeaway: 'box-sizing: border-box is usually the sane default.',
  },

  {
    id: 'arch-state-decision-tree',
    type: 'qa',
    category: 'Architecture',
    difficulty: 2,
    minutes: 3,
    question: 'How do you choose between local state, URL state, server state, and shared client state?',
    shortAnswer:
      'I classify the state first. Local UI state stays local. Shareable/bookmarkable state often belongs in the URL. Backend-owned data is server state. Shared client state is the smallest bucket and should be introduced only when multiple areas truly need it.',
    deepAnswer:
      'This is one of the strongest senior frontend answers because it shows structure. A lot of teams reach for one tool first and ask questions later. I prefer to classify the state by ownership and behavior. That leads to cleaner solutions and avoids stuffing everything into one global system. The best part is it also makes tradeoffs easier to explain to other engineers and PMs.',
    takeaway: 'Classify state before choosing tools.',
  },
  {
    id: 'arch-loading-empty-error',
    type: 'qa',
    category: 'Architecture',
    difficulty: 2,
    minutes: 2,
    question: 'How do you think about loading, empty, and error states?',
    shortAnswer:
      'They are product states, not afterthoughts. I want them designed intentionally because they shape how trustworthy the app feels under real conditions.',
    deepAnswer:
      'A lot of perceived product quality lives in non-happy-path states. If loading is jumpy, users think the app is slow. If empty states are vague, people think it is broken. If errors are generic, trust drops fast. Strong frontend systems treat these as first-class patterns rather than leaving each feature team to improvise.',
    takeaway: 'Great frontend work includes the transitions and failure modes, not just the happy path.',
  },
  {
    id: 'arch-testing-priority',
    type: 'qa',
    category: 'Architecture',
    difficulty: 2,
    minutes: 3,
    question: 'If an app has almost no tests, what would you add first?',
    shortAnswer:
      'Start with end-to-end coverage on the highest-value user flows. Then add integration tests around brittle UI/data interactions. Use unit tests surgically for pure logic where they provide real value.',
    deepAnswer:
      'This answer is about prioritization, not ideology. If the product’s critical workflow is broken, a pile of small unit tests does not save you. E2E often gives the best confidence per effort when there is no safety net yet. After that, add integration tests where the UI and async behavior are easy to break. Unit tests come in where logic is isolated and worth protecting. Apple may not spend a full round on testing, but this is a good senior signal.',
    takeaway: 'Protect business-critical behavior first.',
  },
  {
    id: 'arch-component-boundaries',
    type: 'qa',
    category: 'Architecture',
    difficulty: 2,
    minutes: 3,
    question: 'What makes a frontend architecture hold up over time?',
    shortAnswer:
      'Clear boundaries, predictable data flow, shared UI primitives, and the discipline to avoid one-off patterns unless they are truly justified.',
    deepAnswer:
      'Good architecture is not cleverness, it is coherence. Teams move faster when state ownership is clear, components have obvious responsibilities, shared patterns are trustworthy, and product logic is not scattered randomly across the tree. The strongest architectures usually reduce accidental complexity instead of adding layers for theoretical purity.',
    takeaway: 'Architecture should make the team faster and the product more consistent.',
  },
  {
    id: 'arch-pixel-perfect',
    type: 'qa',
    category: 'Architecture',
    difficulty: 2,
    minutes: 3,
    question: 'What does “pixel perfect” mean to you without becoming dogmatic?',
    shortAnswer:
      'It means respecting the intent of the design and delivering a polished, trustworthy UI, while still making sensible engineering decisions when browsers, content, or accessibility realities require adaptation.',
    deepAnswer:
      'For this Apple role, this is worth being ready for because the job description explicitly calls out pixel perfect designs. The best answer is not “I worship Figma measurements.” It is that details matter because they compound into user trust. Spacing, alignment, states, motion, typography, and interaction consistency all matter. But I also know where exact visual fidelity should yield to better semantics, responsiveness, or accessibility.',
    takeaway: 'Pixel perfect should mean high craft, not thoughtless literalism.',
  },
  {
    id: 'arch-localization',
    type: 'qa',
    category: 'Architecture',
    difficulty: 2,
    minutes: 3,
    question: 'What do you keep in mind for localization-ready frontend UI?',
    shortAnswer:
      'Text expands, layouts break, dates and numbers differ, and hardcoded assumptions show up fast. I try to design flexible components and avoid UI that only works for short English strings.',
    deepAnswer:
      'This matters because the Apple role mentions localization and worldwide partners. Senior frontend work anticipates translation, text growth, right-to-left possibilities, date/number formatting, and copy that arrives later than design. The practical mindset is to avoid brittle fixed-width UI, concatenate strings carefully, and build components that tolerate content variation instead of assuming the English comp is the truth forever.',
    takeaway: 'Localization is a layout and systems problem as much as a content problem.',
  },

  {
    id: 'drill-debounce',
    type: 'drill',
    category: 'Drills',
    difficulty: 2,
    minutes: 5,
    prompt: 'Implement debounce(fn, delay).',
    hint1: 'You need a timer variable that lives in a closure.',
    hint2: 'Clear the old timer before setting a new one. Use function(...args) if you want to preserve this.',
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
    takeaway: 'The classic gotchas are closure scope plus preserving args and this.',
  },
  {
    id: 'drill-throttle',
    type: 'drill',
    category: 'Drills',
    difficulty: 2,
    minutes: 5,
    prompt: 'Implement throttle(fn, delay).',
    hint1: 'Track whether execution is currently blocked.',
    hint2: 'A simple version can ignore calls while waiting. More advanced versions support trailing calls too.',
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
    takeaway: 'Throttle limits frequency. Debounce waits for the burst to stop.',
  },
  {
    id: 'drill-useprevious',
    type: 'drill',
    category: 'Drills',
    difficulty: 2,
    minutes: 4,
    prompt: 'Implement a simple usePrevious hook.',
    hint1: 'You need a ref so the value survives renders without causing new ones.',
    hint2: 'Update the ref in an effect after render, then return the previous value.',
    answer: `function usePrevious(value) {
  const ref = useRef()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}`,
    takeaway: 'Refs are useful for remembering values across renders without re-rendering.',
  },
  {
    id: 'drill-click-outside',
    type: 'drill',
    category: 'Drills',
    difficulty: 2,
    minutes: 5,
    prompt: 'Sketch a useClickOutside hook for a popover or dropdown.',
    hint1: 'Listen on document and check whether the target is inside the referenced element.',
    hint2: 'Do cleanup correctly so listeners do not leak.',
    answer: `function useClickOutside(ref, onOutsideClick) {
  useEffect(() => {
    function handlePointerDown(event) {
      if (!ref.current) return
      if (ref.current.contains(event.target)) return
      onOutsideClick()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [ref, onOutsideClick])
}`,
    takeaway: 'This is a clean interview example for effects, refs, DOM APIs, and cleanup.',
  },
  {
    id: 'drill-tabs-a11y',
    type: 'drill',
    category: 'Drills',
    difficulty: 3,
    minutes: 6,
    prompt: 'What would you build into an accessible tabs component?',
    hint1: 'Think semantics, keyboard behavior, and state wiring, not just visuals.',
    hint2: 'Buttons, roving focus or tab order, aria-selected, aria-controls, and clear active panel state.',
    answer: `Core pieces:
- Use buttons for the tabs
- Track activeTabId in state
- Each tab gets aria-selected and aria-controls
- Each panel gets role="tabpanel" and is labelled by its tab
- Support keyboard navigation with ArrowLeft / ArrowRight / Home / End
- Preserve visible focus states`,
    takeaway: 'Accessibility questions often reward structured thinking more than perfect memorization.',
  },
  {
    id: 'drill-event-delegation',
    type: 'drill',
    category: 'Drills',
    difficulty: 2,
    minutes: 4,
    prompt: 'You have a large list of action buttons that can be added dynamically. How would you handle clicks efficiently?',
    hint1: 'You do not need one listener per child.',
    hint2: 'Attach one listener to an ancestor and resolve the clicked element with closest().',
    answer: `container.addEventListener('click', (event) => {
  const target = event.target
  const actionButton = target instanceof HTMLElement
    ? target.closest('[data-action]')
    : null

  if (!actionButton) return
  const action = actionButton.getAttribute('data-action')
  handleAction(action)
})`,
    takeaway: 'Event delegation is a nice DOM answer because it shows model knowledge plus practicality.',
  },
]
