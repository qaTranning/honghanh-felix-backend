<template>
  <div class="w-full flex flex-row justify-between items-start">
    <p v-if="typeof $props.label === 'string'">{{ $props.label }}</p>

    <component :is="$props.label" v-else />

    <p v-if="typeof $props.value === 'string'">{{ $props.value }}</p>

    <component :is="$props.value" v-else />
  </div>
</template>

<script setup lang="ts">
import type { ShInfoItemProps } from '../models';

withDefaults(defineProps<ShInfoItemProps>(), { value: '' });
</script>
