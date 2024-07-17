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
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'operation'">
        <ShTableCellChangeStatusRegister
          :campaignRoleId="record.campaignRoleId"
          :model-id="record.modelId"
        />
      </template>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { type TableColumnsType, type TableProps } from 'ant-design-vue';
import { TIME_HELPER } from '~/common';
import { useRouteQuery } from '~/common/hooks/route-query';
import { ShTableCellLink } from '~/components/organisms';
import {
  ShTableCellChangeStatusRegister,
  StatusRequestCampaignTag,
} from '~/features/request-campaign';
import { useQueryAllRequestCampaign } from '~/features/request-campaign/apis';
import type { IRequestCampaign } from '~/features/request-campaign/models';
const id = useRouteQuery('id');

const {
  query: { data, isLoading, refetch },
  page,
  pageSize,
  modelId,
} = useQueryAllRequestCampaign({
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
const columns: TableColumnsType<IRequestCampaign> = [
  {
    title: t('common.campaign'),
    dataIndex: 'name',
    key: 'name',
    fixed: 'left',
    customRender: ({ record }) =>
      h(ShTableCellLink, {
        name: record.campaignRole?.campaign.name,
        onClick: () =>
          navigateTo({
            name: 'data-campaign-detail',
            query: { id: record.campaignRole.campaign.id },
          }),
      }),
  },

  {
    title: t('field.status'),
    dataIndex: 'status',
    key: 'status',
    customRender: ({ record }) => h(StatusRequestCampaignTag, { status: record.status }),
  },

  {
    title: t('field.createdAt'),
    dataIndex: 'createdAt',
    key: 'createdAt',
    customRender: ({ record }) => TIME_HELPER.convertTimeAndDate(record.createdAt),
  },
  {
    title: t('field.updatedAt'),
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    customRender: ({ record }) => TIME_HELPER.convertTimeAndDate(record.updatedAt),
  },
  {
    title: t('field.action'),
    key: 'operation',
    fixed: 'right',
    width: 100,
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
