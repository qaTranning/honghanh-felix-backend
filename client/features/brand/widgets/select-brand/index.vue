<!-- eslint-disable vue/no-v-model-argument -->
<template>
  <ShMultipleSelect
    v-model:value="value"
    :loading="isLoading"
    :selectProps="{
      placeholder: 'Chọn thương hiệu',
      options,
      onSearch: onChangeDebounce,
    }"
  >
  </ShMultipleSelect>
</template>

<script setup lang="ts">
import { useInfinitySearchNameBrand } from '../../services';
import { ShMultipleSelect } from '~/components/moledules';
import {
  useSelectMultipleWidget,
  type EntitySelectWidgetProps,
  type EntitySelectWidgetEmits,
} from '~/components/moledules/select/hooks';

const props = defineProps<EntitySelectWidgetProps>();
const emits = defineEmits<EntitySelectWidgetEmits>();

const [value] = useSelectMultipleWidget(props, emits);

const { isLoading, options, onChangeDebounce } = useInfinitySearchNameBrand();
</script>
