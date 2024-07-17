<template>
  <a-card>
    <h3>Cấu hình Style</h3>

    <a-space
      v-for="(field, index) in fields"
      :key="index"
      style="display: flex; margin-bottom: 8px"
      class="[&>*:first-child]:w-full"
      align="baseline"
    >
      <a-form-item
        :name="`${field}.${index}`"
        :help="errors[`value[${index}]` as any] ? `Required` : undefined"
        :validate-status="errors[`value[${index}]` as any] ? `error` : undefined"
      >
        <a-input
          :value="typeof field.value === `string` ? field.value : ''"
          placeholder="Style"
          @change="(e) => onChange(e.target.value || '', index)"
        />
      </a-form-item>
      <MinusCircleOutlined @click="remove(index)" />
    </a-space>
    <a-form-item>
      <a-button type="dashed" block @click="push('')">
        <PlusOutlined />
        Add style
      </a-button>
    </a-form-item>
  </a-card>
</template>

<script setup lang="ts">
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { useFieldArray } from 'vee-validate';
import type { UseAppConfigUpdateStyleFormType } from '~/features/app-config/services/update-form-style/types';

const { form } = defineProps<{ form: UseAppConfigUpdateStyleFormType }>();

const { setFieldValue, errors } = form;
const { remove, push, fields } = useFieldArray('value');

const onChange = (value: string, index: number) => {
  setFieldValue(`value[${index}]` as any, value);
};
</script>
