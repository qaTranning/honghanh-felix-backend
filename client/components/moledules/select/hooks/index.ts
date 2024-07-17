import type { SelectProps } from 'ant-design-vue';
import type { LabeledValue, SelectValue } from 'ant-design-vue/es/select';
import { onMounted, ref, watch } from 'vue';

export function useSelectMultiple(defaultValue?: LabeledValue[]) {
  const value = ref<LabeledValue[]>(defaultValue || []);

  return [value];
}

// useSelectMultipleWidget

export interface EntitySelectWidgetProps {
  value: SelectValue[];
  limitValue?: number;
  selectProps?: SelectProps;
}

export interface EntitySelectWidgetEmits {
  (e: 'update:value', value: SelectValue[]): void;
}

export function useSelectMultipleWidget(props: any, emits: any) {
  const [value] = useSelectMultiple();

  const limitValue = props.limitValue as number | undefined;

  watch(value, () => {
    if (limitValue && limitValue >= 1) {
      if (value.value?.length > limitValue) {
        const currValue = [...value.value];
        currValue.pop();

        currValue[limitValue - 1] = value.value[limitValue];

        value.value = currValue;
      }
    }

    if (value.value !== props.value) {
      emits('update:value', value.value);
    }
  });

  onMounted(() => {
    value.value = props.value;
  });

  watch(
    () => props.value,
    () => {
      value.value = props.value;
    }
  );

  return [value];
}
