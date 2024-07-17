<template>
  <div><ShInfoItemList :values="renderItem" /></div>
</template>

<script setup lang="ts">
import type { IModel } from '~/features/model/models';
import { ShInfoItemList, type ShInfoItemProps } from '~/components/organisms';

const props = defineProps<{ model?: IModel }>();

const renderItem: ShInfoItemProps[] = [
  { key: 'money', label: 'Số tài khoản:', value: props.model?.bankAccount || '-' },
  { key: 'status', label: 'Ngân hàng:', value: props.model?.bankName || '-' },
  { key: 'decs', label: 'Tên tài khoản', value: props.model?.cardHolder || '-' },
];
</script>
