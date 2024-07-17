<template>
  <ShBreadcrumb :routes="breadcrumb"></ShBreadcrumb>

  <p>Tạo người mẫu</p>
</template>

<script setup lang="ts">
import type { Route } from 'ant-design-vue/lib/breadcrumb/Breadcrumb';

import { ShBreadcrumb } from '~/components';

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
    path: 'data-model-create',
    breadcrumbName: 'Tạo mới',
  },
];
</script>
