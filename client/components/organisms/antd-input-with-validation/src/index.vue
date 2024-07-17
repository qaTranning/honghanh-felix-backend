<template>
  <a-form-item
    :label="$props.label"
    :has-feedback="!!errorMessage"
    :help="errorMessage"
    :validate-status="errorMessage ? 'error' : undefined"
  >
    <a-input v-model="value" :type="props.type" :allow-clear="false" />
  </a-form-item>
</template>

<script setup lang="ts" generic="TName extends MaybeRefOrGetter<string>">
import { useField } from 'vee-validate';
import { type IAntdInputWithValidationProps } from '../types';

const props = defineProps<IAntdInputWithValidationProps<TName>>();

const { errorMessage, value } = useField(props.name);
</script>
