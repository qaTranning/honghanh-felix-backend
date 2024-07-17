<!-- eslint-disable import/named -->
<!-- eslint-disable import/named -->
<!-- eslint-disable vue/no-v-model-argument -->
<template>
  <ShMultipleSelect
    v-model:value="value"
    :loading="isLoading"
    :selectProps="{
      placeholder: 'Chọn người dùng',
      options,
      onSearch: onChangeDebounce,
      ...props.selectProps,
    }"
  >
  </ShMultipleSelect>
</template>

<script setup lang="ts">
import { useInfinitySearchNameUser } from '../../services';
import type { IUser } from '../../models';
import { ShMultipleSelect } from '~/components/moledules';
import {
  useSelectMultipleWidget,
  type EntitySelectWidgetProps,
  type EntitySelectWidgetEmits,
} from '~/components/moledules/select/hooks';

const props = defineProps<EntitySelectWidgetProps & { role?: IUser['role'] }>();
const emits = defineEmits<EntitySelectWidgetEmits>();

const [value] = useSelectMultipleWidget(props, emits);

const { isLoading, options, onChangeDebounce } = useInfinitySearchNameUser(props.role);
</script>
