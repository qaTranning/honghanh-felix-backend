<template>
  <ShBreadcrumb :routes="breadcrumb"></ShBreadcrumb>

  <UserUpsertForm :form="form" :is-loading="isLoading" />
</template>

<script setup lang="ts">
import type { Route } from 'ant-design-vue/lib/breadcrumb/Breadcrumb';
import { UserUpsertForm } from '~/features/user/widgets';
import { useUpsertFormUser } from '~/features/user/services';
import { useRouteQuery } from '~/common/hooks/route-query';
import { ShBreadcrumb } from '~/components';

const isLoading = false;
const form = useUpsertFormUser();
const userId = useRouteQuery('id');
const { t } = useI18n();
const breadcrumb: Route[] = [
  {
    path: 'index',
    breadcrumbName: 'Trang chủ',
  },

  {
    path: 'data-user',
    breadcrumbName: 'Danh sách người dùng',
  },
  {
    path: 'data-user-update',
    breadcrumbName: 'Cập nhật người dùng id: ' + userId.value,
  },
];

onMounted(() => {
  if (userId.value) {
    form.currentUserId.value = Number(userId.value);
  }
});
onUnmounted(() => {
  form.currentUserId.value = null;
});
</script>
