<template>
  <div class="flex flex-col space-y-2">
    <a-card title="Danh sách người mẫu đăng ký">
      <template #extra
        ><a-button :icon="h(ReloadOutlined)" @click="() => refetch()"></a-button
      ></template>

      <a-table
        :loading="isLoading.value"
        :columns="columns"
        :pagination="paginationTable"
        :data-source="dataSource"
        :scroll="{ x: 1500, y: 450 }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'operation'">
            <ShTableCellAction
              :is-loading="deleteRegisterCampaignMutation.isPending.value"
              @remove="
                () =>
                  handleDeleteRegisterCampaign({
                    campaignRoleId: record.campaignRoleId,
                    modelId: record.modelId,
                  })
              "
              @update="() => handleUpdate(record)"
            />
          </template>
        </template>
      </a-table>

      <a-modal
        v-model:visible="openForm"
        width="500px"
        :centered="true"
        title="Change status register"
        :confirm-loading="isPending.value"
        @ok="handleSubmit"
        @cancel="handleCancel"
      >
        <a-form-item>
          <a-form-item :required="true" :label="`Status`" v-bind="status">
            <a-select class="w-100%" v-bind="status">
              <!-- <a-select-option value="REGISTERED">REGISTERED</a-select-option> -->
              <a-select-option value="ACCEPTED">ACCEPTED</a-select-option>
              <a-select-option value="REJECTED">REJECTED</a-select-option>
              <a-select-option value="COMPLETED">COMPLETED</a-select-option>
              <!-- <a-select-option value="CANCELED">CANCELED</a-select-option> -->
            </a-select>
          </a-form-item>
        </a-form-item>
      </a-modal>
    </a-card>
  </div>
</template>
<script lang="ts" setup>
import { ReloadOutlined } from '@ant-design/icons-vue/lib/icons';
import {
  useDeleteRegisterCampaignService,
  useRegisterCampaignTable,
  useAdminConfirmRegisterCampaignService,
} from '../services';
import { ANDT_FORM_HELPER, useBoolean } from '~/common';
import { useRouteQuery } from '~/common/hooks/route-query';
import { ShTableCellAction } from '~/components';
import type { IRegisterCampaign } from '~/features/campaign/models';

const { t } = useI18n();
const [openForm, { setFalse, setTrue }] = useBoolean();
const {
  columns,
  handleTableChange,
  isLoading,
  paginationTable,
  dataSource,
  suspense,
  campaignId,
  refetch,
} = useRegisterCampaignTable(t);
await suspense();

const { onSubmit, handleResetValues, defineComponentBinds, isPending } =
  useAdminConfirmRegisterCampaignService();
function handleUpdate(record: IRegisterCampaign) {
  setTrue();
  handleResetValues(record);
}

function handleSubmit() {
  if (!campaignId.value) return;

  onSubmit({ campaignId: campaignId.value }, setFalse);
}

function handleCancel() {
  setFalse();
}

const { handleDeleteRegisterCampaign, deleteRegisterCampaignMutation } =
  useDeleteRegisterCampaignService();

onMounted(() => {
  campaignId.value = Number(useRouteQuery('id').value);
});

const status = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'status');
</script>
