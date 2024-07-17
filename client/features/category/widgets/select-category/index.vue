<template>
  <a-select
    show-search
    label-in-value
    placeholder="Select categories"
    style="width: 100%"
    :filter-option="false"
    :not-found-content="isFetching ? undefined : null"
    :options="dataOptions"
    :list-height="120"
    :loading="isFetching"
    :mode="$props.mode"
    :value="$props.value"
    @popup-scroll="onPopupScroll"
    @change="$emit('update:value', $event)"
    @search="onChangeDebounce"
  >
    <template v-if="isFetching" #notFoundContent>
      <a-spin size="small" />
    </template>
  </a-select>
</template>

<script setup lang="ts">
import { type SelectProps } from 'ant-design-vue';
import type { SelectValue } from 'ant-design-vue/lib/select';
import { throttle } from 'lodash-es';
import { useGetInfinityCategoriesQuery } from '../../apis';

interface SelectCategoryProps extends Partial<SelectProps> {
  value?: SelectValue;
}

interface SelectCategoryEmits {
  (e: 'update:value', value: SelectValue): void;
}

defineProps<SelectCategoryProps>();
defineEmits<SelectCategoryEmits>();

const {
  query: { data, isFetching, suspense, fetchNextPage },
  onChangeDebounce,
} = useGetInfinityCategoriesQuery();

await suspense();

const dataOptions = computed(() => {
  const listCategories = (data.value?.pages || []).flatMap((page) => page?.data?.data ?? []);

  return listCategories.map((category) => ({
    label: category.name,
    value: category.id,
  }));
});

const onPopupScroll = throttle((e: UIEvent) => {
  if (isFetching.value) return;
  const dropdownEl = e.srcElement as HTMLElement;
  const isAtBottom = dropdownEl.scrollTop + dropdownEl.clientHeight >= dropdownEl.scrollHeight;
  if (isAtBottom) {
    fetchNextPage();
  }
}, 300);
</script>
