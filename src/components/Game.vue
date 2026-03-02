<script setup lang="ts">
import Keyboard from './Keyboard.vue'
import GameOverlay from './GameOverlay.vue'
import { doesWordExist, getRandomWord } from '../utils/words'
import { computed, ref } from 'vue'
import { GameStatus, useGameStore } from '../pinia/game'
import { useSnackbarStore } from '../pinia/snackbar'
import { storeToRefs } from 'pinia'
import { useTimer } from '../composables/useTimer'
import { share } from '../utils/share'

interface LetterGuess {
  letter: string
  status: GuessLetterStatus
}

type WordGuess = LetterGuess[]

const gameStore = useGameStore()
const { currentWord, gameStatus, language, streakCount } = storeToRefs(gameStore)
const { resetPastWords, setGameStatus, generateNewWord } = gameStore

const snackbarStore = useSnackbarStore()
const { clearTimeoutMessage } = snackbarStore

const { elapsedTimeMs, formattedElapsedTime, startTimer, pauseTimer, restartTimer, resetTimer } =
  useTimer()

const currentRound = ref<number>(0)
const currentGuess = ref<string>('')

const usedLetters = ref<Record<string, GuessLetterStatus>>({})
const lastUsedLetters = ref<Record<string, GuessLetterStatus>>({})

const guesses = ref<WordGuess[]>([])

const shouldShakeLetters = ref<boolean>(false)

const xOverlay = computed(() => {
  return [GameStatus.Ready, GameStatus.FinishedWin, GameStatus.FinishedLose].includes(
    gameStatus.value,
  )
})

const canAddLetter = computed(() => currentGuess.value.length < 5)
const canDeleteLetter = computed(() => currentGuess.value.length > 0)

const appendLetter = (letter: string): void => {
  if (gameStatus.value !== GameStatus.Writing) return
  if (!canAddLetter.value) return
  currentGuess.value += letter
}

const deleteLetter = (): void => {
  if (gameStatus.value !== GameStatus.Writing) return
  if (!canDeleteLetter.value) return
  currentGuess.value = currentGuess.value.slice(0, currentGuess.value.length - 1)
}

const trackUsedLetter = (letter: string, status: GuessLetterStatus): void => {
  if (status === GuessLetterStatus.Maybe) {
    lastUsedLetters.value[letter] = status
    return
  }

  // Return if the letter already matched before
  if (lastUsedLetters.value[letter] === GuessLetterStatus.Match) return

  // If it's a match or a misplace, always track
  if (status !== GuessLetterStatus.NonExistent) {
    lastUsedLetters.value[letter] = status
    return
  }

  // If there's no status or it's a maybe, track
  if (usedLetters.value[letter] == null || usedLetters.value[letter] === GuessLetterStatus.Maybe) {
    lastUsedLetters.value[letter] = status
  }
}

