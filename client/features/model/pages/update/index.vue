<template>
  <ShBreadcrumb :routes="breadcrumb"></ShBreadcrumb>
  <div class="flex space-x-2 items-center">
    <a-avatar shape="square" :size="50" :src="IMAGE_HELPER.getUrlImageLow(data?.data.avatar)">
      <template #icon>
        <UserOutlined />
      </template>
    </a-avatar>
    <div>
      <p>{{ profileHandleName(data?.data.firstname, data?.data.lastname) }}</p>
      <p>{{ data?.data.email }}</p>
    </div>
    <div>
      <a-tooltip title="Cập nhật thông tin tài khoản">
        <a-button
          shape="circle"
          type="text"
          :icon="h(EditOutlined)"
          @click="() => navigateTo({ name: 'data-user-date', query: { id: data?.data.id } })"
        />
      </a-tooltip>
    </div>
  </div>
  <a-tabs v-model:activeKey="activeKey">
    <a-tab-pane key="1" tab="Thông tin chung"><ModelUpdateGeneralTab :form="form" /></a-tab-pane>
    <a-tab-pane key="2" tab="Thông tin hình thể"
      ><ModelUpdateMeasurementTab :form="formMeasurement"
    /></a-tab-pane>
    <a-tab-pane key="3" tab="Ảnh 360 và video"
      ><ModelUpdateMediaTab :form="formMedia"
    /></a-tab-pane>
    <a-tab-pane key="4" tab="Lương"><ModelUpdateSalaryTab :form="formSalary" /></a-tab-pane>
    <a-tab-pane key="5" tab="Thư viện ảnh"><UpdateImageModelTab /></a-tab-pane>
  </a-tabs>
</template>

<script setup lang="ts">
import type { Route } from 'ant-design-vue/es/breadcrumb/Breadcrumb';
import { EditOutlined } from '@ant-design/icons-vue';
import {
  ModelUpdateGeneralTab,
  ModelUpdateMeasurementTab,
  ModelUpdateMediaTab,
  ModelUpdateSalaryTab,
  UpdateImageModelTab,
} from '../../components';
import {
  useUpdateFormGeneral,
  useUpdateFormMeasurement,
  useUpdateFormSalary,
  useUpdateFormMedia,
} from '../../services';
import { useRouteQuery } from '~/common/hooks/route-query';
import { ShBreadcrumb } from '~/components/moledules';
import { profileHandleName } from '~/features/profile';
import { IMAGE_HELPER } from '~/common';
const activeKey = ref('1');

const form = useUpdateFormGeneral();
const formMeasurement = useUpdateFormMeasurement();
const formSalary = useUpdateFormSalary();
const formMedia = useUpdateFormMedia();

const modelId = useRouteQuery('id');

const { data } = form;

onMounted(() => {
  if (modelId.value) {
    form.currentModelId.value = Number(modelId.value);
    formMeasurement.currentModelId.value = Number(modelId.value);
    formSalary.currentModelId.value = Number(modelId.value);
    formSalary.currentModelId.value = Number(modelId.value);
    formMedia.currentModelId.value = Number(modelId.value);
  }
});
onUnmounted(() => {
  form.currentModelId.value = null;
  formMeasurement.currentModelId.value = null;
  formSalary.currentModelId.value = null;
  formMedia.currentModelId.value = null;
});

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
    path: 'data-model-update',
    breadcrumbName: 'Cập nhật người mẫu',
  },
];
</script>
