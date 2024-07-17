<template>
  <div class="flex justify-between">
    <ShBreadcrumb :routes="breadcrumb"></ShBreadcrumb>
    <div><a-button @click="onUpdate">Cập nhật</a-button></div>
  </div>

  <div class="flex space-x-2 items-center">
    <a-avatar shape="square" :size="50" :src="IMAGE_HELPER.getUrlImageLow(resultUser?.avatar)">
      <template #icon>
        <UserOutlined />
      </template>
    </a-avatar>
    <div>
      <p>{{ profileHandleName(resultUser?.firstname, resultUser?.lastname) }}</p>
      <p>{{ resultUser?.email }}</p>
    </div>
    <div>
      <a-tooltip title="Sửa thông tin user">
        <a-button
          shape="circle"
          type="text"
          :icon="h(EditOutlined)"
          @click="() => navigateTo({ name: 'data-user-update', query: { id: resultUser?.id } })"
        />
      </a-tooltip>
    </div>
  </div>

  <a-tabs v-model:activeKey="activeKey">
    <a-tab-pane key="1" tab="Thông tin người mẫu"><ModelDetailBasicInfo /></a-tab-pane>
    <a-tab-pane key="2" tab="Lịch trình"><ModelDetailSchedulesTab /></a-tab-pane>
    <a-tab-pane key="3" tab="Yêu cầu đăng kí"><ModelDetailRequestTab /></a-tab-pane>
    <a-tab-pane key="4" tab="Comcard">
      <ModelUpdateComcardTab :form="formComcard" />
    </a-tab-pane>
    <a-tab-pane key="5" tab="Thư viện ảnh">
      <UpdateImageModelTab />
    </a-tab-pane>
    <a-tab-pane key="6" tab="Trao đổi">
      <ChatWithModel v-if="resultUser?.id" :modelId="resultUser?.id" />
    </a-tab-pane>
  </a-tabs>
</template>

<script setup lang="ts">
import type { Route } from 'ant-design-vue/lib/breadcrumb/Breadcrumb';
import { EditOutlined } from '@ant-design/icons-vue';
import {
  ModelDetailBasicInfo,
  ModelDetailRequestTab,
  ModelDetailSchedulesTab,
  ModelUpdateComcardTab,
  UpdateImageModelTab,
} from '../../components';
import { useUpdateFormComcard } from '../../services';
import { useGetDetailModelQuery } from '../../apis';
import { useRouteQuery } from '~/common/hooks/route-query';
import { ShBreadcrumb } from '@/components/moledules';
import { IMAGE_HELPER } from '~/common';
import { profileHandleName } from '~/features/profile';
import { ChatWithModel } from '~/features/chat/widgets';

const id = useRouteQuery('id');

const { resultUser, currentModelId } = useGetDetailModelQuery();

onMounted(() => {
  currentModelId.value = Number(id.value);
});

function onUpdate() {
  navigateTo({ name: 'data-model-update', query: { id: id.value } });
}

const activeKey = ref('1');

const formComcard = useUpdateFormComcard();

const breadcrumb: Route[] = [
  {
    path: 'index',
    breadcrumbName: 'Trang chủ',
  },

  {
    path: 'data-model',
    breadcrumbName: 'Danh sách người mẫu',
  },
  {
    path: 'data-model-detail',
    breadcrumbName: 'Chi tiết',
  },
];
</script>
