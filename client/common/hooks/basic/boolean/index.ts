import { ref } from 'vue';

export function useBoolean(defaultValue?: boolean) {
  const open = ref<boolean>(defaultValue || false);

  const setTrue = () => {
    open.value = true;
  };

  const setFalse = () => {
    open.value = false;
  };

  const onToggle = () => {
    open.value = !open.value;
  };

  return [open, { setTrue, setFalse, onToggle }] as const;
}
