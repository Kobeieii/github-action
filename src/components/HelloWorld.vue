<template>
  <h1 class="text-3xl font-bold underline">
    Hello world! 🎉
  </h1>
  <br>
  <button class="outline outline-blue-500 hover:outline-blue-700 hover:shadow-lg font-bold py-2 px-4 rounded" @click="() => count++">
    Count: {{ count }}
  </button>
</template>

<script setup lang="ts">
const count = ref(0)
</script>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
