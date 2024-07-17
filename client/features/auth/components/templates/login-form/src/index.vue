<template>
  <a-form layout="vertical" aria-autocomplete="both" @submit="onSubmit">
    <AuthFormView :title="$t('auth.login')">
      <a-form-item :label="$t('field.email')" v-bind="email">
        <a-input
          v-bind="email"
          :placeholder="$t('common.type_something', { name: $t('field.email') })"
          name="email"
        ></a-input>
      </a-form-item>
      <a-form-item :label="$t('field.password')" v-bind="password">
        <a-input-password
          v-bind="password"
          name="password"
          :placeholder="$t('common.type_something', { name: $t('field.password') })"
        ></a-input-password>
      </a-form-item>

      <template #footer>
        <a-button html-type="submit" class="w-full" type="primary">{{
          $t('common.sign_in')
        }}</a-button>
      </template>
    </AuthFormView>
  </a-form>
</template>

<script setup lang="ts">
import { AuthFormView } from '../../../organisms';
import { type AuthLoginFormProps } from '../models';
import { ANDT_FORM_HELPER } from '~~/client/common/helpers';
const { form } = defineProps<AuthLoginFormProps>();
const { onSubmit, defineComponentBinds } = form;

const email = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'email');

const password = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'password');
</script>
