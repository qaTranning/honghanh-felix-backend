<template>
  <a-form layout="vertical" aria-autocomplete="both" @submit="onSubmit">
    <ShDashboardFormView>
      <template #header>
        <div class="flex justify-between">
          <ShBreadcrumb :routes="breadcrumb"></ShBreadcrumb>

          <div class="flex space-x-2">
            <a-button @click="handleClickCancel">{{ $t('common.cancel') }}</a-button>
            <a-button type="primary" html-type="submit">{{ $t('common.create') }}</a-button>
          </div>
        </div>
      </template>
      <template #body>
        <BrandUpsertForm :form="form" />
      </template>
    </ShDashboardFormView>
  </a-form>
</template>

<script setup lang="ts">
import type { Route } from 'ant-design-vue/lib/breadcrumb/Breadcrumb';
import { useUpsertFormBrand } from '../../services';
import { BrandUpsertForm } from '../../components';
import { ShDashboardFormView, ShBreadcrumb } from '~/components';

const form = useUpsertFormBrand();
const { onSubmit } = form;
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
    breadcrumbName: 'Danh sách thương hiệu',
  },
  {
    path: 'data-brand-create',
    breadcrumbName: 'Tạo mới',
  },
];
</script>
