import { computed, ref } from 'vue'
import { createSharedComposable } from './createSharedComposable'

export const useTimer = createSharedComposable(() => {
  const elapsedTimeMs = ref<number>(0)
  const intervalId = ref<number | null>(null)

  const startTimer = () => {
    elapsedTimeMs.value = 0
    intervalId.value = window.setInterval(() => {
      elapsedTimeMs.value += 100
    }, 100)
  }

  const pauseTimer = () => {
    if (intervalId.value == null) return
    clearInterval(intervalId.value)
    intervalId.value = null
  }

  const restartTimer = () => {
    intervalId.value = window.setInterval(() => {
      elapsedTimeMs.value += 100
    }, 100)
  }

  const resetTimer = () => {
    elapsedTimeMs.value = 0
    pauseTimer()
  }

  const formattedElapsedTime = computed(() => {
    const seconds = Math.floor((elapsedTimeMs.value / 1000) % 60)
      .toString()
      .padStart(2, '0')
    const minutes = Math.floor(elapsedTimeMs.value / 1000 / 60)
      .toString()
      .padStart(2, '0')
    return `${minutes}:${seconds}`
  })

  return { elapsedTimeMs, formattedElapsedTime, startTimer, pauseTimer, restartTimer, resetTimer }
})
