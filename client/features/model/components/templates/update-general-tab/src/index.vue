<template>
  <a-form layout="vertical" @submit="onSubmit">
    <ShDashboardFormView :loading="form.isLoading.value">
      <template #header>
        <div class="flex justify-end space-x-2">
          <a-button @click="() => navigateTo({ name: 'data-model' })">Hủy</a-button>

          <a-button type="primary" html-type="submit" :disabled="!form.isDirty.value">Lưu</a-button>
        </div>
      </template>
      <template #main>
        <a-card title="Thông tin chung">
          <a-form-item :label="'Dân tộc'" v-bind="citizenship">
            <a-select v-bind="citizenship">
              <a-select-option value="VIETNAMESE">Vietnamese</a-select-option>
              <a-select-option value="ASIAN">Asian</a-select-option>
              <a-select-option value="AFRICAN">African</a-select-option>
              <a-select-option value="EUROPEAN">European</a-select-option>
              <a-select-option value="AMERICAN">American</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item :label="t('field.gender')" v-bind="gender">
            <a-select v-bind="gender">
              <a-select-option value="MALE">Nam</a-select-option>
              <a-select-option value="FEMALE">Nữ</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item :label="t('field.location')" v-bind="location">
            <a-select v-bind="location" placeholder="Select location">
              <a-select-option value="HN">Ha Noi</a-select-option>
              <a-select-option value="HCM">Ho Chi Minh</a-select-option>
              <a-select-option value="DN">Da Nang</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item :label="t('field.talent')" v-bind="talent">
            <a-input style="width: 100%" v-bind="talent" placeholder="Nhập tài năng người mẫu" />
          </a-form-item>
          <a-form-item :label="t('field.dob')" v-bind="dob">
            <a-date-picker
              class="w-full"
              v-bind="dob"
              placeholder="Select birthday"
              :disabled-date="
                (current: Dayjs) => {
                  return current && current > dayjs().endOf('day');
                }
              "
            />
          </a-form-item>

          <a-form-item label="Địa chỉ" v-bind="address">
            <a-input style="width: 100%" v-bind="address" placeholder="Nhập địa chỉ người mẫu" />
          </a-form-item>

          <a-form-item label="Giới thiệu" v-bind="introduce">
            <a-textarea
              style="width: 100%"
              v-bind="introduce"
              placeholder="Nhập giới thiệu người mẫu"
            />
          </a-form-item>
        </a-card>
      </template>

      <template #side>
        <a-card title="Liên hệ">
          <a-form-item label="Số điện thoại" v-bind="phone">
            <a-input style="width: 100%" v-bind="phone" placeholder="Nhập số điện thoại" />
          </a-form-item>
          <a-form-item label="ID CARD" v-bind="idCard">
            <a-input style="width: 100%" v-bind="idCard" placeholder="Nhập số căn cước/cmt" />
          </a-form-item>
        </a-card>
        <a-card title="Mạng xã hội">
          <a-form-item label="Facebook" v-bind="facebook">
            <a-input style="width: 100%" v-bind="facebook" placeholder="Facebook" />
          </a-form-item>
          <a-form-item label="Instagram" v-bind="instagram">
            <a-input style="width: 100%" v-bind="instagram" placeholder="Instagram" />
          </a-form-item>
          <a-form-item label="Twitter" v-bind="twitter">
            <a-input style="width: 100%" v-bind="twitter" placeholder="Twitter" />
          </a-form-item>
          <a-form-item label="Tiktok" v-bind="tiktok">
            <a-input style="width: 100%" v-bind="tiktok" placeholder="Tiktok" />
          </a-form-item>
        </a-card>
        <a-card title="CCCD">
          <a-form-item label="CCCD Mặt trước" v-bind="idCardFrontFace">
            <ShUploadImages :max-count="1" v-bind="idCardFrontFace" />
          </a-form-item>

          <a-form-item label="CCCD Mặt sau" v-bind="idCardBackFace">
            <ShUploadImages :max-count="1" v-bind="idCardBackFace" />
          </a-form-item>
        </a-card>
      </template>
    </ShDashboardFormView>
  </a-form>
</template>

<script setup lang="ts">
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { ANDT_FORM_HELPER } from '~/common/helpers';
import { ShUploadImages, ShDashboardFormView } from '~/components';
import type { UseUpdateFormGeneralType } from '~/features/model/services/update-form-general';

const props = defineProps<{ form: UseUpdateFormGeneralType }>();
const { t } = useI18n();
const { form } = props;
const { defineComponentBinds, onSubmit } = form;

const citizenship = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'citizenship');

const gender = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'gender');

const location = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'location');

const talent = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'talent');

const dob = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'dob');
const address = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'address');
const introduce = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'introduce');
const facebook = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'facebook');
const instagram = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'instagram');
const twitter = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'twitter');
const tiktok = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'tiktok');
const idCardFrontFace = ANDT_FORM_HELPER.defineFormItemAndtBinds(
  defineComponentBinds,
  'idCardFrontFace',
  'file-list'
);
const idCardBackFace = ANDT_FORM_HELPER.defineFormItemAndtBinds(
  defineComponentBinds,
  'idCardBackFace',
  'file-list'
);

const phone = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'phone');
const idCard = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'idCard');
</script>
