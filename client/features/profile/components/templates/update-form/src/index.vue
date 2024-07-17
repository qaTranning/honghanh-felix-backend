<template>
  <a-card title="Thông tin cơ bản">
    <a-form-item :label="t('field.firstname')" v-bind="firstname">
      <a-input
        v-bind="firstname"
        :placeholder="$t('common.type_something', { name: $t('field.email') })"
        name="firstname"
      ></a-input>
    </a-form-item>
    <a-form-item :label="t('field.lastname')" v-bind="lastname">
      <a-input
        v-bind="lastname"
        name="lastname"
        :placeholder="$t('common.type_something', { name: $t('field.password') })"
      ></a-input>
    </a-form-item>
    <!-- <a-form-item :label="t('field.address')" v-bind="address">
      <a-input
        v-bind="address"
        name="address"
        :placeholder="$t('common.type_something', { name: $t('field.address') })"
      ></a-input>
    </a-form-item>
    <a-form-item :label="t('field.city')" v-bind="city">
      <a-input
        v-bind="city"
        name="city"
        :placeholder="$t('common.type_something', { name: $t('field.city') })"
      ></a-input>
    </a-form-item> -->
  </a-card>
</template>

<script setup lang="ts">
import type { ProfileUpdateFormProps, ProfileUpdateFormEmits } from '../models';
import { ANDT_FORM_HELPER } from '~/common/helpers';

const { form } = defineProps<ProfileUpdateFormProps>();
defineEmits<ProfileUpdateFormEmits>();
const { t } = useI18n();
const { defineComponentBinds } = form;

// form
const firstname = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'firstname');
const lastname = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'lastname');
// const address = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'address');
// const city = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'city');

</script>
