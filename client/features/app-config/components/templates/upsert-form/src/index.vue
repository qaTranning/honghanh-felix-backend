<template>
  <a-card>
    <a-form-item :label="$t('field.name')" v-bind="name">
      <a-input
        :placeholder="$t('common.type_something', { name: $t('field.name') })"
        name="name"
        v-bind="name"
      ></a-input>
    </a-form-item>

    <a-form-item :label="$t('field.value')" v-bind="value">
      <a-textarea
        :placeholder="$t('common.type_something', { name: $t('field.value') })"
        name="value"
        v-bind="value"
      ></a-textarea>
    </a-form-item>
  </a-card>
</template>

<script setup lang="ts">
import type { AppConfigUpsertFormProps } from '../models';
import { ANDT_FORM_HELPER } from '~/common/helpers';
const { form } = defineProps<AppConfigUpsertFormProps>();

const { defineComponentBinds } = form;

const name = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'name');
const value = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'value');
</script>
