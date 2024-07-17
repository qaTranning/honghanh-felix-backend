<template>
  <a-form layout="vertical" aria-autocomplete="both" @submit="onSubmit">
    <ShDashboardFormView :title="t('app_config.update')" :loading="query.isLoading.value">
      <template #header><ShBreadcrumb :routes="breadcrumb" /></template>

      <template #main>
        <AppConfigUpdateStyleForm :form="form" />

        <div class="flex justify-end space-x-2">
          <a-button @click="handleClickCancel">{{ $t('common.cancel') }}</a-button>

          <a-button type="primary" html-type="submit">{{ $t('common.save') }}</a-button>
        </div>
      </template>
      >
    </ShDashboardFormView>
  </a-form>
</template>

<script setup lang="ts">
import type { Route } from 'ant-design-vue/lib/breadcrumb/Breadcrumb';
import { AppConfigUpdateStyleForm } from '../../components';
import { useAppConfigUpdateStyleForm } from '../../services';
import { useRouteQuery } from '~/common/hooks/route-query';
import { ShDashboardFormView, ShBreadcrumb } from '~/components';

const { t } = useI18n();

const form = useAppConfigUpdateStyleForm();

const { appConfigId, onSubmit, query } = form;

const id = useRouteQuery('id');

onMounted(() => {
  if (id.value) appConfigId.value = Number(id.value);
});

function handleClickCancel() {
  navigateTo({ name: 'data-app-config' });
}

const breadcrumb: Route[] = [
  {
    path: 'index',
    breadcrumbName: 'Trang chủ',
  },
  {
    path: 'data-app-config',
    breadcrumbName: 'Danh sách cấu hình',
  },
  {
    path: 'data-app-config-update',
    breadcrumbName: 'Cập nhật cấu hình id: ' + id.value,
  },
];
</script>
