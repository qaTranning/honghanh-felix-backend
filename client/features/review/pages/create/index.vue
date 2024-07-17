<template>
  <ShBreadcrumb :routes="breadcrumb"></ShBreadcrumb>

  <ShDashboardFormView>
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

<script lang="ts" setup>
import type { Route } from 'ant-design-vue/lib/breadcrumb/Breadcrumb';
import { useUpsertFormReview } from '../../services';
import { UpsertFormReview } from '../../components';
import { ShBreadcrumb } from '~/components/moledules';
import { ShDashboardFormView } from '~/components/organisms';

const form = useUpsertFormReview();

const { onSubmit } = form;

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
    breadcrumbName: 'Danh sách đánh giá',
  },
  {
    path: 'data-review-create',
    breadcrumbName: 'Tạo mới',
  },
];
</script>
