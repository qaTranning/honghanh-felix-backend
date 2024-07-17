<template>
  <a v-if="name" class="hover:underline" @click="$props.onClick"> {{ $props.name }}</a>
  <p v-else-if="textName">{{ $props.textName }}</p>
  <p v-else>---</p>
</template>

<script setup lang="ts">
defineProps<{ name: string; onClick?: () => void; textName?: string }>();
</script>
