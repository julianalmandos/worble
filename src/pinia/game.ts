import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { Language, getRandomWord } from '../utils/words'

export enum GameStatus {
  Ready = 'Ready',
  Writing = 'Writing',
  Checking = 'Checking',
  FinishedWin = 'FinishedWin',
  FinishedLose = 'FinishedLose',
}

export const useGameStore = defineStore('gameStore', () => {
  const language = ref<Language>(Language.English)
  const gameStatus = ref<GameStatus>(GameStatus.Ready)
  const currentWord = ref<string>(getRandomWord(language.value))
  const pastWords = ref<string[]>([])

  const streakCount = computed(() => pastWords.value.length)

  const setLanguage = (lang: Language): void => {
    language.value = lang
    currentWord.value = getRandomWord(language.value)
  }

  const setGameStatus = (status: GameStatus): void => {
    gameStatus.value = status
  }

  const generateNewWord = (): void => {
    pastWords.value.unshift(currentWord.value)
    currentWord.value = getRandomWord(language.value)
  }

  const resetPastWords = (): void => {
    pastWords.value = []
  }

  return {
    language,
    gameStatus,
    streakCount,
    currentWord,
    pastWords,

    setLanguage,
    setGameStatus,
    generateNewWord,
    resetPastWords,
  }
})
