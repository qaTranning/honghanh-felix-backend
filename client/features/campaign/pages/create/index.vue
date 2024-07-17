<template>
  <ShBreadcrumb :routes="breadcrumb"></ShBreadcrumb>
  <CampaignUpsertForm :form="form" />
</template>

<script setup lang="ts">
import type { Route } from 'ant-design-vue/lib/breadcrumb/Breadcrumb';
import { CampaignUpsertForm } from '~/features/campaign/widgets';
import { useUpsertFormCampaign } from '~/features/campaign/services';
import { ShBreadcrumb } from '~/components/moledules';

const form = useUpsertFormCampaign();

const breadcrumb: Route[] = [
  {
    path: 'index',
    breadcrumbName: 'Trang chủ',
  },
  {
    path: 'data-campaign',
    breadcrumbName: 'Danh sách chiến dịch',
  },
  {
    path: 'data-campaign-create',
    breadcrumbName: 'Tạo mới',
  },
];
</script>
