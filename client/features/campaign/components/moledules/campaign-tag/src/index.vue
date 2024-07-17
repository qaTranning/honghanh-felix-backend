<template>
  <div>
    <a-tag :color="getStatus().color">{{ getStatus().label }}</a-tag>
  </div>
</template>

<script setup lang="ts">
import { CAMPAIGN_STATUS_ARRAY } from '../../../../constants';
interface Props {
  status?: string;
}

const props = defineProps<Props>();

function getStatus() {
  const status = CAMPAIGN_STATUS_ARRAY.find((item) => item.value === props.status);

  if (!status) {
    return {
      label: '-',
      color: '',
    };
  }

  return status;
}
</script>
