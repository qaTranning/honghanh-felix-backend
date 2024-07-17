<template>
  <a-spin :spinning="$props.loading">
    <div class="max-w-[1150px]" :style="{ maxWidth: $props.maxWidthContainer }">
      <a-typography-title v-if="$props.title" :level="4">{{ $props.title }}</a-typography-title>

      <div v-if="$slots.header">
        <slot name="header"></slot>
      </div>

      <div v-if="$slots.body">
        <slot name="body"></slot>
      </div>

      <div v-if="!$slots.body" class="flex flex-row space-x-2 pt-2">
        <div
          class="flex flex-1 max-w-[800px] flex-col space-y-2"
          :style="{ maxWidth: $props.maxWidthMain }"
        >
          <slot name="main"></slot>
        </div>

        <div
          class="flex flex-1 max-w-[350px] flex-col space-y-2"
          :style="{ maxWidth: $props.maxWidthSide }"
        >
          <slot name="side"></slot>
        </div>
      </div>
    </div>
  </a-spin>
</template>

<script setup lang="ts">
import type { ShDashboardFormViewProps } from '../models';

defineProps<ShDashboardFormViewProps>();
</script>
