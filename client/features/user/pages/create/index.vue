<template>
  <ShBreadcrumb :routes="breadcrumb"></ShBreadcrumb>
  <UserUpsertForm :form="form" :is-loading="isLoading" />
</template>

<script setup lang="ts">
import type { Route } from 'ant-design-vue/lib/breadcrumb/Breadcrumb';
import { UserUpsertForm } from '~/features/user/widgets';
import { useUpsertFormUser } from '~/features/user/services';
import { ShBreadcrumb } from '~/components';

const isLoading = false;
const form = useUpsertFormUser();

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
    path: 'data-user-create',
    breadcrumbName: 'Tạo mới',
  },
];
</script>
