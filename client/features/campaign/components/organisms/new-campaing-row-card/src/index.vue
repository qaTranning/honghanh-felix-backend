<template>
  <div class="flex justify-between items-center py-2">
    <div class="flex space-x-2 items-center">
      <a-avatar shape="square" :size="30" :src="IMAGE_HELPER.getUrlImageLow(data?.thumbnail)">
        <template #icon><AreaChartOutlined /></template>
      </a-avatar>
      <a-typography-title :level="5">{{ data.name }}</a-typography-title>
    </div>
    <div class="flex space-x-2 items-center">
      <p>{{ TIME_HELPER.convertTimeAndDate(data?.createdAt as any) }}</p>
      <div>
        <a-tooltip title="View">
          <a-button
            type="text"
            shape="circle"
            :icon="h(EyeOutlined)"
            @click="() => navigateTo({ name: 'data-campaign-detail', query: { id: data.id } })"
          />
        </a-tooltip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EyeOutlined } from '@ant-design/icons-vue';
import type { ICampaign } from '../../../../models';
import { IMAGE_HELPER, TIME_HELPER } from '~/common';

defineProps<{ data: ICampaign }>();
</script>
