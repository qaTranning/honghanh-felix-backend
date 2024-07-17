<template>
  <a-row :gutter="[10, 10]">
    <a-col v-if="typeof $props.onDetail === 'function'">
      <a-tooltip title="View detail">
        <a-button shape="circle" :disabled="$props.isLoading" @click="onClickDetail">
          <template #icon><EyeOutlined /></template>
        </a-button>
      </a-tooltip>
    </a-col>
    <a-col v-if="typeof $props.onUpdate === 'function'">
      <a-tooltip title="Cập nhật">
        <a-button shape="circle" :disabled="$props.isLoading" @click="onClickUpdate">
          <template #icon><EditOutlined /></template>
        </a-button>
      </a-tooltip>
    </a-col>
    <a-col v-if="typeof $props.onRemove === 'function'">
      <a-tooltip title="Xóa">
        <a-popconfirm
          title="Bạn có muốn xóa?"
          :disabled="$props.isLoading"
          @confirm="onClickRemove"
        >
          <a-button shape="circle" style="color: red" type="ghost">
            <template #icon><DeleteOutlined /></template>
          </a-button>
        </a-popconfirm>
      </a-tooltip>
    </a-col>

    <a-col v-if="$slots">
      <slot></slot>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { DeleteOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons-vue';
import type { ShTableCellActionProps } from '../models';

const props = defineProps<ShTableCellActionProps>();

function onClickDetail() {
  if (props.onDetail) props.onDetail();
}

function onClickUpdate() {
  if (props.onUpdate) props.onUpdate();
}

function onClickRemove() {
  if (props.onRemove) props.onRemove();
}
</script>
