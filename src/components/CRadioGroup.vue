<script setup lang="ts">
import { useTemplateRef, watch, onMounted } from 'vue'
import CButton, { CButtonColorPreset } from './CButton.vue'

const props = defineProps<{
  options: Option[]
  selectedId: string
}>()

const emit = defineEmits<{
  (name: 'select', id: string): void
}>()

const indicator = useTemplateRef<HTMLDivElement>('indicator')
const root = useTemplateRef<HTMLDivElement>('root')

const repositionIndicator = () => {
  if (indicator.value == null) return
  const option = document.querySelector(`[data-id="${props.selectedId}"]`)
  if (option == null) return
  const optionRect = option.getBoundingClientRect()
  indicator.value.style.left = `${optionRect.left - (root.value?.getBoundingClientRect().left ?? 0)}px`
  indicator.value.style.width = `${optionRect.width}px` // 24px is the padding.
}
watch(() => props.selectedId, repositionIndicator)

onMounted(() => {
  setTimeout(() => {
    repositionIndicator()
  }, 0)
})
</script>

<script lang="ts">
interface Option {
  id: string
  text: string
}
export { type Option as CRadioGroupOption }
</script>

<template>
  <div ref="root" class="flex relative" role="radiogroup">
    <CButton
      v-for="option in options"
      :key="option.id"
      class="text-xl"
      :color-preset="CButtonColorPreset.NoBackground"
      :data-id="option.id"
      role="radio"
      :aria-checked="option.id === selectedId"
      :text="option.text"
      @click="emit('select', option.id)"
    />
    <div class="indicator absolute bottom-0 h-1 bg-[#3F259E] duration-50" ref="indicator"></div>
  </div>
</template>
