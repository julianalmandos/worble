<script setup lang="ts">
import { GameStatus, useGameStore } from '../pinia/game'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const gameStore = useGameStore()
const { streakCount, pastWords, gameStatus } = storeToRefs(gameStore)

const props = defineProps<{
  elapsedTime: string
}>()

const formattedElapsedTime = computed(() => {
  if (gameStatus.value === GameStatus.Ready) return 'XX:XX'
  return props.elapsedTime
})

const formattedStreakCount = computed(() => {
  if (gameStatus.value === GameStatus.Ready) return 'X'
  return streakCount.value
})
</script>

<template>
  <div class="text-lg xs:text-2xl climate-crisis">
    <div class="flex max-xs:justify-between flex-row xs:flex-col">
      <div>
        <span class="font-semibold uppercase tracking-wider">Time:</span>
        <span class="inline-block ms-2 xs:ms-4 text-[#3F259E]">{{ formattedElapsedTime }}</span>
      </div>
      <div>
        <span class="font-semibold uppercase tracking-wider">Streak:</span>
        <span class="inline-block ms-2 xs:ms-4 text-[#3F259E]">{{ formattedStreakCount }}</span>
      </div>
    </div>
    <div class="xs:mt-4 px-15 xl:px-0">
      <span class="hidden xs:block font-semibold uppercase tracking-wider">Past words:</span>
      <div v-if="pastWords.length > 0" class="uppercase overflow-hidden">
        <span
          v-for="(word, index) in pastWords.slice(0, 5)"
          :key="index"
          class="text-[#3F259E]"
          :style="{ opacity: 1 * Math.pow(2 / 3, index) }"
          >{{ word }}</span
        >
      </div>
      <div v-else class="text-[#888]">
        {{ gameStatus === GameStatus.Ready ? 'XXXXX' : 'No guesses yet' }}
      </div>
    </div>
  </div>
</template>
