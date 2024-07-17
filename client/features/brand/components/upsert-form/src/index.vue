<template>
  <ShDashboardFormView>
    <template #side>
      <a-card title="Thông tin liên quan">
        <a-form-item label="Người dùng" :required="true" v-bind="userId"
          ><SelectUser user-role="REPRESENTATIVE" v-bind="userId"
        /></a-form-item>

        <a-form-item :required="true" :label="t('field.status')" v-bind="status">
          <a-select class="w-100!" v-bind="status">
            <a-select-option value="PENDING">PENDING</a-select-option>
            <a-select-option value="ACTIVE">ACTIVE</a-select-option>
            <a-select-option value="BANNED">BANNED</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item :label="t('field.thumbnail')" v-bind="thumbnail">
          <ShUploadImages :max-count="1" v-bind="thumbnail"
        /></a-form-item>
      </a-card>
    </template>

    <template #main>
      <a-card title="Thông tin cơ bản">
        <a-form-item :label="t('field.title')" v-bind="title">
          <a-input
            :placeholder="t('common.type_something', { name: t('field.title') })"
            name="title"
            v-bind="title"
          ></a-input>
        </a-form-item>
        <a-form-item :label="t('field.description')" v-bind="description">
          <a-textarea
            :placeholder="t('common.type_something', { name: t('field.description') })"
            name="description"
            v-bind="description"
          ></a-textarea>
        </a-form-item>
        <a-form-item :label="t('field.address')" v-bind="address">
          <a-input
            :placeholder="t('common.type_something', { name: t('field.address') })"
            name="address"
            v-bind="address"
          ></a-input>
        </a-form-item>
        <a-form-item :label="t('field.phone')" v-bind="phone">
          <a-input
            :placeholder="t('common.type_something', { name: t('field.phone') })"
            name="phone"
            v-bind="phone"
          ></a-input>
        </a-form-item>
        <a-form-item :label="t('field.email')" v-bind="email" :required="true">
          <a-input
            :placeholder="t('common.type_something', { name: t('field.email') })"
            name="email"
            v-bind="email"
          ></a-input>
        </a-form-item>
        <a-form-item :label="t('field.taxCode')" v-bind="taxCode" :required="true">
          <a-input
            :placeholder="t('common.type_something', { name: t('field.taxCode') })"
            name="taxCode"
            v-bind="taxCode"
          ></a-input>
        </a-form-item>

        <a-form-item :label="t('field.website')" v-bind="website">
          <a-input
            :placeholder="t('common.type_something', { name: t('field.website') })"
            name="website"
            v-bind="website"
          ></a-input>
        </a-form-item>
      </a-card>
    </template>
  </ShDashboardFormView>
</template>

<script setup lang="ts">
import { ANDT_FORM_HELPER } from '~/common/helpers';
import { ShDashboardFormView, ShUploadImages } from '~/components';
import type { UseBrandUpsertFormType } from '~/features/brand/services';
import { SelectUser } from '~/features/user/widgets';

interface Props {
  form: UseBrandUpsertFormType;
}

const { t } = useI18n();

const { form } = defineProps<Props>();

const { defineComponentBinds } = form;

const userId = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'userId');
const title = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'title');
const address = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'address');
const email = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'email');
const description = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'description');
const phone = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'phone');
const taxCode = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'taxCode');
const website = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'website');
const status = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'status');
const thumbnail = ANDT_FORM_HELPER.defineFormItemAndtBinds(
  defineComponentBinds,
  'thumbnail',
  'file-list'
);
</script>
