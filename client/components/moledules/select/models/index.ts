import type { SelectProps } from 'ant-design-vue';

export interface ShMultipleSelectProps {
  loading?: boolean;
  selectProps?: SelectProps;
  value: SelectProps['value'];
}

export interface ShMultipleSelectEmits {
  (e: 'update:value', props: SelectProps['value']): void;
}
