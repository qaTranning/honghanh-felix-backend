<template>
  <a-card title="Xác minh người mẫu">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="" tab="Tất cả"> </a-tab-pane>
      <a-tab-pane key="PENDING" tab="Chờ xác minh"></a-tab-pane>
      <a-tab-pane key="VERIFIED" tab="Đã xác minh"></a-tab-pane>
      <a-tab-pane key="INVALID" tab="Từ chối xác minh"></a-tab-pane>
    </a-tabs>

    <a-table
      :dataSource="data?.data.data || []"
      :columns="columns"
      :scroll="{ x: 1800, y: 450 }"
      :loading="isLoading || isFetching"
      :pagination="paginationTable"
      @change="handleTableChange"
    ></a-table>
  </a-card>
</template>

<script setup lang="ts">
import type { TableColumnsType } from 'ant-design-vue';
import dayjs from 'dayjs';
import type { KycStatusType } from '../../models';
import { useKycData, useUpdateKycStatusModal } from '../../services';
import { KycStatusTag, TableCellAccountBank, TableCallKycAction } from '../../components';
import type { IUser } from '~/features/user/models';
import { TIME_HELPER } from '~/common';
import { profileHandleName } from '~/features/profile';
import { ShTableCellUser } from '~/components/organisms';

const activeKey = ref<KycStatusType>('');

const { data, changeKycStatus, isLoading, isFetching, paginationTable, handleTableChange } =
  useKycData({
    defaultKycStatus: activeKey.value,
  });

watch(activeKey, (v) => {
  changeKycStatus(v);
});

// onMounted(() => {
//   changeKycStatus(activeKey.value);
// });

const { showConfirmReject, showConfirmVerify } = useUpdateKycStatusModal();

const { t } = useI18n();
const columns: TableColumnsType<IUser & { name: string }> = [
  { title: 'ID', width: 45, dataIndex: 'id', key: 'id' },
  {
    title: 'Người mẫu',
    width: 200,
    dataIndex: 'name',
    key: 'name',
    customRender: ({ record }) =>
      h(ShTableCellUser, {
        fullname: profileHandleName(record.firstname, record.lastname),
        email: record.email,
        phone: record.model?.phone || '',
        avatar: record.avatar,
      }),
  },

  {
    title: 'Tài khoản ngân hàng',
    width: 200,
    dataIndex: 'bank',
    key: 'bank',
    customRender: ({ record }) =>
      h(TableCellAccountBank, {
        model: record?.model,
      }),
  },

  {
    title: t('field.gender'),
    key: 'gender',
    width: 80,
    customRender: ({ record }) => {
      return record?.model?.gender || 'N/A';
    },
  },

  {
    title: 'Ethnic',
    dataIndex: 'citizenship',
    key: 'citizenship',
    width: 80,
    customRender: ({ record }) => record.model?.citizenship,
  },
  {
    title: t('field.dob'),
    width: 80,
    dataIndex: 'dob',
    key: 'dob',

    customRender: ({ record }) =>
      h(
        'span',
        TIME_HELPER.formatDate({
          date: dayjs(record.dob),
          format: 'DD/MM/YYYY',
        })
      ),
  },
  { title: t('field.status'), width: 80, dataIndex: 'status', key: 'status' },

  {
    title: t('field.createdAt'),
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 100,
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
    title: t('field.status'),
    key: 'kycStatus',
    fixed: 'right',
    width: 120,
    customRender: ({ record }) =>
      h(KycStatusTag, { status: record?.model?.kycStatus, kycComment: record?.model?.kycComment }),
  },
  {
    title: t('field.action'),
    key: 'operation',
    fixed: 'right',
    width: 80,
    customRender: ({ record }) =>
      h(TableCallKycAction, {
        model: record?.model,
        onVerify: (id) => showConfirmVerify(id),
        onReject: (id) => showConfirmReject(id),
      }),
  },
];
</script>
