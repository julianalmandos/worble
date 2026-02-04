<script setup lang="ts">
import { useGameStore } from '../pinia/game'
import { storeToRefs } from 'pinia'

const gameStore = useGameStore()
const { streakCount, pastWords } = storeToRefs(gameStore)
</script>

<template>
  <div class="text-2xl climate-crisis">
    <div>
      <span class="font-semibold uppercase tracking-wider">Time</span>:
      <span class="inline-block ms-4 text-[#9E2B25]">00:37</span>
    </div>
    <div>
      <span class="font-semibold uppercase tracking-wider">Current streak</span>:
      <span class="inline-block ms-4 text-[#9E2B25]">{{ streakCount }}</span>
    </div>
    <div class="mt-4">
      <span class="font-semibold uppercase tracking-wider">Past words</span>
      <div class="uppercase">
        <!-- <span
          v-for="(word, index) in pastWords"
          :key="index"
          :class="[index % 2 === 0 ? 'text-[#9E2B25]' : 'text-black']"
          :style="{ opacity: 0.3 + (0.7 / pastWords.length) * (pastWords.length - index) }"
          >{{ word }}</span
        > -->
        <span
          v-for="(word, index) in pastWords"
          :key="index"
          :class="[index % 2 === 0 ? 'text-[#9E2B25]' : 'text-[#9E2B25]']"
          :style="{ opacity: 1 * Math.pow(2 / 3, index) }"
          >{{ word }}</span
        >
      </div>
    </div>
  </div>
</template>
