<template>
  <ShDashboardFormView :loading="isLoading">
    <template #header>
      <div class="flex flex-row justify-between items-center">
        <h4>Người dùng</h4>

        <div class="flex flex-row space-x-2">
          <a-button type="primary" html-type="submit" @click="onSubmit">Lưu</a-button>

          <a-button @click="handleCancel">Huỷ</a-button>
        </div>
      </div>
    </template>

    <template #main>
      <a-card title="Thông tin cơ bản">
        <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }" layout="vertical">
          <a-form-item :required="true" :label="t('field.email')" v-bind="email">
            <a-input
              :readonly="!!currentUserId"
              v-bind="email"
              :placeholder="$t('common.type_something', { name: $t('field.email') })"
              name="email"
            ></a-input>
          </a-form-item>

          <a-form-item :required="true" :label="t('field.firstname')" v-bind="firstname">
            <a-input
              v-bind="firstname"
              :placeholder="$t('common.type_something', { name: $t('field.firstname') })"
              name="firstname"
            ></a-input>
          </a-form-item>

          <a-form-item :required="true" :label="t('field.lastname')" v-bind="lastname">
            <a-input
              v-bind="lastname"
              :placeholder="$t('common.type_something', { name: $t('field.lastname') })"
              name="lastname"
            ></a-input>
          </a-form-item>

          <!-- <a-form-item :required="true" label="Birthday" v-bind="dob">
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
          </a-form-item> -->

          <a-form-item
            :label="t('field.password')"
            v-bind="password"
            extra="Nhập mật khẩu mới"
            :has-feedback="true"
          >
            <a-input-password
              v-bind="password"
              placeholder="Nhập mật khẩu"
              name="password"
            ></a-input-password>
          </a-form-item>

          <!-- <a-form-item :required="true" :label="t('field.phone')" v-bind="phone">
            <a-input
              v-bind="phone"
              :placeholder="$t('common.type_something', { name: $t('field.phone') })"
              name="phone"
            ></a-input>
          </a-form-item> -->

          <a-form-item :required="true" :label="t('field.role')" v-bind="role">
            <a-select v-bind="role" style="width: 140px" :disabled="!!currentUserId">
              <a-select-option value="MODEL">MODEL</a-select-option>
              <a-select-option value="ADMIN">ADMIN</a-select-option>
              <a-select-option value="REPRESENTATIVE">REPRESENTATIVE</a-select-option>
            </a-select>
          </a-form-item>

          <ShTableCellLink
            v-if="isShowLinkToModel"
            name="Đi tới chi tiết mẫu"
            @click="
              () => {
                if (!currentUserId) return;

                navigateTo({
                  name: 'data-model-detail',
                  query: {
                    id: currentUserId,
                  },
                });
              }
            "
          />
        </a-form>
      </a-card>
    </template>

    <template #side> </template>
  </ShDashboardFormView>
</template>

<script setup lang="ts">
import { type IUserUpsertFormProps } from '../types';
import { ANDT_FORM_HELPER } from '@/common';
import { ShDashboardFormView, ShTableCellLink } from '~/components';

const { form } = defineProps<IUserUpsertFormProps>();
const { handleCancel, defineComponentBinds, onSubmit, query, currentUserId, values } = form;
const { t } = useI18n();
const { isLoading } = query;

const isShowLinkToModel = computed(() => values.role === 'MODEL' && !!currentUserId.value);

const firstname = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'firstname');

const lastname = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'lastname');
const email = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'email');
const role = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'role');
const password = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'password');
// const phone = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'phone');
// const dob = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'dob');
</script>
