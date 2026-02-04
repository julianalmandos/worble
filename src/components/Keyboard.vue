<script setup lang="ts">
import { GuessLetterStatus } from './Game.vue'
import { onMounted } from 'vue'

const LETTER_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
]

const emit = defineEmits<{
  (name: 'input', letter: string): void
  (name: 'delete'): void
  (name: 'submit'): void
}>()

defineProps<{
  usedLetters: Record<string, GuessLetterStatus>
}>()

onMounted(() => {
  document.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key == null) return
    if (event.key === 'Enter') {
      emit('submit')
      return
    }
    if (event.key === 'Backspace') {
      emit('delete')
      return
    }
    if (LETTER_ROWS.flat().includes(event.key.toLowerCase())) {
      emit('input', event.key.toLowerCase())
    }
  })
})
</script>

<template>
  <div class="flex flex-col justify-center items-center gap-2.5">
    <div
      v-for="(row, index) in LETTER_ROWS"
      :key="index"
      class="flex gap-2 justify-center px-4 w-full"
    >
      <button
        v-if="index === LETTER_ROWS.length - 1"
        :class="[
          'touch-manipulation',
          'flex-1.5',
          'h-12',
          'grow',
          'rounded-sm',
          'bg-white',
          'flex',
          'justify-center',
          'items-center',
          'uppercase',
          'cursor-pointer',
          'text-sm',
          'px-1',
          'outline-1',
          'outline-black/20',
          'hover:scale-[1.05]',
          'active:scale-[0.95]',
        ]"
        @click="emit('submit')"
      >
        Enter
      </button>
      <div v-else-if="index === LETTER_ROWS.length - 2" class="flex-[0.5]"></div>
      <button
        v-for="letter in row"
        :class="[
          'touch-manipulation',
          'flex-1',
          'h-12',
          'grow',
          'rounded-sm',
          'flex',
          'justify-center',
          'items-center',
          'capitalize',
          'cursor-pointer',
          'text-xl',
          'outline-1',
          'hover:scale-[1.05]',
          'active:scale-[0.95]',

          usedLetters[letter] == null
            ? 'bg-white text-black outline-black/20'
            : 'text-white outline-black',
          usedLetters[letter] === GuessLetterStatus.Match && 'bg-[#6DA34D]',
          usedLetters[letter] === GuessLetterStatus.Misplace && 'bg-[#E0DE64]',
          usedLetters[letter] === GuessLetterStatus.NonExistent && 'bg-[#888]',
        ]"
        @click="emit('input', letter)"
      >
        {{ letter }}
      </button>
      <button
        v-if="index === LETTER_ROWS.length - 1"
        :class="[
          'touch-manipulation',
          'flex-1.5',
          'h-12',
          'grow',
          'rounded-sm',
          'bg-white',
          'flex',
          'justify-center',
          'items-center',
          'uppercase',
          'cursor-pointer',
          'text-sm',
          'px-1',
          'outline-1',
          'outline-black/20',
          'hover:scale-[1.05]',
          'active:scale-[0.95]',
        ]"
        @click="emit('delete')"
      >
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          height="20"
          viewBox="0 0 24 24"
          width="20"
          class="game-icon"
        >
          <path
            d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"
          ></path>
        </svg>
      </button>
      <div v-else-if="index === LETTER_ROWS.length - 2" class="flex-[0.5]"></div>
    </div>
  </div>
</template>

<style></style>
