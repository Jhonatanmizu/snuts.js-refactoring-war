import Prism from 'prismjs'
import { useCallback, useEffect, useState } from 'react'
import 'prismjs/components/prism-javascript'
import { Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { levels } from '@/models/levels'
import { getRank, getXpProgress } from '@/models/ranks'
import { useGameStore } from '@/stores/gameStore'

export function SpotSmellPhase() {
  const progress = useGameStore((s) => s.progress)
  const selectedSmell = useGameStore((s) => s.selectedSmell)
  const showingAnswer = useGameStore((s) => s.showingAnswer)
  const newBadges = useGameStore((s) => s.newBadges)
  const selectSmell = useGameStore((s) => s.selectSmell)
  const submitSmellAnswer = useGameStore((s) => s.submitSmellAnswer)
  const proceedFromSpotSmell = useGameStore((s) => s.proceedFromSpotSmell)
  const soundEnabled = useGameStore((s) => s.soundEnabled)
  const toggleSound = useGameStore((s) => s.toggleSound)

  const level = levels[progress.currentLevel]
  const challenge = level.spotSmellChallenge
  const rank = getRank(progress.xp)
  const xpProgress = getXpProgress(progress.xp)

  const [xpFloat, setXpFloat] = useState<{ id: number; text: string }[]>([])

  useEffect(() => {
    Prism.highlightAll()
  }, [])

  const handleSubmit = useCallback(() => {
    const option = challenge.options.find((o) => o.id === selectedSmell)
    const correct = option?.isCorrect ?? false
    const streakMultiplier = progress.streak >= 3 ? 1.5 : 1
    const earned = Math.round(100 * streakMultiplier)
    submitSmellAnswer()
    if (correct) {
      const id = Math.random()
      setXpFloat((prev) => [...prev, { id, text: `+${earned} XP` }])
      setTimeout(() => setXpFloat((prev) => prev.filter((f) => f.id !== id)), 1500)
    }
  }, [selectedSmell, submitSmellAnswer, challenge, progress.streak])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Enter' && selectedSmell && !showingAnswer) {
        handleSubmit()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectedSmell, showingAnswer, handleSubmit])

  return (
    <div className="flex flex-col gap-6 w-full h-full p-[28px] max-w-[1440px] mx-auto">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-[46px] h-[46px] rounded-lg bg-snuts-surface-2 border border-snuts-cyan">
          <span className="text-snuts-cyan font-code text-xl font-bold">S.</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-snuts-text font-ui text-xl font-bold">SNUTS.js</span>
          <span className="text-snuts-muted font-ui text-sm">Spot the Smell — {level.name}</span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-snuts-surface-3 border border-snuts-border px-3 py-2">
            <span className="text-xs">{rank.icon}</span>
            <span className="text-snuts-muted font-ui text-xs font-medium">{rank.title}</span>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-snuts-surface-3 border border-snuts-border px-3 py-2">
            <span className="text-snuts-muted font-ui text-xs font-medium">XP</span>
            <div className="w-20 h-2 rounded-full bg-snuts-chip overflow-hidden">
              <div
                className="h-full rounded-full bg-snuts-purple transition-all duration-500"
                style={{ width: `${xpProgress.percentage}%` }}
              />
            </div>
            <span className="text-snuts-text font-code text-xs font-semibold">{progress.xp}</span>
          </div>

          <button
            type="button"
            onClick={toggleSound}
            className={`flex items-center gap-1 rounded-xl border px-3 py-2 transition-colors ${
              soundEnabled
                ? 'bg-snuts-surface-3 border-snuts-border text-snuts-green'
                : 'bg-snuts-surface-3 border-snuts-border text-snuts-muted/50'
            }`}
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        <div className="flex-1 flex flex-col gap-4">
          <Card className="border-snuts-border bg-snuts-surface-3 flex-1 flex flex-col">
            <CardContent className="p-4 flex flex-col gap-4 flex-1">
              <div className="flex items-center gap-2 px-2">
                <span className="text-snuts-cyan text-sm">📄</span>
                <span className="text-snuts-text font-code text-xs font-medium">
                  Which test smell does this code exhibit?
                </span>
              </div>

              <div className="flex-1 rounded-xl bg-snuts-code border border-snuts-border overflow-hidden">
                <pre className="p-4 text-sm font-code leading-relaxed overflow-auto h-full min-h-[300px]">
                  <code className="language-javascript">{challenge.codeSnippet}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-[400px] flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-snuts-muted font-ui text-xs font-semibold uppercase tracking-wide">
              Pick the smell
            </span>
            <div className="flex items-center gap-1 rounded-md bg-snuts-surface-3 border border-snuts-border px-2 py-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={`w-3 h-3 rounded-full ${i < progress.lives ? 'bg-snuts-red' : 'bg-snuts-muted/30'}`}
                />
              ))}
              <span className="text-snuts-muted font-code text-xs ml-1">Lives</span>
            </div>
          </div>

          {challenge.options.map((option) => {
            const isSelected = selectedSmell === option.id
            const showCorrect = showingAnswer && option.isCorrect
            const showWrong = showingAnswer && isSelected && !option.isCorrect

            return (
              <button
                type="button"
                key={option.id}
                onClick={() => !showingAnswer && selectSmell(option.id)}
                disabled={showingAnswer}
                className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                  showCorrect
                    ? 'bg-snuts-surface border-snuts-green'
                    : showWrong
                      ? 'bg-snuts-surface border-snuts-red'
                      : isSelected
                        ? 'bg-snuts-surface-3 border-snuts-cyan'
                        : 'bg-snuts-code border-snuts-border hover:bg-snuts-surface'
                }`}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                    showCorrect
                      ? 'bg-snuts-green/20 border border-snuts-green'
                      : showWrong
                        ? 'bg-snuts-red/20 border border-snuts-red'
                        : isSelected
                          ? 'bg-snuts-surface-2 border border-snuts-cyan'
                          : 'bg-snuts-surface-2 border border-snuts-border'
                  }`}
                >
                  {showCorrect ? (
                    <span className="text-snuts-green text-lg">✓</span>
                  ) : showWrong ? (
                    <span className="text-snuts-red text-lg">✗</span>
                  ) : (
                    <span className="text-snuts-muted text-lg text-sm font-bold">{option.id.toUpperCase()}</span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-snuts-text font-ui text-sm font-semibold">{option.smellName}</span>
                </div>
              </button>
            )
          })}

          {showingAnswer && (
            <div className="rounded-xl bg-snuts-surface-3 border border-snuts-border p-4">
              <p className="text-snuts-cyan font-ui text-sm">
                {challenge.options.find((o) => o.isCorrect) === challenge.options.find((o) => o.id === selectedSmell)
                  ? 'Correct! You spotted the right smell.'
                  : `The correct answer is "${challenge.options.find((o) => o.isCorrect)?.smellName}". Review the flashcard and try again next time.`}
              </p>
            </div>
          )}

          {newBadges.length > 0 && (
            <div className="rounded-xl bg-snuts-surface border border-snuts-purple p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏅</span>
                <div>
                  <p className="text-snuts-purple font-ui text-sm font-bold">New Badge Unlocked!</p>
                  <p className="text-snuts-text font-ui text-xs">{newBadges.join(', ')}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-auto">
            {!showingAnswer ? (
              <Button
                onClick={handleSubmit}
                disabled={!selectedSmell}
                className="w-full bg-snuts-cyan text-snuts-code font-semibold hover:bg-snuts-cyan/90 disabled:opacity-50"
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={proceedFromSpotSmell}
                className="w-full bg-snuts-green text-snuts-code font-semibold hover:bg-snuts-green/90"
              >
                Continue to Refactoring Ref →
              </Button>
            )}
          </div>
        </div>
      </div>

      {xpFloat.map((f) => (
        <div
          key={f.id}
          className="fixed pointer-events-none animate-xpFloat font-code text-xl font-bold text-snuts-purple"
          style={{ left: 920, top: 80 }}
        >
          {f.text}
        </div>
      ))}
    </div>
  )
}
