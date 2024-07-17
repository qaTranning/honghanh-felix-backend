<template>
  <a-spin :spinning="isLoading">
    <div class="flex flex-col space-y-4">
      <a-input-search
        :allow-clear="true"
        placeholder="Type search gallery"
        @change="(e) => onChangeDebounce(e.target.value || '')"
      ></a-input-search>

      <div class="flex flex-col space-y-2 overflow-auto max-h-[400px]">
        <div
          v-for="gallery in listData"
          :key="gallery.id"
          class="flex justify-between items-center"
        >
          <div class="flex space-x-1 items-center">
            <div>
              <a-image :width="50" :src="IMAGE_HELPER.getUrlImageLow(gallery.image)"></a-image>
            </div>
            <p>{{ gallery.name }}</p>
          </div>

          <a-button type="text" @click="() => onCoppy(gallery.image, gallery.name)">
            <template #icon> <copy-outlined /> </template>
          </a-button>
        </div>
      </div>

      <div v-if="listData.length === 0">
        <a-empty :image="Empty.PRESENTED_IMAGE_SIMPLE" />
      </div>
    </div>
  </a-spin>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core';
import { message, Empty } from 'ant-design-vue';
import { IMAGE_HELPER } from '~/common';
import { useQueryAllGallery } from '~/features/gallery/apis';

const { onChangeDebounce, listData, isLoading } = useQueryAllGallery();

const { copy } = useClipboard();

function onCoppy(image: string, name: string) {
  // Copy the text inside the text field
  copy(IMAGE_HELPER.getUrlImageLow(image));
  message.info('coppied value: ' + name);
  // Alert the copied text
}
</script>
