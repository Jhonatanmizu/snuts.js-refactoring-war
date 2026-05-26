import { create } from 'zustand'

import { badgeDefinitions } from '@/models/badges'
import { levels } from '@/models/levels'
import { playCorrect, playWrong, playLevelUp } from '@/lib/sound'
import type { PlayerProgress } from '@/types/game'

const STORAGE_KEY = 'snutsjs-game-progress'

function loadProgress(): PlayerProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as PlayerProgress
  } catch { /* ignore */ }
  return defaultProgress()
}

function defaultProgress(): PlayerProgress {
  return {
    xp: 0,
    streak: 0,
    lives: 3,
    hintsRemaining: 3,
    completedLevels: [],
    unlockedBadges: [],
    currentLevel: 0,
    currentPhase: 'welcome',
    spotSmellCorrect: 0,
    refactoringCorrect: 0,
    codeEditorCorrect: 0,
  }
}

function saveProgress(p: PlayerProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p))
  } catch { /* ignore */ }
}

function checkBadges(progress: PlayerProgress): string[] {
  return badgeDefinitions
    .filter((b) => !progress.unlockedBadges.includes(b.id))
    .filter((b) => b.condition(progress))
    .map((b) => b.id)
}

interface CodeEditorState {
  typedAnswers: string[]
  checkingCode: boolean
  codeCorrect: boolean | null
  usedHint: boolean
}

interface GameState {
  progress: PlayerProgress
  newBadges: string[]
  selectedChoice: string | null
  selectedSmell: string | null
  showingAnswer: boolean
  currentSmellTab: 'smelly' | 'fix'
  codeEditor: CodeEditorState
  soundEnabled: boolean

  startGame: () => void
  completeFlashcard: () => void
  selectSmell: (id: string) => void
  submitSmellAnswer: () => void
  proceedFromSpotSmell: () => void
  selectRefactoringChoice: (id: string) => void
  submitRefactoringAnswer: () => void
  proceedFromRefactoring: () => void
  updateCodeEditorAnswer: (index: number, value: string) => void
  submitCodeEditorAnswer: () => void
  useCodeEditorHint: () => void
  proceedFromCodeEditor: () => void
  continueToNextLevel: () => void
  toggleCodeTab: (tab: 'smelly' | 'fix') => void
  toggleSound: () => void
  reset: () => void
}

