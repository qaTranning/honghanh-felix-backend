<template>
  <a-card :title="t('common.review')">
    <div class="flex justify-between py-2">
      <div class="w-[300px]">
        <a-input-search
          label="Tìm kiếm"
          placeholder="Tìm kiếm đánh giá"
          :allow-clear="true"
          @change="(e) => onChangeDebounce(e.target.value || '')"
        />
      </div>

      <div>
        <a-button class="mx-2" type="default" @click="() => refetch()"
          ><reload-outlined
        /></a-button>
        <!-- <a-button type="primary" @click="() => navigateTo({ name: 'data-review-create' })"
          >Tạo mới</a-button
        > -->
      </div>
    </div>

    <a-table
      v-model:pagination="paginationTable"
      :bordered="true"
      :columns="columns"
      :data-source="dataSource"
      :scroll="{ x: 1500, y: 450 }"
      :loading="isLoading || isRefetching"
    >
    </a-table>
  </a-card>
</template>

<script setup lang="ts">
import type { TableColumnsType } from 'ant-design-vue/es';
import dayjs from 'dayjs';
import { Rate } from 'ant-design-vue';
import type { IReview } from '../../models';
import { useAllDataTableReview } from '../../services';
import { useMutationRemoveReview } from '../../apis';
import { TIME_HELPER } from '~/common/helpers';
import {
  ShTableCellAction,
  ShTableCellLink,
  ShTableCellTooltipValue,
} from '~/components/organisms';
import { profileHandleName } from '~/features';
import { ShStatusTag } from '~/components/moledules';

const {
  mutation: { mutate: mutateRemove },
} = useMutationRemoveReview({});

const { t } = useI18n();
const columns: TableColumnsType<IReview> = [
  {
    title: t('common.campaign'),
    width: 80,
    dataIndex: 'campaign',
    key: 'campaign',
    customRender: ({ record }) =>
      h(ShTableCellLink, {
        name: record.campaign.name,
        onClick: () =>
          navigateTo({ name: 'data-campaign-detail', query: { id: record.campaignId } }),
      }),
  },
  {
    title: t('common.model'),
    width: 80,
    dataIndex: 'model',
    key: 'model',
    customRender: ({ record }) =>
      h(ShTableCellLink, {
        name: profileHandleName(record.model.user.firstname, record.model.user.lastname),
        onClick: () => navigateTo({ name: 'data-model-detail', query: { id: record.modelId } }),
      }),
  },

  {
    title: t('field.comment'),
    width: 100,
    dataIndex: 'comment',
    key: 'comment',
    customRender: ({ record }) => h(ShTableCellTooltipValue, { value: record.comment }),
  },

  {
    title: t('field.rate'),
    width: 70,
    dataIndex: 'rate',
    key: 'rate',
    customRender: ({ record }) => h(Rate, { value: record.rate, disabled: true }),
  },
  {
    title: t('field.startDate'),
    dataIndex: 'startDate',
    key: 'startDate',
    width: 80,

    customRender: ({ record }) =>
      h(
        'span',
        TIME_HELPER.formatDate({
          date: dayjs(record.createdAt),
          format: 'DD/MM/YYYY',
        })
      ),
  },
  {
    title: t('field.status'),
    width: 80,
    dataIndex: 'status',
    key: 'status',
    customRender: ({ record }) =>
      h(ShStatusTag, {
        status: record.status,
      }),
  },
  {
    title: t('field.action'),
    key: 'operation',
    fixed: 'right',
    width: 70,
    customRender: ({ record }) =>
      h(ShTableCellAction, {
        onUpdate: () => navigateTo({ name: 'data-review-update', query: { id: record.id } }),
        onRemove: () => mutateRemove({ params: { id: record.id } }),
      }),
  },
];

const { dataSource, isLoading, isRefetching, paginationTable, onChangeDebounce, refetch } =
  useAllDataTableReview();
</script>
