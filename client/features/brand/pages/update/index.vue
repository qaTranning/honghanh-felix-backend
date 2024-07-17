<template>
  <a-form layout="vertical" aria-autocomplete="both" @submit="onSubmit">
    <ShDashboardFormView title="Cập nhật thương hiệu" :loading="isLoading">
      <template #header><ShBreadcrumb :routes="breadcrumb" /></template>

      <template #body>
        <div class="flex justify-end space-x-2">
          <a-button @click="handleClickCancel">Hủy</a-button>
          <a-button type="primary" html-type="submit">Cập nhật</a-button>
        </div>
        <BrandUpsertForm :form="form" />
      </template>
    </ShDashboardFormView>
  </a-form>
</template>

<script setup lang="ts">
import type { Route } from 'ant-design-vue/lib/breadcrumb/Breadcrumb';
import { BrandUpsertForm } from '../../components';
import { useUpsertFormBrand } from '../../services';
import { useRouteQuery } from '~/common/hooks/route-query';

import { ShDashboardFormView } from '~/components/organisms';
import { ShBreadcrumb } from '~/components/moledules';

const form = useUpsertFormBrand();
const { onSubmit, brandId, isLoading } = form;

const id = useRouteQuery('id');
onMounted(() => {
  if (id.value) brandId.value = Number(id.value);
});

function handleClickCancel() {
  navigateTo({ name: 'data-brand' });
}

const breadcrumb: Route[] = [
  {
    path: 'index',
    breadcrumbName: 'Trang chủ',
  },
  {
    path: 'data-brand',
    breadcrumbName: 'Danh sách nhãn hàng',
  },
  {
    path: 'data-brand-update',
    breadcrumbName: 'Cập nhật nhãn hàng id: ' + id.value,
  },
];
</script>
