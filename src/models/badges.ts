import type { Badge, PlayerProgress } from '@/types/game'

export const badgeDefinitions: Badge[] = [
  {
    id: 'smell-detector',
    name: 'Smell Detector',
    description: 'Correctly identify your first test smell.',
    icon: '🔍',
    condition: (p: PlayerProgress) => p.spotSmellCorrect >= 1,
  },
  {
    id: 'garbage-collector',
    name: 'Garbage Collector',
    description: 'Successfully refactor 3 smelly test suites.',
    icon: '♻️',
    condition: (p: PlayerProgress) => p.refactoringCorrect >= 3,
  },
  {
    id: 'cicd-guardian',
    name: 'CI/CD Guardian',
    description: 'Achieve a perfect streak of 3 correct answers in a row.',
    icon: '🛡️',
    condition: (p: PlayerProgress) => p.streak >= 3,
  },
]
