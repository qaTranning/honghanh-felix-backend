<template>
  <a-form layout="vertical">
    <ShDashboardFormView :loading="isLoading">
      <template #header>
        <div class="flex flex-row justify-between items-center">
          <router-link
            class="font-bold"
            :to="{ name: 'data-campaign-detail', query: { id: campaignId } }"
            >ID Chiến dịch: {{ campaignId || '' }}</router-link
          >

          <div class="flex flex-row space-x-2">
            <a-button type="primary" html-type="submit" @click="onSubmit">Lưu</a-button>

            <a-button @click="handleCancel">Huỷ</a-button>
          </div>
        </div>
      </template>

      <template #main>
        <a-card title="Thông tin cơ bản" style="max-height: 650px; overflow-y: auto">
          <a-form-item :required="true" :label="t('field.title')" v-bind="name">
            <a-input v-bind="name" placeholder="Nhập tiêu đề" />
          </a-form-item>

          <a-form-item :required="true" :label="t('common.category')" v-bind="categoryIds">
            <SelectCategory mode="multiple" v-bind="categoryIds" />
          </a-form-item>
          <a-form-item :required="true" :label="t('field.location')" v-bind="location">
            <a-input v-bind="location" placeholder="Nhập vị trí" />
          </a-form-item>

          <a-form-item :required="true" :label="t('field.budget')" v-bind="budget">
            <a-input v-bind="budget" placeholder="Nhập ngân sách" :min="1" class="w-full" />
          </a-form-item>

          <a-form-item :required="true" :label="t('field.jobDescription')" v-bind="description">
            <a-textarea v-bind="description" placeholder="Nhập mô tả" />
          </a-form-item>

          <a-form-item :required="true" label="Độc quyền" v-bind="exclusive">
            <a-switch v-bind="exclusive" />
          </a-form-item>

          <a-form-item
            v-if="values?.exclusive === true"
            :label="t('field.exclusiveTime')"
            v-bind="exclusiveTime"
          >
            <a-textarea v-bind="exclusiveTime" placeholder="Nhập thời gian độc quyền" />
          </a-form-item>
        </a-card>
      </template>

      <template #side>
        <a-card title="Tổng quát">
          <a-form-item v-bind="brand" :label="t('common.brand')">
            <BrandSelect v-bind="brand" :limit-value="1"
          /></a-form-item>

          <a-form-item v-bind="brandName" :label="'Tên thương hiệu'">
            <a-input v-bind="brandName" placeholder="Nhập tên thương hiệu" />
          </a-form-item>
          <!-- PENDING, ACTIVE, ENDED, CANCELED -->
          <a-form-item :required="true" :label="t('field.status')" v-bind="status">
            <a-select class="w-100%" v-bind="status" :disabled="true">
              <a-select-option value="PENDING">PENDING</a-select-option>
              <a-select-option value="ACTIVE">PROCESSING</a-select-option>
              <a-select-option value="ENDED">COMPLETED</a-select-option>
              <a-select-option value="CANCELED">CANCELED</a-select-option>
              <a-select-option value="WAITING_PAYMENT">WAITING_PAYMENT</a-select-option>
              <a-select-option value="PAID">PAID</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item v-bind="thumbnail" label="Ảnh bìa">
            <ShUploadImages :max-count="1" v-bind="thumbnail"
          /></a-form-item>
        </a-card>
        <a-card title="Time">
          <!-- <a-form-item :required="true" :label="'Thời gian làm việc'" v-bind="workHours">
            <a-input-number class="w-full" v-bind="workHours" size="large" :min="1" :max="100">
              <template #addonAfter>Giờ</template>
            </a-input-number>
          </a-form-item> -->
          <a-form-item :required="true" :label="'Thời gian casting'" v-bind="castingTime">
            <a-date-picker
              v-bind="castingTime"
              class="w-full"
              show-time
              :disabled-date="disabledDate"
              :format="TIME_HELPER.FormatDateTimeEnum['DD-MM-YYYY HH:mm']"
            />
          </a-form-item>
          <!--
          <a-form-item :required="true" :label="'Thời gian thử đồ dự kiến'" v-bind="fitingTime">
            <a-range-picker
              v-bind="fitingTime"
              show-time
              :disabled-date="disabledDateFitting"
              :format="TIME_HELPER.FormatDateTimeEnum['DD-MM-YYYY HH:mm']"
            />
          </a-form-item> -->

          <a-form-item :required="true" :label="'Thời gian làm việc dự kiến'" v-bind="workingTime">
            <a-range-picker
              v-bind="workingTime"
              show-time
              :format="TIME_HELPER.FormatDateTimeEnum['DD-MM-YYYY HH:mm']"
            />
          </a-form-item>
        </a-card>
      </template>
    </ShDashboardFormView>
  </a-form>
</template>

<script setup lang="ts">
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { type ICampaignUpsertFormProps } from '../types';
import { ANDT_FORM_HELPER, TIME_HELPER } from '@/common';
import { ShUploadImages } from '~/components/moledules';
import { ShDashboardFormView } from '~/components/organisms';
import { BrandSelect } from '~/features/brand/widgets';

import { SelectCategory } from '~/features/category/widgets';
import { useRouteQuery } from '~/common/hooks/route-query';
const campaignId = useRouteQuery('id');

const { form } = defineProps<ICampaignUpsertFormProps>();

const { handleCancel, defineComponentBinds, onSubmit, query, values, setFieldValue } = form;

watch(
  () => values?.exclusive,
  (value) => {
    if (!value) setFieldValue('exclusiveTime', undefined);
  }
);

const disabledDate = (current: Dayjs) => {
  // Can not select days before today
  return current && current <= dayjs().startOf('day');
};

const disabledDateFitting = (current: Dayjs) => {
  if (values.castingTime) {
    return current && current < values.castingTime;
  }
  // Can not select days before today
  return current && current <= dayjs().startOf('day');
};
const { t } = useI18n();
const { isLoading } = query;

const thumbnail = ANDT_FORM_HELPER.defineFormItemAndtBinds(
  defineComponentBinds,
  'thumbnail',
  'file-list'
);
const brandName = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'brandName');

const name = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'name');

const location = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'location');
const budget = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'budget');
const description = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'description');
const categoryIds = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'categoryIds');
const status = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'status');
const exclusive = ANDT_FORM_HELPER.defineFormItemAndtBinds(
  defineComponentBinds,
  'exclusive',
  'checked'
);

const exclusiveTime = ANDT_FORM_HELPER.defineFormItemAndtBinds(
  defineComponentBinds,
  'exclusiveTime'
);
const brand = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'brand');
const castingTime = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'castingTime');

const fitingTime = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'fitingTime');
const workingTime = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'workingTime');
// const workHours = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'workHours');
</script>
