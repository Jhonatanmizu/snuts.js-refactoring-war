import Prism from 'prismjs'
import { useCallback, useEffect, useState } from 'react'
import 'prismjs/components/prism-javascript'
import { Lightbulb, Volume2, X } from 'lucide-react'
import { PhaseProgress } from '@/components/PhaseProgress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { levels } from '@/models/levels'
import { getRank, getXpProgress } from '@/models/ranks'
import { useGameStore } from '@/stores/gameStore'

export function RefactoringPhase() {
  const progress = useGameStore((s) => s.progress)
  const selectedChoice = useGameStore((s) => s.selectedChoice)
  const showingAnswer = useGameStore((s) => s.showingAnswer)
  const newBadges = useGameStore((s) => s.newBadges)
  const selectRefactoringChoice = useGameStore((s) => s.selectRefactoringChoice)
  const submitRefactoringAnswer = useGameStore((s) => s.submitRefactoringAnswer)
  const proceedFromRefactoring = useGameStore((s) => s.proceedFromRefactoring)
  const soundEnabled = useGameStore((s) => s.soundEnabled)
  const toggleSound = useGameStore((s) => s.toggleSound)
  const goToMenu = useGameStore((s) => s.goToMenu)
  const streakMultiplier = progress.streak >= 3 ? 1.5 : 1

  const level = levels[progress.currentLevel]
  const challenge = level.refactoringChallenge
  const rank = getRank(progress.xp)
  const xpProgress = getXpProgress(progress.xp)

  const [xpFloat, setXpFloat] = useState<{ id: number; text: string }[]>([])
  const [showHints, setShowHints] = useState(false)

  useEffect(() => {
    Prism.highlightAll()
  })

  const handleSubmit = useCallback(() => {
    const choice = challenge.choices.find((c) => c.id === selectedChoice)
    const correct = choice?.isCorrect ?? false
    const baseXp = correct ? (choice?.xpReward ?? 100) : 0
    const streakMultiplier = progress.streak >= 3 ? 1.5 : 1
    const earned = Math.round(baseXp * streakMultiplier)
    submitRefactoringAnswer()
    if (correct) {
      const id = Math.random()
      setXpFloat((prev) => [...prev, { id, text: `+${earned} XP` }])
      setTimeout(() => setXpFloat((prev) => prev.filter((f) => f.id !== id)), 1500)
    }
  }, [selectedChoice, progress.streak, submitRefactoringAnswer, challenge])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Enter' && selectedChoice && !showingAnswer) {
        handleSubmit()
      }
      if (e.key === 'Escape') goToMenu()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectedChoice, showingAnswer, handleSubmit, goToMenu])

  return (
    <div className="flex flex-col gap-6 w-full h-full p-[28px] max-w-[1440px] mx-auto">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-[46px] h-[46px] rounded-lg bg-snuts-surface-2 border border-snuts-cyan">
          <span className="text-snuts-cyan font-code text-xl font-bold">S.</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-snuts-text font-ui text-xl font-bold">SNUTS.js</span>
          <span className="text-snuts-muted font-ui text-sm">The Refactoring Ref — {level.name}</span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <PhaseProgress />
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

          <button
            type="button"
            onClick={goToMenu}
            className="flex items-center gap-1 rounded-xl border border-snuts-border bg-snuts-surface-3 px-3 py-2 transition-colors hover:text-snuts-text text-snuts-muted"
            title="Back to Menu (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        <div className="w-[500px] flex flex-col gap-4 flex-shrink-0">
          <Card className="border-snuts-border bg-snuts-surface-3 flex-1 flex flex-col">
            <CardContent className="p-4 flex flex-col gap-3 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-snuts-cyan text-sm">🎯</span>
                <span className="text-snuts-text font-ui text-sm font-semibold">Objective</span>
              </div>
              <p className="text-snuts-muted font-ui text-xs leading-relaxed">{challenge.objective}</p>

              <div className="flex-1 rounded-xl bg-snuts-code border border-snuts-border overflow-hidden mt-2 min-h-[250px]">
                <div className="flex items-center gap-3 px-4 py-2 bg-snuts-surface-3 border-b border-snuts-border">
                  <span className="text-snuts-red text-sm">🐛</span>
                  <span className="text-snuts-text font-code text-xs font-medium">Smelly Code</span>
                </div>
                <pre className="p-4 text-sm font-code leading-relaxed overflow-auto">
                  <code className="language-javascript">{challenge.smellyCode}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-snuts-muted font-ui text-xs font-semibold uppercase tracking-wide">
                Pick the correct refactor
              </span>
              <div className="flex items-center gap-1 rounded-md bg-snuts-surface-3 border border-snuts-border px-2 py-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={`w-3 h-3 rounded-full ${i < progress.lives ? 'bg-snuts-red' : 'bg-snuts-muted/30'}`}
                  />
                ))}
              </div>
            </div>
            {progress.streak >= 3 && (
              <Badge className="bg-snuts-yellow/20 text-snuts-yellow border-snuts-yellow font-code">
                🔥 {streakMultiplier}x Streak Active
              </Badge>
            )}
            {challenge.hints.length > 0 && !showingAnswer && (
              <div className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowHints((s) => !s)}
                  className="flex items-center gap-1.5 text-snuts-muted hover:text-snuts-cyan transition-colors text-xs"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  {showHints ? 'Hide Hints' : 'Show Hints'}
                </button>
                {showHints && (
                  <div className="flex flex-col gap-1 rounded-lg bg-snuts-surface-3 border border-snuts-border p-3 animate-fadeIn">
                    {challenge.hints.map((hint) => (
                      <p key={hint} className="text-snuts-muted font-ui text-xs leading-relaxed">
                        💡 {hint}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {challenge.choices.map((choice) => {
            const isSelected = selectedChoice === choice.id
            const correct = choice.isCorrect
            const showCorrect = showingAnswer && correct
            const showWrong = showingAnswer && isSelected && !correct

            return (
              <button
                type="button"
                key={choice.id}
                onClick={() => !showingAnswer && selectRefactoringChoice(choice.id)}
                className={`flex flex-col rounded-xl border transition-all overflow-hidden ${
                  showCorrect
                    ? 'border-snuts-green bg-snuts-surface'
                    : showWrong
                      ? 'border-snuts-red bg-snuts-surface animate-shake'
                      : isSelected
                        ? 'border-snuts-cyan bg-snuts-surface-3'
                        : 'border-snuts-border bg-snuts-code hover:bg-snuts-surface'
                }`}
              >
                <div className="flex items-center gap-4 p-4">
                  <div
                    className={`flex items-center justify-center w-[42px] h-[42px] rounded-lg flex-shrink-0 ${
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
                      <span className="text-snuts-muted text-lg">🔧</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 text-left flex-1">
                    <span className="text-snuts-text font-ui text-sm font-semibold">{choice.title}</span>
                    <span className="text-snuts-muted font-ui text-xs">{choice.description}</span>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`flex-shrink-0 ${
                      showingAnswer
                        ? choice.isCorrect
                          ? 'bg-snuts-green/20 text-snuts-green border-snuts-green'
                          : 'bg-snuts-surface-3 text-snuts-muted border-snuts-border'
                        : 'bg-snuts-surface-3 text-snuts-muted/50 border-snuts-border'
                    }`}
                  >
                    {showingAnswer ? `+${choice.xpReward} XP` : '? XP'}
                  </Badge>
                </div>

                {isSelected && (
                  <div className="border-t border-snuts-border">
                    <pre className="p-4 text-sm font-code leading-relaxed overflow-x-auto bg-snuts-code">
                      <code className="language-javascript">{choice.code}</code>
                    </pre>
                  </div>
                )}
              </button>
            )
          })}

          {showingAnswer && selectedChoice && !challenge.choices.find((c) => c.id === selectedChoice)?.isCorrect && (
            <div className="rounded-xl border border-snuts-green bg-snuts-surface overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-2 bg-snuts-green/10 border-b border-snuts-green/30">
                <span className="text-snuts-green text-sm">✓</span>
                <span className="text-snuts-green font-ui text-xs font-semibold">Correct Answer</span>
              </div>
              <pre className="p-4 text-sm font-code leading-relaxed overflow-x-auto">
                <code className="language-javascript">{challenge.choices.find((c) => c.isCorrect)?.code}</code>
              </pre>
            </div>
          )}

          {showingAnswer && (
            <div className="rounded-xl bg-snuts-surface-3 border border-snuts-border p-4">
              <p className="text-snuts-cyan font-ui text-sm">
                {challenge.choices.find((c) => c.isCorrect)?.explanation}
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

          <div className="flex items-center justify-between rounded-xl border border-snuts-border bg-snuts-surface-3 px-[18px] py-[14px] mt-auto">
            <span className="text-snuts-muted font-code text-xs">Streak: {progress.streak} 🔥</span>
            {!showingAnswer ? (
              <Button
                onClick={handleSubmit}
                disabled={!selectedChoice}
                className="bg-snuts-cyan text-snuts-code font-semibold hover:bg-snuts-cyan/90 disabled:opacity-50"
              >
                Submit Answer →
              </Button>
            ) : (
              <Button
                onClick={proceedFromRefactoring}
                className="bg-snuts-green text-snuts-code font-semibold hover:bg-snuts-green/90"
              >
                See Results →
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
