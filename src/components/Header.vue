<script setup lang="ts">
import { ref, watch, useTemplateRef } from 'vue'
import { useGameStore } from '../pinia/game'
import Logo from './Logo.vue'
import { storeToRefs } from 'pinia'
import { Language } from '../utils/words'

const LANGUAGE_TO_BACKGROUND_COLOR = {
  [Language.English]: '#0A369D',
  [Language.Spanish]: '#6DA34D',
}

const LANGUAGE_TO_INDICATOR_COLOR = {
  [Language.English]: '#FF3CC7',
  [Language.Spanish]: '#333333',
}

const gameStore = useGameStore()
const { setLanguage } = gameStore
const { language } = storeToRefs(gameStore)

const indicator = useTemplateRef('indicator')

watch(
  language,
  () => {
    setTimeout(() => {
      if (indicator.value == null) return

      const selectedButton = document.querySelector('.selected')
      if (selectedButton == null) return

      const selectedButtonRect = selectedButton.getBoundingClientRect()
      indicator.value.style.left = `${selectedButtonRect.left}px`
      indicator.value.style.width = `${selectedButtonRect.width}px`
    }, 0)
  },
  { immediate: true },
)
</script>

<template>
  <header
    class="h-14 flex justify-center items-center px-4 relative"
    :style="{ backgroundColor: LANGUAGE_TO_BACKGROUND_COLOR[language] }"
  >
    <button
      :class="[
        'z-10',
        'px-2',
        'text-2xl',
        'uppercase',
        'font-semibold',
        'text-white',
        'italic',
        'cursor-pointer',
        language === Language.English && 'selected',
      ]"
      @click="setLanguage(Language.English)"
    >
      EN
    </button>
    <div class="flex-1 flex justify-center">
      <Logo class="text-white text-3xl font-semibold" :text="'Worble'" />
    </div>
    <button
      :class="[
        'z-10',
        'px-2',
        'text-2xl',
        'uppercase',
        'font-semibold',
        'text-white',
        'italic',
        'cursor-pointer',
        language === Language.Spanish && 'selected',
      ]"
      @click="setLanguage(Language.Spanish)"
    >
      ES
    </button>
    <div
      ref="indicator"
      class="absolute h-9 duration-200 -skew-x-[12deg]"
      :style="{ backgroundColor: LANGUAGE_TO_INDICATOR_COLOR[language] }"
    ></div>
  </header>
</template>
