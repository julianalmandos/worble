<script setup lang="ts">
import { GameStatus, useGameStore } from '../pinia/game'
import { storeToRefs } from 'pinia'
import CButton, { CButtonColorPreset } from './CButton.vue'
import { Language } from '../utils/words'
import { useTemplateRef, onMounted, ref } from 'vue'
import CRadioGroup, { type CRadioGroupOption } from './CRadioGroup.vue'
import RotatingText from './RotatingText.vue'

enum Screen {
  Introduction = 'Introduction',
  About = 'About',
}

const gameStore = useGameStore()
const { language } = storeToRefs(gameStore)
const { setGameStatus, setLanguage } = gameStore

const playButtonRef = useTemplateRef<HTMLButtonElement>('playButton')

const languageOptions = ref<CRadioGroupOption[]>([
  { id: Language.English, text: 'English' },
  { id: Language.Spanish, text: 'Spanish' },
])

const currentScreen = ref<Screen>(Screen.Introduction)

onMounted(() => {
  playButtonRef.value?.focus()
})
</script>

<template>
  <div>
    <template v-if="currentScreen === Screen.Introduction">
      <CButton
        ref="playButton"
        class="text-4xl mb-4 climate-crisis"
        :color-preset="CButtonColorPreset.Primary"
        :text="'Play'"
        @click="setGameStatus(GameStatus.Writing)"
      />
      <div class="flex justify-center mb-4">
        <CRadioGroup
          aria-label="Game language"
          :options="languageOptions"
          :selected-id="language"
          @select="setLanguage($event as Language)"
        />
      </div>
      <CButton
        class="text-xl"
        :color-preset="CButtonColorPreset.NoBackground"
        :text="'About'"
        @click="currentScreen = Screen.About"
      />
    </template>
    <div v-else-if="currentScreen === Screen.About" class="px-6 dm-serif-text">
      <p class="text-2xl md:text-3xl text-[#3F259E] mb-2">Welcome to Worble!</p>
      <p class="text-md md:text-lg mb-2">
        This project was born out of curiosity about how to implement Wordle while adding my own
        twist to it.
      </p>
      <p class="text-md md:text-lg mb-2">
        Made with <span class="text-[#3F259E] font-semibold">चाय</span> and
        <span class="text-[#3F259E] font-semibold">प्यार</span> by
        <CButton
          class="p-0! normal-case!"
          href="https://github.com/julianalmandos"
          :color-preset="CButtonColorPreset.NoBackground"
          :text="'Julian Almandos'"
        />
      </p>
      <p class="text-md md:text-lg mb-8">I hope you have fun playing it!</p>

      <CButton
        class="text-2xl"
        :color-preset="CButtonColorPreset.NoBackground"
        :text="`Let's play!`"
        @click="currentScreen = Screen.Introduction"
      />
    </div>
  </div>
</template>
