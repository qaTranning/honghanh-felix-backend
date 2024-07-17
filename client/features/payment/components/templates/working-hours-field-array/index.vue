<template>
  <div class="flex flex-col space-y-3">
    <a-form-item
      v-for="(field, index) in fields"
      :key="field.key"
      :label="`Thời gian làm việc ${index + 1}`"
      :name="`${field}.${index}`"
    >
      <div class="w-full flex space-x-3">
        <a-range-picker
          :disabled="$props.disabled"
          :value="field.value as unknown as RangeValue"
          class="flex-1"
          show-time
          :format="TIME_HELPER.FormatDateTimeEnum['DD-MM-YYYY HH:mm']"
          :allow-clear="true"
          @change="(value) => handleChangeDate(index, value as RangeValue)"
        />
        <a-button :disabled="fields.length === 1 || $props.disabled" @click="remove(index)">
          <template #icon><DeleteOutlined /></template>
        </a-button>
      </div>
    </a-form-item>

    <a-button type="dashed" block :disabled="$props.disabled" @click="handleAddNewWorkingHours">
      <PlusOutlined />
      Thêm
    </a-button>
  </div>
</template>

<script setup lang="ts">
import type { Dayjs } from 'dayjs';
import { useFieldArray, useFormErrors } from 'vee-validate';
import { TIME_HELPER } from '~/common';
import type { CreatePaymentSchemaType } from '~/features/payment/services';

defineProps<{
  disabled?: boolean;
}>();

type RangeValue = [Dayjs, Dayjs];

type WorkingHoursFieldArrayType = CreatePaymentSchemaType['workingHours'][number];

const errors = useFormErrors<CreatePaymentSchemaType>();

const workingHoursError = computed(() => errors.value.workingHours);

const { push, remove, update, fields } = useFieldArray<WorkingHoursFieldArrayType>('workingHours');

function handleAddNewWorkingHours() {
  push([] as unknown as RangeValue);
}

function handleChangeDate(index: number, value: RangeValue) {
  update(index, Array.from(value) as RangeValue);
}
</script>
