<template>
  <div class="flex justify-between flex-row items-center">
    <div>
      <a-typography-title :level="5">{{ $props.label }}</a-typography-title>
    </div>
    <div class="flex-1 items-center px-[2%]">
      <a-divider type="horizontal" style="height: 2px" dashed />
    </div>
    <div>
      <p v-if="!$props.value"></p>
      <component :is="$props.value" v-if="typeof $props.value !== 'string'" />
      <p v-else>{{ $props.value }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ShInfoItemHozProps } from '../models';

defineProps<ShInfoItemHozProps>();
</script>
