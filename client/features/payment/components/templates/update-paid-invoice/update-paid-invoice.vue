<template>
  <a-card
    v-if="isShowPaidInvoice"
    title="Thông tin hoá đơn"
    :extra="
      h(
        Button,
        {
          type: 'primary',
          onClick: submitUpdatePaidInvoice,
        },
        'Cập nhật'
      )
    "
  >
    <a-form-item :label="`Hình ảnh hoá đơn`" v-bind="image">
      <ShUploadImagesVadidate :max-count="1" v-bind="image" />
    </a-form-item>

    <a-form-item v-bind="referenceCode" :label="`Mã tham chiếu`">
      <!-- <a-input v-bind="referenceCode" placeholder="Nhập mã tham chiếu"></a-input> -->

      <a-input-group compact>
        <a-input
          v-bind="referenceCode"
          style="width: calc(100% - 40px)"
          placeholder="Nhập mã giao dịch"
        />
        <a-tooltip title="sao chép">
          <a-button @click="onCoppyRef">
            <template #icon><CopyOutlined /></template>
          </a-button>
        </a-tooltip>
      </a-input-group>
    </a-form-item>
  </a-card>
</template>

<script setup lang="ts">
import { Button, type UploadFile } from 'ant-design-vue';
import { z } from 'zod';
import { ShUploadImagesVadidate } from '@/components/moledules';
import { ANDT_FORM_HELPER, getZodFileAntd } from '~/common';
import { useFormZodSchema } from '~/common/form';
import { useMutationUpdatePaidInvoice } from '~/features/payment/apis/mutation-update-paid-invoice';
import type { IPayment } from '~/features/payment/models';

const props = defineProps<{
  payment: IPayment;
}>();
const { payment } = props || {};
const isShowPaidInvoice = computed(
  () =>
    (!!payment?.id && payment?.invoiceStatus === 'PAID') ||
    (!!payment?.id && payment?.invoiceStatus === 'APPROVED') ||
    (!!payment?.id && payment?.invoiceStatus === 'COMPLETED')
);

watch(isShowPaidInvoice, (value) => {
  console.log('value: ', value);
});

const schema = z.object({
  image: getZodFileAntd()
    .min(1, 'Hình ảnh hoá đơn không được để trống')
    .superRefine((value, ctx) => {
      if (!value || value?.length === 0) {
        ctx.addIssue({
          code: 'custom',
          message: 'Hình ảnh hoá đơn không được để trống',
        });
      }
    }),
  referenceCode: z.string().min(1, 'Mã tham chiếu không được để trống'),
});
type FormValues = z.infer<typeof schema>;

const form = useFormZodSchema({
  schema,
  options: {
    initialValues: {
      image: [],
      referenceCode: '',
    },
  },
});

const { defineComponentBinds, handleSubmit, setFieldValue, values } = form;

watch(payment, () => {
  const { image = [], referenceCode = '' } = payment || {};
  setFieldValue('image', ANDT_FORM_HELPER.handleImageForm(image));
  setFieldValue('referenceCode', referenceCode || '');
});

const image = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'image');
const referenceCode = ANDT_FORM_HELPER.defineFormItemAndtBinds(
  defineComponentBinds,
  'referenceCode'
);

const mutationUpdatePaidInvoice = useMutationUpdatePaidInvoice();

const submitUpdatePaidInvoice = handleSubmit((values) => {
  const { id } = payment || {};
  if (!id) return;

  const payload = handleConvertValues(values);

  mutationUpdatePaidInvoice.mutate({
    params: {
      id,
    },
    body: payload,
  });
});

function handleConvertValues(values: FormValues) {
  const { uploadImage: image } = ANDT_FORM_HELPER.handleImageForApi({
    listImageForm: values.image,
  });

  return {
    ...values,
    image,
  };
}

function onCoppyRef() {
  console.log('onCoppyRef: ');
}
</script>