const submitGuess = (): void => {
  if (gameStatus.value !== GameStatus.Writing) return
  if (currentGuess.value.length !== 5) {
    shouldShakeLetters.value = true
    return
  }
  if (!doesWordExist(language.value, currentGuess.value)) {
    shouldShakeLetters.value = true
    return
  }

  if (guesses.value.length === 0) {
    if (elapsedTimeMs.value > 0) {
      restartTimer()
    } else {
      startTimer()
    }
  }

  lastUsedLetters.value = { ...usedLetters.value }

  let guess = currentGuess.value.split('').map((letter: string) => ({
    letter,
    status: GuessLetterStatus.NotProcessed,
  }))

  const currentWordLetterCount = currentWord.value.split('').reduce(
    (acc, letter: string) => {
      if (acc[letter] == null) acc[letter] = 1
      else acc[letter]++
      return acc
    },
    {} as Record<string, number>,
  )

  // Validate guess
  guess = guess.map((letterGuess: LetterGuess, index: number) => {
    // If it is a perfect match, we track it.
    if (currentWord.value[index] === letterGuess.letter) {
      trackUsedLetter(letterGuess.letter, GuessLetterStatus.Match)
      ;(currentWordLetterCount[letterGuess.letter] as number) -= 1
      return {
        ...letterGuess,
        status: GuessLetterStatus.Match,
      }
    }

    // If the letter is not in the word, is not a match
    if (!currentWord.value.includes(letterGuess.letter)) {
      trackUsedLetter(letterGuess.letter, GuessLetterStatus.NonExistent)
      return {
        ...letterGuess,
        status: GuessLetterStatus.NonExistent,
      }
    }

    // Otherwise, it's a misplace. We handle in the next loop
    return letterGuess
  })

  guess = guess.map((letterGuess: LetterGuess, index: number) => {
    // We skip previously-processed letters
    if ([GuessLetterStatus.Match, GuessLetterStatus.NonExistent].includes(letterGuess.status))
      return letterGuess

    trackUsedLetter(letterGuess.letter, GuessLetterStatus.Misplace)

    // If we've already tracked the correct number, we take as non existent.
    if (currentWordLetterCount[letterGuess.letter] === 0) {
      return {
        ...letterGuess,
        status: GuessLetterStatus.NonExistent,
      }
    }
    ;(currentWordLetterCount[letterGuess.letter] as number) -= 1
    return { ...letterGuess, status: GuessLetterStatus.Misplace }
  })

  /**
   * Twist:
   * - If there are at least 2 non existent letters, choose one of them
   * and mark as "Maybe". "Maybe".
   * - If there are 2 or less non existent letters, choose
   * one of the matches or mismatches ONLY IF non existent in the previous round (no clue was given for them)
   * - If there's a clue for all 5 letters already, do not show red letters.
   */

  if (currentGuess.value !== currentWord.value) {
    function wasClueGivenBefore(letter: string): boolean {
      return (
        guesses.value.flat().find((letterGuess: LetterGuess) => letterGuess.letter === letter) !=
        null
      )
    }

    const nonExistentIndices = guess
      .map((letterGuess: LetterGuess, index: number) =>
        letterGuess.status === GuessLetterStatus.NonExistent &&
        !wasClueGivenBefore(letterGuess.letter)
          ? index
          : null,
      )
      .filter((index) => index !== null) as number[]

    if (nonExistentIndices.length >= 2) {
      // Choose one of the non existent letters randomly to mark as "Maybe"
      const randIndex = nonExistentIndices[
        Math.floor(Math.random() * nonExistentIndices.length)
      ] as number
      const letterGuess = guess[randIndex] as LetterGuess
      guess[randIndex] = { ...letterGuess, status: GuessLetterStatus.Maybe }
      trackUsedLetter(letterGuess.letter, GuessLetterStatus.Maybe)
    } else {
      const matchMisplaceIndices = guess
        .map((letterGuess: LetterGuess, index: number) =>
          [GuessLetterStatus.Match, GuessLetterStatus.Misplace, GuessLetterStatus.Maybe].includes(
            letterGuess.status,
          ) && !wasClueGivenBefore(letterGuess.letter)
            ? index
            : null,
        )
        .filter((index) => index !== null) as number[]

      if (matchMisplaceIndices.length > 0) {
        const randIndex = matchMisplaceIndices[
          Math.floor(Math.random() * matchMisplaceIndices.length)
        ] as number
        const letterGuess = guess[randIndex] as LetterGuess
        guess[randIndex] = { ...letterGuess, status: GuessLetterStatus.Maybe }
        trackUsedLetter(letterGuess.letter, GuessLetterStatus.Maybe)
      }
    }
  }

  guesses.value.push(guess)
  currentRound.value++
  currentGuess.value = ''

  setGameStatus(GameStatus.Checking)
}

const onAnimationEnd = (event: AnimationEvent): void => {
  if (event.animationName === 'reveal') {
    const previousGuess = guesses.value[guesses.value.length - 1] as WordGuess
    const previousGuessWord = previousGuess?.map((guess: LetterGuess) => guess.letter)?.join('')

    // Update used letters
    usedLetters.value = { ...usedLetters.value, ...lastUsedLetters.value }

    // Update game status
    if (previousGuessWord === currentWord.value) {
      setGameStatus(GameStatus.FinishedWin)
      pauseTimer()
    } else if (currentRound.value === 6) {
      setGameStatus(GameStatus.FinishedLose)
      pauseTimer()
    } else {
      setGameStatus(GameStatus.Writing)
    }
  }
  shouldShakeLetters.value = false
}

const resetGame = (): void => {
  generateNewWord()
  currentRound.value = 0
  currentGuess.value = ''
  clearTimeoutMessage()

  usedLetters.value = {}
  lastUsedLetters.value = {}
  guesses.value = []
}

const continueGame = (): void => {
  resetGame()
  setGameStatus(GameStatus.Writing)
}

const restartGame = (): void => {
  resetGame()
  resetPastWords()
  resetTimer()
  setGameStatus(GameStatus.Ready)
}

const shareGame = (): void => {
  let message = `Worble ${guesses.value.length}/6`
  const statusToIcon = {
    [GuessLetterStatus.Match]: '🟩',
    [GuessLetterStatus.Misplace]: '🟨',
    [GuessLetterStatus.NonExistent]: '⬛',
    [GuessLetterStatus.Maybe]: '🟦',
    [GuessLetterStatus.NotProcessed]: '⬛', // Not used.
  }
  for (const guess of guesses.value) {
    message += `\n${guess.map((letter: LetterGuess) => statusToIcon[letter.status]).join('')}`
  }

  message += `\n\n+++Final stats+++`
  message += `\n\nTime: ${formattedElapsedTime.value}`
  message += `\nStreak: ${streakCount.value}`

  share(message)
}
</script>

