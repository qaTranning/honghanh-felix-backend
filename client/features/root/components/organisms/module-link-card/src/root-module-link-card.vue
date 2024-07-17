<template>
  <div class="w-full p-3 flex space-x-3">
    <a-avatar shape="square" :size="64">
      <component :is="$props.icon" />
    </a-avatar>

    <div class="flex flex-col">
      <a-typography-title :level="5">{{ $t($props.name) }}</a-typography-title>
      <a
        v-for="item in $props.children"
        :key="item.name"
        @click="() => navigateTo({ name: item.routeName })"
        >{{ $t(item.name) }}</a
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RootModuleLinkCardProps } from '../models';

defineProps<RootModuleLinkCardProps>();
</script>
