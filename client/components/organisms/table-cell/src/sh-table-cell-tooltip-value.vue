<template>
  <a-tooltip>
    <template #title>{{ value }}</template>

    <p class="line-clamp-1 w-fit">{{ value }}</p>
  </a-tooltip>
</template>

<script setup lang="ts">
defineProps<{ value: string }>();
</script>
