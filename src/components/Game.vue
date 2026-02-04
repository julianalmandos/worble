<script setup lang="ts">
import Keyboard from './Keyboard.vue'
import Snackbar from './Snackbar.vue'
import Logo from './Logo.vue'
import Summary from './Summary.vue'
import Stats from './Stats.vue'
import { doesWordExist, getRandomWord } from '../utils/words'
import { computed, ref, watch } from 'vue'
import { GameStatus, LetterGuess, useGameStore } from '../pinia/game'
import { useSnackbarStore } from '../pinia/snackbar'
import { storeToRefs } from 'pinia'

interface LetterGuess {
  letter: string
  status: GuessLetterStatus
}

type WordGuess = LetterGuess[]

const gameStore = useGameStore()
const { currentWord, gameStatus, language } = storeToRefs(gameStore)
const { increaseStreakCount, resetStreakCount, setGameStatus, setCurrentWord } = gameStore

const snackbarStore = useSnackbarStore()
const { clearTimeoutMessage } = snackbarStore

const currentRound = ref<number>(0)
const currentGuess = ref<string>('')

const usedLetters = ref<Record<string, GuessLetterStatus>>({})
const lastUsedLetters = ref<Record<string, GuessLetterStatus>>({})

const guesses = ref<WordGuess[]>([])

const shouldShakeLetters = ref<boolean>(false)

const isGameFinished = computed<boolean>(() =>
  [GameStatus.FinishedWin, GameStatus.FinishedLose].includes(gameStatus.value),
)

const appendLetter = (letter: string): void => {
  if (gameStatus.value !== GameStatus.Writing) return
  if (currentGuess.value.length === 5) return
  currentGuess.value += letter
}

const deleteLetter = (): void => {
  if (gameStatus.value !== GameStatus.Writing) return
  if (currentGuess.value.length === 0) return
  currentGuess.value = currentGuess.value.slice(0, currentGuess.value.length - 1)
}

const trackUsedLetter = (letter: string, status: GuessLetterStatus): void => {
  // Return if the letter already matched before
  if (lastUsedLetters.value[letter] === GuessLetterStatus.Match) return

  // If it's a match or a misplace, always track
  if (status !== GuessLetterStatus.NonExistent) {
    lastUsedLetters.value[letter] = status
    return
  }

  // If there's no status, track (at this point it's always a no-match)
  if (usedLetters.value[letter] == null) {
    lastUsedLetters.value[letter] = status
  }
}

const submitGuess = (): void => {
  if (gameStatus.value !== GameStatus.Writing) return
  if (currentGuess.value.length !== 5) return
  if (!doesWordExist(language.value, currentGuess.value)) {
    // Animate
    // Show snackbar
    shouldShakeLetters.value = true
    console.log('Word does not exist')
    return
  }

  lastUsedLetters.value = { ...usedLetters.value }

  let guess = currentGuess.value.split('').map((letter: string) => ({
    letter,
    status: GuessLetterStatus.NotProcessed,
  }))

  const currentWordLetterCount = currentWord.value.split('').reduce((acc, letter: string) => {
    if (acc[letter] == null) acc[letter] = 1
    else acc[letter]++
    return acc
  }, {})

  console.log(guess)
  console.log(currentWordLetterCount)

  // Validate guess
  const misplacedLetters: string[] = []
  guess = guess.map((letterGuess: LetterGuess, index: number) => {
    // If it is a perfect match, we track it.
    if (currentWord.value[index] === letterGuess.letter) {
      trackUsedLetter(letterGuess.letter, GuessLetterStatus.Match)
      currentWordLetterCount[letterGuess.letter]--
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

  console.log(guess)

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
    currentWordLetterCount[letterGuess.letter]--
    return { ...letterGuess, status: GuessLetterStatus.Misplace }
  })

  console.log(guess)

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
      increaseStreakCount()
      setGameStatus(GameStatus.FinishedWin)
    } else if (currentRound.value === 6) {
      setGameStatus(GameStatus.FinishedLose)
    } else {
      setGameStatus(GameStatus.Writing)
    }
  }
  shouldShakeLetters.value = false
}

