<template>
  <div class="flex flex-col space-y-2">
    <div class="flex justify-between">
      <div class="w-[300px]">
        <a-input-search
          label="Tìm kiếm"
          placeholder="Tìm kiếm chiến dịch"
          :allow-clear="true"
          @change="(e) => onChangeDebounce(e.target.value || '')"
        />
      </div>

      <div>
        <a-button class="mx-2" type="default" @click="handleRefresh"><reload-outlined /></a-button>
        <a-button type="primary" @click="goToCreate">Tạo mới</a-button>
      </div>
    </div>
    <!--
    <div class="flex-row space-x-2">
      <a-checkable-tag
        v-for="status in STATUS"
        :key="status"
        class="hover:bg-pink-50 hover:!text-pink-300 focus:!bg-pink-100 focus:!text-pink-300 active:!bg-pink-100 active:!text-pink-300"
        :checked="statusChecked(status)"
        @change="changeStatus(status)"
        >{{ status }}</a-checkable-tag
      >
    </div> -->

    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="ALL" tab="Tất cả"></a-tab-pane>

      <a-tab-pane
        v-for="item in CAMPAIGN_STATUS_ARRAY"
        :key="item.value"
        :tab="item.label"
      ></a-tab-pane>
    </a-tabs>

    <a-table
      :bordered="true"
      :loading="isLoading.value || isRefreshing"
      :columns="columns"
      :pagination="paginationTable"
      :data-source="dataSource"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <ShTableCellAction
            :onDetail="() => navigateTo({ name: 'data-campaign-detail', query: { id: record.id } })"
            :onUpdate="() => navigateTo({ name: 'data-campaign-update', query: { id: record.id } })"
            :onRemove="() => handleDeleteCampaign(record.id)"
          />
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { CAMPAIGN_STATUS, CAMPAIGN_STATUS_ARRAY } from '@/features/campaign/constants';
import { useCampaignTable, useDeleteCampaignService } from '@/features/campaign/services';
import { ShTableCellAction } from '~/components';

const { t } = useI18n();
const STATUS = [...CAMPAIGN_STATUS, 'ALL'] as const;
type StatusType = (typeof STATUS)[number];

const activeKey = ref<any>('ALL');

const statusChecked = (status: StatusType) => statusRef.value.includes(status);

const {
  columns,
  handleTableChange,
  dataSource,
  paginationTable,
  suspense,
  isLoading,
  onChangeDebounce,
  statusRef,
  changeStatus,
  handleRefresh,
  isRefreshing,
} = useCampaignTable(t);

watch(activeKey, (v) => {
  changeStatus(v as any);
});

async function goToCreate() {
  await navigateTo({ name: 'data-campaign-create' });
}

await suspense();
const { handleDeleteCampaign } = useDeleteCampaignService();
</script>

<style>
.ant-tag-checkable-checked {
  color: rgb(249 168 212 / var(--tw-text-opacity)) !important;
  background-color: rgb(253 242 248 / var(--tw-bg-opacity));
}
</style>
