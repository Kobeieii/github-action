<template>
  <HelloWorld />
  <div class="mt-5 text-xs hover:text-base">
    <p>From {{ env }} server</p>
  </div>
</template>

<script setup lang="ts">
const hostname = new URL(import.meta.url).hostname
const env = ref<string>(hostname === "github-action-demo-657305254360.asia-southeast1.run.app" ? "Production" : "Development")
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
