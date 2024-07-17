<template>
  <div @click="$emit('click', $props.id)">
    <div class="flex flex-row space-x-2 items-center">
      <div>
        <a-avatar shape="square" :size="30" :src="IMAGE_HELPER.getUrlImageLow($props?.avatar)">
          <template #icon><UserOutlined /></template>
        </a-avatar>
      </div>
      <div>
        <p>Tên: {{ $props.name }}</p>
        <p>Email: {{ $props.email }}</p>
        <p>Phone: {{ $props?.phone || '---' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IMAGE_HELPER } from '~/common';

interface Emits {
  (e: 'click', id: number): void;
}

interface Props {
  name: string;
  email: string;
  phone?: string;

  avatar?: string;
  id: number;
}

defineEmits<Emits>();

defineProps<Props>();
</script>
