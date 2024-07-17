<template>
  <div class="flex justify-between items-center py-2">
    <div class="flex space-x-2 items-center">
      <a-avatar :src="IMAGE_HELPER.getUrlImageLow(data?.avatar)">
        <template #icon><UserOutlined /></template>
      </a-avatar>
      <a-typography-title :level="5">{{
        profileHandleName(data.firstname, data.lastname)
      }}</a-typography-title>
    </div>
    <div>
      <a-tooltip title="View">
        <a-button
          type="text"
          shape="circle"
          :icon="h(EyeOutlined)"
          @click="() => navigateTo({ name: 'data-model-detail', query: { id: data.id } })"
        />
      </a-tooltip>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { EyeOutlined } from '@ant-design/icons-vue';
import { IMAGE_HELPER } from '~/common';
import { profileHandleName } from '~/features';
import type { IUser } from '~/features/user/models';
defineProps<{ data: IUser }>();
</script>
