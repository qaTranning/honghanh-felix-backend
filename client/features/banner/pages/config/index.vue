<template>
  <ShBreadcrumb :routes="breadcrumb"></ShBreadcrumb>

  <UpdateBannerForm :form="form" />
</template>

<script setup lang="ts">
import type { Route } from 'ant-design-vue/lib/breadcrumb/Breadcrumb';

import { UpdateBannerForm } from '../../components/templates';
import { useUpdateBannerForm } from '../../services';
import { ShBreadcrumb } from '~/components/moledules';

const form = useUpdateBannerForm();

const breadcrumb: Route[] = [
  {
    path: 'index',
    breadcrumbName: 'Trang chủ',
  },
  {
    path: 'data-banner',
    breadcrumbName: 'Cập nhật Banner',
  },
];
</script>
