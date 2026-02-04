<script setup lang="ts">
import { GameStatus, useGameStore } from '../pinia/game'
import { storeToRefs } from 'pinia'
import { Language } from '../utils/words'

// TODO: centralize
const LANGUAGE_TO_ACCENT_COLOR = {
  [Language.English]: '#0A369D',
  [Language.Spanish]: '#6DA34D',
}

const gameStore = useGameStore()
const { gameStatus, language, streakCount, currentWord } = storeToRefs(gameStore)

const emit = defineEmits<{
  (name: 'continue'): void
}>()
</script>

<template>
  <div
    class="overlay fixed inset-0 z-9999 flex flex-col justify-end climate-crisis bg-black/80 tracking-wider"
  >
    <div class="summary min-h-[30%] flex flex-col">
      <div
        class="uppercase text-center text-white text-6xl italic block py-3"
        :style="{ backgroundColor: LANGUAGE_TO_ACCENT_COLOR[language] }"
      >
        {{ gameStatus === GameStatus.FinishedWin ? 'Yay' : 'Booh' }}
      </div>
      <div class="flex-1 bg-black text-white pt-3 px-3 pb-10 flex flex-col text-center">
        <div class="flex flex-col mb-8">
          <template v-if="gameStatus === GameStatus.FinishedWin">
            <span class="text-md">You've guessed</span>
            <span class="text-md">Keep it going!</span>
          </template>
          <template v-if="gameStatus === GameStatus.FinishedLose">
            <span class="text-md">You've lost</span>
            <span class="text-md"
              >The word was <span class="uppercase">{{ currentWord }}</span></span
            >
            <span class="text-md">Your final streak was {{ streakCount }}</span>
          </template>
        </div>
        <button
          class="mt-auto h-10 text-white py-2 px-3 outline-2 outline-white uppercase"
          @click="$emit('continue')"
        >
          {{ gameStatus === GameStatus.FinishedWin ? 'Continue' : 'New game' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.overlay {
  animation: fade-in 150ms linear;
}

.summary {
  animation: slide-in 150ms ease-out;
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes slide-in {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