export const useGameStore = create<GameState>((set, get) => {
  const initial = loadProgress()

  const defaultCodeEditor: CodeEditorState = {
    typedAnswers: [],
    checkingCode: false,
    codeCorrect: null,
    usedHint: false,
  }

  return {
    progress: initial,
    newBadges: [],
    selectedChoice: null,
    selectedSmell: null,
    showingAnswer: false,
    currentSmellTab: 'smelly',
    codeEditor: { ...defaultCodeEditor },
    soundEnabled: true,

    startGame: () => {
      const updated: PlayerProgress = {
        ...get().progress,
        lives: 3,
        currentPhase: 'flashcard',
      }
      saveProgress(updated)
      set({ progress: updated })
    },

    completeFlashcard: () => {
      const { progress } = get()
      const updated: PlayerProgress = {
        ...progress,
        currentPhase: 'spot-smell',
      }
      saveProgress(updated)
      set({ progress: updated, showingAnswer: false, selectedSmell: null })
    },

    selectSmell: (id: string) => {
      set({ selectedSmell: id })
    },

    submitSmellAnswer: () => {
      const { progress, selectedSmell, soundEnabled } = get()
      if (!selectedSmell) return

      const level = levels[progress.currentLevel]
      const option = level.spotSmellChallenge.options.find((o) => o.id === selectedSmell)
      const correct = option?.isCorrect ?? false
      const newLives = correct ? progress.lives : Math.max(0, progress.lives - 1)

      if (soundEnabled) {
        if (correct) playCorrect()
        else playWrong()
      }

      const updated: PlayerProgress = {
        ...progress,
        xp: correct ? progress.xp + 100 : progress.xp,
        streak: correct ? progress.streak + 1 : 0,
        lives: newLives,
        spotSmellCorrect: correct ? progress.spotSmellCorrect + 1 : progress.spotSmellCorrect,
      }
      saveProgress(updated)

      const newBadges = checkBadges(updated)
      const next = newLives <= 0
        ? { progress: { ...updated, lives: 3, currentPhase: 'flashcard' as const }, newBadges: [] }
        : { progress: updated, newBadges, showingAnswer: true }
      set(next)
    },

    proceedFromSpotSmell: () => {
      const { progress, newBadges } = get()
      const level = levels[progress.currentLevel]
      const updated: PlayerProgress = {
        ...progress,
        unlockedBadges: [...progress.unlockedBadges, ...newBadges],
        currentPhase: 'code-editor',
      }
      saveProgress(updated)
      set({
        progress: updated,
        newBadges: [],
        selectedChoice: null,
        showingAnswer: false,
        codeEditor: {
          typedAnswers: level.codeEditorChallenge.blanks.map(() => ''),
          checkingCode: false,
          codeCorrect: null,
          usedHint: false,
        },
      })
    },

    selectRefactoringChoice: (id: string) => {
      set({ selectedChoice: id })
    },

    submitRefactoringAnswer: () => {
      const { progress, selectedChoice, soundEnabled } = get()
      if (!selectedChoice) return

      const level = levels[progress.currentLevel]
      const choice = level.refactoringChallenge.choices.find((c) => c.id === selectedChoice)
      const correct = choice?.isCorrect ?? false
      const streakMultiplier = progress.streak >= 3 ? 1.5 : 1
      const baseXp = correct ? (choice?.xpReward ?? 100) : 0
      const earned = Math.round(baseXp * streakMultiplier)
      const newLives = correct ? progress.lives : Math.max(0, progress.lives - 1)

      if (soundEnabled) {
        if (correct) playCorrect()
        else playWrong()
      }

      const updated: PlayerProgress = {
        ...progress,
        xp: progress.xp + earned,
        streak: correct ? progress.streak + 1 : 0,
        lives: newLives,
        refactoringCorrect: correct ? progress.refactoringCorrect + 1 : progress.refactoringCorrect,
      }
      saveProgress(updated)

      const newBadges = checkBadges(updated)
      const next = newLives <= 0
        ? { progress: { ...updated, lives: 3, currentPhase: 'flashcard' as const }, newBadges: [] }
        : { progress: updated, newBadges, showingAnswer: true }
      set(next)
    },

    proceedFromRefactoring: () => {
      const { progress, newBadges, soundEnabled } = get()
      const level = levels[progress.currentLevel]
      const updated: PlayerProgress = {
        ...progress,
        completedLevels: [...progress.completedLevels, level.id],
        unlockedBadges: [...progress.unlockedBadges, ...newBadges],
        currentPhase: 'level-complete',
      }
      saveProgress(updated)
      if (soundEnabled) playLevelUp()
      set({
        progress: updated,
        newBadges: [],
      })
    },

    updateCodeEditorAnswer: (index: number, value: string) => {
      const { codeEditor } = get()
      const answers = [...codeEditor.typedAnswers]
      answers[index] = value
      set({ codeEditor: { ...codeEditor, typedAnswers: answers } })
    },

    submitCodeEditorAnswer: () => {
      const { progress, codeEditor, soundEnabled } = get()
      const level = levels[progress.currentLevel]
      const challenge = level.codeEditorChallenge

      set({ codeEditor: { ...codeEditor, checkingCode: true } })

      const allCorrect = challenge.blanks.every((blank, i) => {
        const userAnswer = codeEditor.typedAnswers[i]?.trim() ?? ''
        return userAnswer === blank.expected
      })

      if (soundEnabled) {
        if (allCorrect) playCorrect()
        else playWrong()
      }

      const earned = allCorrect ? 200 : 0
      const streakMultiplier = progress.streak >= 3 ? 1.5 : 1
      const totalXp = Math.round(earned * streakMultiplier)
      const newLives = allCorrect ? progress.lives : Math.max(0, progress.lives - 1)

      const updated: PlayerProgress = {
        ...progress,
        xp: progress.xp + totalXp,
        streak: allCorrect ? progress.streak + 1 : 0,
        lives: newLives,
        codeEditorCorrect: allCorrect ? progress.codeEditorCorrect + 1 : progress.codeEditorCorrect,
      }
      saveProgress(updated)

      const newBadges = checkBadges(updated)

      setTimeout(() => {
        if (newLives <= 0) {
          set({
            progress: { ...updated, lives: 3, currentPhase: 'flashcard' },
            newBadges: [],
            codeEditor: {
              ...codeEditor,
              checkingCode: false,
              codeCorrect: allCorrect,
            },
          })
        } else {
          set({
            progress: updated,
            newBadges,
            codeEditor: {
              ...codeEditor,
              checkingCode: false,
              codeCorrect: allCorrect,
            },
          })
        }
      }, 800)
    },

    useCodeEditorHint: () => {
      const { progress, codeEditor } = get()
      if (progress.hintsRemaining <= 0) return

      const level = levels[progress.currentLevel]
      const challenge = level.codeEditorChallenge
      const firstWrong = challenge.blanks.findIndex((_, i) => {
        const answer = codeEditor.typedAnswers[i]?.trim() ?? ''
        return answer !== _.expected
      })

      if (firstWrong >= 0) {
        const answers = [...codeEditor.typedAnswers]
        answers[firstWrong] = challenge.blanks[firstWrong].expected
        const updated: PlayerProgress = {
          ...progress,
          hintsRemaining: progress.hintsRemaining - 1,
        }
        saveProgress(updated)
        set({
          progress: updated,
          codeEditor: { ...codeEditor, typedAnswers: answers, usedHint: true },
        })
      }
    },

    proceedFromCodeEditor: () => {
      const { progress, newBadges, soundEnabled } = get()
      const level = levels[progress.currentLevel]
      const updated: PlayerProgress = {
        ...progress,
        completedLevels: [...progress.completedLevels, level.id],
        unlockedBadges: [...progress.unlockedBadges, ...newBadges],
        currentPhase: 'level-complete',
      }
      saveProgress(updated)
      if (soundEnabled) playLevelUp()
      set({
        progress: updated,
        newBadges: [],
      })
    },

    continueToNextLevel: () => {
      const { progress } = get()
      const nextLevel = progress.currentLevel + 1

      if (nextLevel < levels.length) {
        const updated: PlayerProgress = {
          ...progress,
          lives: 3,
          currentLevel: nextLevel,
          currentPhase: 'flashcard',
        }
        saveProgress(updated)
        set({
          progress: updated,
          selectedChoice: null,
          selectedSmell: null,
          showingAnswer: false,
          currentSmellTab: 'smelly',
          codeEditor: {
            typedAnswers: [],
            checkingCode: false,
            codeCorrect: null,
            usedHint: false,
          },
        })
      } else {
        const fresh = defaultProgress()
        localStorage.removeItem(STORAGE_KEY)
        set({
          progress: fresh,
          newBadges: [],
          selectedChoice: null,
          selectedSmell: null,
          showingAnswer: false,
          currentSmellTab: 'smelly',
          codeEditor: {
            typedAnswers: [],
            checkingCode: false,
            codeCorrect: null,
            usedHint: false,
          },
        })
      }
    },

    toggleCodeTab: (tab: 'smelly' | 'fix') => {
      set({ currentSmellTab: tab })
    },

    toggleSound: () => {
      set((s) => ({ soundEnabled: !s.soundEnabled }))
    },

    reset: () => {
      const fresh = defaultProgress()
      localStorage.removeItem(STORAGE_KEY)
      set({
        progress: fresh,
        newBadges: [],
        selectedChoice: null,
        selectedSmell: null,
        showingAnswer: false,
        currentSmellTab: 'smelly',
        codeEditor: {
          typedAnswers: [],
          checkingCode: false,
          codeCorrect: null,
          usedHint: false,
        },
      })
    },
  }
})
