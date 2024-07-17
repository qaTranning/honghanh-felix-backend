<template>
  <a-card :title="$t('app_config.list')">
    <div class="flex justify-between pb-4">
      <a-input-search
        placeholder="Tìm kiếm cấu hình"
        class="max-w-[300px]"
        :allow-clear="true"
        @change="(e) => onChangeDebounce(e.target.value || '')"
      ></a-input-search>
      <div class="flex space-x-2">
        <a-button class="mx-2" type="default" @click="handleRefresh"><reload-outlined /></a-button>
        <a-button @click="clickCreate">{{ $t('common.create') }}</a-button>
      </div>
    </div>
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :loading="isLoading || isRefreshing || isFetching"
      :pagination="false"
    ></a-table>
  </a-card>
</template>

<script setup lang="ts">
import { type TableColumnsType } from 'ant-design-vue';
import dayjs from 'dayjs';
import type { IAppConfig } from '../../models';
import { useMutationRemoveAppConfig, useQueryAllAppConfig } from '../../apis';
import { TableCellListStyleTag } from '../../components';
import { TIME_HELPER } from '~/common/helpers';
import { ShTableCellAction } from '~/components/organisms';
import { useString } from '~/common';
const {
  query: { data, isLoading, refetch, isFetching },
} = useQueryAllAppConfig();

const [name, { onChangeDebounce }] = useString();

const dataSource = computed(
  () => data.value?.data.filter((item) => item.name.includes(name.value)) || []
);

const {
  mutation: { mutate: mutateRemove },
} = useMutationRemoveAppConfig();

function clickCreate() {
  navigateTo({ name: 'data-app-config-create' });
}

const { t } = useI18n();
const columns: TableColumnsType<IAppConfig> = [
  { title: t('field.name'), dataIndex: 'name', key: 'name', fixed: 'left' },
  {
    title: t('field.value'),
    dataIndex: 'value',
    key: 'value',
    customRender: ({ record }) => {
      if (record.name.toLocaleLowerCase() === 'style') {
        return h(TableCellListStyleTag, { value: record.value });
      } else {
        return h('p', { class: 'line-clamp-1 max-w-[300px]' }, record.value);
      }
    },
  },
  {
    title: t('field.updated_at'),
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    width: 250,
    customRender: ({ record }) =>
      h(
        'span',
        TIME_HELPER.formatDate({
          date: dayjs(record.createdAt),
          format: 'YYYY-MM-DD HH:mm',
        })
      ),
  },
  {
    title: t('field.action'),
    key: 'operation',
    fixed: 'right',
    width: 150,
    customRender: ({ record }) =>
      h(ShTableCellAction, {
        onRemove: () => {
          mutateRemove({ params: { id: record.id } });
        },
        onDetail: () => {
          record.name.toLocaleLowerCase() === 'style'
            ? navigateTo({ name: 'data-app-config-update-style', query: { id: record.id } })
            : navigateTo({ name: 'data-app-config-update', query: { id: record.id } });
        },
      }),
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
