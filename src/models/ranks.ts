export interface Rank {
  id: string
  title: string
  minXp: number
  icon: string
}

export const ranks: Rank[] = [
  { id: 'recruit', title: 'Recruit', minXp: 0, icon: '🌱' },
  { id: 'smell-spotter', title: 'Smell Spotter', minXp: 200, icon: '🔍' },
  { id: 'refactor-apprentice', title: 'Refactor Apprentice', minXp: 600, icon: '🔧' },
  { id: 'code-warrior', title: 'Code Warrior', minXp: 1200, icon: '⚔️' },
  { id: 'snuts-master', title: 'SNUTS Master', minXp: 2000, icon: '👑' },
]

export function getRank(xp: number): Rank {
  let rank = ranks[0]
  for (const r of ranks) {
    if (xp >= r.minXp) rank = r
  }
  return rank
}

export function getNextRank(xp: number): Rank | null {
  for (const r of ranks) {
    if (xp < r.minXp) return r
  }
  return null
}

export function getXpProgress(xp: number): { current: number; needed: number; percentage: number } {
  const next = getNextRank(xp)
  const current = getRank(xp)
  if (!next) return { current: xp, needed: xp, percentage: 100 }
  const range = next.minXp - current.minXp
  const progress = xp - current.minXp
  return {
    current: progress,
    needed: range,
    percentage: Math.min(100, Math.round((progress / range) * 100)),
  }
}
