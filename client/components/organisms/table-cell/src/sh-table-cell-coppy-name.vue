<template>
  <a-space direction="horizontal">
    <a-typography>{{ $props.name }}</a-typography>

    <a-button type="text" @click="onCoppy">
      <template #icon> <copy-outlined /> </template>
    </a-button>
  </a-space>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core';
import { message } from 'ant-design-vue';
import type { ShTableCellCoppyNameProps } from '../models';

const props = defineProps<ShTableCellCoppyNameProps>();

const { copy } = useClipboard();

function onCoppy() {
  // Copy the text inside the text field
  copy(props.name);
  message.info('coppied value: ' + props.name);
  // Alert the copied text
}
</script>
