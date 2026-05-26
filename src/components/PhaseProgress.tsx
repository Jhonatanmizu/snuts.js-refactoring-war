import { useGameStore } from '@/stores/gameStore'

const PHASES = [
  { id: 'flashcard', icon: '📖', label: 'Flashcard' },
  { id: 'spot-smell', icon: '🔍', label: 'Spot Smell' },
  { id: 'refactoring-ref', icon: '🔧', label: 'Refactoring' },
  { id: 'code-editor', icon: '⌨️', label: 'Code Editor' },
] as const

const PHASE_ORDER = PHASES.map((p) => p.id)

export function PhaseProgress() {
  const currentPhase = useGameStore((s) => s.progress.currentPhase)

  if (
    currentPhase === 'welcome' ||
    currentPhase === 'game-over' ||
    currentPhase === 'level-complete' ||
    currentPhase === 'flashcard-lab'
  ) {
    return null
  }

  const currentIndex = PHASE_ORDER.indexOf(currentPhase)

  return (
    <div className="flex items-center gap-1.5">
      {PHASES.map((phase, i) => {
        const isActive = i === currentIndex
        const isDone = i < currentIndex
        return (
          <div key={phase.id} className="flex items-center gap-1.5">
            <div
              className={`flex items-center justify-center w-[22px] h-[22px] rounded-full transition-all ${
                isActive
                  ? 'bg-snuts-cyan/20 border border-snuts-cyan'
                  : isDone
                    ? 'bg-snuts-green/20 border border-snuts-green'
                    : 'bg-snuts-surface-2 border border-snuts-border'
              }`}
            >
              <span
                className={`text-[10px] ${isActive ? 'text-snuts-cyan' : isDone ? 'text-snuts-green' : 'text-snuts-muted/50'}`}
              >
                {phase.icon}
              </span>
            </div>
            {i < PHASES.length - 1 && (
              <div className={`w-2 h-[1.5px] ${isDone ? 'bg-snuts-green/50' : 'bg-snuts-border'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
