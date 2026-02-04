import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSnackbarStore = defineStore('snackbarStore', () => {
  const snackbarMessage = ref<string>('')
  const snackbarMessageTimeout = ref<number | null>(null)

  const setSnackbarMessage = (msg: string): void => {
    snackbarMessage.value = msg
    snackbarMessageTimeout.value = setTimeout(() => {
      snackbarMessage.value = ''
    }, 10000)
  }

  const clearTimeoutMessage = (): void => {
    snackbarMessage.value = ''
    if (snackbarMessageTimeout.value == null) return
    clearTimeout(snackbarMessageTimeout.value)
  }

  return {
    snackbarMessage,
    setSnackbarMessage,
    clearTimeoutMessage,
  }
})
