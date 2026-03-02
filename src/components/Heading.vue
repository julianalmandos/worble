<script setup lang="ts">
import Logo from './Logo.vue'
import Stats from './Stats.vue'
import { useTimer } from '../composables/useTimer'

const { formattedElapsedTime } = useTimer()
</script>

<template>
  <div class="text-center xl:text-start xl:pt-10">
    <Logo
      class="w-full xl:w-min text-[#3F259E] max-xs:*:leading-[0.9] text-[12vw] xs:text-[70px] md:text-[90px] 2xl:text-[120px] font-bold"
      :text="'Worble'"
      :animate="false"
    />
    <p
      class="max-xs:hidden text-xl leading-tight xs:text-2xl md:text-3xl 2xl:text-4xl dm-serif-text"
    >
      Five letters, six tries.
    </p>
    <p class="max-xs:hidden text-xl xs:text-2xl md:text-3xl 2xl:text-4xl dm-serif-text">
      Look for the <span class="google-sans font-semibold text-[#3F259E]">नीला</span>. It may not
      belong.
    </p>

    <Stats class="mt-2 xs:mt-10" :elapsed-time="formattedElapsedTime" />
  </div>
</template>
