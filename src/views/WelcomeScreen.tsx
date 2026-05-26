import { ArrowRight, BookOpen, Swords } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { levels } from '@/models/levels'
import { getNextRank, getRank, getXpProgress } from '@/models/ranks'
import { useGameStore } from '@/stores/gameStore'
import type { GameMode } from '@/types/game'

export function WelcomeScreen() {
  const startGame = useGameStore((s) => s.startGame)
  const startFlashcardLab = useGameStore((s) => s.startFlashcardLab)
  const progress = useGameStore((s) => s.progress)
  const setGameMode = useGameStore((s) => s.setGameMode)
  const hasSavedData = progress.xp > 0 || progress.completedLevels.length > 0
  const rank = getRank(progress.xp)
  const xpProgress = getXpProgress(progress.xp)
  const nextRank = getNextRank(progress.xp)
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null)

  const answerCount = progress.answerHistory.length
  const correctCount = progress.answerHistory.filter((r) => r.correct).length
  const accuracy = answerCount > 0 ? Math.round((correctCount / answerCount) * 100) : 0

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

        {!selectedMode && (
          <div className="grid grid-cols-2 gap-4 w-full">
            <button
              type="button"
              onClick={() => setSelectedMode('full-game')}
              className="flex flex-col items-center gap-3 rounded-2xl border-2 border-snuts-border bg-snuts-surface-3 p-6 text-left transition-all hover:border-snuts-cyan hover:bg-snuts-surface-2/50"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-snuts-cyan/20">
                <Swords className="w-6 h-6 text-snuts-cyan" />
              </div>
              <span className="text-snuts-text font-ui text-lg font-bold">Full Game</span>
              <span className="text-snuts-muted font-ui text-xs text-center leading-relaxed">
                Complete challenges, earn XP, climb ranks
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedMode('flashcard-lab')
                startFlashcardLab()
              }}
              className="flex flex-col items-center gap-3 rounded-2xl border-2 border-snuts-border bg-snuts-surface-3 p-6 text-left transition-all hover:border-snuts-accent hover:bg-snuts-surface-2/50"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-snuts-accent/20">
                <BookOpen className="w-6 h-6 text-snuts-accent" />
              </div>
              <span className="text-snuts-text font-ui text-lg font-bold">Flashcard Lab</span>
              <span className="text-snuts-muted font-ui text-xs text-center leading-relaxed">
                Browse all flashcards, no pressure
              </span>
            </button>
          </div>
        )}

        {selectedMode === 'full-game' && (
          <div className="flex flex-col gap-3 w-full animate-fadeIn">
            {hasSavedData && (
              <Button
                onClick={() => {
                  setGameMode('full-game')
                  startGame()
                }}
                className="bg-snuts-green text-snuts-code font-semibold hover:bg-snuts-green/90 h-12 text-base"
              >
                Continue Learning
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            )}

            <Button
              onClick={() => {
                setGameMode('full-game')
                useGameStore.getState().reset()
                useGameStore.getState().startGame()
              }}
              variant={hasSavedData ? 'outline' : 'default'}
              className={`h-12 text-base ${!hasSavedData ? 'bg-snuts-green text-snuts-code font-semibold hover:bg-snuts-green/90' : 'border-snuts-border text-snuts-muted'}`}
            >
              New Game
            </Button>

            <div className="flex flex-col gap-2 w-full">
              <span className="text-snuts-muted font-ui text-xs font-medium text-left">Level Select</span>
              <div className="grid grid-cols-3 gap-2">
                {levels.map((l, i) => {
                  const completed = progress.completedLevels.includes(l.id)
                  return (
                    <button
                      type="button"
                      key={l.id}
                      onClick={() => {
                        useGameStore.getState().reset()
                        startGame()
                        useGameStore.setState((s) => ({
                          progress: {
                            ...s.progress,
                            currentLevel: i,
                          },
                        }))
                      }}
                      className={`flex flex-col items-center gap-1 rounded-xl border p-3 transition-all ${
                        completed
                          ? 'border-snuts-green bg-snuts-green/10 text-snuts-green'
                          : i === progress.currentLevel && progress.currentPhase !== 'welcome'
                            ? 'border-snuts-cyan bg-snuts-cyan/10 text-snuts-cyan'
                            : 'border-snuts-border bg-snuts-surface-3 text-snuts-muted hover:border-snuts-cyan'
                      }`}
                    >
                      <span className="text-xs font-bold">{String(i + 1).padStart(2, '0')}</span>
                      <span className="font-ui text-[10px] leading-tight text-center">{l.name}</span>
                      {completed && <span className="text-xs">✅</span>}
                    </button>
                  )
                })}
              </div>
            </div>

            <Button
              variant="ghost"
              onClick={() => setSelectedMode(null)}
              className="text-snuts-muted hover:text-snuts-text"
            >
              Back
            </Button>
          </div>
        )}

        <div className="grid grid-cols-4 gap-3 w-full">
          {[
            { label: 'Test Smells', value: `${levels.length}`, icon: '🔍' },
            { label: 'XP Earned', value: `${progress.xp}`, icon: '⭐' },
            { label: 'Accuracy', value: answerCount > 0 ? `${accuracy}%` : '--', icon: '🎯' },
            { label: 'Completed', value: `${progress.completedLevels.length}/${levels.length}`, icon: '✅' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1.5 rounded-xl bg-snuts-surface-3 border border-snuts-border p-3"
            >
              <span className="text-lg">{stat.icon}</span>
              <span className="text-snuts-cyan font-code text-base font-bold">{stat.value}</span>
              <span className="text-snuts-muted font-ui text-[10px]">{stat.label}</span>
            </div>
          ))}
        </div>

        {hasSavedData && !selectedMode && (
          <Button
            variant="ghost"
            onClick={() => useGameStore.getState().reset()}
            className="text-snuts-muted hover:text-snuts-text"
          >
            Reset Progress
          </Button>
        )}
      </div>
    </div>
  )
}
