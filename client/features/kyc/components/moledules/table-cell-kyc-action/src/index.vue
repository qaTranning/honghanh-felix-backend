<template>
  <a-space direction="vertical">
    <a-tooltip v-if="!$props.isHideDetail" title="Xem chi tiết">
      <a-button :icon="h(EyeOutlined)" @click="onDetail"> Chi tiết</a-button>
    </a-tooltip>

    <a-tooltip
      v-if="
        $props.model?.kycStatus === 'PENDING' ||
        $props.model?.kycStatus === 'NOT_STARTED' ||
        $props.model?.kycStatus === 'INVALID'
      "
      title="Nếu bạn đã xác minh thông tin, xác nhận?"
    >
      <a-button type="primary" @click="$emit('verify', $props.model.id)"> Xác minh </a-button>
    </a-tooltip>

    <a-tooltip v-if="$props.model?.kycStatus === 'PENDING'" title="Từ chối xác minh">
      <a-button type="primary" danger @click="$emit('reject', $props.model.id)"> Từ chối </a-button>
    </a-tooltip>

    <a-tooltip v-if="$props.model?.kycStatus === 'VERIFIED'" title="Xoá xác minh">
      <a-button type="primary" danger @click="$emit('reject', $props.model.id)">
        Xoá xác minh
      </a-button>
    </a-tooltip>
  </a-space>
</template>

<script setup lang="ts">
import { EyeOutlined } from '@ant-design/icons-vue';
import type { IModel } from '~/features/model/models';

interface Props {
  model?: IModel;
  isHideDetail?: boolean;
}

interface Emits {
  (e: 'reject', id: number): void;
  (e: 'verify', id: number): void;
}

const props = defineProps<Props>();

defineEmits<Emits>();

const { push } = useRouter();

function onDetail() {
  push({ name: 'data-model-detail', query: { id: props.model?.id } });
}
</script>
