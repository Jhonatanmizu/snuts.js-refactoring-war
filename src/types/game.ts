export type GamePhase = 'welcome' | 'flashcard' | 'spot-smell' | 'refactoring-ref' | 'code-editor' | 'level-complete'

export interface Flashcard {
  smellName: string
  description: string
  smellyCode: string
  fixCode: string
  language: string
  fileName: string
}

export interface SpotSmellOption {
  id: string
  smellName: string
  isCorrect: boolean
}

export interface SpotSmellChallenge {
  codeSnippet: string
  options: SpotSmellOption[]
}

export interface RefactoringChoice {
  id: string
  title: string
  description: string
  code: string
  isCorrect: boolean
  explanation: string
  xpReward: number
}

export interface CodeLine {
  text: string
  highlight?: 'smell' | 'fix' | 'blank' | 'none'
  indent?: number
  tokens?: { text: string; color: string }[]
}

export interface CodeEditorChallenge {
  fileName: string
  language: string
  objective: string
  smellyCode: string
  fixCode: string
  codeLines: CodeLine[]
  blanks: { lineIndex: number; expected: string; hint?: string }[]
  hints: string[]
}

export interface RefactoringChallenge {
  smellyCode: string
  objective: string
  choices: RefactoringChoice[]
  hints: string[]
}

export interface Level {
  id: string
  name: string
  flashcard: Flashcard
  spotSmellChallenge: SpotSmellChallenge
  refactoringChallenge: RefactoringChallenge
  codeEditorChallenge: CodeEditorChallenge
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  condition: (progress: PlayerProgress) => boolean
}

export interface PlayerProgress {
  xp: number
  streak: number
  lives: number
  hintsRemaining: number
  completedLevels: string[]
  unlockedBadges: string[]
  currentLevel: number
  currentPhase: GamePhase
  spotSmellCorrect: number
  refactoringCorrect: number
  codeEditorCorrect: number
}
