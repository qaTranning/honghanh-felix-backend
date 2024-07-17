<template>
  <a-select
    label-in-value
    placeholder="Chọn phong cách"
    style="width: 100%"
    :filter-option="false"
    :not-found-content="isFetching ? undefined : null"
    :options="dataOptions"
    :value="$props.value"
    :list-height="120"
    :mode="$props.mode"
    :loading="isFetching"
    @change="$emit('update:value', $event)"
  >
    <template v-if="isFetching" #notFoundContent>
      <a-spin size="small" />
    </template>
  </a-select>
</template>

<script setup lang="ts">
import { type SelectProps } from 'ant-design-vue';
import type { SelectValue } from 'ant-design-vue/lib/select';
import { useQueryAllAppConfig } from '@/features/app-config/apis';
import { jsonReturnStringArray } from '~/common/helpers/json';

interface SelectStyleProps extends Partial<SelectProps> {
  value?: SelectValue;
}

interface SelectStyleEmits {
  (e: 'update:value', value: SelectValue): void;
}

defineProps<SelectStyleProps>();
defineEmits<SelectStyleEmits>();

const {
  query: { data, isFetching, suspense },
} = useQueryAllAppConfig();

await suspense();

const dataOptions = computed(() => {
  const listConfigs = data.value?.data || [];

  const styleConfig = listConfigs.find((config) => config.name.toLowerCase() === 'style');

  if (!styleConfig) {
    return [];
  }

  const listStyles = jsonReturnStringArray(styleConfig?.value);

  return listStyles.map((style) => ({
    label: style,
    value: style,
  }));
});
</script>
