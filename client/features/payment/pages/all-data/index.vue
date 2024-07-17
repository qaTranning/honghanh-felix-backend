<template>
  <a-card title="Thanh toán">
    <template #extra>
      <router-link :to="{ name: 'data-payment-create' }">
        <a-button type="primary">Tạo hoá đơn</a-button>
      </router-link>
    </template>

    <div class="flex justify-between">
      <a-tabs v-model:activeKey="activeKey">
        <!-- <a-tab-pane key="WAITING_CONFIRM" tab="Chưa xác nhận"> </a-tab-pane>
      <a-tab-pane key="WAITING_APPROVED" tab="Chưa thanh toán"> </a-tab-pane>
      <a-tab-pane key="PAID" tab="Đã thanh toán"></a-tab-pane>
      <a-tab-pane key="COMPLETED" tab="Đã hoàn thành"></a-tab-pane>

      <a-tab-pane key="REJECTED" tab="Từ chối"></a-tab-pane>
      <a-tab-pane key="RECEIVED" tab="Đã nhận thanh toán"></a-tab-pane> -->

        <a-tab-pane
          v-for="item in INVOICE_STATUS_ARRAY"
          :key="item.value"
          :tab="item.label"
        ></a-tab-pane>
      </a-tabs>

      <a-dropdown placement="bottom">
        <a-button type="ghost">{{ orderValue }} <DownOutlined /> </a-button>
        <template #overlay>
          <a-menu>
            <a-menu-item
              v-for="item in listSort"
              :key="item.value"
              @click="
                () => {
                  const [key, value] = item.value.split('-');
                  order = { [key]: value };
                }
              "
            >
              <span>{{ item.label }}</span>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
    <AllPaymentTable :invoiceStatus="activeKey" :order="order" />
  </a-card>
</template>

<script setup lang="ts">
import type { IParamsGetAllPayment } from '../../apis';
import { AllPaymentTable } from '../../components';
import { INVOICE_STATUS_ARRAY } from '../../constants';
import type { InvoiceStatusType } from '../../models';

const activeKey = ref<InvoiceStatusType>('WAITING_APPROVED');

const listSort = [
  {
    label: 'Mới nhất',
    value: 'createdAt-desc',
  },
  {
    label: 'Cũ nhất',
    value: 'createdAt-asc',
  },
] as const;

const order = ref<IParamsGetAllPayment['order']>({});

const orderValue = computed(() => {
  const valueOrder = order.value || {};

  return (
    listSort.find((item) => {
      const [key, value] = item.value.split('-');
      return valueOrder[key] === value;
    })?.label || 'Mới nhất'
  );
});
</script>
