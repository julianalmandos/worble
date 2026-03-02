<script setup lang="ts">
import Game from './components/Game.vue'
import GradientBackground from './components/GradientBackground.vue'
import LettersBackground from './components/LettersBackground.vue'
import Snackbar from './components/Snackbar.vue'
import Heading from './components/Heading.vue'
</script>

<template>
  <div class="root relative">
    <LettersBackground />
    <GradientBackground />
    <main class="min-h-dvh w-full flex justify-center items-center relative">
      <Snackbar />
      <div
        class="flex flex-col xl:flex-row xl:justify-center gap-4 xs:gap-10 2xl:gap-40 w-[90%] md:w-[90%] 2xl:w-auto 2xl:px-30 md:py-20"
      >
        <Heading />
        <Game />
      </div>
    </main>
  </div>
</template>

<style>
body,
html,
#app,
.root {
  width: 100%;
  min-height: 100dvh;
  background-color: #fff8f0;
}
</style>
