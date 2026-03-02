<script setup lang="ts">
import { getPoissonDiskSamples } from '../utils/poisson'
import type Vector from '../utils/vector'
import { ref, onMounted, useTemplateRef, watch } from 'vue'
import { GameStatus, useGameStore } from '../pinia/game'
import { storeToRefs } from 'pinia'

const gameStore = useGameStore()
const { gameStatus } = storeToRefs(gameStore)

const points = ref<Vector[]>([])
const lettersBackgroundRef = useTemplateRef<HTMLDivElement>('lettersBackgroundRef')

// No I since it's just a stick.
const LETTERS = 'abcdefghjklmnopqrstuvwxyz'

const generatePoints = (): void => {
  const grid = getPoissonDiskSamples(
    window.innerWidth,
    window.innerHeight,
    Math.max(window.innerWidth / 10, 75),
    { K: 30 },
  )
  points.value = grid.flat().filter((point: Vector | number) => point !== -1) as Vector[]
}

const onAnimationEnd = (event: AnimationEvent, index: number): void => {
  if (index !== points.value.length - 1) return
  if (event.animationName === 'drop') {
    points.value = []
    lettersBackgroundRef.value?.classList.remove('drop')
    return
  }

  if (event.animationName === 'appear') {
    lettersBackgroundRef.value?.classList.remove('appear')
    return
  }
}

watch(gameStatus, (newValue, oldValue) => {
  if (newValue === GameStatus.FinishedLose) {
    lettersBackgroundRef.value?.classList.add('drop')
    return
  }
  if (oldValue === GameStatus.FinishedLose && newValue === GameStatus.Ready) {
    lettersBackgroundRef.value?.classList.remove('drop')
    lettersBackgroundRef.value?.classList.add('appear')
    generatePoints()
    return
  }
})

onMounted(() => {
  generatePoints()
})
</script>

<template>
  <div ref="lettersBackgroundRef" class="absolute inset-0 overflow-hidden">
    <div
      v-for="(point, index) in points"
      :key="point.x + point.y"
      class="absolute text-[#3F259E]/10 climate-crisis uppercase select-none"
      :style="{
        '--angle': `${Math.random() * 360}deg`,
        left: point.x + 'px',
        top: point.y + 'px',
        transform: 'rotate(var(--angle))',
        'font-size': `${Math.random() * 12 + 24}px`,
        '--i': index,
      }"
      @animationend="onAnimationEnd($event, index)"
    >
      {{ LETTERS[Math.floor(Math.random() * LETTERS.length)] }}
    </div>
  </div>
</template>

<style>
.appear div {
  animation: appear 150ms ease-out forwards;
}

@keyframes appear {
  0% {
    transform: rotate(var(--angle)) scale(0);
  }
  70% {
    transform: rotate(var(--angle)) scale(1.3);
  }
  100% {
    transform: rotate(var(--angle)) scale(1);
  }
}

.drop div {
  animation: drop 1s ease-in forwards;
  animation-delay: calc(var(--i) * 20ms);
}

@keyframes drop {
  100% {
    transform: translateY(100vh);
  }
}
</style>
