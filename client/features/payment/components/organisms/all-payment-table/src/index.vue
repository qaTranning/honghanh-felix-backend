<template>
  <div>
    <a-table
      :loading="isLoading || isRefetching"
      :columns="columns"
      :data-source="listData"
      :pagination="paginationTable"
      :scroll="{ x: 1200, y: 450 }"
      @change="handleTableChange"
    >
    </a-table>
  </div>
</template>

<script setup lang="ts">
import type { TableColumnsType } from 'ant-design-vue';
import dayjs from 'dayjs';
import { TableCellPaymentInfo, TableCellPaymentAction } from '../../../moledules';
import { ShTableCellUser } from '~/components/organisms';
import type { IPayment, InvoiceStatusType } from '~/features/payment/models';
import { profileHandleName } from '~/features/profile';
import { TIME_HELPER } from '~/common/helpers';
import { useAllDataTablePayment, useUpdatePaymentStatusModal } from '~/features/payment/services';
import type { IParamsGetAllPayment } from '~/features/payment/apis';

interface Props {
  invoiceStatus: InvoiceStatusType;
  campaignId?: number;
  order?: IParamsGetAllPayment['order'];
}

const props = defineProps<Props>();

const {
  listData,
  paginationTable,
  handleTableChange,
  isLoading,
  isRefetching,
  invoiceStatus,
  orderRef,
} = useAllDataTablePayment({
  defaultInvoiceStatus: props.invoiceStatus,
  campaignId: props.campaignId,
  order: props.order,
});
const { t } = useI18n();

const { showConfirmReject, showConfirmPay, showConfirmComplete, showConfirmApprove } =
  useUpdatePaymentStatusModal();

watch(
  () => props.invoiceStatus,
  (value) => {
    invoiceStatus.value = value;
  }
);

watch(
  () => props.order,
  (value) => {
    orderRef.value = value;
  }
);

const columns: TableColumnsType<IPayment> = [
  {
    title: 'ID',
    key: 'id',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: 'Người mẫu',
    key: 'model',
    width: 300,
    customRender: ({ record }) =>
      h(ShTableCellUser, {
        fullname: profileHandleName(record.model.user.firstname, record.model.user.lastname),
        email: record.model.user.email,
        phone: record.model.phone || '',
        avatar: record.model.user.avatar,
        id: record.model.user.id,
      }),
  },
  {
    title: 'Thông tin thanh toán',
    key: 'model',
    width: 500,
    customRender: ({ record }) => h(TableCellPaymentInfo, { payment: record }),
  },
  {
    title: t('field.created_at'),
    dataIndex: 'createdAt',
    key: 'createdAt',
    align: 'right',
    width: 200,

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
    title: '',
    key: 'model',
    width: 150,
    fixed: 'right',
    customRender: ({ record }) =>
      h(TableCellPaymentAction, {
        payment: record,

        onReject: (id) => showConfirmReject(id),
        onPay: (id) => showConfirmPay(id),
        onApprove: (id) => showConfirmApprove(id),
        onConfirm: (id) => showConfirmComplete(id),
      }),
  },
];
</script>
