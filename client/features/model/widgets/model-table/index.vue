<template>
  <div class="flex flex-col space-y-2">
    <div class="flex justify-between">
      <div>
        <div class="w-[300px]">
          <a-input-search
            placeholder="Tìm kiếm người mẫu"
            :allow-clear="true"
            @change="(e) => onChangeDebounce(e.target.value || '')"
          />
        </div>

        <a-tabs v-model:activeKey="activeKey">
          <a-tab-pane key="ALL" tab="Tất cả"></a-tab-pane>

          <a-tab-pane key="PENDING" tab="Chờ duyệt"> </a-tab-pane>
          <a-tab-pane key="ACTIVE" tab="Hoạt động"></a-tab-pane>
          <a-tab-pane key="BANNED" tab="Bị cấm"></a-tab-pane>
        </a-tabs>
        <!-- 
        <div class="flex-row space-x-2 pt-2">
          <a-checkable-tag
            v-for="status in STATUS"
            :key="status"
            :checked="statusChecked(status)"
            class="hover:bg-pink-50 hover:!text-pink-300 focus:!bg-pink-100 focus:!text-pink-300 active:!bg-pink-100 active:!text-pink-300"
            @change="changeStatus(status)"
            >{{ status }}</a-checkable-tag
          >
        </div> -->
      </div>

      <div>
        <a-button class="mx-2" type="default" @click="handleRefresh"><reload-outlined /></a-button>
      </div>
    </div>

    <a-table
      :bordered="true"
      :loading="isLoading.value || isRefreshing"
      :columns="columns"
      :pagination="paginationTable"
      :data-source="dataSource"
      :scroll="{ x: 1500, y: 450 }"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <ShTableCellAction
            :onDetail="() => navigateTo({ name: 'data-model-detail', query: { id: record.id } })"
            :onUpdate="() => navigateTo({ name: 'data-model-update', query: { id: record.id } })"
            :onRemove="() => handleDeleteModel(record.id)"
          />
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { Modal } from 'ant-design-vue';
import { useDeleteModelService, useModelTable } from '@/features/model/services';
import { MODEL_STATUS } from '@/features/model/constants';
import { ShTableCellAction } from '~/components/organisms';

const activeKey = ref<string>('ALL');

const { t } = useI18n();
const STATUS = [...MODEL_STATUS, 'ALL'] as const;
type StatusType = (typeof STATUS)[number];

const statusChecked = (status: StatusType) => statusRef.value.includes(status);
const infoCreate = () => {
  Modal.info({
    title: 'Notify',
    content: h('div', {}, [h('p', 'Please edit a model in list table beside')]),
  });
};

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
  page,
  isRefreshing,
} = useModelTable(t);

watch(activeKey, (v) => {
  changeStatus(v as any);
});
function handleSearch(value: string) {
  onChangeDebounce(value, () => {
    page.value = 1;
  });
}

await suspense();
const { handleDeleteModel } = useDeleteModelService();
</script>
