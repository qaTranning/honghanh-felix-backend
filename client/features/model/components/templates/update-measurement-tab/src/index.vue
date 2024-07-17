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
        <a-card title="Đặc điểm">
          <a-form-item :label="t('field.skinColor')" v-bind="skinColor">
            <a-select v-bind="skinColor">
              <a-select-option value="WHITE">WHITE</a-select-option>
              <a-select-option value="YELLOW">YELLOW</a-select-option>
              <a-select-option value="BLACK">BLACK</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :label="t('field.eyeColor')" v-bind="eyeColor">
            <a-input style="width: 100%" v-bind="eyeColor" />
          </a-form-item>
          <a-form-item :label="t('field.hairColor')" v-bind="hairColor">
            <a-input style="width: 100%" v-bind="hairColor" />
          </a-form-item>

          <a-form-item :label="t('field.hairLength')" v-bind="hairLength">
            <a-select v-bind="hairLength">
              <a-select-option value="LONG">LONG</a-select-option>
              <a-select-option value="SHORT">SHORT</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :label="t('field.shirtSize')" v-bind="shirtSize">
            <a-input style="width: 100%" v-bind="shirtSize" />
          </a-form-item>
          <a-form-item :label="t('field.trousersSize')" v-bind="trousersSize">
            <a-input style="width: 100%" v-bind="trousersSize" />
          </a-form-item>
          <a-form-item :label="t('field.shoesSize')" v-bind="shoesSize">
            <a-input style="width: 100%" v-bind="shoesSize" />
          </a-form-item>

          <a-form-item :label="t('field.style')" v-bind="style">
            <SelectStyle v-bind="style" mode="multiple" />
          </a-form-item>

          <a-form-item :label="t('field.tattoo')" v-bind="tattoo">
            <a-switch v-bind="tattoo" />
          </a-form-item>
        </a-card>
      </template>

      <template #side>
        <a-card title="Số đo cơ thể">
          <a-form-item :label="t('field.weight')" v-bind="weight">
            <a-input-number
              style="width: 100%"
              v-bind="weight"
              :min="0"
              :max="999"
              addon-after="kg"
            />
          </a-form-item>
          <a-form-item :label="t('field.height')" v-bind="height">
            <a-input-number
              style="width: 100%"
              v-bind="height"
              :min="0"
              :max="999"
              addon-after="cm"
            />
          </a-form-item>
          <a-form-item :label="t('field.bust')" v-bind="bust">
            <a-input-number
              style="width: 100%"
              v-bind="bust"
              :min="0"
              :max="999"
              addon-after="cm"
            />
          </a-form-item>

          <a-form-item :label="t('field.waist')" v-bind="waist">
            <a-input-number
              style="width: 100%"
              v-bind="waist"
              :min="0"
              :max="999"
              addon-after="cm"
            />
          </a-form-item>

          <a-form-item :label="t('field.hips')" v-bind="hips">
            <a-input-number
              style="width: 100%"
              v-bind="hips"
              :min="0"
              :max="999"
              addon-after="cm"
            />
          </a-form-item>
        </a-card>
      </template>
    </ShDashboardFormView>
  </a-form>
</template>

<script setup lang="ts">
import { ANDT_FORM_HELPER } from '~/common/helpers';
import { ShDashboardFormView } from '~/components';
import { SelectStyle } from '~/features/app-config/widgets';
import type { UseUpdateFormMeasurementType } from '~/features/model/services';

const props = defineProps<{ form: UseUpdateFormMeasurementType }>();
const { t } = useI18n();
const { form } = props;
const { defineComponentBinds, onSubmit } = form;

const weight = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'weight');
const height = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'height');
const bust = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'bust');

const hips = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'hips');
const waist = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'waist');

const skinColor = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'skinColor');
const eyeColor = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'eyeColor');
const hairColor = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'hairColor');
const hairLength = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'hairLength');
const shirtSize = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'shirtSize');
const trousersSize = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'trousersSize');
const shoesSize = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'shoesSize');

const style = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'style');
const tattoo = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'tattoo', 'checked');
</script>
