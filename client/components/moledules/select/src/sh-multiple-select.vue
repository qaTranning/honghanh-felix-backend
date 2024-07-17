<template>
  <div class="w-full flex flex-row justify-between space-x-2">
    <div class="flex-1">
      <a-select
        mode="multiple"
        label-in-value
        style="width: 100%"
        :filter-option="false"
        :not-found-content="loading || $props.selectProps?.options?.length === 0 ? undefined : null"
        :value="$props.value"
        v-bind="$props.selectProps"
        @update:value="(e: any) => $emit('update:value', e)"
      >
        <template #notFoundContent>
          <div v-if="loading" class="max-h-20 h-20 w-full flex justify-center items-center">
            <a-spin size="small" />
          </div>
          <a-empty v-else :image="simpleImage" />
        </template>
        <!-- <template #tagRender="slotProps">
          <div>dsadas</div>
        </template> -->
      </a-select>
    </div>
    <div v-if="$slots.suffixIcon">
      <slot name="suffixIcon"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Empty } from 'ant-design-vue';

import type { ShMultipleSelectEmits, ShMultipleSelectProps } from '../models';
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;

defineProps<ShMultipleSelectProps>();
defineEmits<ShMultipleSelectEmits>();
</script>

<style lang="scss">
.ant-select-selection-item-content {
  @apply line-clamp-1;
  max-width: 150px !important;
}
</style>
