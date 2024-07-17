<template>
  <a-card :title="t('common.gallery')">
    <div class="flex flex-col space-y-2">
      <!-- search -->

      <div class="flex justify-between">
        <a-input-search
          class="max-w-[300px]"
          placeholder="Tìm kiếm ảnh"
          :allow-clear="true"
          @change="(e) => onChangeDebounce(e.target.value || '')"
        ></a-input-search>

        <div class="flex space-x-2">
          <a-button @click="() => refetch()">
            <template #icon><ReloadOutlined /></template>
          </a-button>

          <a-button type="primary" @click="onOpen.setTrue">Tạo mới</a-button>
        </div>
      </div>

      <!-- delete -->

      <div class="py-4 flex space-x-2 items-center">
        <a-button :disabled="!hasSelected" type="primary" danger @click="onRemove">
          <template #icon><delete-outlined /></template>
          Xoá ảnh</a-button
        >
        <a-typography v-if="hasSelected">Đã chọn: {{ selectedRowKeys.length }}</a-typography>
      </div>

      <!-- data -->

      <a-table
        :row-selection="rowSelection"
        :loading="isLoading || isFetching"
        :bordered="true"
        :columns="columns"
        :data-source="dataSource"
        :pagination="paginationTable"
      >
      </a-table>

      <!-- model upload -->

      <a-modal
        v-model:visible="open"
        title="Upload ảnh lên thư viện"
        :confirm-loading="isPending"
        @ok="onSubmit"
      >
        <CreateGalleryForm :form="form" />
      </a-modal>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { type TableColumnsType } from 'ant-design-vue';
import dayjs from 'dayjs';
import type { IGallery } from '../../models';
import { CreateGalleryForm, TableCellImageLink } from '../../components';

import {
  useDataTableGallery,
  useCreateFormModalGallery,
  useRemoveModalGallery,
} from '../../services';
import { TIME_HELPER } from '~/common/helpers';
import { ShTableCellCoppyName } from '~/components/organisms';
import { useTableRowSelection } from '~/common/hooks';
const { dataSource, paginationTable, isLoading, refetch, isFetching, name, onChangeDebounce } =
  useDataTableGallery();

const form = useCreateFormModalGallery();
const { open, onOpen, onSubmit, isPending } = form;
const { t } = useI18n();

const { hasSelected, rowSelection, selectedRowKeys, onSelectChange } = useTableRowSelection();

const { showPromiseConfirm } = useRemoveModalGallery({
  onSuccess: () => {
    onSelectChange([]);
  },
});

function onRemove() {
  showPromiseConfirm(selectedRowKeys.value as number[]);
}

const columns: TableColumnsType<IGallery> = [
  {
    title: t('field.image'),
    dataIndex: 'image',
    key: 'image',
    width: 250,
    customRender: ({ record }) => h(TableCellImageLink, { image: record.image }),
  },

  {
    title: t('field.name'),
    dataIndex: 'name',
    key: 'name',
    width: 450,
    customRender: ({ record }) => h(ShTableCellCoppyName, { name: record.name }),
  },
  {
    title: t('field.created_at'),
    dataIndex: 'createdAt',
    key: 'createdAt',
    customRender: ({ record }) =>
      h(
        'span',
        TIME_HELPER.formatDate({
          date: dayjs(record.createdAt),
          format: 'YYYY-MM-DD HH:mm',
        })
      ),
  },
];
</script>
