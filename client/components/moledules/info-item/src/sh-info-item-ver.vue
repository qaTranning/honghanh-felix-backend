<template>
  <div class="flex flex-col">
    <div>
      <a-typography-title :level="5">{{ $props.label }}</a-typography-title>
    </div>

    <div>
      <p v-if="!$props.value"></p>
      <component :is="$props.value" v-if="typeof $props.value !== 'string'" />
      <p v-else class="break-words">{{ $props.value }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ShInfoItemHozProps } from '../models';

defineProps<ShInfoItemHozProps>();
</script>
