<script setup lang="ts">
import { useTemplateRef } from 'vue'

withDefaults(
  defineProps<{
    text: string
    colorPreset?: ColorPreset
    href?: string
  }>(),
  {
    colorPreset: ColorPreset.Primary,
  },
)

const emit = defineEmits<{
  (name: 'click'): void
}>()

const rootRef = useTemplateRef<HTMLButtonElement>('root')

defineExpose({
  focus: () => {
    rootRef.value?.focus()
  },
})
</script>

<script lang="ts">
enum ColorPreset {
  Primary = 'Primary',
  Secondary = 'Secondary',
  NoBackground = 'NoBackground',
}

export { ColorPreset as CButtonColorPreset }
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href"
    :target="href ? '_blank' : undefined"
    ref="root"
    :class="[
      colorPreset === ColorPreset.Primary && [
        // Base
        'climate-crisis',
        'tracking-[0.1em]',
        'text-[#fff8f0]',
        'bg-[#3F259E]',

        // Hover
        'hover:bg-[#2E1D71]',
        'hover:scale-[1.05]',

        // Active
        'active:bg-[#2E1D71]',
        'active:scale-[0.95]',

        // Focus
        'focus-visible:outline-dashed',
        'focus-visible:outline-[#3F259E]',
        'focus-visible:outline-offset-3',
        'focus-visible:outline-4',
      ],
      colorPreset === ColorPreset.Secondary && [
        // Base
        'climate-crisis',
        'bg-transparent',
        'text-[#3F259E]',
        'border-3',
        'border-[#3F259E]',

        // Hover
        'hover:scale-[1.05]',

        // Active
        'active:scale-[0.95]',

        // Focus
        'focus-visible:outline-dashed',
        'focus-visible:outline-[#3F259E]',
        'focus-visible:outline-offset-3',
        'focus-visible:outline-4',
      ],
      colorPreset === ColorPreset.NoBackground && [
        // Base
        'dm-serif-text',
        'bg-transparent',
        'text-[#3F259E]',

        // Hover
        'hover:bg-[#3F259E]/10',

        // Active

        // Focus
        'focus-visible:outline-dashed',
        'focus-visible:outline-[#3F259E]',
        'focus-visible:outline-offset-3',
        'focus-visible:outline-4',

        'tracking-wider',
        'font-semibold',
      ],

      'uppercase',
      'py-2',
      'px-3',
      'cursor-pointer',
    ]"
    @click="emit('click')"
  >
    {{ text }}
  </component>
</template>
