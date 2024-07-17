<template>
  <ShDashboardFormView>
    <template #main>
      <a-card>
        <a-form-item label="Mật khẩu cũ" v-bind="oldPassword">
          <a-input-password
            v-bind="oldPassword"
            name="oldPassword"
            :placeholder="$t('common.type_something', { name: $t('field.oldPassword') })"
          ></a-input-password>
        </a-form-item>
        <a-form-item label="Mật khẩu mới" v-bind="newPassword">
          <a-input-password
            v-bind="newPassword"
            :placeholder="$t('common.type_something', { name: $t('field.newPassword') })"
            name="password"
          ></a-input-password>
        </a-form-item>

        <a-form-item label="Nhập lại mật khẩu" v-bind="confirmPassword">
          <a-input-password
            v-bind="confirmPassword"
            :placeholder="$t('common.type_something', { name: $t('field.confirmPassword') })"
            name="confirmPassword"
          ></a-input-password>
        </a-form-item>
      </a-card>

      <div class="flex justify-end space-x-4 pt-4">
        <a-button>{{ $t('common.cancel').toUpperCase() }}</a-button>

        <a-button html-type="submit" type="primary">{{ $t('common.save').toUpperCase() }}</a-button>
      </div>
    </template>
  </ShDashboardFormView>
</template>

<script setup lang="ts">
import type { ProfileUpdatePasswordFormProps } from '../models';
import { ANDT_FORM_HELPER } from '~/common/helpers';
import { ShDashboardFormView } from '~/components';

const { form } = defineProps<ProfileUpdatePasswordFormProps>();

const { defineComponentBinds } = form;
const newPassword = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'newPassword');

const confirmPassword = ANDT_FORM_HELPER.defineFormItemAndtBinds(
  defineComponentBinds,
  'confirmPassword'
);
const oldPassword = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'oldPassword');
</script>
