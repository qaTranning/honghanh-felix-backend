import debounce from 'lodash-es/debounce';

export function useString(defaultValue?: string, delay = 500) {
  const textValue = ref(defaultValue || '');

  const onChangeDebounce = debounce((value: string, callback?: () => void) => {
    textValue.value = value;
    callback?.();
  }, delay);

  const onClear = () => {
    textValue.value = '';
  };

  return [textValue, { onChangeDebounce, onClear }] as const;
}
