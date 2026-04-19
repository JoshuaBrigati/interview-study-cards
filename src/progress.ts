export type ProgressState = {
  reviewed: Record<string, boolean>
  xp: number
  streak: number
  lastStudyDate: string
  combo: number
  maxCombo: number
}

export const STORE_KEY = 'study-cards-v3'

export const defaultProgress: ProgressState = {
  reviewed: {},
  xp: 0,
  streak: 1,
  lastStudyDate: new Date().toISOString().slice(0, 10),
  combo: 0,
  maxCombo: 0,
}

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (!raw) return defaultProgress
    return { ...defaultProgress, ...(JSON.parse(raw) as Partial<ProgressState>) }
  } catch {
    return defaultProgress
  }
}
