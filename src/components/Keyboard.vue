<script setup lang="ts">
import { GuessLetterStatus } from './Game.vue'
import { onMounted } from 'vue'
import KeyboardLetter from './KeyboardLetter.vue'

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

const props = withDefaults(
  defineProps<{
    usedLetters: Record<string, GuessLetterStatus>
    canAddLetter?: boolean
    canDeleteLetter?: boolean
  }>(),
  {
    canAddLetter: true,
    canDeleteLetter: true,
  },
)

onMounted(() => {
  document.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key == null) return
    if (event.key === 'Enter') {
      emit('submit')
      return
    }
    if (event.key === 'Backspace') {
      if (!props.canDeleteLetter) return
      emit('delete')
      return
    }
    if (LETTER_ROWS.flat().includes(event.key.toLowerCase())) {
      if (!props.canAddLetter) return
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
      class="flex gap-2 justify-center xs:px-4 w-full"
    >
      <KeyboardLetter
        v-if="index === LETTER_ROWS.length - 1"
        class="flex-1.5 text-sm"
        aria-label="Submit guess"
        :letter="'Enter'"
        :status="GuessLetterStatus.NotProcessed"
        @click="emit('submit')"
      />
      <div v-else-if="index === LETTER_ROWS.length - 2" class="flex-[0.5]"></div>
      <KeyboardLetter
        v-for="(letter, index) in row"
        :key="index"
        class="flex-1 text-lg xs:text-xl"
        :aria-label="`Add ${letter} to the word`"
        :letter="letter"
        :status="usedLetters[letter] ?? GuessLetterStatus.NotProcessed"
        :disabled="!canAddLetter"
        @click="emit('input', letter)"
      />
      <KeyboardLetter
        v-if="index === LETTER_ROWS.length - 1"
        class="flex-1.5 text-sm"
        aria-label="Delete last letter"
        :status="GuessLetterStatus.NotProcessed"
        :disabled="!canDeleteLetter"
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
      </KeyboardLetter>
      <div v-else-if="index === LETTER_ROWS.length - 2" class="flex-[0.5]"></div>
    </div>
  </div>
</template>
