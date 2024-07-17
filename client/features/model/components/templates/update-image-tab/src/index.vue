<template>
  <ShDashboardFormView>
    <template #main>
      <a-card title="Gallery">
        <div class="py-4 flex space-x-2 items-center">
          <a-button :disabled="!hasSelected" type="primary" danger @click="onRemove">
            <template #icon><delete-outlined /></template>
            Xoá</a-button
          >
          <a-typography v-if="hasSelected">Đã chọn: {{ selectedRowKeys.length }}</a-typography>
        </div>
        <a-table
          key="id"
          :row-selection="rowSelection"
          :loading="isLoading || isFetching"
          :bordered="true"
          :columns="columns"
          :data-source="listImage"
          :pagination="false"
        >
        </a-table>
      </a-card>
    </template>
    <template #side>
      <a-card title="Upload">
        <a-form-item v-bind="images">
          <ShUploadImagesVadidate :max-count="maxImageUpload" v-bind="images" :multiple="true" />
        </a-form-item>

        <div class="flex justify-end">
          <a-button @click="onSubmit">Upload</a-button>
        </div>
      </a-card>
    </template>
  </ShDashboardFormView>
</template>

<script setup lang="ts">
import type { TableColumnsType } from 'ant-design-vue';
import { ANDT_FORM_HELPER, useTableRowSelection } from '~/common';
import { useRouteQuery } from '~/common/hooks/route-query';
import { ShUploadImagesVadidate } from '~/components/moledules';
import { ShDashboardFormView, ShTableCellAction } from '~/components/organisms';
import { TableCellImageLink } from '~/features/gallery/components';
import type { ModelImage } from '~/features/model/models';
import { useRemoveImageModel, useUpsertImageModelForm } from '~/features/model/services';

const { currentModelId, onSubmit, listImage, defineComponentBinds, isLoading, isFetching } =
  useUpsertImageModelForm();

const maxImageUpload = computed(() => 10 - listImage.value.length);

const images = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'images');
const id = useRouteQuery('id');

onMounted(() => {
  currentModelId.value = Number(id.value);
});

const { hasSelected, rowSelection, selectedRowKeys, onSelectChange } = useTableRowSelection({
  key: 'id',
});

const { showPromiseConfirm } = useRemoveImageModel({
  onSuccess: () => {
    onSelectChange([]);
  },
  id: Number(id.value),
});
function onRemove() {
  showPromiseConfirm(selectedRowKeys.value as number[]);
}
const { t } = useI18n();

const columns: TableColumnsType<ModelImage> = [
  {
    title: t('field.image'),
    dataIndex: 'image',
    key: 'image',
    width: 250,
    customRender: ({ record }) => h(TableCellImageLink, { image: record.image }),
  },
  {
    title: t('field.action'),
    dataIndex: 'action',
    key: 'action',
    width: 100,
    customRender: ({ record }) =>
      h(ShTableCellAction, { onRemove: () => showPromiseConfirm([record.id]) }),
  },
];
</script>
