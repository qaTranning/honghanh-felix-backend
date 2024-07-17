<template>
  <a-button class="mb-3 float-right" type="default" @click="handleRefresh"
    ><reload-outlined
  /></a-button>
  <a-table
    :bordered="true"
    :columns="columns"
    :loading="isLoading || isRefreshing"
    :data-source="dataSource"
    :pagination="paginationTable"
  >
    <template #bodyCell="{ column, record }"> </template>
  </a-table>
</template>

<script setup lang="ts">
import { type TableColumnsType, type TableProps } from 'ant-design-vue';
import { TIME_HELPER } from '~/common';
import { useRouteQuery } from '~/common/hooks/route-query';
import { useQueryAllSchedule } from '~/features/schedule/apis';
import { ScheduleType } from '~/features/schedule/components';
import type { ISchedule } from '~/features/schedule/models';
const id = useRouteQuery('id');

const {
  query: { data, isLoading, refetch },
  page,
  pageSize,
  modelId,
} = useQueryAllSchedule({
  defaultParams: { filter: { modelId: Number(id.value) } },
});

onMounted(() => {
  modelId.value = Number(id.value);
});

const result = computed(() => data.value);

const paginationTable = computed<TableProps['pagination']>(() => {
  const meta = result.value?.data.meta;
  return {
    total: meta?.total,
    current: page.value ?? meta?.currentPage,
    pageSize: pageSize.value ?? 20,
    showLessItems: true,
    pageSizeOptions: ['20', '40', '60', '80', '100'],
    showSizeChanger: true,
  };
});

const dataSource = computed(() => data.value?.data.data);

watch(dataSource, (value) => console.log(value));
const { t } = useI18n();

const columns: TableColumnsType<ISchedule> = [
  {
    title: t('field.note'),
    dataIndex: 'note',
    key: 'note',
    fixed: 'left',
    customRender: ({ record }) => record.note,
  },
  {
    title: t('field.detail'),
    dataIndex: 'detail',
    key: 'detail',
    fixed: 'left',
    customRender: ({ record }) => record.detail,
  },
  {
    title: t('field.startDate'),
    dataIndex: 'startDate',
    key: 'startDate',
    fixed: 'left',
    customRender: ({ record }) => TIME_HELPER.convertTimeAndDate(record.startDate),
  },
  {
    title: t('field.endDate'),
    dataIndex: 'endDate',
    key: 'endDate',
    fixed: 'left',
    customRender: ({ record }) => TIME_HELPER.convertTimeAndDate(record.endDate),
  },
  {
    title: t('field.type'),
    dataIndex: 'type',
    key: 'type',
    customRender: ({ record }) => h(ScheduleType, { type: record.type }),
  },
];

const isRefreshing = ref(false);
const handleRefresh = async () => {
  try {
    isRefreshing.value = true;
    await refetch();
  } finally {
    isRefreshing.value = false;
  }
};
</script>
