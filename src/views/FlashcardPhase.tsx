import Prism from 'prismjs'
import { useEffect } from 'react'
import 'prismjs/components/prism-javascript'
import { Volume2, X } from 'lucide-react'
import { PhaseProgress } from '@/components/PhaseProgress'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { levels } from '@/models/levels'
import { getRank, getXpProgress } from '@/models/ranks'
import { useGameStore } from '@/stores/gameStore'

export function FlashcardPhase() {
  const progress = useGameStore((s) => s.progress)
  const currentSmellTab = useGameStore((s) => s.currentSmellTab)
  const completeFlashcard = useGameStore((s) => s.completeFlashcard)
  const toggleCodeTab = useGameStore((s) => s.toggleCodeTab)
  const soundEnabled = useGameStore((s) => s.soundEnabled)
  const toggleSound = useGameStore((s) => s.toggleSound)
  const goToMenu = useGameStore((s) => s.goToMenu)
  const notification = useGameStore((s) => s.notification)
  const clearNotification = useGameStore((s) => s.clearNotification)

  const level = levels[progress.currentLevel]
  const card = level.flashcard
  const rank = getRank(progress.xp)
  const xpProgress = getXpProgress(progress.xp)

  useEffect(() => {
    Prism.highlightAll()
  })

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Enter') completeFlashcard()
      if (e.key === 'Escape') goToMenu()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [completeFlashcard, goToMenu])

  return (
    <div className="flex flex-col gap-6 w-full h-full p-[28px] max-w-[1440px] mx-auto">
      {notification && (
        <div className="rounded-xl bg-snuts-red/20 border border-snuts-red p-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="text-xl">💀</span>
            <p className="text-snuts-red font-ui text-sm flex-1">{notification}</p>
            <button
              type="button"
              onClick={clearNotification}
              className="text-snuts-muted hover:text-snuts-text text-xs"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-[46px] h-[46px] rounded-lg bg-snuts-surface-2 border border-snuts-cyan">
          <span className="text-snuts-cyan font-code text-xl font-bold">S.</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-snuts-text font-ui text-xl font-bold">SNUTS.js</span>
          <span className="text-snuts-muted font-ui text-sm">Learn Phase: {level.name}</span>
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

          <div className="flex items-center gap-2">
            <span className="text-snuts-muted font-ui text-xs font-medium">
              Level {progress.currentLevel + 1} of {levels.length}
            </span>
            <div className="flex gap-1">
              {levels.map((l, i) => (
                <div
                  key={l.name}
                  className={`w-2 h-2 rounded-full ${
                    i < progress.currentLevel
                      ? 'bg-snuts-green'
                      : i === progress.currentLevel
                        ? 'bg-snuts-cyan'
                        : 'bg-snuts-surface-2'
                  }`}
                />
              ))}
            </div>
          </div>

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
        <div className="flex-1 flex flex-col gap-4">
          <Card className="border-snuts-border bg-snuts-surface-3">
            <CardContent className="p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="text-snuts-cyan text-lg">📖</span>
                <h2 className="text-snuts-text font-ui text-xl font-bold">{card.smellName}</h2>
              </div>
              <p className="text-snuts-muted font-ui text-sm leading-relaxed">{card.description}</p>
            </CardContent>
          </Card>

          <Card className="border-snuts-border bg-snuts-surface-3 flex-1 flex flex-col">
            <CardContent className="p-4 flex flex-col gap-4 flex-1">
              <div className="flex gap-[6px] p-1 rounded-xl bg-snuts-code border border-snuts-border">
                <button
                  type="button"
                  onClick={() => toggleCodeTab('smelly')}
                  className={`flex items-center gap-2 flex-1 rounded-xl px-3 py-[10px] text-sm font-semibold transition-colors ${
                    currentSmellTab === 'smelly'
                      ? 'bg-snuts-surface-2 border border-snuts-red text-snuts-red'
                      : 'text-snuts-muted'
                  }`}
                >
                  <span className="text-sm">🐛</span>
                  Smelly Code
                </button>
                <button
                  type="button"
                  onClick={() => toggleCodeTab('fix')}
                  className={`flex items-center gap-2 flex-1 rounded-xl px-3 py-[10px] text-sm font-semibold transition-colors ${
                    currentSmellTab === 'fix'
                      ? 'bg-snuts-surface-2 border border-snuts-green text-snuts-green'
                      : 'text-snuts-muted'
                  }`}
                >
                  <span className="text-sm">✅</span>
                  The Fix
                </button>
              </div>

              <div className="flex-1 relative">
                <div className="absolute inset-0 rounded-xl bg-snuts-code border border-snuts-border overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-2 bg-snuts-surface-3 border-b border-snuts-border">
                    <span className="text-snuts-muted font-code text-xs">{card.fileName}</span>
                    <span className="text-snuts-cyan font-code text-xs">{card.language}</span>
                  </div>
                  <pre className="p-4 text-sm font-code leading-relaxed overflow-auto h-[calc(100%-40px)]">
                    <code className="language-javascript">
                      {currentSmellTab === 'smelly' ? card.smellyCode : card.fixCode}
                    </code>
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-end rounded-xl border border-snuts-border bg-snuts-surface-3 px-[18px] py-[14px]">
        <Button
          onClick={completeFlashcard}
          className="bg-snuts-cyan text-snuts-code font-semibold hover:bg-snuts-cyan/90"
        >
          Got it — Let's Practice →
        </Button>
      </div>
    </div>
  )
}
