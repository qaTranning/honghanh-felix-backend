<template>
  <ShBreadcrumb :routes="breadcrumb" />
  <CampaignUpsertForm :form="form" :is-loading="isLoading" />
</template>

<script setup lang="ts">
import type { Route } from 'ant-design-vue/lib/breadcrumb/Breadcrumb';
import { CampaignUpsertForm } from '~/features/campaign/widgets';
import { useUpsertFormCampaign } from '~/features/campaign/services';
import { useRouteQuery } from '~/common/hooks/route-query';
import { ShBreadcrumb } from '~/components/moledules';

const isLoading = false;
const form = useUpsertFormCampaign();
const campaignId = useRouteQuery('id');

onMounted(() => {
  if (campaignId.value) {
    form.currentCampaignId.value = Number(campaignId.value);
  }
});
onUnmounted(() => {
  form.currentCampaignId.value = null;
});

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
    path: 'data-campaign-update',
    breadcrumbName: 'Cập nhật chiến dịch id: ' + campaignId.value,
  },
];
</script>
