<script setup lang="ts">
withDefaults(
  defineProps<{
    text: string
    animate?: boolean
    direction?: Direction
  }>(),
  { animate: true, direction: Direction.Horizontal },
)

const getRandomAngle = (): number => {
  return Math.floor(Math.random() * 20 - 10)
}
</script>

<script lang="ts">
export enum Direction {
  Horizontal = 'Horizontal',
  Vertical = 'Vertical',
}
</script>

<template>
  <h1
    :class="[
      'flex',
      direction === Direction.Horizontal ? 'flex-row justify-center' : 'flex-col',
      'gap-0',
      animate && 'hover:gap-[0.2em]',
      'z-10',
      'text-center',
      'uppercase',
      '-tracking-[0.1em]',
      'select-none',
      'group',
      'climate-crisis',
      'duration-200',
      '[&>*]:duration-200',
    ]"
  >
    <span
      v-for="(letter, index) in text.split('')"
      :key="index"
      :class="[animate && 'group-hover:rotate-(--angle)']"
      :style="{ '--angle': `${getRandomAngle()}deg` }"
      >{{ letter }}</span
    >
  </h1>
</template>
