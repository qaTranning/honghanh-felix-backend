<template>
  <a-form layout="vertical">
    <a-form-item label="Name" v-bind="name"
      ><a-input v-bind="name" placeholder="Nhập tên ảnh"
    /></a-form-item>

    <a-form-item :label="$t('field.thumbnail')" v-bind="image">
      <ShUploadImagesVadidate :max-count="1" v-bind="image"
    /></a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import type { UseCreateFormModalType } from '../../../../services';
import { ANDT_FORM_HELPER } from '~/common/helpers';
import { ShUploadImages, ShUploadImagesVadidate } from '~/components';

const {
  form: { defineComponentBinds },
} = defineProps<{ form: UseCreateFormModalType }>();

const name = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'name');

const image = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'image');
</script>
