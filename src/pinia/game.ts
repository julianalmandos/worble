import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Language, getRandomWord } from '../utils/words'

export enum GameStatus {
  Writing = 'Writing',
  Checking = 'Checking',
  FinishedWin = 'FinishedWin',
  FinishedLose = 'FinishedLose',
}

export const useGameStore = defineStore('gameStore', () => {
  const language = ref<Language>(Language.English)
  const gameStatus = ref<GameStatus>(GameStatus.Writing)
  const currentWord = ref<string>(getRandomWord(language.value))
  const pastWords = ref<string[]>(['crane', 'cloud', 'thumb', 'train', 'plate'])

  const streakCount = ref<number>(0)

  const setLanguage = (lang: Language): void => {
    language.value = lang
  }

  const setGameStatus = (status: GameStatus): void => {
    gameStatus.value = status
  }

  const setCurrentWord = (word: string): void => {
    pastWords.value.unshift(currentWord.value)
    currentWord.value = word
  }

  const increaseStreakCount = (): void => {
    streakCount.value++
  }

  const resetStreakCount = (): void => {
    streakCount.value = 0
  }

  return {
    language,
    gameStatus,
    streakCount,
    currentWord,
    pastWords,

    setLanguage,
    setGameStatus,
    setCurrentWord,
    increaseStreakCount,
    resetStreakCount,
  }
})
