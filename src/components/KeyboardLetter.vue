<script setup lang="ts">
import { GuessLetterStatus } from './Game.vue'

const emit = defineEmits<{
  (name: 'click'): void
}>()

const props = withDefaults(
  defineProps<{
    status: GuessLetterStatus
    letter?: string
    disabled?: boolean
  }>(),
  {
    letter: '',
    disabled: false,
  },
)

const handleClick = (): void => {
  if (props.disabled) return
  emit('click')
}
</script>

<template>
  <button
    :class="[
      'keyboard-letter',
      'touch-manipulation',
      'h-10 xs:h-12',
      'grow',
      'rounded-sm',
      'flex',
      'justify-center',
      'items-center',
      'uppercase',
      'cursor-pointer',
      'outline-1',
      'hover:scale-[1.05]',
      'active:scale-[0.95]',

      status === GuessLetterStatus.NotProcessed
        ? 'bg-white text-black outline-black/20'
        : 'text-white outline-black',
      status === GuessLetterStatus.Match && 'bg-[#6DA34D]',
      status === GuessLetterStatus.Misplace && 'bg-[#bebc4c]',
      status === GuessLetterStatus.Maybe && 'bg-[#3F259E]',
      status === GuessLetterStatus.NonExistent && 'bg-[#888]',

      'focus-visible:outline-dashed',
      'focus-visible:outline-black',
      'focus-visible:outline-offset-1',
      'focus-visible:outline-2',
    ]"
    :key="letter"
    :aria-disabled="disabled"
    @click="handleClick"
  >
    {{ letter }}
    <slot />
  </button>
</template>

<style>
.keyboard-letter {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.15);
}
</style>
