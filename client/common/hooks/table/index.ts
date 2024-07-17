import type { Key } from 'ant-design-vue/lib/_util/type';

export function useTableRowSelection(config?: any) {
  const selectedRowKeys = ref<Key[]>([]);
  const onSelectChange = (keys: Key[]) => {
    selectedRowKeys.value = keys;
  };
  const hasSelected = computed(() => selectedRowKeys.value.length > 0);

  const rowSelection = computed(() => ({
    selectedRowKeys: selectedRowKeys.value,
    onChange: onSelectChange,
    key: config?.key || 'key',
  }));
  return { selectedRowKeys, onSelectChange, hasSelected, rowSelection };
}
