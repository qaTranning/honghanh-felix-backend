<template>
  <div class="flex flex-row space-x-2 items-center">
    <a-tag :color="getColorStatusCampaign(props.data?.status)">{{ props.data?.status }}</a-tag>
    <a-dropdown placement="bottomRight">
      <a-button type="text"
        ><template #icon> <EditOutlined /> </template
      ></a-button>

      <template #overlay>
        <div class="flex flex-col bg-slate-50 shadow-lg rounded-md py-4 space-y-2">
          <a-button
            v-for="option in options"
            :key="option"
            type="text"
            @click="() => showPromiseConfirm(option)"
          >
            <a-tag class="w-full" :color="getColorStatusCampaign(option)">{{ option }}</a-tag>
          </a-button>
        </div>
      </template>
    </a-dropdown>
  </div>
</template>

<script setup lang="ts">
import { EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Modal } from 'ant-design-vue';
import { createVNode } from 'vue';
import { useUpdateStatusCampaignMutation } from '~/features/campaign/apis';
import type { ICampaign } from '~/features/campaign/models';
import { getColorStatusCampaign } from '~/features/campaign/utils';

const props = defineProps<{ data?: ICampaign }>();

const haha = ['PROCESSING', 'PENDING', 'COMPLETED', 'CANCELED', 'WAITING_PAYMENT', 'PAID'];

const options = computed(() => haha.filter((item) => item !== props.data?.status));

const { mutateAsync } = useUpdateStatusCampaignMutation();

function showPromiseConfirm(status: string) {
  Modal.confirm({
    title: 'Bạn muốn chuyển trạng thái chiến dịch?',
    icon: createVNode(ExclamationCircleOutlined),
    content: 'Bằng việc click vào nút OK bạn sẽ chuyển sang thái sang ' + status,
    async onOk() {
      try {
        await mutateAsync({ body: { status, id: props.data?.id || 0 } });
      } catch {
        return console.log('Oops errors!');
      }
    },
    onCancel() {},
  });
}
</script>
