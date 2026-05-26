import {
  ArrowRight,
  CheckCircle2,
  FileCode,
  Flame,
  Heart,
  Lightbulb,
  Play,
  Sparkles,
  Timer,
  Volume2,
  XCircle,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { CodeEditor, SyntaxHighlightedCode } from '@/components/CodeEditor'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { levels } from '@/models/levels'
import { getRank, getXpProgress } from '@/models/ranks'
import { useGameStore } from '@/stores/gameStore'

const TIMER_SECONDS = 150

export function CodeEditorPhase() {
  const progress = useGameStore((s) => s.progress)
  const codeEditor = useGameStore((s) => s.codeEditor)
  const newBadges = useGameStore((s) => s.newBadges)
  const updateCodeEditorAnswer = useGameStore((s) => s.updateCodeEditorAnswer)
  const submitCodeEditorAnswer = useGameStore((s) => s.submitCodeEditorAnswer)
  const useCodeEditorHint = useGameStore((s) => s.useCodeEditorHint)
  const proceedFromCodeEditor = useGameStore((s) => s.proceedFromCodeEditor)
  const soundEnabled = useGameStore((s) => s.soundEnabled)
  const toggleSound = useGameStore((s) => s.toggleSound)

  const level = levels[progress.currentLevel]
  const challenge = level.codeEditorChallenge
  const rank = getRank(progress.xp)
  const xpProgress = getXpProgress(progress.xp)

  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS)
  const [showFix, setShowFix] = useState(false)
  const [xpFloat, setXpFloat] = useState<{ id: number; text: string; x: number; y: number }[]>([])

  const allFilled = challenge.blanks.every((_, i) => (codeEditor.typedAnswers[i]?.trim() ?? '') !== '')

  const handleSubmit = useCallback(() => {
    submitCodeEditorAnswer()
    if (allFilled) {
      const id = Math.random()
      setXpFloat((prev) => [...prev, { id, text: '+200 XP', x: 920, y: 80 }])
      setTimeout(() => setXpFloat((prev) => prev.filter((f) => f.id !== id)), 1500)
    }
  }, [allFilled, submitCodeEditorAnswer])

  useEffect(() => {
    if (codeEditor.codeCorrect !== null) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Enter' && allFilled) handleSubmit()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [codeEditor.codeCorrect, allFilled, handleSubmit])

  useEffect(() => {
    if (codeEditor.codeCorrect !== null) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          if (allFilled) handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [codeEditor.codeCorrect, allFilled, handleSubmit])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  const timeLow = timeLeft <= 30

  const lives = progress.lives

  const streakMultiplier = progress.streak >= 3 ? 1.5 : 1
  const hintsLeft = progress.hintsRemaining

  return (
    <div className="flex flex-col gap-6 w-full h-full p-[28px] max-w-[1440px] mx-auto">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-[46px] h-[46px] rounded-lg bg-snuts-surface-2 border border-snuts-cyan">
          <span className="text-snuts-cyan font-code text-xl font-bold">S.</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-snuts-text font-ui text-xl font-bold">SNUTS.js</span>
          <span className="text-snuts-muted font-ui text-sm">Code Editor — {level.name}</span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <Badge className="bg-snuts-chip text-snuts-text border-snuts-border font-code">
            Level {String(progress.currentLevel + 1).padStart(2, '0')}
          </Badge>

          <div className="flex items-center gap-2 rounded-xl bg-snuts-surface-3 border border-snuts-border px-3 py-2">
            <span className="text-xs">{rank.icon}</span>
            <span className="text-snuts-muted font-ui text-xs font-medium">{rank.title}</span>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-snuts-surface-3 border border-snuts-border px-3 py-2">
            <span className="text-snuts-muted font-ui text-xs font-medium">XP</span>
            <div className="w-24 h-2 rounded-full bg-snuts-chip overflow-hidden">
              <div
                className="h-full rounded-full bg-snuts-purple transition-all duration-500"
                style={{ width: `${xpProgress.percentage}%` }}
              />
            </div>
            <span className="text-snuts-text font-code text-xs font-semibold">
              {xpProgress.percentage >= 100 ? `${progress.xp} MAX` : `${progress.xp} / ${xpProgress.needed}`}
            </span>
          </div>

          <div className="flex items-center gap-1 rounded-xl bg-snuts-surface-3 border border-snuts-border px-3 py-2">
            <Flame
              className={`w-4 h-4 ${progress.streak >= 3 ? 'text-snuts-orange animate-pulse' : 'text-snuts-muted'}`}
            />
            <span
              className={`font-ui text-xs font-bold ${progress.streak >= 3 ? 'text-snuts-orange' : 'text-snuts-text'}`}
            >
              {progress.streak}x Combo
            </span>
          </div>

          <div
            className={`flex items-center gap-1 rounded-xl border px-3 py-2 ${
              timeLow ? 'bg-snuts-red/20 border-snuts-red' : 'bg-snuts-surface-3 border-snuts-border'
            }`}
          >
            <Timer className={`w-4 h-4 ${timeLow ? 'text-snuts-red' : 'text-snuts-cyan'}`} />
            <span
              className={`font-code text-xs font-bold ${timeLow ? 'text-snuts-red animate-pulse' : 'text-snuts-text'}`}
            >
              {timeStr}
            </span>
          </div>

          <div
            className={`flex items-center gap-1 rounded-xl border px-3 py-2 ${
              lives <= 1 ? 'bg-snuts-red/20 border-snuts-red animate-pulse' : 'bg-snuts-surface-3 border-snuts-border'
            }`}
          >
            {[0, 1, 2].map((i) => (
              <Heart
                key={i}
                className={`w-4 h-4 ${i < lives ? 'text-snuts-red' : 'text-snuts-muted'}`}
                fill={i < lives ? 'currentColor' : 'none'}
              />
            ))}
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
            <span className="font-ui text-xs font-medium">{soundEnabled ? 'On' : 'Off'}</span>
          </button>
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        <div className="w-[500px] flex flex-col gap-4 flex-shrink-0">
          <Card className="border-snuts-border bg-snuts-surface-3 flex-1 flex flex-col">
            <CardContent className="p-4 flex flex-col gap-3 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-snuts-cyan">
                  <FileCode className="w-4 h-4" />
                </span>
                <span className="text-snuts-text font-ui text-sm font-semibold">Objective</span>
              </div>
              <p className="text-snuts-muted font-ui text-xs leading-relaxed">{challenge.objective}</p>

              <div className="flex-1 min-h-0">
                {showFix ? (
                  <SyntaxHighlightedCode code={challenge.fixCode} language={challenge.language} />
                ) : (
                  <SyntaxHighlightedCode code={challenge.smellyCode} language={challenge.language} />
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowFix(false)}
                  className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                    !showFix
                      ? 'bg-snuts-surface-2 border border-snuts-red text-snuts-red'
                      : 'bg-snuts-code border border-snuts-border text-snuts-muted'
                  }`}
                >
                  🐛 Smelly Code
                </button>
                <button
                  type="button"
                  onClick={() => setShowFix(true)}
                  className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                    showFix
                      ? 'bg-snuts-surface-2 border border-snuts-green text-snuts-green'
                      : 'bg-snuts-code border border-snuts-border text-snuts-muted'
                  }`}
                >
                  ✅ The Fix
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-snuts-muted font-ui text-xs font-semibold uppercase tracking-wide flex items-center gap-2">
              <FileCode className="w-3 h-3" />
              Fill in the blanks to refactor
            </span>
            {progress.streak >= 3 && (
              <Badge className="bg-snuts-yellow/20 text-snuts-yellow border-snuts-yellow font-code">
                🔥 {streakMultiplier}x Streak Active
              </Badge>
            )}
          </div>

          <Card className="border-snuts-border bg-snuts-surface-3 flex-1 flex flex-col">
            <CardContent className="p-4 flex flex-col gap-3 flex-1">
              <CodeEditor
                lines={challenge.codeLines}
                blanks={challenge.blanks}
                typedAnswers={codeEditor.typedAnswers}
                onAnswerChange={updateCodeEditorAnswer}
                readOnly={codeEditor.codeCorrect !== null}
                fileName={challenge.fileName}
                language={challenge.language}
                className="flex-1"
              />

              {codeEditor.codeCorrect === true && (
                <div className="rounded-xl bg-snuts-green/20 border border-snuts-green p-4 animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-snuts-green flex-shrink-0" />
                    <div>
                      <p className="text-snuts-green font-ui text-sm font-bold">Correct!</p>
                      <p className="text-snuts-text font-ui text-xs mt-1">
                        The blanks were filled correctly. The smell has been removed!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {codeEditor.codeCorrect === false && (
                <div className="rounded-xl bg-snuts-red/20 border border-snuts-red p-4 animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-snuts-red flex-shrink-0" />
                    <div>
                      <p className="text-snuts-red font-ui text-sm font-bold">Not quite right</p>
                      <p className="text-snuts-text font-ui text-xs mt-1">
                        Some answers don't match. Review the smelly code and try again.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {codeEditor.usedHint && (
                <div className="rounded-xl bg-snuts-yellow/20 border border-snuts-yellow p-3">
                  <p className="text-snuts-yellow font-ui text-xs font-medium">
                    💡 Hint was applied — one answer was filled in for you.
                  </p>
                </div>
              )}

              {newBadges.length > 0 && (
                <div className="rounded-xl bg-snuts-surface border border-snuts-purple p-4 animate-slideUp">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-snuts-purple" />
                    <div>
                      <p className="text-snuts-purple font-ui text-sm font-bold">New Badge Unlocked!</p>
                      <p className="text-snuts-text font-ui text-xs">{newBadges.join(', ')}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex items-center justify-between rounded-xl border border-snuts-border bg-snuts-surface-3 px-[18px] py-[14px]">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={useCodeEditorHint}
                disabled={hintsLeft <= 0 || codeEditor.codeCorrect !== null}
                className="border-snuts-border text-snuts-warning hover:text-snuts-text"
              >
                <Lightbulb className="w-4 h-4" />
                Need a Hint? ({hintsLeft})
              </Button>
            </div>

            <div className="flex items-center gap-3">
              {codeEditor.checkingCode ? (
                <div className="flex items-center gap-2 text-snuts-cyan font-code text-xs">
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-snuts-cyan border-t-transparent rounded-full" />
                  Checking with snuts.js...
                </div>
              ) : codeEditor.codeCorrect === null ? (
                <>
                  <span className="text-snuts-muted font-code text-xs">
                    {allFilled
                      ? 'Ready'
                      : `${challenge.blanks.length - codeEditor.typedAnswers.filter((a) => a.trim()).length} blank(s) remaining`}
                  </span>
                  <Button
                    onClick={handleSubmit}
                    disabled={!allFilled}
                    className="bg-snuts-green text-snuts-code font-semibold hover:bg-snuts-green/90 disabled:opacity-50"
                  >
                    <Play className="w-4 h-4" />
                    Run snuts.js Check
                  </Button>
                </>
              ) : (
                <Button
                  onClick={proceedFromCodeEditor}
                  className="bg-snuts-cyan text-snuts-code font-semibold hover:bg-snuts-cyan/90"
                >
                  See Results
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {xpFloat.map((f) => (
        <div
          key={f.id}
          className="fixed pointer-events-none animate-xpFloat font-code text-xl font-bold text-snuts-purple"
          style={{ left: f.x, top: f.y }}
        >
          {f.text}
        </div>
      ))}
    </div>
  )
}