const resetGame = (): void => {
  setCurrentWord(getRandomWord(language.value))
  currentRound.value = 0
  currentGuess.value = ''
  setGameStatus(GameStatus.Writing)
  clearTimeoutMessage()

  usedLetters.value = {}
  lastUsedLetters.value = {}
  guesses.value = []
}

const continueGame = (): void => {
  if (gameStatus.value === GameStatus.FinishedWin) {
    resetGame()
  } else if (gameStatus.value === GameStatus.FinishedLose) {
    resetGame()
    resetStreakCount()
  }
}

watch(language, resetGame)
</script>

<script lang="ts">
export enum GuessLetterStatus {
  Match = 'Match',
  Misplace = 'Misplace',
  NonExistent = 'NonExistent',
  NotProcessed = 'NotProcessed',
}
</script>

<template>
  <main class="flex-1 w-[70%] mx-auto flex flex-col relative justify-center gap-20">
    <Snackbar />
    <div class="flex">
      <div class="flex-1 w-full">
        <Logo
          class="w-min text-[#9E2B25] text-[120px] font-bold"
          :text="'Worble'"
          :animate="false"
        />
        <p class="text-4xl dm-serif-text">Five letters, six tries.</p>
        <p class="text-4xl dm-serif-text">
          Look for the <span class="google-sans font-semibold text-[#9E2B25]">मिर्च</span>. It may
          not belong.
        </p>

        <Stats class="mt-10" />
      </div>
      <div
        class="flex-1 flex flex-col justify-center items-center gap-2 text-center shrink-0 dm-serif-text"
      >
        <div v-for="round in 6">
          <div
            class="flex gap-2"
            :class="[round - 1 === currentRound && shouldShakeLetters && 'shake']"
            @animationend.self="onAnimationEnd"
          >
            <div
              v-for="letter in 5"
              :class="[
                'size-20',
                round - 1 >= currentRound && 'bg-white',
                round - 1 >= currentRound && 'outline-1',
                round - 1 >= currentRound && 'outline-black/20',
                'rounded-sm',
                'capitalize',
                'font-semibold',
                'text-5xl',
                'relative',
              ]"
            >
              <!-- Previous round -->
              <span
                v-if="round - 1 < currentRound"
                class="absolute inset-0 previous-letter"
                :style="{ '--i': letter }"
                @animationend="letter === 5 && onAnimationEnd($event)"
              >
                <span
                  class="previous-letter-front absolute inset-0 z-10 flex justify-center items-center bg-white rounded-sm outline-1 outline-black"
                >
                  {{ guesses[round - 1]?.[letter - 1]?.letter }}
                </span>
                <span
                  class="previous-letter-back absolute inset-0 z-0 flex justify-center items-center rounded-sm outline-1 outline-black text-white"
                  :class="[
                    guesses[round - 1]?.[letter - 1]?.status === GuessLetterStatus.Match &&
                      'bg-[#6DA34D]',
                    guesses[round - 1]?.[letter - 1]?.status === GuessLetterStatus.Misplace &&
                      'bg-[#E0DE64]',
                    guesses[round - 1]?.[letter - 1]?.status === GuessLetterStatus.NonExistent &&
                      'bg-[#888]',
                  ]"
                >
                  {{ guesses[round - 1]?.[letter - 1]?.letter }}
                </span>
              </span>
              <!-- Current round -->
              <span
                v-else-if="round - 1 === currentRound && currentGuess[letter - 1] != null"
                class="letter h-full w-full flex justify-center items-center bg-white rounded-sm outline-1 outline-black"
              >
                {{ currentGuess[letter - 1] }}
              </span>
            </div>
          </div>
        </div>

        <Keyboard
          class="w-[min(500px,100%)] mt-8 mx-auto"
          :used-letters="usedLetters"
          @input="appendLetter"
          @delete="deleteLetter"
          @submit="submitGuess"
        />
      </div>
    </div>
    <Summary v-if="isGameFinished" @continue="continueGame" />
  </main>
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
