<template>
  <a-form :label-col="{ style: { width: '100px', textAlign: 'start' } }" @submit="onSubmit">
    <ShDashboardFormView>
      <template #main>
        <a-card title="Review">
          <a-form-item v-bind="model" :label="t('common.model')">
            <SelectUserMul v-bind="model" role="MODEL" :limit-value="1" />
          </a-form-item>
          <a-form-item v-bind="comment" :label="t('field.comment')">
            <a-textarea v-bind="comment" />
          </a-form-item>
          <a-form-item v-bind="rate" :label="t('field.rate')">
            <a-rate v-bind="rate" />
          </a-form-item>
          <a-form-item v-bind="status" :label="t('field.status')">
            <a-select v-bind="status">
              <a-select-option value="INACTIVE">INACTIVE</a-select-option>
              <a-select-option value="ACTIVE">ACTIVE</a-select-option>
            </a-select>
          </a-form-item>
        </a-card>
      </template>
      <template #side>
        <a-card title="Chiến dịch">
          <a-form-item v-bind="campaign" :label="t('common.campaign')">
            <SelectCampaign v-bind="campaign" :limit-value="1" />
          </a-form-item>
        </a-card>
      </template>
    </ShDashboardFormView>
  </a-form>
</template>

<script setup lang="ts">
import type { UseUpsertFormReviewType } from '../../../services';
import { ANDT_FORM_HELPER } from '~/common';
import { ShDashboardFormView } from '~/components/organisms';
import { SelectCampaign } from '~/features/campaign';
import { SelectUserMul } from '~/features/user/widgets';
const { form } = defineProps<{ form: UseUpsertFormReviewType }>();

const { t } = useI18n();
const { defineComponentBinds, onSubmit } = form;

const comment = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'comment');
const rate = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'rate');
const status = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'status');

const campaign = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'campaign');

const model = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'model');
</script>
