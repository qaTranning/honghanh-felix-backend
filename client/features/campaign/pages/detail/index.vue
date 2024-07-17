<template>
  <div class="flex flex-row w-full justify-between">
    <div>
      <ShBreadcrumb :routes="breadcrumb"></ShBreadcrumb>
    </div>

    <div>
      <a-button type="primary" :onClick="onNavigateToUpdateCampaign">Cập nhật Chiến dịch</a-button>
    </div>
  </div>

  <a-tabs v-model:activeKey="activeKey">
    <a-tab-pane key="1" tab="Thông tin chi tiết"><DetailCampaignTab /></a-tab-pane>
    <a-tab-pane key="3" tab="Vai trò"><CampaignRoleTab /></a-tab-pane>
    <a-tab-pane key="2" tab="Người mẫu đăng kí"><RegisterCampaignTab /></a-tab-pane>
    <a-tab-pane key="4" tab="Đánh giá"><ReviewCampaignTab /></a-tab-pane>
    <a-tab-pane key="5" tab="Thanh toán"><CampaignPaymentTab /></a-tab-pane>
  </a-tabs>
</template>

<script setup lang="ts">
import type { Route } from 'ant-design-vue/lib/breadcrumb/Breadcrumb';
import { ShBreadcrumb } from '@/components/moledules';
import {
  CampaignRoleTab,
  DetailCampaignTab,
  RegisterCampaignTab,
  ReviewCampaignTab,
  CampaignPaymentTab,
} from '@/features/campaign/components/templates';
import { useRouteQuery } from '~/common/hooks/route-query';

const activeKey = ref('1');

const id = useRouteQuery('id');

function onNavigateToUpdateCampaign() {
  navigateTo({ name: 'data-campaign-update', query: { id: id.value } });
}

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
    path: 'data-model-detail',
    breadcrumbName: 'Chi tiết chiến dịch',
  },
];
</script>
