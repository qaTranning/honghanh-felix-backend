<template>
  <a-card>
    <a-form-item :label="$t('field.name')" v-bind="name">
      <a-input
        :placeholder="$t('common.type_something', { name: $t('field.name') })"
        name="name"
        v-bind="name"
      ></a-input>
    </a-form-item>

    <a-form-item :label="$t('field.order')" v-bind="order">
      <a-input-number
        class="w-full"
        :min="0"
        :max="50"
        :placeholder="$t('common.type_something', { name: $t('field.order') })"
        name="order"
        v-bind="order"
      ></a-input-number>
    </a-form-item>
  </a-card>
</template>

<script setup lang="ts">
import { ANDT_FORM_HELPER } from '~/common/helpers';
import type { UseCategoryUpsertFormType } from '~/features/category/services';

interface Props {
  form: UseCategoryUpsertFormType;
}

const { form } = defineProps<Props>();

const { defineComponentBinds } = form;

const name = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'name');
const order = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'order');
</script>
