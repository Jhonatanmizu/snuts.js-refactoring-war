import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { levels } from '@/models/levels'
import { getRank, getXpProgress, getNextRank } from '@/models/ranks'
import { useGameStore } from '@/stores/gameStore'

export function LevelCompletePhase() {
  const progress = useGameStore((s) => s.progress)
  const continueToNextLevel = useGameStore((s) => s.continueToNextLevel)
  const reset = useGameStore((s) => s.reset)
  const rank = getRank(progress.xp)
  const xpProgress = getXpProgress(progress.xp)
  const nextRank = getNextRank(progress.xp)

  const isComplete = progress.currentLevel >= levels.length - 1

  return (
    <div className="flex items-center justify-center min-h-screen bg-snuts-bg p-8">
      <div className="flex flex-col items-center gap-8 max-w-lg text-center">
        {isComplete ? (
          <>
            <div className="flex items-center justify-center w-[100px] h-[100px] rounded-full bg-snuts-green/20 border-2 border-snuts-green">
              <span className="text-5xl">🎉</span>
            </div>

            <div className="flex flex-col gap-3">
              <h1 className="text-snuts-text font-ui text-3xl font-bold">
                Training Complete!
              </h1>
              <p className="text-snuts-muted font-ui text-sm leading-relaxed">
                You have mastered the 3 essential test smells.
                Your code reviews will never be the same.
              </p>
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
                  <span className="text-snuts-text font-code text-xs font-semibold">
                    {progress.xp} XP
                  </span>
                  {nextRank && (
                    <span className="text-snuts-muted font-code text-xs ml-2">
                      Next: {nextRank.icon} {nextRank.title}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center gap-2 rounded-xl bg-snuts-code border border-snuts-border p-4">
                    <span className="text-snuts-yellow text-2xl">⭐</span>
                    <span className="text-snuts-text font-code text-xl font-bold">{progress.xp}</span>
                    <span className="text-snuts-muted font-ui text-xs">Total XP</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 rounded-xl bg-snuts-code border border-snuts-border p-4">
                    <span className="text-snuts-cyan text-2xl">🔥</span>
                    <span className="text-snuts-text font-code text-xl font-bold">{progress.streak}</span>
                    <span className="text-snuts-muted font-ui text-xs">Best Streak</span>
                  </div>
                </div>

                {progress.unlockedBadges.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-snuts-muted font-ui text-xs font-semibold uppercase">
                      Badges Earned
                    </span>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {progress.unlockedBadges.map((badgeId) => (
                        <Badge
                          key={badgeId}
                          className="bg-snuts-surface border-snuts-purple text-snuts-purple font-code"
                        >
                          {badgeId === 'smell-detector'
                            ? '🔍 Smell Detector'
                            : badgeId === 'garbage-collector'
                              ? '♻️ Garbage Collector'
                              : '🛡️ CI/CD Guardian'}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Button
              onClick={reset}
              className="bg-snuts-cyan text-snuts-code font-semibold hover:bg-snuts-cyan/90"
            >
              Start Over
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center w-[100px] h-[100px] rounded-full bg-snuts-cyan/20 border-2 border-snuts-cyan">
              <span className="text-5xl">⭐</span>
            </div>

            <div className="flex flex-col gap-3">
              <h1 className="text-snuts-text font-ui text-3xl font-bold">
                Level Complete!
              </h1>
              <p className="text-snuts-muted font-ui text-sm">
                {levels[progress.currentLevel]?.name} — mastered.
              </p>
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
                  <span className="text-snuts-text font-code text-xs font-semibold">
                    {progress.xp} XP
                  </span>
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
                    <span className="text-snuts-orange text-2xl">🔥</span>
                    <span className="text-snuts-text font-code text-lg font-bold">{progress.streak}</span>
                    <span className="text-snuts-muted font-ui text-xs">Streak</span>
                  </div>
                </div>

                {progress.unlockedBadges.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {progress.unlockedBadges.map((badgeId) => (
                      <Badge
                        key={badgeId}
                        className="bg-snuts-surface border-snuts-purple text-snuts-purple font-code"
                      >
                        {badgeId === 'smell-detector'
                          ? '🔍 Smell Detector'
                          : badgeId === 'garbage-collector'
                            ? '♻️ Garbage Collector'
                            : '🛡️ CI/CD Guardian'}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Button
              onClick={continueToNextLevel}
              className="bg-snuts-green text-snuts-code font-semibold hover:bg-snuts-green/90"
            >
              Next Level →
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
