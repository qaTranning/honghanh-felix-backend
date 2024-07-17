<template>
  <a-form layout="vertical" aria-autocomplete="both" @submit="onSubmit">
    <ShDashboardFormView title="Tạo mới">
      <template #header><ShBreadcrumb :routes="breadcrumb" /></template>

      <template #main>
        <CategoryUpsertForm :form="form" />

        <div class="flex justify-end space-x-2">
          <a-button @click="handleClickCancel">{{ $t('common.cancel') }}</a-button>

          <a-button type="primary" html-type="submit">{{ $t('common.create') }}</a-button>
        </div></template
      >
    </ShDashboardFormView>
  </a-form>
</template>

<script setup lang="ts">
import type { Route } from 'ant-design-vue/lib/breadcrumb/Breadcrumb';
import { CategoryUpsertForm } from '../../components';
import { useCategoryUpsertForm } from '../../services';
import { getBreadcrumbCategory } from '../../breadcrumb';
import { ShDashboardFormView, ShBreadcrumb } from '~/components';

const { t } = useI18n();
// const { createBreadcrumb: breadcrumb } = getBreadcrumbCategory(t);

const form = useCategoryUpsertForm();
const { onSubmit } = form;

function handleClickCancel() {
  navigateTo({ name: 'data-category' });
}

const breadcrumb: Route[] = [
  {
    path: 'index',
    breadcrumbName: 'Trang chủ',
  },
  {
    path: 'data-category',
    breadcrumbName: 'Danh sách',
  },
  {
    path: 'data-category-create',
    breadcrumbName: 'Tạo mới',
  },
];
</script>
