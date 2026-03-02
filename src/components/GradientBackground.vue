<script setup lang="ts"></script>

<template>
  <div
    class="absolute top-0 inset-x-0 h-6"
    :style="{
      background: `repeating-linear-gradient(120deg, #3F259E 0px, #3F259E 50px, #FFF8F0 50px, #FFF8F0 100px)`,
    }"
  />
  <div
    class="absolute top-3 inset-x-0 h-3"
    :style="{
      background: `repeating-linear-gradient(120deg, #3F259E 20px, #3F259E 70px, #FFF8F0 70px, #FFF8F0 120px)`,
    }"
  />

  <div
    class="absolute bottom-0 inset-x-0 h-6"
    :style="{
      background: `repeating-linear-gradient(60deg, black 0px, black 50px, #FFF8F0 50px, #FFF8F0 100px)`,
    }"
  />
  <div
    class="absolute bottom-3 inset-x-0 h-3"
    :style="{
      background: `repeating-linear-gradient(60deg, black 20px, black 70px, #FFF8F0 70px, #FFF8F0 120px)`,
    }"
  />
</template>
