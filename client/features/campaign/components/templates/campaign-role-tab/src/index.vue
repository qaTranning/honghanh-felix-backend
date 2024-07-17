<template>
  <div class="flex flex-col space-y-2">
    <div class="flex justify-end">
      <a-button type="primary" @click="onCreate">Tạo mới</a-button>
    </div>
    <a-modal v-model:visible="openForm" width="1000px" title="Cập nhật vai trò chiến dịch"
      :confirm-loading="isPending.value" :bodyStyle="{
        overflowY: 'auto',
        maxHeight: 'calc(100vh -  )',
      }" @ok="handleSubmit" @cancel="handleCancel">
      <a-form layout="vertical" labelAlign="left">
        <div class="grid grid-cols-2 gap-4">
          <a-form-item :required="true" :label="t('field.name')" v-bind="name">
            <a-input v-bind="name" placeholder="Nhập tên" />
          </a-form-item>

          <a-form-item :required="true" :label="t('field.fromHeight')" v-bind="fromHeight">
            <a-input-number class="w-full" v-bind="fromHeight" placeholder="Nhập chiều cao tối thiểu" />
          </a-form-item>

          <a-form-item :required="true" :label="t('field.description')" v-bind="description">
            <a-textarea v-bind="description" placeholder="Nhập mô tả" />
          </a-form-item>

          <a-form-item :required="true" :label="t('field.toHeight')" v-bind="toHeight">
            <a-input-number class="w-full" v-bind="toHeight" placeholder="Nhập chiều cao tối đa" />
          </a-form-item>

          <a-form-item :required="true" :label="t('field.gender')" v-bind="gender">
            <a-select v-bind="gender">
              <a-select-option value="MALE">Nam</a-select-option>
              <a-select-option value="FEMALE">Nữ</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item :required="true" :label="t('field.fromWeight')" v-bind="fromWeight">
            <a-input-number class="w-full" v-bind="fromWeight" placeholder="Nhập cân nặng tối thiểu" />
          </a-form-item>

          <a-form-item :required="true" :label="t('field.style')" v-bind="style">
            <SelectStyle mode="multiple" v-bind="style" />
          </a-form-item>

          <a-form-item :required="true" :label="t('field.toWeight')" v-bind="toWeight">
            <a-input-number class="w-full" v-bind="toWeight" placeholder="Nhập cân nặng tối đa" />
          </a-form-item>

          <a-form-item :required="true" :label="t('field.budget')" v-bind="budget">
            <a-input-number class="w-full" v-bind="budget" placeholder="Nhập ngân sách"
              :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="(value) => value.replace(/\$\s?|(,*)/g, '')" />
          </a-form-item>

          <a-form-item :required="true" :label="t('field.fromAge')" v-bind="fromAge">
            <a-input-number class="w-full" v-bind="fromAge" placeholder="Nhập tuổi tối thiểu" />
          </a-form-item>

          <a-form-item :required="true" :label="t('field.quantity')" v-bind="quantity">
            <a-input-number class="w-full" v-bind="quantity" placeholder="Nhập số lượng" />
          </a-form-item>

          <a-form-item :required="true" :label="t('field.toAge')" v-bind="toAge">
            <a-input-number class="w-full" v-bind="toAge" placeholder="Nhập tuổi tối đa" />
          </a-form-item>

          <a-form-item :required="true" :label="'Dân tộc'" v-bind="citizenship">
            <a-select v-bind="citizenship">
              <a-select-option value="VIETNAMESE">Vietnamese </a-select-option>
              <a-select-option value="ASIAN">Asian</a-select-option>
              <a-select-option value="AFRICAN">African</a-select-option>
              <a-select-option value="EUROPEAN">European</a-select-option>
              <a-select-option value="AMERICAN">American</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item :required="true" :label="t('field.imageLicenseFee')" v-bind="imageLicenseFee">
            <a-input v-bind="imageLicenseFee" placeholder="Phí giấy phép hình ảnh" class="w-full" />
          </a-form-item>

          <a-form-item :required="true" :label="'Thời gian thử đồ dự kiến'" v-bind="fitingTime">
            <a-range-picker v-bind="fitingTime" class="w-full" show-time :disabled-date="disabledDate"
              :format="TIME_HELPER.FormatDateTimeEnum['DD-MM-YYYY HH:mm']" />
          </a-form-item>

          <a-form-item :required="true" :label="t('field.workLoad')" v-bind="workLoad">
            <a-input-number class="w-full" v-bind="workLoad" placeholder="Nhập thời gian làm việc" />
          </a-form-item>

          <a-form-item :required="true" :label="`Thời gian làm việc dự kiến`" v-bind="shootingDate">
            <a-range-picker v-bind="shootingDate" class="w-full" show-time :disabled-date="disabledDateShooting"
              :format="TIME_HELPER.FormatDateTimeEnum['DD-MM-YYYY HH:mm']" />
          </a-form-item>
        </div>
      </a-form>
    </a-modal>

    <a-card title="Danh sách vai trò chiến dịch">
      <a-table :loading="isLoading.value" :columns="columns" :pagination="paginationTable" :data-source="dataSource"
        :scroll="{ x: 2000, y: 450 }" @change="handleTableChange">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'operation'">
            <ShTableCellAction :onUpdate="() => onUpdate(record)" @remove="() => handleDeleteCampaignRole(record.id)">
              <a-tooltip title="Cập nhật trạng thái">
                <a-button shape="circle" @click="() => showModalConfirmChangeStatus(record?.id, record?.status)">
                  <template #icon>
                    <ToolOutlined />
                  </template>
                </a-button>
              </a-tooltip>
            </ShTableCellAction>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>
