<script setup lang="ts">
import { useSnackbarStore } from '../pinia/snackbar'
import { storeToRefs } from 'pinia'

const snackbarStore = useSnackbarStore()
const { snackbarMessage } = storeToRefs(snackbarStore)
</script>

<template>
  <div class="z-[9999] fixed top-20 start-1/2 -translate-x-1/2 max-w-[80%]">
    <div
      v-if="snackbarMessage"
      class="snackbar-message w-full truncate bg-black text-white font-semibold rounded-md py-1 px-3 text-lg text-center"
    >
      {{ snackbarMessage }}
    </div>
  </div>
</template>

<style>
.snackbar-message {
  animation: slide-in 200ms ease-out;
}

@keyframes slide-in {
  0% {
    transform: translateY(-10px);
  }

  100% {
    transform: translateY(0px);
  }
}
</style>
