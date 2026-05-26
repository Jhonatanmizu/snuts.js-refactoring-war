import { Button } from '@/components/ui/button'
import { getNextRank, getRank, getXpProgress } from '@/models/ranks'
import { useGameStore } from '@/stores/gameStore'

export function WelcomeScreen() {
  const startGame = useGameStore((s) => s.startGame)
  const progress = useGameStore((s) => s.progress)
  const hasSavedData = progress.xp > 0 || progress.completedLevels.length > 0
  const rank = getRank(progress.xp)
  const xpProgress = getXpProgress(progress.xp)
  const nextRank = getNextRank(progress.xp)

  return (
    <div className="flex items-center justify-center min-h-screen bg-snuts-bg p-8">
      <div className="flex flex-col items-center gap-8 max-w-lg text-center">
        <div className="flex items-center justify-center w-[80px] h-[80px] rounded-2xl bg-snuts-surface-2 border-2 border-snuts-cyan">
          <span className="text-snuts-cyan font-code text-4xl font-bold">S.</span>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-snuts-text font-ui text-4xl font-bold">SNUTS.js</h1>
          <p className="text-snuts-muted font-ui text-base leading-relaxed">
            Learn to sniff out test smells and refactor like a senior engineer. Master 3 essential anti-patterns through
            interactive challenges.
          </p>
        </div>

        {hasSavedData && (
          <div className="flex flex-col gap-3 w-full rounded-xl bg-snuts-surface-3 border border-snuts-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{rank.icon}</span>
                <span className="text-snuts-text font-ui text-sm font-semibold">{rank.title}</span>
              </div>
              {nextRank && (
                <span className="text-snuts-muted font-ui text-xs">
                  Next: {nextRank.icon} {nextRank.title}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-snuts-chip overflow-hidden">
                <div
                  className="h-full rounded-full bg-snuts-purple transition-all duration-500"
                  style={{ width: `${xpProgress.percentage}%` }}
                />
              </div>
              <span className="text-snuts-text font-code text-xs font-semibold flex-shrink-0">{progress.xp} XP</span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 w-full">
          <Button
            onClick={startGame}
            className="bg-snuts-green text-snuts-code font-semibold hover:bg-snuts-green/90 h-12 text-base"
          >
            {hasSavedData ? 'Continue Learning' : 'Start Training'}
          </Button>

          {hasSavedData && (
            <Button
              variant="ghost"
              onClick={() => useGameStore.getState().reset()}
              className="text-snuts-muted hover:text-snuts-text"
            >
              Reset Progress
            </Button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 w-full">
          {[
            { label: 'Test Smells', value: '3', icon: '🔍' },
            { label: 'XP Earned', value: `${progress.xp}`, icon: '⭐' },
            { label: 'Completed', value: `${progress.completedLevels.length}/3`, icon: '✅' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-2 rounded-xl bg-snuts-surface-3 border border-snuts-border p-4"
            >
              <span className="text-xl">{stat.icon}</span>
              <span className="text-snuts-cyan font-code text-lg font-bold">{stat.value}</span>
              <span className="text-snuts-muted font-ui text-xs">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
