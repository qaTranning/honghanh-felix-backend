<template>
  <a-spin :spinning="loadingStore.loading || !!isMutating">
    <slot></slot>
  </a-spin>
</template>

<script setup lang="ts">
import { useIsMutating } from '@tanstack/vue-query';
import { useLoadingStore } from '~/features/root/stores';

const isMutating = useIsMutating();
const loadingStore = useLoadingStore();
</script>
