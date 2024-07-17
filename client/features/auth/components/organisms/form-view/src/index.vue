<template>
  <div class="flex flex-col space-y-2">
    <a-typography-title class="text-center" :level="4">{{
      $props.title.toUpperCase()
    }}</a-typography-title>

    <div class="flex flex-col space-y-4">
      <div class="flex flex-col">
        <slot></slot>
      </div>

      <div class="w-full">
        <a-divider v-if="$slots.footer" />

        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AuthFormViewProps } from '../models';

defineProps<AuthFormViewProps>();
</script>
