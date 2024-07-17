<template>
  <div>
    <a-tag :color="getStatus().color">{{ getStatus().label }}</a-tag>
  </div>
</template>

<script setup lang="ts">
import { INVOICE_STATUS_ARRAY } from '~/features/payment/constants';
import type { InvoiceStatusType } from '~/features/payment/models';

interface Props {
  status?: InvoiceStatusType;
}

const props = defineProps<Props>();

function getStatus() {
  const status = INVOICE_STATUS_ARRAY.find((item) => item.value === props.status);

  if (!status) {
    return {
      label: '-',
      color: '',
    };
  }

  return status;
}
</script>
