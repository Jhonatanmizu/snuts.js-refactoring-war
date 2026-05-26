import { useGameStore } from '@/stores/gameStore'
import { CodeEditorPhase } from '@/views/CodeEditorPhase'
import { FlashcardPhase } from '@/views/FlashcardPhase'
import { LevelCompletePhase } from '@/views/LevelCompletePhase'
import { RefactoringPhase } from '@/views/RefactoringPhase'
import { SpotSmellPhase } from '@/views/SpotSmellPhase'
import { WelcomeScreen } from '@/views/WelcomeScreen'

function App() {
  const phase = useGameStore((s) => s.progress.currentPhase)

  switch (phase) {
    case 'welcome':
      return <WelcomeScreen />
    case 'flashcard':
      return <FlashcardPhase />
    case 'spot-smell':
      return <SpotSmellPhase />
    case 'refactoring-ref':
      return <RefactoringPhase />
    case 'code-editor':
      return <CodeEditorPhase />
    case 'level-complete':
      return <LevelCompletePhase />
    default:
      return <WelcomeScreen />
  }
}

export default App
