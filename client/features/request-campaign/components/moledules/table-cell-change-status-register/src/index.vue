<template>
  <div>
    <a-popover v-model:visible="visible" title="Select Status" trigger="click">
      <template #content>
        <a-space direction="vertical">
          <a-tag
            v-for="option in options"
            :key="option.name"
            style="width: 100%"
            class="cursor-pointer"
            :color="option.color"
            @click="() => showPromiseConfirm(option.name)"
            >{{ option.name }}</a-tag
          >
        </a-space>
      </template>
      <a-button type="primary">Cập nhật trạng thái</a-button>
    </a-popover>
  </div>
</template>

<script setup lang="ts">
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Modal } from 'ant-design-vue';
import { createVNode } from 'vue';
import { useAdminConfirmRegisterCampaignMutation } from '~/features/campaign/apis/register/admin-confirm';
import { ERegisterCampaignStatus } from '~/features/request-campaign';

const visible = ref<boolean>(false);

const props = defineProps<{ campaignRoleId: number; modelId: number }>();

const { mutateAsync } = useAdminConfirmRegisterCampaignMutation();

const options = [
  {
    name: ERegisterCampaignStatus.ACCEPTED,
    color: 'success',
  },
  {
    name: ERegisterCampaignStatus.REJECTED,
    color: 'error',
  },

  {
    name: ERegisterCampaignStatus.COMPLETED,
    color: 'processing',
  },
];

function showPromiseConfirm(status: ERegisterCampaignStatus) {
  Modal.confirm({
    title: 'Bạn có chắc chắn muốn thay đổi trạng thái?',
    icon: createVNode(ExclamationCircleOutlined),
    content: 'Hành động này có thể không thể quay lại trạng thái ban đầu',
    async onOk() {
      try {
        await mutateAsync({
          body: { campaignRoleId: props.campaignRoleId, modelId: props.modelId, status },
        });
      } catch {
        return console.log('Oops errors!');
      }
    },
    onCancel() {},
  });
}
</script>
