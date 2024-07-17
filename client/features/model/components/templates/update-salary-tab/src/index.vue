<template>
  <a-form layout="vertical" @submit="onSubmit">
    <ShDashboardFormView :loading="form.isLoading.value"
      >>
      <template #header>
        <div class="flex justify-end space-x-2">
          <a-button @click="() => navigateTo({ name: 'data-model' })">Huỷ</a-button>

          <a-button type="primary" html-type="submit">Lưu</a-button>
        </div>
      </template>
      <template #main>
        <a-card title="Lương">
          <a-form-item :label="t('field.currency')" v-bind="currency">
            <a-select v-bind="currency">
              <a-select-option value="VND">VND</a-select-option>
              <a-select-option value="USD">USD</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item :label="t('field.salary1h')" v-bind="salary1h">
            <a-input-number style="width: 100%" v-bind="salary1h" :addon-after="values.currency" />
          </a-form-item>
          <a-form-item :label="t('field.salary4h')" v-bind="salary4h">
            <a-input-number style="width: 100%" v-bind="salary4h" :addon-after="values.currency" />
          </a-form-item>
          <a-form-item :label="t('field.salary8h')" v-bind="salary8h">
            <a-input-number style="width: 100%" v-bind="salary8h" :addon-after="values.currency" />
          </a-form-item>
          <a-form-item :label="t('field.salary12h')" v-bind="salary12h">
            <a-input-number style="width: 100%" v-bind="salary12h" :addon-after="values.currency" />
          </a-form-item>
          <a-form-item :label="t('field.salary24h')" v-bind="salary24h">
            <a-input-number style="width: 100%" v-bind="salary24h" :addon-after="values.currency" />
          </a-form-item>

          <a-form-item :label="t('field.salaryOvertime')" v-bind="salaryOvertime">
            <a-input-number style="width: 100%" v-bind="salaryOvertime" />
          </a-form-item>
        </a-card>
      </template>

      <template #side> </template>
    </ShDashboardFormView>
  </a-form>
</template>

<script setup lang="ts">
import { ANDT_FORM_HELPER } from '~/common/helpers';
import { ShDashboardFormView } from '~/components';
import type { UseUpdateFormSalaryType } from '~/features/model/services';

const { t } = useI18n();
const props = defineProps<{ form: UseUpdateFormSalaryType }>();

const { form } = props;
const { defineComponentBinds, onSubmit, values } = form;

const currency = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'currency');

const salary1h = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'salary1h');

const salary4h = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'salary4h');

const salary8h = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'salary8h');

const salary12h = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'salary12h');

const salary24h = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'salary24h');

const salaryOvertime = ANDT_FORM_HELPER.defineFormItemAndtBinds(
  defineComponentBinds,
  'salaryOvertime'
);
</script>
