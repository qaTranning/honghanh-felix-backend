export function useNumber(defaultValue?: number) {
  const value = ref(defaultValue || 0);

  const onClear = () => {
    value.value = 0;
  };

  return [value, { onClear }] as const;
}
