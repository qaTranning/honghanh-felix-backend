<template>
  <a-card v-bind="$props.card"> <ShInfoItemList :values="$props.values" /> </a-card>
</template>

<script setup lang="ts">
import { ShInfoItemList } from '..';
import type { ShInfoItemListCardProps } from '../models';

defineProps<ShInfoItemListCardProps>();
</script>
