<template>
  <a-card :title="t('common.newCampaign')" :loading="query.isLoading.value">
    <div class="flex flex-col space-y-2 max-h-[300px] overflow-auto">
      <NewCampaignRowCard v-for="row in data" :key="row.id" :data="row" />
    </div>

    <a-empty v-if="data.length === 0" :image="simpleImage" />

    <template #extra>
      <a-button type="text" @click="navigateTo({ name: 'data-campaign' })">Xem tất cả</a-button>
    </template>
  </a-card>
</template>

<script setup lang="ts">
import { Empty } from 'ant-design-vue';
import { useGetAllCampaignsQuery } from '../../apis';
import { NewCampaignRowCard } from '~/features/campaign/components';
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;

const { query } = useGetAllCampaignsQuery();
const { t } = useI18n();
const data = computed(() => query.data.value?.data.data || []);
</script>
