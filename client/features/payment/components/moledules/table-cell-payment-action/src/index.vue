<template>
  <a-space direction="vertical">
    <a-tooltip v-if="!$props.isNotShowDetail" title="Xem chi tiết">
      <a-button :icon="h(EyeOutlined)" @click="onDetail"> Chi tiết</a-button>
    </a-tooltip>

    <!-- <a-tooltip
      v-if="$props.payment.invoiceStatus === 'APPROVED'"
      title="Nếu bạn đã thanh toán, xác nhận?"
    >
      <a-button type="primary" @click="$emit('pay', $props.payment.id)"> Thanh toán </a-button>
    </a-tooltip> -->

    <div class="flex space-x-2">
      <a-tooltip
        v-if="$props.payment.invoiceStatus === 'WAITING_APPROVED'"
        title="Từ chối thanh toán"
      >
        <a-button type="primary" danger @click="$emit('reject', $props.payment.id)">
          Từ chối
        </a-button>
      </a-tooltip>

      <a-tooltip
        v-if="$props.payment.invoiceStatus === 'WAITING_APPROVED'"
        title="Xác nhận thanh toán"
      >
        <a-button type="primary" @click="$emit('approve', $props.payment.id)">Xác nhận</a-button>
      </a-tooltip>
    </div>

    <a-tooltip v-if="$props.payment.invoiceStatus === 'APPROVED'" title="Xác nhận thanh toán">
      <a-button type="primary" @click="$emit('confirm', $props.payment.id)">Xác nhận</a-button>
    </a-tooltip>

    <!-- <a-typography-paragraph v-if="$props.payment.invoiceStatus === 'WAITING_CONFIRM'">
      Chờ người mẫu xác nhận để thanh toán hoặc từ chối
    </a-typography-paragraph> -->

    <a-button
      v-if="$props.payment.invoiceStatus === 'WAITING_CONFIRM'"
      type="primary"
      danger
      @click="$emit('reject', $props.payment.id)"
    >
      Từ chối
    </a-button>
  </a-space>
</template>

<script setup lang="ts">
import { EyeOutlined } from '@ant-design/icons-vue';
import type { IPayment } from '~/features/payment/models';
interface Props {
  payment: IPayment;
  isNotShowDetail?: boolean;
}

interface Emits {
  (e: 'reject', id: number): void;
  (e: 'pay', id: number): void;
  (e: 'confirm', id: number): void;
  (e: 'approve', id: number): void;
}

const props = defineProps<Props>();

defineEmits<Emits>();

const { push } = useRouter();

function onDetail() {
  push({ name: 'data-payment-detail', query: { id: props.payment.id } });
}
</script>
