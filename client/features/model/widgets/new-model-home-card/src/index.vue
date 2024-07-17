<template>
  <a-card title="Người mẫu mới" :loading="isLoading">
    <div class="flex flex-col max-h-[400px] overflow-auto">
      <NewModelRowCard v-for="row in result" :key="row.id" :data="row" />
    </div>
    <a-empty v-if="result.length === 0" :image="simpleImage" />

    <template #extra>
      <a-button type="text" @click="navigateTo({ name: 'data-model' })">Xem tất cả</a-button>
    </template>
  </a-card>
</template>

<script setup lang="ts">
import { Empty } from 'ant-design-vue';

import { useGetAllModelsQuery } from '~/features/model/apis';
import { NewModelRowCard } from '~/features/model/components';
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;

const {
  query: { data, isLoading },
} = useGetAllModelsQuery();
const { t } = useI18n();
const result = computed(() => data.value?.data.data.slice(0, 5) || []);
</script>
