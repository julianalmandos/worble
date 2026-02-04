<script setup lang="ts">
import Logo, { Direction } from './Logo.vue'
import { ref } from 'vue'

const emit = defineEmits<{
  (name: 'start'): void
}>()

const GAME_COLORS = ['#9E2B25', '#3F259E', '#689E25']

const twistColorIndex = ref<number>(0)

const rotateTwistColor = (): void => {
  twistColorIndex.value = (twistColorIndex.value + 1) % GAME_COLORS.length
}
</script>

<template>
  <main class="h-full w-[70%] mx-auto flex items-center gap-20">
    <div class="flex-1 flex flex-col items-center text-start">
      <div>
        <!-- Info -->
        <h1 class="text-[80px] leading-[60px] italic dm-serif-text uppercase">Twistees</h1>
        <p class="text-4xl dm-serif-text">
          A collection of known games,<br />with a
          <span
            class="relative twist-text inline-block climate-crisis cursor-default"
            :style="{ color: GAME_COLORS[twistColorIndex] }"
            @mouseover="rotateTwistColor"
          >
            <span class="inline-block pointer-events-none">twist</span></span
          >.
        </p>
        <p class="mt-10 text-4xl dm-serif-text">Play now. Free forever.</p>
      </div>
    </div>
    <div class="flex-1 flex justify-center gap-20">
      <!-- Games -->
      <button class="inline-block cursor-pointer" @click="emit('start')">
        <Logo
          class="text-[#9E2B25] text-7xl font-bold"
          :text="'Worble'"
          :direction="Direction.Vertical"
        />
      </button>
      <button class="inline-block cursor-pointer" @click="emit('start')">
        <Logo
          class="text-[#3F259E] text-7xl font-bold"
          :text="'Strands'"
          :direction="Direction.Vertical"
        />
      </button>
      <button class="inline-block cursor-pointer" @click="emit('start')">
        <Logo
          class="text-[#689E25] text-7xl font-bold"
          :text="'Bees'"
          :direction="Direction.Vertical"
        />
      </button>
    </div>
  </main>
</template>

<style>
.twist-text:hover span {
  animation: shake 250ms linear infinite;
}
@keyframes shake {
  0% {
    transform: rotate(4deg);
  }
  50% {
    transform: rotate(-4deg);
  }
  100% {
    transform: rotate(4deg);
  }
}
</style>
