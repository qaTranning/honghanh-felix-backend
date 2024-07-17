<template>
  <div>
    <a-tag :color="getColor($props.type)">{{ getName($props.type) }}</a-tag>
  </div>
</template>

<script setup lang="ts">
import { EScheduleType } from '../../../../models';

defineProps<{ type: EScheduleType }>();

function getName(value: EScheduleType) {
  switch (value) {
    case EScheduleType.TRAVEL:
      return 'Travel';
    case EScheduleType.BUSY:
      return 'Busy';
    case EScheduleType.WORK:
      return 'Work';
    default:
      console.log(value);
      return 'Unknown';
  }
}

function getColor(value: EScheduleType) {
  switch (value) {
    case EScheduleType.TRAVEL:
      return 'green';
    case EScheduleType.BUSY:
      return 'blue';
    case EScheduleType.WORK:
      return 'pink';
    default:
      return 'gray';
  }
}
</script>
