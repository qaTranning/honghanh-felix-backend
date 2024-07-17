import type { InputProps } from 'ant-design-vue';

export type IAntdInputWithValidationProps<TName extends MaybeRefOrGetter<string>> = {
  name: TName;
  label: string;
  type?: InputProps['type'];
};
