<script setup lang="ts">
import { GameStatus, useGameStore } from '../pinia/game'
import { storeToRefs } from 'pinia'
import GameOverlayReady from './GameOverlayReady.vue'
import GameOverlayWin from './GameOverlayWin.vue'
import GameOverlayLose from './GameOverlayLose.vue'

const gameStore = useGameStore()
const { gameStatus } = storeToRefs(gameStore)

defineProps<{
  elapsedTime: string
}>()

const emit = defineEmits<{
  (name: 'continue'): void
  (name: 'share'): void
  (name: 'new-game'): void
}>()
</script>

<template>
  <div
    class="absolute -inset-1 flex flex-col justify-center items-center z-10 bg-[#fff8f0]/80 duration-200"
  >
    <div class="summary-content flex flex-col justify-center items-center size-[80%]">
      <GameOverlayReady v-if="gameStatus === GameStatus.Ready" />
      <GameOverlayWin
        v-else-if="gameStatus === GameStatus.FinishedWin"
        @continue="emit('continue')"
        @share="emit('share')"
        @new-game="emit('new-game')"
      />
      <GameOverlayLose
        v-else-if="gameStatus === GameStatus.FinishedLose"
        :elapsed-time="elapsedTime"
        @new-game="emit('new-game')"
        @share="emit('share')"
      />
    </div>
  </div>
</template>

<style>
.summary-content {
  animation: fade-in 50ms linear;
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
