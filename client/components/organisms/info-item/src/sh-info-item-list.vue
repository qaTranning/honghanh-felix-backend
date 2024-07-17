<template>
  <div class="flex flex-col space-y-2">
    <ShInfoItem
      v-for="item in $props.values"
      :key="item.key"
      :label="item.label"
      :value="item.value"
    />
  </div>
</template>

<script setup lang="ts">
import { ShInfoItem } from '..';
import type { ShInfoItemListProps } from '../models';

defineProps<ShInfoItemListProps>();
</script>
