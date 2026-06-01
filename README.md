# Interview Study Cards

Focused front-end interview prep app for practical panel rounds.

Current deck is tuned for Joshua's Apple panel prep:

- Behavioral
  - staying curious
  - building relationships
  - learning new technology
  - difficult decisions
  - feedback
  - why Apple / why this role
- React
  - hooks, state, closures, keys, memoization, Strict Mode
- DOM & CSS
  - layout, event model, accessibility, specificity, stacking context, performance
- Architecture
  - state ownership, loading/error states, testing priorities, component boundaries, localization
- Drills
  - debounce, throttle, usePrevious, click outside, event delegation, accessible tabs

## Scripts

```bash
npm run dev
npm run build
npm run lint
```

## Notes

- Build currently passes.
- Lint currently reports existing `react-hooks/set-state-in-effect` issues in several UI components. That is separate from the Apple-content update and can be cleaned up next if you want.
