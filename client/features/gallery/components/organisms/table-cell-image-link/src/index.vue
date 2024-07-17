<template>
  <div class="flex space-x-2 items-center">
    <ShImage :width="150" :src="IMAGE_HELPER.getUrlImageLow($props.image)" />

    <a-button type="text" @click="onCoppy">
      <template #icon> <copy-outlined /> </template>
    </a-button>
  </div>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core';
import { message } from 'ant-design-vue';
import { IMAGE_HELPER } from '~/common/helpers';
import { ShImage } from '~/components/moledules';

const props = defineProps<{ image: string }>();

const { copy } = useClipboard();

function onCoppy() {
  // Copy the text inside the text field
  copy(IMAGE_HELPER.getUrlImageLow(props.image));
  message.info('coppied image link');
  // Alert the copied text
}
</script>