<script lang="ts">
export enum GuessLetterStatus {
  Match = 'Match',
  Misplace = 'Misplace',
  NonExistent = 'NonExistent',
  Maybe = 'Maybe',
  NotProcessed = 'NotProcessed',
}
</script>

<template>
  <div class="flex flex-col justify-center items-center gap-2 text-center shrink-0 relative">
    <GameOverlay
      v-if="xOverlay"
      :elapsed-time="formattedElapsedTime"
      @continue="continueGame"
      @share="shareGame"
      @new-game="restartGame"
    />
    <div v-for="round in 6" :key="round" :class="xOverlay ? 'blur-[1px]' : ''">
      <div
        class="flex gap-2"
        :class="[round - 1 === currentRound && shouldShakeLetters && 'shake']"
        @animationend.self="onAnimationEnd"
      >
        <div
          v-for="letter in 5"
          :class="[
            'size-12 xs:size-16 xl:size-18 2xl:size-20',
            round - 1 >= currentRound && 'bg-white',
            round - 1 >= currentRound && 'outline-1',
            round - 1 >= currentRound && 'outline-black/20',
            'capitalize',
            'font-semibold',
            'text-3xl xs:text-4xl md:text-5xl',
            'relative',
          ]"
          :key="letter"
        >
          <!-- Previous round -->
          <span
            v-if="round - 1 < currentRound"
            class="absolute inset-0 previous-letter"
            :style="{ '--i': letter - 1 }"
            @animationend="letter === 5 && onAnimationEnd($event)"
          >
            <span
              class="previous-letter-front absolute inset-0 z-10 flex justify-center items-center bg-white outline-1 outline-black"
            >
              {{ guesses[round - 1]?.[letter - 1]?.letter }}
            </span>
            <span
              class="previous-letter-back absolute inset-0 z-0 flex justify-center items-center outline-1 outline-black text-white"
              :class="[
                guesses[round - 1]?.[letter - 1]?.status === GuessLetterStatus.Match &&
                  'bg-[#6DA34D]',
                guesses[round - 1]?.[letter - 1]?.status === GuessLetterStatus.Misplace &&
                  'bg-[#bebc4c]',
                guesses[round - 1]?.[letter - 1]?.status === GuessLetterStatus.NonExistent &&
                  'bg-[#888]',
                guesses[round - 1]?.[letter - 1]?.status === GuessLetterStatus.Maybe &&
                  'bg-[#3F259E]',
              ]"
            >
              {{ guesses[round - 1]?.[letter - 1]?.letter }}
            </span>
          </span>
          <!-- Current round -->
          <span
            v-else-if="round - 1 === currentRound && currentGuess[letter - 1] != null"
            class="letter h-full w-full flex justify-center items-center bg-white outline-1 outline-black"
          >
            {{ currentGuess[letter - 1] }}
          </span>
        </div>
      </div>
    </div>

    <Keyboard
      class="w-[min(500px,100%)] mt-4 xs:mt-8 mx-auto"
      :class="xOverlay ? 'blur-[1.5px]' : ''"
      :used-letters="usedLetters"
      :inert="xOverlay"
      :can-add-letter="canAddLetter"
      :can-delete-letter="canDeleteLetter"
      @input="appendLetter"
      @delete="deleteLetter"
      @submit="submitGuess"
    />
  </div>
</template>

<style lang="css">
.letter {
  animation: bounce 100ms ease-out;
}

@keyframes bounce {
  0% {
    scale: 0.9;
  }

  70% {
    scale: 1.05;
  }

  100% {
    scale: 1;
  }
}

.previous-letter {
  transform-style: preserve-3d;
  animation: reveal 300ms ease-out forwards;
}
.previous-letter:nth-child(n) {
  animation-delay: calc(var(--i) * 350ms);
}

.previous-letter-front {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden; /* Safari */
  transform: rotateY(0deg);
}

.previous-letter-back {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden; /* Safari */
  transform: rotateY(180deg);
}

@keyframes reveal {
  100% {
    transform: rotateY(180deg);
  }
}

.shake {
  animation: shake 250ms ease-in-out;
}

@keyframes shake {
  0% {
    transform: translateX(0px);
  }
  20% {
    transform: translateX(-4px);
  }
  40% {
    transform: translateX(4px);
  }
  60% {
    transform: translateX(-4px);
  }
  80% {
    transform: translateX(4px);
  }
  100% {
    transform: translateX(0px);
  }
}
</style>
