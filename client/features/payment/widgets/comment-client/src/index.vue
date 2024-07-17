<template>
  <div :style="{ height: '350px' }" class="w-full flex flex-col">
    <div class="flex-1 pb-4 overflow-y-auto">
      <p>dsada</p>
      <p>dsada</p>

      <p>dsada</p>

      <p>dsada</p>

      <p>dsada</p>

      <p>dsada</p>

      <p>dsada</p>

      <p>dsada</p>

      <p>dsada</p>

      <p>dsada</p>
      <p>dsada</p>
      <p>dsada</p>
      <p>dsada</p>
      <p>dsada</p>
      <p>dsada</p>
      <p>dsada</p>
      <p>dsada</p>
      <p>dsada</p>
      <p>dsada</p>
      <p>dsada</p>
      <p>dsada</p>
      <p>dsada</p>
      <p>dsada</p>
      <p>dsada</p>
      <p>dsada</p>
      <p>dsada</p>
    </div>

    <div class="flex w-full justify-between space-x-2 pt-2">
      <div class="flex-1">
        <a-input placeholder="Nhập nội dung"></a-input>
      </div>

      <a-button shape="circle">
        <template #icon>
          <SendOutlined />
        </template>
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SendOutlined } from '@ant-design/icons-vue';

import { usePaymentComment } from '../../../services';
const { listData } = usePaymentComment();
</script>
