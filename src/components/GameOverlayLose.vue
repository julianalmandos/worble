<script setup lang="ts">
import { useGameStore } from '../pinia/game'
import { storeToRefs } from 'pinia'
import CButton, { CButtonColorPreset } from './CButton.vue'
import AnimatedText from './AnimatedText.vue'
import { useTimer } from '../composables/useTimer'
import { useTemplateRef, onMounted } from 'vue'

const gameStore = useGameStore()
const { streakCount, currentWord } = storeToRefs(gameStore)

const { formattedElapsedTime } = useTimer()

const emit = defineEmits<{
  (name: 'share'): void
  (name: 'new-game'): void
}>()

const shareButtonRef = useTemplateRef<HTMLButtonElement>('shareButton')

onMounted(() => {
  shareButtonRef.value?.focus()
})
</script>

<template>
  <div>
    <AnimatedText class="text-5xl uppercase text-[#3F259E] mb-8 climate-crisis" :text="'Booh'" />
    <p class="text-2xl dm-serif-text">You've lost</p>
    <p class="text-2xl dm-serif-text mb-4">
      The word was
      <span class="uppercase text-[#3F259E]">{{ currentWord }}</span>
    </p>
    <p class="text-2xl dm-serif-text">
      Streak: <span class="text-[#3F259E]">{{ streakCount }}</span>
    </p>
    <p class="text-2xl dm-serif-text">
      Time: <span class="text-[#3F259E]">{{ formattedElapsedTime }}</span>
    </p>
    <div class="flex flex-col">
      <CButton
        class="text-2xl mt-3"
        :color-preset="CButtonColorPreset.Primary"
        :text="'New game'"
        @click="emit('new-game')"
      />
      <CButton
        ref="shareButton"
        class="text-2xl mt-3"
        :color-preset="CButtonColorPreset.Secondary"
        :text="'Share'"
        @click="emit('share')"
      />
    </div>
  </div>
</template>
