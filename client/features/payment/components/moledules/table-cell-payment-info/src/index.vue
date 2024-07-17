<template>
  <div class="w-full">
    <a-collapse :bordered="false" style="background-color: transparent; width: 100%">
      <a-collapse-panel key="1">
        <template #header>
          <div class="flex-1 w-full">
            <ShInfoItemList :values="renderItem" />
          </div>
        </template>

        <ShInfoItemList :values="renderExpandItem" />
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script setup lang="ts">
import { PaymentStatusTag } from '../../payment-status-tag';
import { NUMBER_HELPER } from '~/common';
import { ShInfoItemList, type ShInfoItemProps } from '~/components/organisms';
import type { IPayment } from '~/features/payment/models';
interface Props {
  payment: IPayment;
}
const props = defineProps<Props>();

const amount =
  NUMBER_HELPER.formatNumberPrice(
    Number(props.payment.salary || 0) + Number(props.payment.otSalary || 0)
  ) +
  ' ' +
  props.payment.currency;

const status = props.payment.invoiceStatus;

const typeInvoice =
  props.payment.invoiceType === 'OT'
    ? [
        { key: 'type', label: 'Loại yêu cầu:', value: 'OT' },
        { key: 'time', label: 'Thời gian OT:', value: props.payment.otHours },
      ]
    : [];

const renderItem: ShInfoItemProps[] = [
  { key: 'money', label: 'Số tiền:', value: amount },
  { key: 'status', label: 'Trạng thái:', value: h(PaymentStatusTag, { status }) },
  { key: 'decs', label: 'Nội dung', value: props.payment.description || '' },
];

const renderExpandItem: ShInfoItemProps[] = [
  { key: 'money', label: 'Chiến dịch:', value: props.payment.campaignRole.campaign.name },
  {
    key: 'status',
    label: 'Thương hiệu :',
    value: props?.payment?.campaignRole?.campaign?.brand?.title || '',
  },
  {
    key: 'bankName',
    label: 'Tên ngân hàng:',
    value: props?.payment?.model?.bankName || '',
  },
  {
    key: 'bankAccount',
    label: 'Số tài khoản:',
    value: props?.payment?.model?.bankAccount || '',
  },
  {
    key: 'bankAddress',
    label: 'Chi nhánh:',
    value: props?.payment?.model?.bankAddress || '',
  },
];
</script>
