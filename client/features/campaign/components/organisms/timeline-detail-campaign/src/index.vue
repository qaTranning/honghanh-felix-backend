<template>
  <a-timeline>
    <!-- <a-timeline-item>Giờ làm việc: {{ workHours }}</a-timeline-item> -->
    <a-timeline-item>Ngày bắt đầu casting: {{ startCasting }}</a-timeline-item>
    <!-- <a-timeline-item>Ngày bắt đầu thử đồ: {{ startFitting }}</a-timeline-item>
    <a-timeline-item>Ngày kết thúc thử đồ: {{ endFitting }}</a-timeline-item> -->
    <a-timeline-item>Ngày bắt đầu làm việc: {{ startWorking }}</a-timeline-item>
    <a-timeline-item>Ngày kết thúc làm việc: {{ endWorking }}</a-timeline-item>
  </a-timeline>
</template>

<script setup lang="ts">
import { FormatDateTimeEnum, convertTimeAndDateFormat } from '~/common/helpers/time';
import type { ICampaign } from '~/features/campaign/models';

const props = defineProps<{
  data?: ICampaign;
}>();

const workHours = computed(() => props?.data?.workHours + ' giờ' || '');

const startCasting = computed(
  () => convertTimeAndDateFormat(FormatDateTimeEnum['DD-MM-YY hh:mm'], props?.data?.startDate) || ''
);

const startFitting = computed(
  () =>
    convertTimeAndDateFormat(FormatDateTimeEnum['DD-MM-YY hh:mm'], props?.data?.startFittingDate) ||
    ''
);

const endFitting = computed(
  () =>
    convertTimeAndDateFormat(FormatDateTimeEnum['DD-MM-YY hh:mm'], props?.data?.endFittingDate) ||
    ''
);
const startWorking = computed(
  () =>
    convertTimeAndDateFormat(FormatDateTimeEnum['DD-MM-YY hh:mm'], props?.data?.startWorkingDate) ||
    ''
);

const endWorking = computed(
  () =>
    convertTimeAndDateFormat(FormatDateTimeEnum['DD-MM-YY hh:mm'], props?.data?.endWorkingDate) ||
    ''
);
</script>
