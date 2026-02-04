<script setup lang="ts">
import Game from './components/Game.vue'
import Home from './components/Home.vue'
import Header from './components/Header.vue'
import { useGameStore } from './pinia/game'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { Language } from './utils/words'

enum Page {
  Home = 'Home',
  Game = 'Game',
}

// const LANGUAGE_TO_BACKGROUND_COLOR: Record<Language, string> = {
//   [Language.English]: '#C8D9F9',
//   [Language.Spanish]: '#C6D8AF',
// }

const gameStore = useGameStore()
const { language } = storeToRefs(gameStore)

const currentPage = ref<Page>(Page.Home)
</script>

<template>
  <div v-if="currentPage === Page.Home" class="w-full h-full bg-[#FFF8F0]">
    <Home @start="currentPage = Page.Game" />
  </div>
  <div v-else-if="currentPage === Page.Game" class="w-full h-full flex flex-col bg-[#FFF8F0]">
    <!-- <Header /> -->
    <Game />
  </div>
</template>

<style>
body,
html,
#app {
  width: 100%;
  height: 100vh;
}
</style>
