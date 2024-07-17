<template>
  <div>
    <a-tag :color="getStatus().color">{{ getStatus().name }}</a-tag>
    <p v-if="getShowComment()">
      <span class="font-bold"> Lý do: </span>

      {{ $props.kycComment }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { KycStatusType } from '~/features/kyc/models';

interface Props {
  status?: KycStatusType;
  kycComment?: string;
}

const props = defineProps<Props>();

function getShowComment() {
  if (!props.kycComment) {
    return false;
  }
  if (props.status === 'INVALID' || props.status === 'PENDING') {
    return true;
  }

  return false;
}

function getStatus() {
  switch (props.status) {
    case 'NOT_STARTED':
      return {
        color: 'blue',
        name: 'Chưa xác minh',
      };
    case 'PENDING':
      return {
        color: 'yellow',
        name: 'Chờ xác minh',
      };
    case 'VERIFIED':
      return {
        color: 'green',
        name: 'Đã xác minh',
      };
    case 'INVALID':
      return {
        color: 'red',
        name: 'Từ chối xác minh',
      };

    default:
      return {
        color: '',
        name: '-',
      };
  }
}
</script>
