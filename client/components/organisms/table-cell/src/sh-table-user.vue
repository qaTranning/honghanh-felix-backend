<template>
  <div class="flex flex-row space-x-2 items-center">
    <AppAvatar shape="square" :size="50" :src="IMAGE_HELPER.getUrlImageLow($props?.avatar)">
      <template #icon><UserOutlined /></template>
    </AppAvatar>
    <div>
      <router-link v-if="$props.id" :to="{ name: 'data-model-detail', query: { id: $props.id } }">
        <ShTableCellLink :name="$props.fullname" />
      </router-link>
      <p v-else>{{ $props.fullname }}</p>
      <p>{{ $props.email || 'Chưa có email' }}</p>
      <p>{{ $props.phone || 'Chưa có số điện thoại' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ShTableCellLink } from '..';
import { AppAvatar } from '~/components/atoms';
import { IMAGE_HELPER } from '~/common';

interface Props {
  fullname: string;
  email: string;
  phone: string;
  avatar: string;
  id?: number;
}

defineProps<Props>();
</script>
