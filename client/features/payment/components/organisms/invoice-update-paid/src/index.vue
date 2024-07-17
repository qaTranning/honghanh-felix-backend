<template>
  <a-card
    title="Chuyển khoản"
    :extra="h(Button, { type: 'primary', onClick: onSubmit }, 'Lưu lại')"
  >
    <a-form layout="vertical" @submit="onSubmit">
      <div class="flex flex-col space-y-2">
        <a-form-item label="Mã giao dịch" v-bind="referenceCode">
          <a-input-group compact>
            <a-input
              v-bind="referenceCode"
              style="width: calc(100% - 40px)"
              placeholder="Nhập mã giao dịch"
            />
            <a-tooltip title="sao chép">
              <a-button @click="onCopyRef">
                <template #icon><CopyOutlined /></template>
              </a-button>
            </a-tooltip>
          </a-input-group>
        </a-form-item>
        <a-form-item label="Ngày thanh toán" v-bind="paymentTime">
          <a-date-picker class="w-full" v-bind="paymentTime"></a-date-picker>
        </a-form-item>
        <a-form-item label="Ảnh giao dịch" v-bind="image">
          <ShUploadImagesVadidate :max-count="1" v-bind="image" />
        </a-form-item>
      </div>
    </a-form>
  </a-card>
</template>

<script setup lang="ts">
import { Button, message } from 'ant-design-vue';
import { ANDT_FORM_HELPER } from '~/common/helpers';
import { FormatDateTimeEnum, convertTimeAndDateFormat } from '~/common/helpers/time';
import { ShInfoItemHoz, ShUploadImagesVadidate } from '~/components';
import type { IPayment } from '~/features/payment/models';
import { useFormUpdateInvoicePaid } from '~/features/payment/services';

interface Props {
  invoice: IPayment;
}

const { invoice } = defineProps<Props>();

const { form, onSubmit } = useFormUpdateInvoicePaid({ invoice });

const { defineComponentBinds, values } = form;
const referenceCode = ANDT_FORM_HELPER.defineFormItemAndtBinds(
  defineComponentBinds,
  'referenceCode'
);

const paymentTime = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'paymentTime');

const image = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'image');

function onCopyRef() {
  const { referenceCode } = values;
  if (referenceCode) {
    navigator.clipboard.writeText(referenceCode);
    message.success('Đã sao chép mã giao dịch');
  }
}
</script>