<script lang="ts" setup>
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import {
  useCampaignRoleTable,
  useUpsertFormCampaignRole,
  useDeleteCampaignRoleService,
  useCampaignRoleUpdateStatus,
} from '../services';
import { type ICampaign, type ICampaignRole } from '@/features/campaign/models';
import { ANDT_FORM_HELPER, TIME_HELPER, useBoolean } from '~/common';
import { useRouteQuery } from '~/common/hooks/route-query';
import { ShTableCellAction } from '~/components/organisms';
import { SelectStyle } from '~/features/app-config/widgets';
import { useGetDetailCampaignQuery } from '~/features/campaign/apis';

const { t } = useI18n();
const [openForm, { setFalse, setTrue }] = useBoolean();
const { columns, handleTableChange, isLoading, paginationTable, dataSource, campaignId } =
  useCampaignRoleTable(t);

const { handleDeleteCampaignRole } = useDeleteCampaignRoleService();

const id = useRouteQuery('id');

const { currentCampaignId, query } = useGetDetailCampaignQuery();
const campaignData = computed(() => query.data.value?.data as ICampaign | undefined);
// const brandData = computed(() => query.data.value?.data. as IBrand | undefined);

const disabledDate = (current: Dayjs) => {
  // if (campaignData.value) {
  //   if (campaignData.value.endFittingDate) {
  //     return current && current < dayjs(campaignData.value?.endFittingDate);
  //   }
  // }
  // Can not select days before today
  return current && current <= dayjs().startOf('day');
};

const disabledDateShooting = (current: Dayjs) => {
  // if (campaignData.value) {
  //   if (campaignData.value.endFittingDate) {
  //     return current && current < dayjs(campaignData.value?.endFittingDate);
  //   }
  // }
  // Can not select days before today
  return current && current <= dayjs().startOf('day');
};

onMounted(() => {
  if (!id.value) return;
  campaignId.value = Number(id.value);
  currentCampaignId.value = Number(id.value);
});

const { onSubmit, defineComponentBinds, handleResetValues, isPending, currentCampaignRoleId } =
  useUpsertFormCampaignRole();

function handleSubmit() {
  onSubmit(campaignId.value, setFalse);
}

function handleCancel() {
  handleResetValues(undefined);

  setFalse();
}

function onCreate() {
  handleResetValues(undefined);
  setTrue();
}

function onUpdate(record: ICampaignRole) {
  handleResetValues(record);
  setTrue();
  currentCampaignRoleId.value = record.id;
}

const name = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'name');
const description = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'description');
const fromAge = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'fromAge');
const toAge = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'toAge');
const budget = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'budget');
const citizenship = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'citizenship');
const fromHeight = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'fromHeight');
const fromWeight = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'fromWeight');
const gender = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'gender');
const imageLicenseFee = ANDT_FORM_HELPER.defineFormItemAndtBinds(
  defineComponentBinds,
  'imageLicenseFee'
);
const quantity = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'quantity');
const toHeight = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'toHeight');
const toWeight = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'toWeight');
const workLoad = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'workLoad');
const style = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'style');

const shootingDate = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'shootingDate');
const fitingTime = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'fitingTime');

// update status

const { showModalConfirmChangeStatus } = useCampaignRoleUpdateStatus();
</script>
