<template>
  <a-select
    show-search
    label-in-value
    :placeholder="$props.placeholder || 'Select...'"
    style="width: 100%"
    :filter-option="false"
    :not-found-content="isFetching ? undefined : null"
    :options="dataOptions"
    :value="$props.value"
    :list-height="120"
    :loading="isFetching"
    @popup-scroll="onPopupScroll"
    @change="$emit('update:value', $event)"
    @search="searchUser"
  >
    <template v-if="isFetching || isLoading" #notFoundContent>
      <a-spin size="small" />
    </template>
  </a-select>
</template>

<script setup lang="ts">
import { type SelectProps } from 'ant-design-vue';
import type { SelectValue } from 'ant-design-vue/lib/select';
import { debounce, throttle } from 'lodash-es';
import type { LabeledValue } from 'ant-design-vue/es/select';
import { useGetInfinityUsersQuery } from '../../apis';
import type { IUser } from '../../models';
import { profileHandleName } from '~/features/profile';

interface SelectUserProps extends Partial<SelectProps> {
  userRole?: IUser['role'];
  isModelNotExist?: string;
  value?: SelectValue;
  defaultValue?: SelectValue;
  defaultOptions?: LabeledValue[];
}

interface SelectUserEmits {
  (e: 'update:value', value: SelectValue): void;
}

const props = defineProps<SelectUserProps>();
defineEmits<SelectUserEmits>();

const {
  query: { data, isFetching, fetchNextPage, isLoading },
  search,
} = useGetInfinityUsersQuery({
  defaultParams: {
    role: props.userRole,
    isModelNotExist: props.isModelNotExist,
  },
});

const dataOptions = computed(() => {
  const listUsers = (data.value?.pages || []).flatMap((page) => page?.data?.data ?? []);

  const defaultOptions = props.defaultOptions ? props.defaultOptions : [];

  const preData = listUsers.map((user) => ({
    label: profileHandleName(user.firstname, user.lastname) + ' (' + user.email + ')',
    value: user.id,
  }));

  return [...preData, ...defaultOptions];
});

const onPopupScroll = throttle((e: UIEvent) => {
  if (isFetching.value) return;
  const dropdownEl = e.srcElement as HTMLElement;
  const isAtBottom = dropdownEl.scrollTop + dropdownEl.clientHeight >= dropdownEl.scrollHeight;
  if (isAtBottom) {
    fetchNextPage();
  }
}, 300);

const searchUser = debounce((value) => {
  search.value = value;
}, 300);
</script>
