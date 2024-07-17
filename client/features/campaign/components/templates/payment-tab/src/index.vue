<template>
  <!-- <ShDashboardFormView>
    <template #main>
      <a-card title="Danh sách thanh toán">
        <template #extra>
          <a-button>Tạo mới</a-button>
        </template>
        <a-tabs v-model:activeKey="activeKey">
          <a-tab-pane key="1" tab="Chưa thanh toán"
            ><a-table :columns="columns" :data-source="[]"> </a-table
          ></a-tab-pane>
          <a-tab-pane key="2" tab="Yêu cầu thanh toán"
            ><a-table :columns="columns" :data-source="[]"> </a-table
          ></a-tab-pane>
          <a-tab-pane key="3" tab="Đã thanh toán"
            ><a-table :columns="columns" :data-source="[]"> </a-table
          ></a-tab-pane>
        </a-tabs>
      </a-card>
    </template>

    <template #side>
      <a-card title="Thanh toán">
        <h1>dsadas</h1>
      </a-card>
    </template>
  </ShDashboardFormView> -->
  <a-card title="Thanh toán">
    <template #extra>
      <router-link :to="{ name: 'data-payment-create' }">
        <a-button type="primary">Tạo hoá đơn</a-button>
      </router-link>
    </template>

    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane v-for="item in INVOICE_STATUS_ARRAY" :key="item.value" :tab="item.label">
      </a-tab-pane>
    </a-tabs>

    <AllPaymentTable :invoiceStatus="activeKey" :campaignId="campaignId" />
  </a-card>
</template>

<script setup lang="ts">
import { AllPaymentTable } from '../../../../../payment/components/organisms';
import type { InvoiceStatusType } from '~/features/payment/models';
import { useRouteQuery } from '~/common/hooks/route-query';
import { INVOICE_STATUS_ARRAY } from '~/features/payment/constants';
// import type { TableColumnsType } from 'ant-design-vue';
// import { ShDashboardFormView } from '~/components/organisms';
const campaignId = Number(useRouteQuery('id').value);

const activeKey = ref<InvoiceStatusType>('WAITING_APPROVED');
// const campaignId = ref<number | undefined>(undefined);

// const activeKey = ref('1');

// const columns: TableColumnsType<any> = [
//   {
//     title: 'STT',
//     key: 'thumbnail',
//     width: 20,
//   },
//   {
//     title: 'Avatar',
//     key: 'avatar',
//     width: 100,
//   },
//   {
//     title: 'Người mẫu',
//     key: 'model',
//     width: 250,
//   },
//   {
//     title: 'Thông tin thanh toán',
//     key: 'model',
//     // width: '100%',
//   },
// ];
</script>
