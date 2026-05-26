import Prism from 'prismjs'
import { useEffect } from 'react'
import 'prismjs/components/prism-javascript'
import { ArrowLeft, ArrowRight, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { levels } from '@/models/levels'
import { useGameStore } from '@/stores/gameStore'

export function FlashcardLabPhase() {
  const currentLabCard = useGameStore((s) => s.currentLabCard)
  const setLabCard = useGameStore((s) => s.setLabCard)
  const currentSmellTab = useGameStore((s) => s.currentSmellTab)
  const toggleCodeTab = useGameStore((s) => s.toggleCodeTab)
  const soundEnabled = useGameStore((s) => s.soundEnabled)
  const toggleSound = useGameStore((s) => s.toggleSound)

  const goToMenu = () => {
    useGameStore.setState((s) => ({
      progress: { ...s.progress, currentPhase: 'welcome' },
    }))
  }

  const card = levels[currentLabCard].flashcard

  useEffect(() => {
    Prism.highlightAll()
  })

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft' && currentLabCard > 0) setLabCard(currentLabCard - 1)
      if (e.key === 'ArrowRight' && currentLabCard < levels.length - 1) setLabCard(currentLabCard + 1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [currentLabCard, setLabCard])

  return (
    <div className="flex flex-col gap-6 w-full h-full p-[28px] max-w-[1440px] mx-auto">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-[46px] h-[46px] rounded-lg bg-snuts-surface-2 border border-snuts-cyan">
          <span className="text-snuts-cyan font-code text-xl font-bold">F.</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-snuts-text font-ui text-xl font-bold">Flashcard Lab</span>
          <span className="text-snuts-muted font-ui text-sm">
            Browse all test smells &mdash; Card {currentLabCard + 1} of {levels.length}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-snuts-surface-3 border border-snuts-border px-3 py-2">
            <span className="text-snuts-muted font-ui text-xs font-medium">Progress</span>
            <div className="flex gap-1">
              {levels.map((l, i) => (
                <button
                  type="button"
                  key={l.name}
                  onClick={() => setLabCard(i)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    i === currentLabCard
                      ? 'bg-snuts-cyan'
                      : i < currentLabCard
                        ? 'bg-snuts-green'
                        : 'bg-snuts-surface-2 hover:bg-snuts-muted'
                  }`}
                />
              ))}
            </div>
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

        <div className="w-[320px] flex flex-col gap-4 flex-shrink-0">
          <Card className="border-snuts-border bg-snuts-surface-3">
            <CardContent className="p-5 flex flex-col gap-4">
              <h3 className="text-snuts-text font-ui text-base font-bold">🗂️ Deck Progress</h3>
              <div className="flex flex-col gap-3">
                {levels.map((l, i) => (
                  <button
                    type="button"
                    key={l.name}
                    onClick={() => setLabCard(i)}
                    className={`flex items-center gap-3 rounded-xl p-3 text-left transition-all ${
                      i === currentLabCard
                        ? 'bg-snuts-surface-2 border border-snuts-cyan'
                        : 'bg-snuts-code border border-snuts-border hover:bg-snuts-surface'
                    }`}
                  >
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold ${
                        i === currentLabCard
                          ? 'bg-snuts-cyan/20 text-snuts-cyan'
                          : 'bg-snuts-surface-2 text-snuts-muted'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span
                        className={`text-sm font-semibold ${
                          i === currentLabCard ? 'text-snuts-cyan' : 'text-snuts-text'
                        }`}
                      >
                        {l.name}
                      </span>
                      <span className="text-snuts-muted font-ui text-xs">{l.flashcard.smellName}</span>
                    </div>
                    {i === currentLabCard && <span className="ml-auto text-snuts-cyan text-xs">←</span>}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-snuts-border bg-snuts-surface-3">
            <CardContent className="p-5 flex flex-col gap-3">
              <h3 className="text-snuts-text font-ui text-base font-bold">💡 Tips</h3>
              <p className="text-snuts-muted font-ui text-sm leading-relaxed">
                Use <kbd className="px-1 py-0.5 rounded bg-snuts-chip text-snuts-text text-xs">→</kbd> and{' '}
                <kbd className="px-1 py-0.5 rounded bg-snuts-chip text-snuts-text text-xs">←</kbd> to navigate cards.
              </p>
              <p className="text-snuts-muted font-ui text-sm leading-relaxed">
                Toggle between <span className="text-snuts-red">Smelly</span> and{' '}
                <span className="text-snuts-green">The Fix</span> to compare.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-snuts-border bg-snuts-surface-3 px-[18px] py-[14px]">
        <Button variant="ghost" onClick={goToMenu} className="text-snuts-muted hover:text-snuts-text">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Menu
        </Button>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setLabCard(currentLabCard - 1)}
            disabled={currentLabCard <= 0}
            className="border-snuts-border text-snuts-muted"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <span className="text-snuts-muted font-code text-sm">
            {currentLabCard + 1} / {levels.length}
          </span>

          <Button
            variant="outline"
            onClick={() => setLabCard(currentLabCard + 1)}
            disabled={currentLabCard >= levels.length - 1}
            className="border-snuts-border text-snuts-muted"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}
