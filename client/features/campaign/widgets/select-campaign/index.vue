<!-- eslint-disable vue/no-v-model-argument -->
<template>
  <ShMultipleSelect
    v-model:value="value"
    :loading="isLoading"
    :selectProps="{
      placeholder: 'Chọn chiến dịch',
      options,
      onSearch: onChangeDebounce,
      ...props.selectProps,
    }"
  >
  </ShMultipleSelect>
</template>

<script setup lang="ts">
import { useInfinitySearchNameCampaign } from '../../services';
import { ShMultipleSelect } from '~/components/moledules';
import {
  useSelectMultipleWidget,
  type EntitySelectWidgetProps,
  type EntitySelectWidgetEmits,
} from '~/components/moledules/select/hooks';

const props = defineProps<EntitySelectWidgetProps>();
const emits = defineEmits<EntitySelectWidgetEmits>();

const [value] = useSelectMultipleWidget(props, emits);

const { isLoading, options, onChangeDebounce } = useInfinitySearchNameCampaign();
</script>
