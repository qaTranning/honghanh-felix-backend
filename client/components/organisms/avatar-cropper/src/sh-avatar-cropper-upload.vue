<template>
  <div class="flex justify-center">
    <div class="border-2 border-primary">
      <a-avatar
        :size="120"
        class="cursor-pointer border-2 border-background_v2 border-solid"
        :src="$props.cropper.avatar"
        @click="onOpen.setTrue"
      >
        <template #icon>
          <UserOutlined />
        </template>
      </a-avatar>
    </div>
  </div>
  <a-modal v-model:visible="open">
    <sh-avatar-cropper v-bind="$props.cropper" :on-close="onOpen.setFalse"></sh-avatar-cropper>

    <template #footer> </template>
  </a-modal>
</template>

<script setup lang="ts">
import { ShAvatarCropper } from '..';
import type { ShAvatarCropperUploadProps } from '../models';
import { useBoolean } from '~/common';

defineProps<ShAvatarCropperUploadProps>();

const [open, onOpen] = useBoolean();
</script>
