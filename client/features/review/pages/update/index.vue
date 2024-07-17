<template>
  <ShBreadcrumb :routes="breadcrumb"></ShBreadcrumb>

  <ShDashboardFormView :loading="isLoading">
    <template #header>
      <div class="flex flex-row justify-end items-center">
        <div class="flex flex-row space-x-2">
          <a-button @click="handleCancel">Huỷ</a-button>
          <a-button type="primary" html-type="submit" @click="onSubmit">Lưu</a-button>
        </div>
      </div>
    </template>
    <template #body>
      <UpsertFormReview :form="form" />
    </template>
  </ShDashboardFormView>
</template>

<script setup lang="ts">
import type { Route } from 'ant-design-vue/lib/breadcrumb/Breadcrumb';
import { useUpsertFormReview } from '../../services';
import { UpsertFormReview } from '../../components';
import { ShBreadcrumb } from '~/components/moledules';
import { ShDashboardFormView } from '~/components/organisms';
import { useRouteQuery } from '~/common/hooks/route-query';
const id = useRouteQuery('id');

const form = useUpsertFormReview();

const { onSubmit, currentReviewId, isLoading } = form;

onMounted(() => {
  currentReviewId.value = Number(id.value);
});

function handleCancel() {
  navigateTo({ name: 'data-review' });
}

const breadcrumb: Route[] = [
  {
    path: 'index',
    breadcrumbName: 'Trang chủ',
  },
  {
    path: 'data-review',
    breadcrumbName: 'Danh sách',
  },
  {
    path: 'data-review-update',
    breadcrumbName: 'Cập nhật',
  },
];
</script>
