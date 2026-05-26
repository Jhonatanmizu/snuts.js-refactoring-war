import { Home, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { levels } from '@/models/levels'
import { getNextRank, getRank, getXpProgress } from '@/models/ranks'
import { useGameStore } from '@/stores/gameStore'

export function GameOverScreen() {
  const progress = useGameStore((s) => s.progress)
  const gameOverReason = useGameStore((s) => s.gameOverReason)
  const retryLevel = useGameStore((s) => s.retryLevel)
  const reset = useGameStore((s) => s.reset)
  const rank = getRank(progress.xp)
  const xpProgress = getXpProgress(progress.xp)
  const nextRank = getNextRank(progress.xp)

  const answerCount = progress.answerHistory.length
  const correctCount = progress.answerHistory.filter((r) => r.correct).length

  return (
    <div className="flex items-center justify-center min-h-screen bg-snuts-bg p-8">
      <div className="flex flex-col items-center gap-8 max-w-lg w-full">
        <div className="flex items-center justify-center w-[90px] h-[90px] rounded-2xl bg-snuts-red/20 border-2 border-snuts-red">
          <span className="text-snuts-red font-code text-5xl font-bold">!</span>
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-snuts-text font-ui text-3xl font-bold">Game Over</h1>
          <p className="text-snuts-muted font-ui text-sm leading-relaxed max-w-sm">{gameOverReason}</p>
        </div>

        <Card className="border-snuts-border bg-snuts-surface-3 w-full">
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between rounded-xl bg-snuts-code border border-snuts-border p-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{rank.icon}</span>
                <span className="text-snuts-text font-ui text-sm font-semibold">{rank.title}</span>
              </div>
              <div className="flex-1 mx-4">
                <div className="h-2 rounded-full bg-snuts-chip overflow-hidden">
                  <div
                    className="h-full rounded-full bg-snuts-purple transition-all duration-500"
                    style={{ width: `${xpProgress.percentage}%` }}
                  />
                </div>
              </div>
              <span className="text-snuts-text font-code text-xs font-semibold">{progress.xp} XP</span>
              {nextRank && (
                <span className="text-snuts-muted font-code text-xs ml-2">
                  Next: {nextRank.icon} {nextRank.title}
                </span>
              )}
            </div>

            <div className="flex items-center justify-center gap-6">
              <div className="flex flex-col items-center gap-1">
                <span className="text-snuts-yellow text-2xl">⭐</span>
                <span className="text-snuts-text font-code text-lg font-bold">{progress.xp}</span>
                <span className="text-snuts-muted font-ui text-xs">XP</span>
              </div>
              <div className="w-px h-10 bg-snuts-border" />
              <div className="flex flex-col items-center gap-1">
                <span className="text-snuts-cyan text-2xl">📊</span>
                <span className="text-snuts-text font-code text-lg font-bold">
                  {progress.completedLevels.length}/{levels.length}
                </span>
                <span className="text-snuts-muted font-ui text-xs">Levels</span>
              </div>
              <div className="w-px h-10 bg-snuts-border" />
              <div className="flex flex-col items-center gap-1">
                <span className="text-snuts-green text-2xl">✓</span>
                <span className="text-snuts-text font-code text-lg font-bold">
                  {answerCount > 0 ? `${Math.round((correctCount / answerCount) * 100)}%` : '--'}
                </span>
                <span className="text-snuts-muted font-ui text-xs">Accuracy</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-4 w-full">
          <Button
            onClick={retryLevel}
            className="flex-1 bg-snuts-cyan text-snuts-code font-semibold hover:bg-snuts-cyan/90 h-12 text-base"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button
            onClick={reset}
            variant="outline"
            className="flex-1 border-snuts-border text-snuts-muted hover:text-snuts-text h-12 text-base"
          >
            <Home className="w-4 h-4 mr-2" />
            Main Menu
          </Button>
        </div>
      </div>
    </div>
  )
}
