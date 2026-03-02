<script setup lang="ts">
defineProps<{
  text: string
}>()

const getRandomAngle = (): number => {
  return Math.floor(Math.random() * 30 - 10)
}
</script>

<template>
  <div class="animated-text flex -tracking-[0.1em]">
    <span
      v-for="(letter, index) in text.split('')"
      :key="index"
      class="inline-block animated-letter"
      :style="{ '--angle': `${getRandomAngle()}deg` }"
      >{{ letter }}
    </span>
  </div>
</template>

<style lang="postcss">
.animated-text {
  animation: expand 100ms linear forwards;
}

@keyframes expand {
  0% {
    gap: 0;
  }
  100% {
    gap: 0.6em;
  }
}

.animated-letter {
  animation: spring 100ms linear forwards;
}

@keyframes spring {
  0% {
    transform: rotate(0deg) scale(1);
  }
  100% {
    transform: rotate(var(--angle)) scale(1.3);
  }
}
</style>
