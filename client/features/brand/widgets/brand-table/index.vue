<template>
  <div class="flex flex-col space-y-2">
    <div class="flex justify-between">
      <div class="w-[300px]">
        <a-input-search
          placeholder="Tìm kiếm thương hiệu"
          :allow-clear="true"
          @change="(e) => onChangeDebounce(e.target.value || '')"
        />
      </div>

      <div>
        <a-button class="mx-2" type="default" @click="handleRefresh"><reload-outlined /></a-button>
        <a-button type="primary" @click="goToCreate">Tạo mới</a-button>
      </div>
    </div>

    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="ALL" tab="Tất cả"></a-tab-pane>

      <a-tab-pane key="PENDING" tab="Chờ duyệt"> </a-tab-pane>
      <a-tab-pane key="ACTIVE" tab="Hoạt động"></a-tab-pane>
      <a-tab-pane key="BANNED" tab="Bị cấm"></a-tab-pane>
    </a-tabs>
    <!-- <div class="flex-row space-x-2">
      <a-checkable-tag
        v-for="status in STATUS"
        :key="status"
        class="hover:bg-pink-50 hover:!text-pink-300 focus:!bg-pink-100 focus:!text-pink-300 active:!bg-pink-100 active:!text-pink-300"
        :checked="statusChecked(status)"
        @change="() => changeStatus(status)"
        >{{ status }}</a-checkable-tag
      >
    </div> -->

    <a-table
      :loading="isLoading.value || isRefreshing"
      :columns="columns"
      :pagination="paginationTable"
      :data-source="dataSource"
      @change="handleTableChange"
    >
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { BRAND_STATUS } from '../../constants';
import { useBrandTable } from '@/features/brand/services';

const STATUS = [...BRAND_STATUS, 'ALL'] as const;
type StatusType = (typeof STATUS)[number];
const statusChecked = (status: StatusType) => statusRef.value.includes(status);
const { t } = useI18n();
const {
  columns,
  handleTableChange,
  dataSource,
  paginationTable,
  suspense,
  isLoading,
  statusRef,
  onChangeDebounce,
  isRefreshing,
  handleRefresh,
  changeStatus,
} = useBrandTable(t);
const activeKey = ref<string>('ALL');

watch(activeKey, (v) => {
  changeStatus(v as any);
});

async function goToCreate() {
  await navigateTo({ name: 'data-brand-create' });
}

await suspense();
</script>
