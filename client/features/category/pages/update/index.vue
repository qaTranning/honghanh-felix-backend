<template>
  <a-form layout="vertical" aria-autocomplete="both" @submit="onSubmit">
    <ShDashboardFormView title="Cập nhật Category">
      <template #header><ShBreadcrumb :routes="breadcrumb" /></template>

      <template #main>
        <CategoryUpsertForm :form="form" />

        <div class="flex justify-end space-x-2">
          <a-button @click="handleClickCancel">Hủy</a-button>

          <a-button type="primary" html-type="submit">Cập nhật</a-button>
        </div></template
      >
    </ShDashboardFormView>
  </a-form>
</template>

<script setup lang="ts">
import type { Route } from 'ant-design-vue/lib/breadcrumb/Breadcrumb';
import { CategoryUpsertForm } from '../../components';
import { useCategoryUpsertForm } from '../../services';
import { useRouteQuery } from '~/common/hooks/route-query';
import { ShBreadcrumb } from '~/components/moledules';
import { ShDashboardFormView } from '~/components/organisms';

const { t } = useI18n();

// const { createBreadcrumb: breadcrumb } = getBreadcrumbCategory(t);

const form = useCategoryUpsertForm();
const { onSubmit, categoryId } = form;

const id = useRouteQuery('id');
onMounted(() => {
  if (id.value) categoryId.value = Number(id.value);
});

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
    path: 'data-category-update',
    breadcrumbName: 'Cập nhật id: ' + id.value,
  },
];
</script>
