<script setup lang="ts">
import CButton, { CButtonColorPreset } from './CButton.vue'
import AnimatedText from './AnimatedText.vue'
import { useTemplateRef, onMounted } from 'vue'

const emit = defineEmits<{
  (name: 'continue'): void
  (name: 'share'): void
  (name: 'new-game'): void
}>()

const continueButtonRef = useTemplateRef<HTMLButtonElement>('continueButton')

onMounted(async () => {
  continueButtonRef.value?.focus()
})
</script>

<template>
  <div class="flex flex-col items-center">
    <AnimatedText class="text-5xl uppercase text-[#3F259E] mb-8 climate-crisis" :text="'Yay!'" />
    <p class="text-2xl dm-serif-text">You've guessed the word</p>
    <p class="text-2xl dm-serif-text">Keep it going!</p>
    <div class="flex flex-col">
      <CButton
        ref="continueButton"
        class="text-2xl mt-4"
        :color-preset="CButtonColorPreset.Primary"
        :text="'Continue'"
        @click="emit('continue')"
      />
      <CButton
        ref="shareButton"
        class="text-xl mt-4"
        :color-preset="CButtonColorPreset.Secondary"
        :text="'Share'"
        @click="emit('share')"
      />
      <CButton
        ref="shareButton"
        class="text-xl mt-4"
        :color-preset="CButtonColorPreset.NoBackground"
        :text="'New game'"
        @click="emit('new-game')"
      />
    </div>
  </div>
</template>
